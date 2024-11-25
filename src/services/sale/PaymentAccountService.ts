import Constants from "@src/constants";
import SaleClient from "./SaleClient";
import Helpers from "@src/commons/helpers";
import { IMultiLanguageContent, IPagedList } from "@src/commons/interfaces";


export interface IRequestGetPagedPayment {
    organizationId: string
    groupId?: string
    type?: string
    orderby?: string
    pageSize?: number
    pageNumber?: number
}

export interface ICreatePayment {
    organizationId?: string
    partnerId?: string
    groupId?: string
    userId?: string

    name?: string
    cvc?: number
    type?: number
    default?: number
    bankCode?: string
    accountId?: string
    accountName?: string
    description?: string
    expiredDate?: number

    balance?: number
    availableBalance?: number
}

export interface IUpdatePayment {
    id?: string
    updateTime?: string | number

    cvc?: number
    name?: string
    default?: number
    bankCode?: string
    accountId?: string
    accountName?: string
    description?: string
    expiredDate?: number

    balance?: number
    availableBalance?: number
}

export interface IRecordPayment {
    id?: string
    updateTime?: string
    tenantCode?: string
    organizationId?: string
    organizationName?: IMultiLanguageContent

    groupId?: string
    groupName?: IMultiLanguageContent

    userId?: string
    userName?: string
    partnerId?: string
    partnerCode?: string
    partnerName?: string

    type?: number
    name?: string
    cvc?: string
    expiredDate: string
    default?: number
    accountId?: string
    accountName?: string
    bankCode?: string
    description?: string

    balance?: number
    creditLimit?: number
    currentCycle?: number
    billingCycle?: number
    currentBalance?: number
    availableBalance?: number
}

const PaymentAccountService = {
    async getPaged(data: IRequestGetPagedPayment): Promise<IPagedList<IRecordPayment>> {
        const query = Helpers.handleFormatParams(data);
        const result = await SaleClient().get(Constants.ApiPath.PAYMENT_ACCOUNT.GETPAGED + `?${query}`);
        return result.data.result;
    },

    async create(data: ICreatePayment) {
        const result = await SaleClient().post(Constants.ApiPath.PAYMENT_ACCOUNT.CREATE, data);
        return result.data.result;
    },

    async setDefault(id: string) {
        const result = await SaleClient().patch(Constants.ApiPath.PAYMENT_ACCOUNT.SET_DEFAULT + `/${id}`);
        return result.data.result;
    },

    async update(data: IUpdatePayment) {
        const result = await SaleClient().patch(Constants.ApiPath.PAYMENT_ACCOUNT.UPDATE, data);
        return result.data.result;
    },

    async delete(id: string) {
        const result = await SaleClient().delete(Constants.ApiPath.PAYMENT_ACCOUNT.DELETE + `/${id}`);
        return result.data.result;
    },

    async detail(id: string): Promise<IRecordPayment> {
        const result = await SaleClient().get(Constants.ApiPath.PAYMENT_ACCOUNT.DETAIL + `/${id}`);
        return result.data.result;
    },
};

export default PaymentAccountService;
