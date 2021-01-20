
import {
    expect
} from 'chai';
import { Heap } from '../src/Utility/Heap'
import { SolutionComponentSummary } from '../src/SolutionManagement/Solution'
import * as Helpers from '../src/Utility/Helpers'

describe('Heap Tests', function () {

    describe("Empty Heap Test", function () {
        it("Initialize", async function () {
            let scsHeap: Heap<SolutionComponentSummary> = new Heap<SolutionComponentSummary>();
        });

        it("Size", async function () {
            let scsHeap: Heap<SolutionComponentSummary> = new Heap<SolutionComponentSummary>();
            expect(scsHeap.size).to.equal(0);
        });

        it("Is empty", async function () {
            let scsHeap: Heap<SolutionComponentSummary> = new Heap<SolutionComponentSummary>();
            expect(scsHeap.isEmpty).to.be.true;
        });

        it("Peek", async function () {
            let scsHeap: Heap<SolutionComponentSummary> = new Heap<SolutionComponentSummary>();
            expect(scsHeap.peek()).to.be.undefined;
        });
    });

    describe("Populated Heap Test", function () {
        let scsHeap: Heap<SolutionComponentSummary> = new Heap<SolutionComponentSummary>();
        it("Add to heap", async function () {

            let contents: any = await Helpers.jsonFromFile(`${process.cwd()}/tests/resources/solComponentSummaries_A.json`);

            contents.forEach((element: any) => {
                let scs: SolutionComponentSummary = new SolutionComponentSummary();

                scs.deserializeFromJson(element);
                scsHeap.Add(scs);
            })

            expect((scsHeap.peek()).msdyn_componenttype).to.equal(1);
            expect(scsHeap.size).to.equal(4);
        });

        it("Is not empty", async function () {
            expect(scsHeap.isEmpty).to.be.false;
        });

        it("Remote First", async function () {
            let first: SolutionComponentSummary = scsHeap.RemoveFirst();
            expect(first.msdyn_componenttype).to.eq(1);
            expect(scsHeap.size).to.eq(3);
        });

        it("Remote Third", async function () {
            let second: SolutionComponentSummary = scsHeap.RemoveFirst();
            expect(second.msdyn_componenttype).to.eq(1);
            let third: SolutionComponentSummary = scsHeap.RemoveFirst();
            expect(third.msdyn_componenttype).to.eq(50);
            expect(scsHeap.size).to.eq(1);
        });

        it("Peek last", async function () {
            expect(scsHeap.peek().msdyn_componenttype).to.eq(60);
        });

        it("Clear", async function () {
            scsHeap.clear();
            expect(scsHeap.size).to.eq(0);
        });

        it("Drain heap", async function () {

            let contents: any = await Helpers.jsonFromFile(`${process.cwd()}/tests/resources/solComponentSummaries_A.json`);

            contents.forEach((element: any) => {
                let scs: SolutionComponentSummary = new SolutionComponentSummary();

                scs.deserializeFromJson(element);
                scsHeap.Add(scs);
            })

            expect((scsHeap.peek()).msdyn_componenttype).to.equal(1);
            expect(scsHeap.size).to.equal(4);

            while (scsHeap.size > 0){
                scsHeap.RemoveFirst();
            }

            expect(scsHeap.size).to.equal(0);
        });
    });
});

