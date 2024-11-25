import Constants from "@src/constants";
import Helpers from "@src/commons/helpers";
import MayworkClient from "./MayworkClient";
import { IPagedList } from "@src/commons/interfaces";



const WorkFlowService = {

    async getAll(): Promise<{
        id: string,
        code: string,
        name: string,
    }[]> {
        const result = await MayworkClient().get(Constants.ApiPath.WORKFLOW.GET_ALL);
        return result.data.result;
    },

    async getPaged(data: {
        searchText?: string,
        organizationId?: string,

        orderby?: string,
        pageSize?: number,
        pageNumber?: number,
    }): Promise<IPagedList<IRecordWorkflow>> {
        const query = Helpers.handleFormatParams(data);

        const result = await MayworkClient().get(
            `${Constants.ApiPath.WORKFLOW.GET_PAGED}?${query}`
        );

        return result.data.result;
    },

    async getDetail(id: string): Promise<IRecordWorkflow> {
        const result = await MayworkClient().get(
            Constants.ApiPath.WORKFLOW.DETAIL + `/${id}`,
        );
        return result.data.result;
    },

    async create(data: ICreateWorkflow): Promise<string> {
        const result = await MayworkClient().post(
            Constants.ApiPath.WORKFLOW.CREATE,
            data
        );
        return result.data.result;
    },

    async update(data: IUpdateWorkflow): Promise<any> {
        const result = await MayworkClient().patch(
            Constants.ApiPath.WORKFLOW.UPDATE,
            data
        );
        return result.data.result;
    },

    async fullUpdate(data: ICreateWorkflow): Promise<any> {
        const result = await MayworkClient().patch(
            Constants.ApiPath.WORKFLOW.FULL_UPDATE,
            data
        );
        return result.data.result;
    },

    async delete(id: string): Promise<any> {
        const result = await MayworkClient().delete(
            Constants.ApiPath.WORKFLOW.DELETE + `/${id}`
        );
        return result.data.result;
    },

}

export default WorkFlowService;

export interface IRecordWorkflow {
    tenantCode: string
    organizationId: string,

    id: string
    type: number
    code: string
    name: string
    caseCode: string
    updateTime: string
    description: string

    commonSetting?: {
        id?: string
        workflowId?: string
        phaseId?: string
        settingCode?: string
        settingValue?: any
        action?: number
        criteriaId?: string
        nextPhase?: string
        nextStatus?: any
        updateTime?: string
    }

    phases?: IRecordWorkflowPhase[]
};

export interface ICreateWorkflow {
    id?: string,
    name: string,
    code?: string,
    caseCode?: string,
    updateTime?: string,
    description?: string,
    phases?: {
        id?: string
        sla: number
        index: number
        sequence: number
        phaseName: string
        description: string
        stakeholders: {
            id?: string
            permission: number
            stakeholderId: string
            stakeholderType: number
            sameHierachyGroup: number
        }[]
        actions: {
            id?: string
            action: number
            nextPhase: string
            criteriaId: string
            nextStatus: number
            results: {
                id?: string
                type: number
                dataField: string
                dataValue: string
            }[]
        }[]
    }[],
    settingCommon?: {
        settingCode?: string,
        criteriaId?: string,
    },
}

export interface IUpdateWorkflow {
    id: string,
    code: string,
    name: string,
    caseCode?: string,
    description?: string,
    updateTime: string | number,
    settingCommon?: {
        settingCode?: string,
        criteriaId?: string,
    },
}

export interface IRecordWorkflowPhase {
    id?: string
    sla?: string
    sequence?: number
    phaseName?: string
    workflowId?: string
    updateTime?: string
    description?: string

    stakeHolders?: {
        id?: string
        phaseId?: string
        sequence?: number
        permission?: number
        workflowId?: string
        stakeholderId?: string
        stakeholderType?: number
        sameHierachyGroup?: number
        updateTime?: string
    }[]
    actions?: {
        id?: string
        action?: number
        phaseId?: string
        nextPhase?: string
        nextStatus?: number
        workflowId?: string
        criteriaId?: string
        settingValue?: any
        settingCode?: string
        updateTime?: string
    }[]
}