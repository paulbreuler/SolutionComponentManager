import { ComponentTypes } from "../componentTypes"

export class SolutionComponent {
    // Default 
    public objectId: string;
    public friendlyName?: string;
    public logicalName: string;
    public componentType: number;
    public solution: Solution;
    public createdon: Date;
    public rootcomponentbehavior: number;
    public modifiedon: Date;
    public versionnumber: number;
    public ismetadata: boolean;

    // Extended functionality 
    public solutionnName: string;
    public componentTypeName?: string;
    public children?: SolutionComponent[];

    instantiateFromJson(element: any) {
        this.objectId = element.objectid;
        this.componentType = element.componenttype;
        this.componentTypeName = ComponentTypes[element.componenttype];

        if (typeof element.solutionid !== "object") {
            this.solution = {
                solutionid: element._solutionid_value
            }

        } else {

            this.solution = {
                uniquename: element.solutionid.uniquename,
                solutionid: element.solutionid.solutionid,
                version: element.solutionid.version
            }
        }

    }
}

interface Solution {
    solutionid: string,
    uniquename?: string,
    version?: string
}