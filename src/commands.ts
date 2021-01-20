// import fetch, { Body, RequestInit, HeaderInit } from 'node-fetch';
import { Authentication, PowerAppsConnection } from "./Authentication/Authentication"
import { EnvironmentDetails, AuthParamsPWD } from './RunSettings.development'
import fetch from 'node-fetch'
import { ComponentTypes } from "./componentTypes"
import { SolutionComponent, SolutionComponentSummary } from './SolutionManagement/Solution'
import { Heap } from './Utility/Heap'
import * as Helpers from './Utility/Helpers';

export const WhoAmI = async () => {
    let response: PowerAppsConnection = await Authentication.authenticate(AuthParamsPWD);

    let r = await fetch(`${EnvironmentDetails.org_url}/WhoAmI`,
        {
            method: "GET", headers: {
                accept: "application/json",
                "OData-MaxVersion": "4.0",
                "OData-Version": "4.0",
                "Content-Type": "application/json; charset=utf-8",
                Authorization: `Bearer ${response.access_token}`
            }
        });

    let json = await r.json();

    console.log(`WhoAmI Response: ${JSON.stringify(json)}`)
};


export const AddManySolutionComponent = async () => {
    let response: PowerAppsConnection = await Authentication.authenticate(AuthParamsPWD);

    let r = await fetch(`${EnvironmentDetails.org_url}/$batch`,
        {
            method: "POST", headers: {
                accept: "application/json",
                "OData-MaxVersion": "4.0",
                "OData-Version": "4.0",
                "content-type": "multipart/mixed; boundary=batch_ee98-0d8c-7edb",
                Authorization: `Bearer ${response.access_token}`
            }, body: "\r\n--batch_ee98-0d8c-7edb\r\nContent-Type: multipart/mixed; boundary=changeset_171f-b886-d992\r\n\r\n--changeset_171f-b886-d992\r\nContent-Type: application/http\r\nContent-Transfer-Encoding: binary\r\n\r\nPOST AddSolutionComponent HTTP/1.1\r\nContent-ID: 1\r\nAccept: application/json\r\nContent-Type: application/json; charset=utf-8\r\n\r\n{\"ComponentId\":\"70816501-edb9-4740-a16c-6a5efbc05d84\",\"ComponentType\":1,\"AddRequiredComponents\":false,\"DoNotIncludeSubcomponents\":true,\"SolutionUniqueName\":\"CORE\"}\r\n--changeset_171f-b886-d992\r\nContent-Type: application/http\r\nContent-Transfer-Encoding: binary\r\n\r\nPOST AddSolutionComponent HTTP/1.1\r\nContent-ID: 2\r\nAccept: application/json\r\nContent-Type: application/json; charset=utf-8\r\n\r\n{\"ComponentId\":\"7ffa2f83-c47c-49da-81de-e41829c856ba\",\"ComponentType\":2,\"AddRequiredComponents\":false,\"DoNotIncludeSubcomponents\":false,\"SolutionUniqueName\":\"CORE\"}\r\n--changeset_171f-b886-d992--\r\n\r\n--batch_ee98-0d8c-7edb--\r\n"
        });

    let body = await r.text();
}

export async function AddSolutionComponent(componentId: string, componentType: number, solutionUniqueName: string, addRequiredComponents: boolean = false, doNotIncludeSubcomponents: boolean = true) {
    let authResponse: PowerAppsConnection = await Authentication.authenticate(AuthParamsPWD);

    let response = await fetch(`${EnvironmentDetails.org_url}/AddSolutionComponent`,
        {
            method: "POST", headers: {
                accept: "application/json",
                "OData-MaxVersion": "4.0",
                "OData-Version": "4.0",
                "Content-Type": "application/json; charset=utf-8",
                Authorization: `Bearer ${authResponse.access_token}`
            }, body: `{
                    "ComponentId": "${componentId}",
                    "ComponentType": ${componentType},
                    "AddRequiredComponents": ${addRequiredComponents},
                    "DoNotIncludeSubcomponents": ${doNotIncludeSubcomponents},
                    "SolutionUniqueName": "${solutionUniqueName}"
                }`
        });

    return response;
}

/**
 * Run undocumented function that returns full summary of each component in a solution. 
 * Includes displayname, objectid, type name, type code, component logical name (For subsequent API calls)
 * @param solutionID 
 * @returns Array of solution components.
 */
export async function GetSolutionComponentsSummaries(solutionID: string) {
    let authResponse: PowerAppsConnection = await Authentication.authenticate(AuthParamsPWD);

    let response = await fetch(`${EnvironmentDetails.org_url}/msdyn_solutioncomponentsummaries?$filter=(msdyn_solutionid eq ${solutionID})`,
        {
            method: "GET", headers: {
                accept: "application/json",
                "OData-MaxVersion": "4.0",
                "OData-Version": "4.0",
                "Content-Type": "application/json; charset=utf-8",
                Authorization: `Bearer ${authResponse.access_token}`
            }
        });

    let json = await response.json();

    let componentSummaryCollection = Array<SolutionComponentSummary>();
    json.value.forEach(component => {
        let scs: SolutionComponentSummary = component;
        componentSummaryCollection.push(scs);
    });

    return componentSummaryCollection;
}


