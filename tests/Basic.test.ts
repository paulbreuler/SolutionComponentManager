
import {
    expect
} from 'chai';
import fetch from 'node-fetch';
import { EnvironmentDetails } from "../src/Runsettings.development"
import { getTestAccessToken } from './Authentication.test'
import * as Helpers from '../src/Utility/Helpers'

module Automobile {
    export class Car {
        id: string;
        make: string;
        model: string;
        year: number;
        owner: Owner;
    }

    export class Owner {
        name: string;
    }
}

describe('PowerApps Basic Tests', function () {
    let access_token: string;

    before(async () => {
        access_token = (await getTestAccessToken()).access_token;
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

    it("DeserializeJSON", async function () {
        let dj: Helpers.DeserializeJSON = new Helpers.DeserializeJSON();

        let result: any = dj.deserializeFromJson(JSON.parse("{\"id\":1,\"make\":\"Ford\",\"model\":\"Escape\",\"year\":2020}"));

        expect(result).to.exist;
        expect(result.id).to.equal(1);
        expect(result.make).to.equal("Ford");
        expect(result.model).to.equal("Escape");
        expect(result.year).to.equal(2020);
    });

    it("DeserializeJSON - nested object", async function () {
        let dj: Helpers.DeserializeJSON = new Helpers.DeserializeJSON();

        let result: Automobile.Car = dj.deserializeFromJson(JSON.parse("{\"id\":1,\"make\":\"Ford\",\"model\":\"Escape\",\"year\":2020, \"owner\": { \"name\": \"Paul\"}}"), Automobile, Automobile.Car);

        expect(result).to.exist;
        expect(result.id).to.equal(1);
        expect(result.make).to.equal("Ford");
        expect(result.model).to.equal("Escape");
        expect(result.year).to.equal(2020);
        expect(result.owner.name).to.equal("Paul");
    });

});


