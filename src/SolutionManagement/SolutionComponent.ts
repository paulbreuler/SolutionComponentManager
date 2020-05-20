import { ComponentTypes } from "../componentTypes"

export class SolutionComponent {
    // Default 
    public objectId: string;
    public friendlyName?: string;
    public logicalName: string;
    public componentType: number;
    public solutionId: string;
    public createdon: Date;
    public rootcomponentbehavior: number;
    public modifiedon: Date;
    public versionnumber: number;
    public ismetadata: boolean;
    public solutionnName: string;
    
    // Extended functionality 
    public componentTypeName?: string;

    public children?: SolutionComponent[];

    instantiateFromJson(element: any) {
        this.objectId = element.objectid;
        this.componentType = element.componenttype;
        this.componentTypeName = ComponentTypes[element.componenttype];        
        this.solutionId = element._solutionid_value;
    }

}
