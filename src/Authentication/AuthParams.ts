export enum GrantType {
    CLIENT_CREDENTIALS = "client_credentials",
    PASSWORD = "password"
}

/**
 * Authentication parameters for OAuth2 authentication
 */
export interface IAuthParams {
    name: string;
    client_id: string;
    client_secret: string;
    grant_type: string;
    resource: string;
    tenant_id: string;
    username?: string;
    password?: string;
}