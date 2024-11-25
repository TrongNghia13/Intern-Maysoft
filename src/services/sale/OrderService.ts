import SaleClient from "./SaleClient";
import Constants from "@src/constants";
import Helpers from "@src/commons/helpers";

import { IOrder } from "@src/commons/interfaces";
import { IOrderCheckout, IRequestPricing } from "@src/pages/checkout/useDataPaymentTrip.hook";



const OrderService = {
    async getByIds(data: { ids: string[] }): Promise<IOrder[]> {
        const query  = Helpers.handleFormatParams(data)
        const result = await SaleClient().get(Constants.ApiPath.ORDER.GET_BY_IDS + `?${query}`);
        return result.data.result;
    },

    getPricing: async (data: any) => {
        const result = await SaleClient().post(`${Constants.ApiPath.ORDER.PRICING}`, { ...data });
        return result.data.result;
    },

    pricingMultiple: async (data: IRequestPricing[]): Promise<IOrderCheckout[]> => {
        const result = await SaleClient().post(`${Constants.ApiPath.ORDER.PRICING_MULTIPLE}`, data);
        return result.data.result;
    },

    create: async (data: any) => {
        const result = await SaleClient().post(`${Constants.ApiPath.ORDER.CREATE}`, { ...data });
        return result.data.result;
    },

    updateAndPayment: async (data: any): Promise<{
        transactionId: string;
        returnUrl: string;
    }> => {
        const result = await SaleClient().post(`${Constants.ApiPath.ORDER.UPDATE_AND_PAYMENT}`, { ...data });
        return result.data.result;
    },

    confirmPayment: async (data: {
        targetId: string;
        orderIds: string[];
        paymentType: number;
        returnUrl?: string;
    }): Promise<{
        transactionId: string;
        returnUrl: string;
        redirectUrl?: string;
    }> => {
        const result = await SaleClient().post(`${Constants.ApiPath.ORDER.CONFIRM_PAYMENT}`, { ...data });
        return result.data.result;
    },

    getDetail: async (id: string): Promise<IOrderCheckout> => {
        const result = await SaleClient().get(`${Constants.ApiPath.ORDER.DETAIL}/${id}`);
        return result.data.result;
    },

    getDetailByIds: async (ids: string[]): Promise<IOrderCheckout[]> => {
        const query = Helpers.handleFormatParams({ ids });
        const result = await SaleClient().get(`${Constants.ApiPath.ORDER.GET_ORDER_DETAIL_BY_ID}?${query}`);
        return result.data.result;
    },

    update: async (data: any) => {
        const result = await SaleClient().post(Constants.ApiPath.ORDER.UPDATE, { ...data });
        return result.data.result;
    },

    getPaged: async (data: any) => {
        const result = await SaleClient().get(`${Constants.ApiPath.ORDER.GET_PAGED}?${data}`);
        return result.data.result;
    },

    cancelOrder: async (id: string) => {
        const result = await SaleClient().post(`${Constants.ApiPath.ORDER.CANCEL}/${id}`);
        return result.data.result;
    },
};

export default OrderService;
