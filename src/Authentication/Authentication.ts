import fetch, { RequestInit } from "node-fetch";
import { URLSearchParams } from "url";
import { IAuthParams, GrantType } from "./AuthParams";
import { DeserializeJSON } from "../Utility/Helpers";

interface IPowerAppsConnection {
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

  refreshToken(config: IAuthParams): Promise<string>;
  deserializeFromJson(json: JSON): PowerAppsConnection;
}

export class PowerAppsConnection
  extends DeserializeJSON
  implements IPowerAppsConnection {
  name: string = "";
  access_token: string;
  expires_in: string;
  expires_on: string;
  ext_expires_in: string;
  not_before: string;
  refresh_token: string;
  resource: string;
  scope: string;
  token_type: string;

  public async refreshToken(config: IAuthParams): Promise<string> {
    var urlencoded = new URLSearchParams();
    urlencoded.append("client_id", config.client_id);
    urlencoded.append("client_secret", config.client_secret);
    urlencoded.append("grant_type", "refresh_token");
    urlencoded.append("resource", config.resource);
    urlencoded.append("refresh_token", this.refresh_token);

    let init: RequestInit = {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: urlencoded,
      redirect: "follow",
    };

    let response = await fetch(
      `https://login.microsoftonline.com/${config.tenant_id}/oauth2/token`,
      init
    );

    let json = await response.json();

    this.deserializeFromJson(json); // ensure content is updated in this

    return json.access_token;
  }
}

export class Authentication {
  private powerAppsConnections = new Array<PowerAppsConnection>();
  private static instance: Authentication;
  private currentConnection: PowerAppsConnection;

  static get Instance(): Authentication {
    if (Authentication.instance) {
      return this.instance;
    }
    this.instance = new Authentication();
    return this.instance;
  }

  public getConnections() {
    return this.powerAppsConnections;
  }

  public get CurrentConnection() {
    return this.currentConnection;
  }

  /**
   * Authenticate to Dynamics 365 / Power Apps Customer Engagement
   * @param config Configuration of type IAuthParams
   */
  public async authenticate(config: IAuthParams): Promise<PowerAppsConnection> {
    // Does the connection already exist?
    if (this.powerAppsConnections.length > 0) {
      let conn: PowerAppsConnection | null = null;
      for (var i = 0; i < this.powerAppsConnections.length; i++) {
        if (this.powerAppsConnections[i].name == config.name) {
          conn = this.powerAppsConnections[i];
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
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: urlencoded,
      redirect: "follow",
    };

    let response = await fetch(
      `https://login.microsoftonline.com/${config.tenant_id}/oauth2/token`,
      init
    );

    let json = await response.json();

    let connection: PowerAppsConnection = new PowerAppsConnection();
    connection.deserializeFromJson(json);
    connection.name = config.name;

    this.powerAppsConnections.push(connection);
    this.currentConnection = connection;
    return connection;
  }
}
