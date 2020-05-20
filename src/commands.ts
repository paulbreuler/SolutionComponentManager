// import fetch, { Body, RequestInit, HeaderInit } from 'node-fetch';
import { Authentication } from "./Authentication/Authentication"
import { EnvironmentDetails, AuthParamsPWD } from './RunSettings.development'
import fetch from 'node-fetch'
import { ComponentTypes } from "./componentTypes"

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

class SolutionComponent {
    public objectId: string;
    public componentType: number;
    public solutionId: string;
    public solutionnName: string;
    public name?: string;
    public componentTypeName?: string;
    public children?: SolutionComponent[];

    instantiateFromJson(element: any) {
        this.objectId = element.objectid;
        this.componentType = element.componenttype;
        this.solutionId = element._solutionid_value;
        this.componentTypeName = ComponentTypes[element.componenttype];
    }
}



export const GetSolutionComponents = async () => {
    let access_token: string;

    let response: any = await Authentication.authenticate(AuthParamsPWD);
    let data = await response.json();
    access_token = data.access_token;

    // Get all solution components from a solution and expand any parent components to show children. (e.g. Entity will have attributes nested in object)
    let r = await fetch(`${EnvironmentDetails.org_url}/solutioncomponents?$filter=solutionid/uniquename eq 'Core'&$expand=solutionid($select=uniquename),solutioncomponent_parent_solutioncomponent`,
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

    let solutioncomponentCollection: Array<SolutionComponent> = new Array<SolutionComponent>();

    json.value.forEach(element => {

        let component: SolutionComponent = new SolutionComponent();
        // Ignore attributes they will be nested under the entity
        if (element.componenttype !== ComponentTypes.attribute) {
            component.instantiateFromJson(element);

            component.solutionnName = element.solutionid.uniquename;


            switch (element.componenttype) {
                case ComponentTypes.entity:
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

    // Get all unamanged solution components
    // ID
    // Component --> ComponentTypes.json
    // What is this? Actualy name (Entity name, workflow name... etc.)

    let index = 0;
    for (var component of solutioncomponentCollection) {
        let response = await GetActualComponent(component, access_token);

        solutioncomponentCollection[index].name = response.name;
        index++;
    }

    console.log(`GetSolutionComponents Response: ${JSON.stringify(json)}`)
};



async function GetActualComponent(component: any, access_token: any) {

    let apiCallType: string = component.componentTypeName;


    let r = await fetch(`${EnvironmentDetails.org_url}/${apiCallType}(${component.objectId.replace(/{|}/g, "")})`,
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

    return json;
}


export const GetDefinitions = async () => {
    let access_token: string;

    let response: any = await Authentication.authenticate(AuthParamsPWD);
    let data = await response.json();
    access_token = data.access_token;


    let r = await fetch(`${EnvironmentDetails.org_url}/EntityDefinitions(e79e7977-de99-ea11-a811-000d3a579cbc)?$select=LogicalName,SchemaName,ObjectTypeCode&$expand=Attributes($select=DisplayName)`,
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

    console.log(`GetDefinitions Response: ${JSON.stringify(json)}`)
};
