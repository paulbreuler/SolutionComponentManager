
import {
    expect
} from 'chai';
import * as Commands from '../src/Commands'
import { getTestAccessToken } from './Authentication.test'

describe('Solution Management Tests', function () {
    let access_token: string;

    before(async () => {
        access_token = await getTestAccessToken();
    })

    it("AddSolutionComponent", async function () {
        this.slow(500);

        let response = await Commands.AddSolutionComponent("e79e7977-de99-ea11-a811-000d3a579cbc", 1, "CORE");

        let json = await response.json();
        expect(response.status).to.equal(200);
        expect(json.id).to.match(/^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/i, "UUID format required");
    });

    // A bit slower due to multiple requests needed to compile components 
    it("GetSolutionComponents", async function () {
        this.slow(10000);

        let componentCollection = await Commands.GetSolutionComponents("CORE");

        expect(componentCollection.length).to.be.greaterThan(0);
    });

    // More efficient but an undocumented feature
    it("GetSolutionComponentsSummary", async function () {
        this.slow(2000);

        let componentCollection = await Commands.GetSolutionComponentsSummaries("b0367b29-ed8a-ea11-a812-000d3a579ca6");

        expect(componentCollection.length).to.be.greaterThan(0);
    });
});


