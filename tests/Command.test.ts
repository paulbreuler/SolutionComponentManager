
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
                isEqual = scsCollection[i].equalsNaive(scsCollection_2[j]);
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

        let componentCollection = await Commands.GetSolutionComponentsSummaries("b0367b29-ed8a-ea11-a812-000d3a579ca6");

        expect(componentCollection.length).to.be.greaterThan(0);
    });
});


