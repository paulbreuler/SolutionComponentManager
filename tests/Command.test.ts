
import {
    expect
} from 'chai';
import * as Commands from '../src/Commands';
import { getTestAccessToken } from './Authentication.test';
import * as Helpers from '../src/Utility/Helpers';
import { SolutionComponentSummary } from '../src/SolutionManagement/Solution';

describe('Solution Management Tests', function () {
    let access_token: string;

    before(async () => {
        access_token = (await getTestAccessToken()).access_token;
    })

    it("AddSolutionComponent", async function () {
        this.slow(500);

        // Need to replace ID, componenet type, and solution number with valid strings for a target test environment
        let response = await Commands.AddSolutionComponent("70816501-edb9-4740-a16c-6a5efbc05d84", 1, "Test");

        let json = await response.json();
        expect(response.status).to.equal(200);
        expect(json.id).to.match(/^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/i, "UUID format required");
    });

    // A bit slower due to multiple requests needed to compile components 
    it("GetSolutionComponents", async function () {
        this.slow(10000);

        // Replace with valid solution unique name
        let componentCollection = await Commands.GetSolutionComponents("Test");

        expect(componentCollection.length).to.be.greaterThan(0);
    });

    it("Read solution summary from file", async function () {

        let scsCollection: Array<SolutionComponentSummary> = new Array<SolutionComponentSummary>();

        let contents: any = await Helpers.jsonFromFile(`${process.cwd()}/tests/resources/solComponentSummaries_A.json`);

        contents.forEach((element: any) => {
            let scs: SolutionComponentSummary = new SolutionComponentSummary();

            scs.deserializeFromJson(element);
            scsCollection.push(scs);
        })

    });

    it("Compare solution summaries", async function () {

        let scsCollection: Array<SolutionComponentSummary> = new Array<SolutionComponentSummary>();

        let contents: any = await Helpers.jsonFromFile(`${process.cwd()}/tests/resources/solComponentSummaries_A.json`);

        contents.forEach((element: any) => {
            let scs: SolutionComponentSummary = new SolutionComponentSummary();

            scs.deserializeFromJson(element);
            scsCollection.push(scs);
        })

        let scsCollection_2: Array<SolutionComponentSummary> = new Array<SolutionComponentSummary>();

        let contents_2: any = await Helpers.jsonFromFile(`${process.cwd()}/tests/resources/solComponentSummaries_B.json`);

        contents_2.forEach((element: any) => {
            let scs: SolutionComponentSummary = new SolutionComponentSummary();

            scs.deserializeFromJson(element);
            scsCollection_2.push(scs);
        })

        let isEqual = true;
        for (let i = 0; i < scsCollection.length; i++) {
            for (let j = 0; i < scsCollection_2.length; j++) {
                isEqual = scsCollection[i].equals(scsCollection_2[j]);
                if (isEqual === false)
                    break;
            }
            if (isEqual === false)
                break;
        }
        
        expect(isEqual).to.be.false;
    });

    // More efficient but an undocumented feature
    it("GetSolutionComponentsSummary", async function () {
        this.slow(2000);
        
        // Replace with valid solution ID
        let componentCollection = await Commands.GetSolutionComponentsSummaries("496c3d5b-7b5a-eb11-a812-000d3a8c9261");

        expect(componentCollection.length).to.be.greaterThan(0);
    });
});


