// import fetch, { Body, RequestInit, HeaderInit } from 'node-fetch';
import { Authentication } from "./Authentication/Authentication"
import { EnvironmentDetails, AuthParamsPWD } from './RunSettings.development'
import fetch from 'node-fetch'
import { ComponentTypes } from "./componentTypes"
import { SolutionComponent } from './SolutionManagement/Solution'
import fs from 'fs';
import os from 'os';


export const WhoAmI = async () => {
    let access_token: string;

    let response: any = await Authentication.authenticate(AuthParamsPWD);
    let data = await response.json();
    access_token = data.access_token;


    let r = await fetch(`${EnvironmentDetails.org_url}/WhoAmI`,
        {
            method: "GET", headers: {
                accept: "application/json",
                "OData-MaxVersion": "4.0",
                "OData-Version": "4.0",
                "Content-Type": "application/json; charset=utf-8",
                Authorization: `Bearer ${access_token}`
            }
        });

    let json = await r.json();

    console.log(`WhoAmI Response: ${JSON.stringify(json)}`)
};


export const AddSolutionComponent = async () => {
    let access_token: string;

    let response: any = await Authentication.authenticate(AuthParamsPWD);
    let data = await response.json();
    access_token = data.access_token;

    let r = await fetch(`${EnvironmentDetails.org_url}/$batch`,
        {
            method: "POST", headers: {
                accept: "application/json",
                "OData-MaxVersion": "4.0",
                "OData-Version": "4.0",
                "content-type": "multipart/mixed; boundary=batch_ee98-0d8c-7edb",
                Authorization: `Bearer ${access_token}`
            }, body: "\r\n--batch_ee98-0d8c-7edb\r\nContent-Type: multipart/mixed; boundary=changeset_171f-b886-d992\r\n\r\n--changeset_171f-b886-d992\r\nContent-Type: application/http\r\nContent-Transfer-Encoding: binary\r\n\r\nPOST AddSolutionComponent HTTP/1.1\r\nContent-ID: 1\r\nAccept: application/json\r\nContent-Type: application/json; charset=utf-8\r\n\r\n{\"ComponentId\":\"70816501-edb9-4740-a16c-6a5efbc05d84\",\"ComponentType\":1,\"AddRequiredComponents\":false,\"DoNotIncludeSubcomponents\":true,\"SolutionUniqueName\":\"CORE\"}\r\n--changeset_171f-b886-d992\r\nContent-Type: application/http\r\nContent-Transfer-Encoding: binary\r\n\r\nPOST AddSolutionComponent HTTP/1.1\r\nContent-ID: 2\r\nAccept: application/json\r\nContent-Type: application/json; charset=utf-8\r\n\r\n{\"ComponentId\":\"7ffa2f83-c47c-49da-81de-e41829c856ba\",\"ComponentType\":2,\"AddRequiredComponents\":false,\"DoNotIncludeSubcomponents\":false,\"SolutionUniqueName\":\"CORE\"}\r\n--changeset_171f-b886-d992--\r\n\r\n--batch_ee98-0d8c-7edb--\r\n"
        });

    let body = await r.text();
}

export async function GetSolutionComponents(solutionName) {
    let access_token: string;

    let authResponse: any = await Authentication.authenticate(AuthParamsPWD);
    let authJson = await authResponse.json();
    access_token = authJson.access_token;

    // Get all solution components from a solution and expand any parent components to show children. (e.g. Entity will have attributes nested in object)
    let response = await fetch(`${EnvironmentDetails.org_url}/solutioncomponents?$filter=solutionid/uniquename eq '${solutionName}'&$expand=solutionid($select=uniquename, version),solutioncomponent_parent_solutioncomponent`,
        {
            method: "GET", headers: {
                accept: "application/json",
                "OData-MaxVersion": "4.0",
                "OData-Version": "4.0",
                "Content-Type": "application/json; charset=utf-8",
                Authorization: `Bearer ${access_token}`
            }
        });

    let solutionComponentResponse = await response.json();

    let solutioncomponentCollection: Array<SolutionComponent> = generateComponents(solutionComponentResponse);

    let index = 0;
    for (var component of solutioncomponentCollection) {
        let response = await getActualComponent(component, access_token);

        if (typeof response.name === "string") {
            solutioncomponentCollection[index].friendlyName = response.name;
        } else if (typeof response.EntityMetadata === "object") {
            solutioncomponentCollection[index].friendlyName = response.EntityMetadata.DisplayName.LocalizedLabels[0].Label;
            solutioncomponentCollection[index].logicalName = response.EntityMetadata.LogicalName;

            // To get name of child attributes.
            // for children n = x, where x is small num
                // scan all attributes in metadata for entity m = y where y --> 300
                //response.EntityMetadata.Attributes.forEach(att => {console.log(att.LogicalName)})
        }
        index++;
    }

    let data: string = JSON.stringify(solutioncomponentCollection);

    let dir = "./output";
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }

    let file: string = `${dir}/solutionComponents.json`;
    fs.writeFile(file, data, (err) => {
        if (err) throw err;
        console.log(`Data written to file: ${file}`);
    });
};

/**
 * Parse Power Apps web API JSON response solution components into an array.
 * @param json Web API JSON response 
 * @returns Array<SolutionComponent>
 */
function generateComponents(json: any): Array<SolutionComponent> {
    let solutioncomponentCollection: Array<SolutionComponent> = new Array<SolutionComponent>();

    // Build array
    json.value.forEach(element => {
        let component: SolutionComponent = new SolutionComponent();
        // Ignore attributes they will be nested under the entity
        if (element.componenttype !== ComponentTypes.attribute) {
            component.instantiateFromJson(element);

            switch (element.componenttype) {
                case ComponentTypes.entity:
                    // Add children
                    component.children = new Array<any>();
                    element.solutioncomponent_parent_solutioncomponent.forEach(element => {
                        let childComponent: SolutionComponent = new SolutionComponent();
                        childComponent.instantiateFromJson(element);

                        component.children.push(childComponent);
                    });
                    break;
                default:
                    break;
            }

            solutioncomponentCollection.push(component);
        }
    });

    return solutioncomponentCollection;
}

/**
 * 
 * @param component Solution component to retrieve from API in its proper form matching its componentType (e.g. Entity, Form, etc.)
 * @param access_token bearer token for Web API
 * @returns JSON representing the actual component in Power Apps
 */
async function getActualComponent(component: SolutionComponent, access_token: any) {

    let apiCallType: string = component.componentTypeName;
    let restRequest: string = `(${component.objectId.replace(/{|}/g, "")})`;


    if (apiCallType === ComponentTypes[ComponentTypes.entity]) {
        apiCallType = "RetrieveEntity"
        restRequest = `(EntityFilters=Microsoft.Dynamics.CRM.EntityFilters'Attributes',MetadataId=${component.objectId.replace(/{|}/g, "")},RetrieveAsIfPublished=false)`
    }

    let response = await fetch(`${EnvironmentDetails.org_url}/${apiCallType}${restRequest}`,
        {
            method: "GET", headers: {
                accept: "application/json",
                "OData-MaxVersion": "4.0",
                "OData-Version": "4.0",
                "Content-Type": "application/json; charset=utf-8",
                Authorization: `Bearer ${access_token}`
            }
        });

    let json = await response.json();

    return json;
}