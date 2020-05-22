import fetch, { RequestInit } from "node-fetch";
import { URLSearchParams } from "url";
import { IAuthParams, GrantType } from "./AuthParams";

export class PowerAppsConnection {
    name: string;
    access_token: string;
    expires_in: string;
    expires_on: string;
    ext_expires_in: string;
    not_before: string;
    refresh_token: string;
    resource: string;
    scope: string;
    token_type: string;

    public refreshToken() {
        throw "Not Implemented";
    }
}

export class Authentication {
    private static PowerAppsConnections = new Array<PowerAppsConnection>();

    public static getConnections() {
        return this.PowerAppsConnections;
    }

    /**
     * Authenticate to Dynamics 365 / Power Apps Customer Engagement
     * @param config Configuration of type IAuthParams
     */
    public static async authenticate(config: IAuthParams): Promise<PowerAppsConnection> {

        // Does the connection already exist?
        if (this.PowerAppsConnections.length > 0) {
            let conn: PowerAppsConnection | null = null;
            for (var i = 0; i < this.PowerAppsConnections.length; i++) {
                if (this.PowerAppsConnections[i].name == config.name) {
                    conn = this.PowerAppsConnections[i];
                    return conn;
                }
            }
        }

        let urlencoded: URLSearchParams = new URLSearchParams();
        urlencoded.append("client_id", config.client_id);
        urlencoded.append("client_secret", config.client_secret);
        urlencoded.append("grant_type", config.grant_type);
        urlencoded.append("resource", config.resource);

        switch (config.grant_type) {
            case GrantType.CLIENT_CREDENTIALS:
                //return this.authenticateClientCredentialFlow(config);
                break;
            case GrantType.PASSWORD:
                urlencoded.append("username", config.username);
                urlencoded.append("password", config.password);
                //return this.authenticatePasswordFlow(config);
                break;
            default:
                break;
        }

        let init: RequestInit = {
            method: 'POST',
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: urlencoded,
            redirect: 'follow',
        };

        let response = await fetch(`https://login.microsoftonline.com/${config.tenant_id}/oauth2/token`, init)

        let json = await response.json();

        let connection: PowerAppsConnection = json;
        connection.name = config.name;

        this.PowerAppsConnections.push(connection);

        return connection;
    };

    /**
     * Authenticate to Dynamics 365 / Power Apps Customer Engagement using grant type client credentials
     * @param config Configuration of type IAuthParams
     */
    private static async authenticateClientCredentialFlow(config: IAuthParams): Promise<any> {
        let urlencoded: URLSearchParams = new URLSearchParams();
        urlencoded.append("client_id", config.client_id);
        urlencoded.append("client_secret", config.client_secret);
        urlencoded.append("grant_type", config.grant_type);
        urlencoded.append("resource", config.resource);

        let init: RequestInit = {
            method: 'POST',
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: urlencoded,
            redirect: 'follow',
        };

        let response = fetch(`https://login.microsoftonline.com/${config.tenant_id}/oauth2/token`, init)
            .catch((error: any) => console.log('error', error));


        return response;
    }

    /**
     * Authenticate to Dynamics 365 / Power Apps Customer Engagement using grant type password
     * @param config Configuration of type IAuthParams
     */
    private static async authenticatePasswordFlow(config: IAuthParams): Promise<any> {
        let urlencoded: URLSearchParams = new URLSearchParams();
        urlencoded.append("client_id", config.client_id);
        urlencoded.append("client_secret", config.client_secret);
        urlencoded.append("grant_type", config.grant_type);
        urlencoded.append("resource", config.resource);
        urlencoded.append("username", config.username);
        urlencoded.append("password", config.password);

        let init: RequestInit = {
            method: 'POST',
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: urlencoded,
            redirect: 'follow',
        };

        let response = fetch(`https://login.microsoftonline.com/${config.tenant_id}/oauth2/token`, init)
            .catch((error: any) => console.log('error', error));


        return response;
    }
}