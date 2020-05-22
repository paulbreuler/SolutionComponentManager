
import {
    expect
} from 'chai';
import { Authentication, PowerAppsConnection } from "../src/Authentication/Authentication";
import fetch from 'node-fetch';
import { AuthParams, EnvironmentDetails, AuthParamsPWD } from "../src/Runsettings.development"

describe('PowerApps Authentication Tests', function () {
    let access_token: string;

    it("Authenticate to PowerApps | password grant", async function () {
        access_token = await getTestAccessToken();
    });
});


export async function getTestAccessToken(): Promise<string> {
    let response: PowerAppsConnection = await Authentication.authenticate(AuthParamsPWD);

    expect(response.token_type).to.equal("Bearer");
    expect(response.access_token).to.exist;
    expect(response.refresh_token).to.exist;

    return response.access_token;
}