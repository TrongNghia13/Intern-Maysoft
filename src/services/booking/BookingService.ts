import Constants from "@src/constants";
import Helpers from "@src/commons/helpers";
import BookingClient from "./BookingClient";
import { IDetailBooking, IPagedList, IRequestCreateBooking, IResponseCreateBooking } from "@src/commons/interfaces";

const BookingService = {
    getPaged: async (data: {
        buyer?: string;
        seller?: string;
        searchText?: string;
        confirmStatus?: string;
        organizationId?: string;
        pageSize?: number;
        pageNumber?: number;
    }): Promise<IPagedList<any>> => {
        const query = Helpers.handleFormatParams(data);
        const result = await BookingClient().get(Constants.ApiPath.BOOKING.GETPAGED + `?${query}`);
        return result.data.result;
    },

    create: async (data: IRequestCreateBooking): Promise<IResponseCreateBooking> => {
        const result = await BookingClient().post(Constants.ApiPath.BOOKING.CREATE, data);
        return result.data.result;
    },

    update: async (data: IRequestCreateBooking): Promise<IResponseCreateBooking> => {
        const result = await BookingClient().put(Constants.ApiPath.BOOKING.UPDATE, data);
        return result.data.result;
    },

    confirm: async (data: { bookingId: string }): Promise<string> => {
        const result = await BookingClient().put(Constants.ApiPath.BOOKING.CONFIRM, data);
        return result.data.result;
    },

    cancel: async (bookingId: string): Promise<any> => {
        const result = await BookingClient().put(Constants.ApiPath.BOOKING.CANCEL + `/${bookingId}`);
        return result.data.result;
    },

    delete: async (bookingId: string): Promise<any> => {
        const result = await BookingClient().delete(Constants.ApiPath.BOOKING.DELETE + `/${bookingId}`);
        return result.data.result;
    },

    getDetail: async (id: string): Promise<IDetailBooking> => {
        const result = await BookingClient().get(Constants.ApiPath.BOOKING.DETAIL + `/${id}`);
        return result.data.result;
    },

    getDetailByOrderId: async (id: string): Promise<IDetailBooking> => {
        const result = await BookingClient().get(Constants.ApiPath.BOOKING.DETAIL_BY_ORDER_ID + `/${id}`);
        return result.data.result;
    },
};

export default BookingService;
