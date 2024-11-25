import { WorkFlowCriteriaCompareType, WorkflowActionType } from "@src/commons/enum";
import Helpers from "@src/commons/helpers";
import MayworkClient from "./MayworkClient";

export interface IDataAppRoveRequest {
    datas: {
        dataId: number;
        redirectUrl: string;
        requestDetail?: string;
        criteria: {
            name: string;
            value: string;
            valueType: number;
            compareType: number;
        };
    }[];
}

export interface IReponseGetByCondition {
    id: string;
    dataId: string;
    targetId: string;
    workflowId: string;
    requestStatus: number;
    currentStep: string;
    requestDetail: string;
    logs: ILog[];
    stakeHolders: IStakeHolder[];
}

export interface IStakeHolder {
    id: string;
    requestId: string;
    stakeholderId: string;
    stakeholderType: number;
    userId: string;
    permission: number;
    assignedDate: string;
    responseDate: any;
    dueDate: string;
    completedDate?: string;
}

export interface ILog {
    id: string;
    requestId: string;
    requestStatus: number;
    currentStep: string;
    stakeholder: string;
    actionDate: string;
    description: string;
    extraInformation: string;
}

export type IDataRejctRequest = IDataAppRoveRequest & { reason: string };

interface RequestV2CheckRequestData {
    userId: string;
    groupId: string;
    dataId: string;
    workflowId: string;
    criteria: {
        valueType: number;
        name: string;
        value: string;
        compareType: WorkFlowCriteriaCompareType;
    };
    redirectUrl: string;
    requestDetail?: string;
}
interface RequestV2CheckRequest {
    requestDate: string;
    organizationId: string;
    datas: RequestV2CheckRequestData[];
}

interface RequesV2CreateRequestData extends RequestV2CheckRequestData {}
export interface RequestV2CreateRequest {
    organizationId: string;
    requestDate: string;
    description?: string;
    requestGroup: {
        targetId: string;
        name: string;
        description?: string;
    };
    datas: RequesV2CreateRequestData[];
    actionType: WorkflowActionType;
}

export type IResponseGetRequestByCondition = Record<string, IReponseGetByCondition[]>;

const RequestV2Service = {
    async getByCondition(data: { targetIds: string[]; permission: number }): Promise<IResponseGetRequestByCondition> {
        const query = Helpers.handleFormatParams(data);
        const result = await MayworkClient().get("/RequestV2/GetByCondition" + `?${query}`);
        return result.data.result;
    },

    async getApprovalRequest(): Promise<string[]> {
        const result = await MayworkClient().get("/RequestV2/GetApprovalRequest");
        return result.data.result;
    },

    async appRoveRequest(data: IDataAppRoveRequest): Promise<any> {
        const result = await MayworkClient().patch(`/RequestV2/Approve`, data);
        return result.data.result;
    },

    async rejectRequest(data: IDataRejctRequest): Promise<any> {
        const result = await MayworkClient().patch("/RequestV2/Reject", data);
        return result.data.result;
    },

    async create(data: RequestV2CreateRequest) {
        const result = await MayworkClient().post(`/RequestV2/Create`, data);
        return result.data.result;
    },

    async checkRequest(data: RequestV2CheckRequest) {
        const result = await MayworkClient().post(`/RequestV2/CheckRequest`, data);
        return result.data.result;
    },

    async cancel(id: string): Promise<any> {
        const result = await MayworkClient().patch(`/RequestV2/Cancel/${id}`);
        return result.data.result;
    },
};

export default RequestV2Service;
