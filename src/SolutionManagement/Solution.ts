import { ComponentTypes } from "../componentTypes"
import { DeserializeJSON } from "../Utility/Helpers";
import { IHeapItem } from "../Utility/Heap";

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
    msdyn_canvasappuniqueid: any;
    msdyn_componentlogicalname: string | null;
    msdyn_componenttype: number;
    msdyn_componenttypename: string | null;
    msdyn_connectorinternalid: string | null;
    msdyn_createdon: any;
    msdyn_culture: any;
    msdyn_deployment: string;
    msdyn_description: string;
    msdyn_displayname: string;
    msdyn_eventhandler: string;
    msdyn_executionorder: any;
    msdyn_executionstage: any;
    msdyn_fieldsecurity: string;
    msdyn_fieldtype: string;
    msdyn_isappaware: any;
    msdyn_isappawarename: any;
    msdyn_isauditenabled: false;
    msdyn_isauditenabledname: string;
    msdyn_iscustom: boolean;
    msdyn_iscustomizable: true;
    msdyn_iscustomizablename: string;
    msdyn_iscustomname: string;
    msdyn_isdefault: any;
    msdyn_isdefaultname: boolean | null;
    msdyn_ismanaged: boolean;
    msdyn_ismanagedname: string;
    msdyn_isolationmode: any;
    msdyn_istableenabled: any;
    msdyn_logicalcollectionname: string;
    msdyn_modifiedon: any;
    msdyn_name: string;
    msdyn_objectid: string;
    msdyn_objecttypecode: number;
    msdyn_owner: any;
    msdyn_owningbusinessunit: any;
    msdyn_primaryentityname: string;
    msdyn_publickeytoken: any;
    msdyn_relatedentity: string;
    msdyn_relatedentityattribute: string;
    msdyn_schemaname: string;
    msdyn_sdkmessagename: string;
    msdyn_solutioncomponentsummaryid: string | null;
    msdyn_solutionid: string;
    msdyn_status: any;
    msdyn_statusname: string | null | undefined;
    msdyn_subtype: number;
    msdyn_synctoexternalsearchindex: any;
    msdyn_total: number | null;
    msdyn_typename: string;
    msdyn_uniquename: any;
    msdyn_version: any;
    msdyn_workflowcategory: any;
    msdyn_workflowcategoryname: any;
    msdyn_workflowidunique: any;
    organizationid: string;

    HeapIndex: number;

    /**
     * Return -1 is component type is greater
     * Return msdyn_name localCompare if equal
     * Return 1 if less than
     * @param scs 
     */
    public compareTo(scs: SolutionComponentSummary) {

        if (!scs)
            return 0;

        if (this.msdyn_componenttype > scs.msdyn_componenttype) {
            return -1;
        } else if (this.msdyn_componenttype === scs.msdyn_componenttype) {
            return this.msdyn_name.localeCompare(scs.msdyn_name);
        } else {
            return 1;
        }
    }

    public equals(scs: SolutionComponentSummary) {
        let isEqual = true;

        if (this.msdyn_displayname !== scs.msdyn_displayname
            || this.msdyn_ismanagedname !== scs.msdyn_ismanagedname
            || this.msdyn_componenttype !== scs.msdyn_componenttype
            || this.msdyn_componentlogicalname !== scs.msdyn_componentlogicalname) {

            isEqual = false;
        }

        return isEqual;
    }

    public exactMatch(scs: SolutionComponentSummary) {
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
