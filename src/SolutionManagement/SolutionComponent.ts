import { ComponentTypes } from "../componentTypes"

export class SolutionComponent {
    public objectId: string;
    public friendlyName?: string;
    public logicalName: string;
    public componentType: number;
    public componentTypeName?: string;
    public solutionId: string;
    public solutionnName: string;
    public children?: SolutionComponent[];
    instantiateFromJson(element: any) {
        this.objectId = element.objectid;
        this.componentType = element.componenttype;
        this.componentTypeName = ComponentTypes[element.componenttype];        
        this.solutionId = element._solutionid_value;
    }

}
