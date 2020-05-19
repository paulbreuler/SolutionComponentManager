// import fetch, { Body, RequestInit, HeaderInit } from 'node-fetch';
import { Authentication } from "./Authentication/Authentication"
import { EnvironmentDetails, AuthParamsPWD } from './RunSettings.development'
import fetch from 'node-fetch'

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