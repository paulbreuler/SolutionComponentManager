import { ComponentTypes } from "../componentTypes"
import { DeserializeJSON } from "../Utility/Helpers";

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

export class SolutionComponentSummary extends DeserializeJSON {
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
    msdyn_componenttypename: string | null;
    msdyn_componentlogicalname: string | null;
    msdyn_total: number | null;
    msdyn_statusname: string | null | undefined;
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

    public equalsNaive(scs: SolutionComponentSummary) {
        let isEqual = true;

        if (this.msdyn_displayname !== scs.msdyn_displayname
            || this.msdyn_ismanagedname !== scs.msdyn_ismanagedname
            || this.msdyn_componenttype !== scs.msdyn_componenttype
            || this.msdyn_componentlogicalname !== scs.msdyn_componentlogicalname) {
                
            isEqual = false;
        }

        return isEqual;
    }

    public equalsComplete(scs: SolutionComponentSummary) {
        var aProps = Object.getOwnPropertyNames(this);
        var bProps = Object.getOwnPropertyNames(scs);

        if (aProps.length != bProps.length) {
            return false;
        }

        for (var i = 0; i < aProps.length; i++) {
            var propName = aProps[i];

            if (this[propName] !== scs[propName]) {
                return false;
            }
        }

        return true;
    }
}
