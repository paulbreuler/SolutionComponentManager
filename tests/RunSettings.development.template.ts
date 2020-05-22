import { IAuthParams, GrantType } from '../src/Authentication/AuthParams'
import { IEnvironmentDetails } from "../src/Authentication/EnvironmentDetails"

export const AuthParams: IAuthParams = {
    name: "A Friendly Name",
    client_id: "Azure App Registration Application (client) ID",
    client_secret: "Azure App Registration Secret",
    grant_type: GrantType.CLIENT_CREDENTIALS,
    resource: "https://contoso.crm.dynamics.com",
    tenant_id: "tenantId"
}

export const AuthParamsPWD: IAuthParams = {
    name: "A Friendly Name",
    client_id: "Azure App Registration Application (client) ID",
    client_secret: "Azure App Registration Secret",
    grant_type: GrantType.PASSWORD,
    resource: "https://contoso.crm.dynamics.com",
    tenant_id: "tenantId",
    username: "username",
    password: "pwd"
}

export const EnvironmentDetails: IEnvironmentDetails = {
    org_url: "https://contoso.api.crm.dynamics.com/api/data/v9.1"
}