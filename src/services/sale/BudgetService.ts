import Constants from "@src/constants";
import SaleClient from "./SaleClient";
import Helpers from "@src/commons/helpers";
import { IPagedList } from "@src/commons/interfaces";


export interface ITimerangeCustom {
    id?: string,
    from?: number | string,
    to?: number | string,
    amount?: number,
    currency?: string,
}

export interface INotifyTargetCustom {
    id?: string,
    targetId?: string,
    targetType?: number,
}

export interface ICreateUpdateBudget {
    id?: string,
    name?: string,
    serviceCode?: string[],
    organizationId?: string,
    groupId?: string,

    amount?: number,
    currency?: string,

    timerange?: number,
    timerangeCustom?: ITimerangeCustom[],

    notifyTarget?: number,
    notifyTargetCustom?: INotifyTargetCustom[],

    targetType?: string,
    targetId?: string,

    percentAlert?: string | number,

}

export interface IRequestGetPaged {
    pageSize?: number,
    pageNumber?: number,
    serviceCode?: string[],
    organizationId?: string,

    name?: string,
    to?: string | number,
    from?: string | number,
    timerangeBudget?: number,
}

export interface IRecordBudget {
    budgetTimeranges: IBudgetTimerange[]
    budgetNotifyTargets: IBudgetNotifyTarget[]
    budgetService: IBudgetService[]
    budgetAlert: IBudgetAlert
    budgetActuals: IBudgetActual[]
    actualAmount: number
    quarter: number
    remainDay: number
    tenantCode: string
    organizationId: string
    groupId: string
    name: string
    timerange: number
    notifyTarget: number
    amount: number
    currency: string
    id: string
    status: number
    createTime: string
    createUser: string
    updateTime: string
    updateUser: string
}

export interface IBudgetActual {
    budgetId: string
    timerangeId: string
    serviceCode: any
    actual: number
    id: string
    status: number
    createTime: string
    createUser: any
    updateTime: string
    updateUser: any
}

export interface IBudgetTimerange {
    budgetId: string
    from: string
    to: string
    currency: string
    amount: number
    id: string
    status: number
    createTime: string
    createUser: string
    updateTime: string
    updateUser: string
}

export interface IBudgetNotifyTarget {
    budgetId: string
    targetType: number
    targetId: string
    id: string
    status: number
    createTime: string
    createUser: string
    updateTime: string
    updateUser: string
}

export interface IBudgetService {
    budgetId: string
    serviceCode: string
    id: string
    status: number
    createTime: string
    createUser: string
    updateTime: string
    updateUser: string
}

export interface IBudgetAlert {
    budgetId: string
    percent: number
    id: string
    status: number
    createTime: string
    createUser: string
    updateTime: string
    updateUser: string
}


const BudgetService = {

    async getAll(data: { serviceCode?: string[] }): Promise<{
        id: string,
        name: string,
    }[]> {
        const query = Helpers.handleFormatParams(data);
        const result = await SaleClient().get(Constants.ApiPath.BUDGET.GET_ALL + `?${query}`);
        return result.data.result;
    },

    async getPaged(data: IRequestGetPaged): Promise<IPagedList<IRecordBudget>> {
        const query = Helpers.handleFormatParams(data);
        const result = await SaleClient().get(Constants.ApiPath.BUDGET.GET_PAGED + `?${query}`);
        return result.data.result;
    },

    async create(data: ICreateUpdateBudget) {
        const result = await SaleClient().post(Constants.ApiPath.BUDGET.CREATE, data);
        return result.data.result;
    },

    async update(data: ICreateUpdateBudget) {
        const result = await SaleClient().patch(Constants.ApiPath.BUDGET.UPDATE, data);
        return result.data.result;
    },

    async detail(id: string): Promise<IRecordBudget> {
        const result = await SaleClient().get(`${Constants.ApiPath.BUDGET.DETAIL}/${id}`);
        return result.data.result;
    },

    async delete(id: string) {
        const result = await SaleClient().delete(`${Constants.ApiPath.BUDGET.DELETE}/${id}`);
        return result.data.result;
    },

};

export default BudgetService;
