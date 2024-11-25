import Helpers from "@src/commons/helpers";
import { IItinerary, IItineraryDetail, IItineraryMember, IPagedList, IRequestCreateBooking, IResponseConfirmDetailItinerary, IResponseConfirmDetailItineraryError } from "@src/commons/interfaces";
import Constants from "@src/constants";
import BookingClient from "./BookingClient";
import { ActionSubmit, ConfirmStatus, ConfirmStatusBooking, PaymentStatus, RequestStatus, RequestType, Status, Timeline } from "@src/commons/enum";
import { IRecordRequestV2Service } from "@src/hooks/useDataRequestApproveReject.hook";

export type IRequestCreateItinerary = {
    serviceCode: string;
    organizationId: string;
    nameDefault: string;
    description: string;
    userIds: string[];
};

export type IRequestUpdateItinerary = IRequestCreateItinerary & {
    id: string;
    updateTime: string | number;
    detailAddBooking?: {
        itineraryDetailId?: string;
        bookingRequest: IRequestCreateItineraryAndBooking | undefined;
        userIds: string[];
        action: ActionSubmit;
    }
};

export type IResponseCreateItinerary = {
    tenantCode: string;
    serviceCode: string;
    organizationId: string;
    code: string;
    name: string;
    description: any;
    searchText: string;
    estimateAmount: number;
    confirmStatus: number;
    policyCompliance: number;
    id: string;
    status: number;
    createTime: string;
    createUser: string;
    updateTime: string;
    updateUser: string;
};

export type IRequestCreateItineraryAndBooking = Omit<IRequestCreateBooking, "countryPhoneNumber" | "propertyId"> & {
    nameDefault: string;
    userIds: string[];
} & {
    countryPhoneNumber?: string;
    propertyId?: string;
};

// export type IRequestUpdateItineraryDetail = {
//     itineraryId: string;
//     itineraryDetailId?: string;
//     nameDefault: string;
//     userIds: string[];
//     bookingNew: IRequestCreateItineraryAndBooking;
//     updateTime: string | number;
// };

export type IRequestConfirmDetailItinerary = {
    itineraryId: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    phoneCode: string;
    email: string;
    detailIdComfirm: string[];
    isConfirmedPrice: boolean,
};

export type IBookingInfoRequest = {
    firstName: string;
    lastName: string;
};

export type IRequestGetPagedItinerary = {
    organizationId: string;
    status?: Status[];
    searchText?: string;
    types?: number[];
    policyCompliance?: number;
    startTime?: string | number;
    endTime?: string | number;

    timeline?: Timeline;
    isOrder?: boolean;
    paymentConfirm?: PaymentStatus[];
    paymentConfirmNotIn?: PaymentStatus[];
    confirmStatus?: ConfirmStatus[];
    isNoneDetail?: boolean;
    statusDetail?: Status[];

    pageNumber: number;
    pageSize: number;
    orderby?: string;
};

export type ICountItinerary = {
    past: number;
    now: number;
    future: number;
};

export type IRequestUpdateMemberDetail = {
    itineraryId: string;
    itineraryDetailId: string;
    userIds: string[];
};

export type IItineraryGetListDetailRequest = {
    detailIds: string[];
    itineraryId: string;
    checkRequest?: boolean;
}
export interface ITineraryGetListDetailResponse extends IItineraryDetail {
    bookingId: string | undefined;
    orderId: string | undefined;
    confirmStatusBooking: ConfirmStatusBooking;
    bookingDetailId: string | undefined;
    itineraryMembers: IItineraryMember[];
}

export type IItinerarySubmitRequest = {
    detailIds: string[];
    itineraryId: string;
    action: ActionSubmit;
}

export interface IItinerarySendRequestBodyData {
    detailIds: string[];
    itineraryId: string;
    redirectUrl: string;

