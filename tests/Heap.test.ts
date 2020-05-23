
import {
    expect
} from 'chai';
import { Heap } from '../src/Utility/Heap'
import { SolutionComponentSummary } from '../src/SolutionManagement/Solution'
import * as Helpers from '../src/Utility/Helpers'

describe('Heap Tests', function () {

    it("Empty Heap", async function () {
        let scsHeap: Heap<SolutionComponentSummary> = new Heap<SolutionComponentSummary>();
    });

    it("Empty Heap size", async function () {
        let scsHeap: Heap<SolutionComponentSummary> = new Heap<SolutionComponentSummary>();
        expect(scsHeap.size()).to.equal(0);
    });

    it("Empty Heap peek", async function () {
        let scsHeap: Heap<SolutionComponentSummary> = new Heap<SolutionComponentSummary>();
        expect(scsHeap.peek()).to.be.undefined;
    });

    it("Add to heap", async function () {
        let scsHeap: Heap<SolutionComponentSummary> = new Heap<SolutionComponentSummary>();

        let contents: any = await Helpers.jsonFromFile(`${process.cwd()}/tests/resources/solComponentSummaries_A.json`);

        contents.forEach((element: any) => {
            let scs: SolutionComponentSummary = new SolutionComponentSummary();

            scs.deserializeFromJson(element);
            scsHeap.Add(scs);
        })

        expect((scsHeap.peek()).msdyn_componenttype).to.equal(1);
        expect(scsHeap.size()).to.equal(4);
    });
});

