
import {
    expect
} from 'chai';
import { Authentication, PowerAppsConnection } from "../src/Authentication/Authentication";
import fetch from 'node-fetch';
import { AuthParams, EnvironmentDetails, AuthParamsPWD } from "../src/Runsettings.development"

describe('PowerApps Authentication Tests', function () {
    let access_token: string;

    before(async () => {
        let response: PowerAppsConnection = await Authentication.authenticate(AuthParamsPWD);
        access_token = response.access_token;
    })

    it("GET /WhoAmI", async function () {
        this.slow(500);
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
        expect(json.OrganizationId).to.match(/^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/i, "UUID format required");
    });
});