    email: string,
    phoneNumber: string,
    phoneCode: string,
    firstName: string,
    lastName: string,
    isConfirmedPrice: boolean,
}
interface ItinerarySendRequestError {
    isSuccess: false,
    statusCode: number,
    mesCode: string,
    userIdErr: string[],
    result: {
        itineraryDetailIds?: string[],
        needApprove?: number;
        bookingFlightResponse?: {
            session_id?: string,
            booking?: any,
            new_fare_amount_info?: any,
            is_success: boolean,
            statusCode?: number,
            error_code?: string,
            error_msg?: string
        }
    }[],
    priceItineraryDetail?: number,
    // statusCode: number;
    // isSuccess: boolean;
    // mesCode: string;
    // userIdErr: null;
    // itineraryDetailIds: string[];
}
const ItineraryService = {
    //IPagedList<IDetailHotel>
    create: async (data: IRequestCreateItinerary): Promise<IResponseCreateItinerary> => {
        const result = await BookingClient().post(Constants.ApiPath.ITINERARY.CREATE, data);
        return result.data.result;
    },

    createByBooking: async (data: IRequestCreateItineraryAndBooking): Promise<IResponseCreateItinerary> => {
        const result = await BookingClient().post(Constants.ApiPath.ITINERARY.CREATE_BY_BOOKING, data);
        return result.data.result;
    },

    getPaged: async (data: IRequestGetPagedItinerary): Promise<IPagedList<IItinerary>> => {
        const query = Helpers.handleFormatParams(data);
        const result = await BookingClient().get(`${Constants.ApiPath.ITINERARY.GET_PAGED}?${query}`);
        return result.data.result;
    },
    getCountItinerary: async (data: Omit<IRequestGetPagedItinerary, "pageSize" | "orderBy" | "pageNumber">): Promise<number> => {
        const query = Helpers.handleFormatParams(data);
        const result = await BookingClient().get(`${Constants.ApiPath.ITINERARY.COUNT_IITNERARY}?${query}`);
        return result.data.result;
    },

    detail: async (id: string): Promise<IItinerary> => {
        const result = await BookingClient().get(Helpers.urlJoin(Constants.ApiPath.ITINERARY.DETAIL, id));
        return result.data.result;
    },

    update: async (data: IRequestUpdateItinerary): Promise<IResponseCreateItinerary> => {
        const result = await BookingClient().patch(Constants.ApiPath.ITINERARY.UPDATE, data);
        return result.data.result;
    },

    updateMemberDetail: async (data: IRequestUpdateMemberDetail): Promise<string[]> => {
        const result = await BookingClient().patch(Constants.ApiPath.ITINERARY.UPDATE_MEMBER_DETAIL, data);
        return result.data.result;
    },

    // updateItinerary: async (data: IRequestUpdateItineraryDetail): Promise<any> => {
    //     const result = await BookingClient().patch(Constants.ApiPath.ITINERARY.UPDATE_ITINERARY, data);
    //     return result.data.result;
    // },

    confirmDetails: async (data: IRequestConfirmDetailItinerary): Promise<{
        version: string,
        message: string,
        statusCode: number,
        result: IResponseConfirmDetailItinerary | IResponseConfirmDetailItineraryError
    }> => {
        const result = await BookingClient().patch(Constants.ApiPath.ITINERARY.CONFIRM_DETAILS, data);
        if (result.data.statusCode === 200) {
            return {
                ...result.data,
                result: {
                    ...result.data.result,
                    isSuccess: true,
                },
            }
        }
        return result.data;
    },

    delete: async (id: string): Promise<any> => {
        const result = await BookingClient().delete(Helpers.urlJoin(Constants.ApiPath.ITINERARY.DELETE, id));
        return result.data.result;
    },

    deleteItineraryDetail: async (ids: string[]): Promise<any> => {
        const result = await BookingClient().delete(Constants.ApiPath.ITINERARY.DELETE_ITINERARY_DETAIL, {
            data: ids,
        });
        return result.data.result;
    },

    // getDetail: async (id: string): Promise<IBookingDetail> => {
    //     const result = await BookingClient().get(Constants.ApiPath.ITINERARY.DETAIL + `/${id}`);
    //     return result.data.result;
    // },

    // getDetailByOrderId: async (id: string): Promise<IDetailBooking> => {
    //     const result = await BookingClient().get(Constants.ApiPath.ITINERARY.DETAIL_BY_ORDER_ID + `/${id}`);
    //     return result.data.result;
    // },
    getListDetail: async (data: IItineraryGetListDetailRequest): Promise<ITineraryGetListDetailResponse[]> => {
        const query = Helpers.handleFormatParams(data);
        const result = await BookingClient().get(Constants.ApiPath.ITINERARY.GET_LIST_DETAIL.concat("?", query));
        return result.data.result;
    },
    submitRequest: async (data: IItinerarySubmitRequest): Promise<any> => {
        const query = Helpers.handleFormatParams(data);
        const result = await BookingClient().post(Constants.ApiPath.ITINERARY.SUBMIT_REQUEST, data);
        return result.data.result;
    },

    // Sonle
    getApproval: async (data: { memberIds?: string[], searchText?: string }): Promise<IRecordRequestV2Service[]> => {
        const query = Helpers.handleFormatParams(data);
        const result = await BookingClient().get(`/Itinerary/GetApproval?${query}`);
        return result.data.result;
    },

    sendRequest: async (data: IItinerarySendRequestBodyData): Promise<{
        version: string,
        message: string,
        statusCode: number,
        result: ItinerarySendRequestError,
    }> => {
        const result = await BookingClient().patch(`/Itinerary/SendRequest`, data);
        if (result.data.statusCode === 200) {
            return {
                ...result.data,
                result: {
                    ...result.data.result,
                    isSuccess: true,
                },
            }
        }
        return result.data;
    }
};

export default ItineraryService;