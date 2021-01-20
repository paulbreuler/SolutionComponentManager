
import {
    expect
} from 'chai';
import * as Commands from '../src/Commands';
import { getTestAccessToken } from './Authentication.test';
import * as Helpers from '../src/Utility/Helpers';
import { SolutionComponentSummary } from '../src/SolutionManagement/Solution';
import { Heap } from '../src/Utility/Heap'
var Table = require("cli-table3");

describe('Solution Management Tests', function () {
    let access_token: string;

    before(async () => {
        access_token = (await getTestAccessToken()).access_token;
    })

    it("Compare solution summaries (Not Equal)", async function () {

        let response = await Commands.CompareSolutionSummaries(`${process.cwd()}/tests/resources/solComponentSummaries_A.json`, `${process.cwd()}/tests/resources/solComponentSummaries_B.json`);
        expect(response.isEqual).to.be.false;
    });

    it("Compare solution summaries (Equal)", async function () {

        let response = await Commands.CompareSolutionSummaries(`${process.cwd()}/tests/resources/solComponentSummaries_A.json`, `${process.cwd()}/tests/resources/solComponentSummaries_A.json`);

        expect(response.isEqual).to.be.true;
    });


});


