
import {
    expect
} from 'chai';
import { Authentication, PowerAppsConnection } from "../src/Authentication/Authentication";
import { AuthParams, AuthParamsPWD } from "../src/Runsettings.development"

describe('PowerApps Authentication Tests', function () {
    let access_token: string | null = null;
    let connection: PowerAppsConnection | null = null;

    it("Authenticate to PowerApps | password grant", async function () {
        connection = await getTestAccessToken();

        expect(connection).to.not.be.null;
    });

    it("Refresh Token", async function () {
        access_token = await connection.refreshToken(AuthParamsPWD);

        expect(access_token).to.not.be.null;
    });

});

export async function getTestAccessToken(): Promise<PowerAppsConnection> {
    let response: PowerAppsConnection = await Authentication.authenticate(AuthParamsPWD);

    expect(response.token_type).to.equal("Bearer");
    expect(response.access_token).to.exist;
    expect(response.refresh_token).to.exist;

    return response;
}