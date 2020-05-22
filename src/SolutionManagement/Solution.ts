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

export interface Solution {
    solutionid: string,
    uniquename?: string,
    version?: string
}

export class SolutionComponentSummary {
    msdyn_solutionid: string;
    msdyn_ismanaged: boolean;
    msdyn_ismanagedname: string;
    organizationid: string;
    msdyn_name: string;
    msdyn_displayname: string;
    msdyn_objecttypecode: number;
    msdyn_objectid: string;
    msdyn_description: string;
    msdyn_componenttype: number;
    msdyn_componenttypename: string;
    msdyn_componentlogicalname: string;
    msdyn_total: number;
    msdyn_statusname: string;
    msdyn_connectorinternalid: string | null;
    msdyn_solutioncomponentsummaryid: string | null;
    msdyn_owner: any;
    msdyn_workflowcategory: any;
    msdyn_sdkmessagename: string;
    msdyn_fieldsecurity: string;
    msdyn_relatedentityattribute: string;
    msdyn_fieldtype: string;
    msdyn_subtype: number;
    msdyn_isdefaultname: boolean | null;
    msdyn_schemaname: string;
    msdyn_isauditenabledname: string;
    msdyn_status: any;
    msdyn_owningbusinessunit: any;
    msdyn_eventhandler: string;
    msdyn_iscustomname: string;
    msdyn_iscustom: boolean;
    msdyn_deployment: string;
    msdyn_synctoexternalsearchindex: any;
    msdyn_isappawarename: any;
    msdyn_publickeytoken: any;
    msdyn_executionorder: any;
    msdyn_logicalcollectionname: string;
    msdyn_modifiedon: any;
    msdyn_primaryentityname: string;
    msdyn_workflowidunique: any;
    msdyn_relatedentity: string;
    msdyn_isdefault: any;
    msdyn_isolationmode: any;
    msdyn_uniquename: any;
    msdyn_iscustomizable: true;
    msdyn_version: any;
    msdyn_iscustomizablename: string;
    msdyn_createdon: any;
    msdyn_istableenabled: any;
    msdyn_executionstage: any;
    msdyn_workflowcategoryname: any;
    msdyn_culture: any;
    msdyn_typename: string;
    msdyn_isauditenabled: false;
    msdyn_isappaware: any;

    constructor() {

    }

}