export interface ISolutionCompareResponse {
    isEqual: boolean;
    uniqueFromPathA: Array<IMinComponentCompare>;
    uniqueFromPathB: Array<IMinComponentCompare>;
}

export interface IMinComponentCompare {
    componentType: number;
    displayName: string;
    uniqueName: string;
    isManaged: boolean;
}

/**
 * Compares solution components from two given solutions from file @pathA and @pathB based on their msdyn_objecttypecode, msdyn_displayname, and msdyn_name
 * @param pathA 
 * @param pathB 
 * 
 * retruns Object of type ISolutionCompareResponse
 */
export async function CompareSolutionSummaries(pathA: string, pathB: string): Promise<ISolutionCompareResponse> {
    let scsCollection_A: Array<SolutionComponentSummary> = new Array<SolutionComponentSummary>();

    let contents_A: any = await Helpers.jsonFromFile(pathA);
    // `${process.cwd()}/tests/resources/solComponentSummaries_A.json`

    contents_A.forEach((element: any) => {
        let scs: SolutionComponentSummary = new SolutionComponentSummary();

        scs.deserializeFromJson(element);
        scsCollection_A.push(scs);
    })

    let scsCollection_B: Array<SolutionComponentSummary> = new Array<SolutionComponentSummary>();

    let contents_B: any = await Helpers.jsonFromFile(pathB);

    contents_B.forEach((element: any) => {
        let scs: SolutionComponentSummary = new SolutionComponentSummary();

        scs.deserializeFromJson(element);
        scsCollection_B.push(scs);
    })

    let result = true;
    // ObjectTypeCode might cause a conflict with solutions from different orgs
    let a = scsCollection_A.map((item) => { return (JSON.stringify(<IMinComponentCompare>{ componentType: item.msdyn_componenttype, displayName: item.msdyn_displayname, uniqueName: item.msdyn_name, isManaged: item.msdyn_ismanaged })) });
    let b = scsCollection_B.map((item) => { return (JSON.stringify(<IMinComponentCompare>{ componentType: item.msdyn_componenttype, displayName: item.msdyn_displayname, uniqueName: item.msdyn_name, isManaged: item.msdyn_ismanaged })) });

    if (a.length !== b.length) result = false;

    const uniqueValues = new Set([...a, ...b]);
    let diffA: Array<string> = new Array<string>();
    let diffB: Array<string> = new Array<string>();

    for (const v of uniqueValues) {
        const aUnique: Array<string> = a.filter(e => e === v);
        const bUnique: Array<string> = b.filter(e => e === v);
        if (aUnique.length !== bUnique.length) {
            diffA = diffA.concat(aUnique);
            diffB = diffB.concat(bUnique);
            result = false;
        }
    }

    let respone: ISolutionCompareResponse = {
        isEqual: result,
        uniqueFromPathA: diffA.map((item) => { return (<IMinComponentCompare>JSON.parse(item)) }),
        uniqueFromPathB: diffB.map((item) => { return (<IMinComponentCompare>JSON.parse(item)) }),
    }

    return respone;
}

/**
 * Generates a collection of components with relevant data based on documented solutioncomponents api call
 * @param solutionName Name of solution
 */
export async function GetSolutionComponents(solutionName): Promise<SolutionComponent[]> {
    let authResponse: PowerAppsConnection = await Authentication.authenticate(AuthParamsPWD);

    // Get all solution components from a solution and expand any parent components to show children. (e.g. Entity will have attributes nested in object)
    let response = await fetch(`${EnvironmentDetails.org_url}/solutioncomponents?$filter=solutionid/uniquename eq '${solutionName}'&$expand=solutionid($select=uniquename, version),solutioncomponent_parent_solutioncomponent`,
        {
            method: "GET", headers: {
                accept: "application/json",
                "OData-MaxVersion": "4.0",
                "OData-Version": "4.0",
                "Content-Type": "application/json; charset=utf-8",
                Authorization: `Bearer ${authResponse.access_token}`
            }
        });

    if (response.status !== 200) {
        return new Array<SolutionComponent>();
    }

    let solutionComponentResponse = await response.json();

    let solutioncomponentCollection: Array<SolutionComponent> = generateComponents(solutionComponentResponse);

    let index = 0;
    for (var component of solutioncomponentCollection) {
        let response = await getActualComponent(component, authResponse.access_token);

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

    return solutioncomponentCollection;
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