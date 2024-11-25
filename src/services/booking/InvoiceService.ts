import Helpers from "@src/commons/helpers";
import BookingClient from "./BookingClient";
import { IPagedList } from "@src/commons/interfaces";


export interface IRecordItinerary {
    itineraryDetails: IItineraryDetail[]
    itineraryMembers: IItineraryMember[]
    bookingOrders: IBookingOrder[]
    tenantCode: string
    serviceCode: string
    organizationId: string
    code: string
    name: string
    description: string
    searchText: string
    estimateAmount: number
    confirmStatus: number
    policyCompliance: number
    id: string
    status: number
    createTime: string
    createUser: string
    updateTime: string
    updateUser: string
}

export interface IItineraryDetail {
    bookingId: string
    orderId: string
    confirmStatusBooking: number
    bookingDetailId: string
    userIds: any
    itineraryId: string
    type: number
    itemId: string
    note: string
    startTime: string
    endTime: string
    estimateQuantity: number
    estimateAmount: number
    policyCompliance: number
    sequence: number
    bookingNo: string
    bookingClass: string
    extraInfo: string
    id: string
    status: number
    createTime: string
    createUser: string
    updateTime: string
    updateUser: string
}

export interface IBookingOrder {
    itineraryId: string
    bookingId: string
    bookingDetailId: string
    orderId: string
    id: string
    status: number
    createTime: string
    createUser: string
    updateTime: string
    updateUser: string
}

export interface IItineraryMember {
    id: string;
    itineraryId: string;
    detailId: string;
    userId: string;
    userProfile: ItineraryMemberProfile;
    updateTime: string;
}
export interface ItineraryMemberProfile {
    fullName: string;
    email: string;
    avatarId?: string;
    avatarUrl?: string;
    identityId: string;
    phoneNumber?: string;
    location: string;
}


const InvoiceService = {

    getPaged: async (data: {
        organizationId: string,

        status?: string,
        timeline?: number,
        searchText?: string,
        types?: number[],
        confirmOrder?: number,
        policyCompliance?: number,
        endTime?: number,
        startTime?: number,

        orderby?: string,
        pageSize?: number,
        pageNumber?: number,
    }): Promise<IPagedList<IRecordItinerary>> => {
        const query = Helpers.handleFormatParams({ ...data, isOrder: true });
        const result = await BookingClient().get("/Itinerary/GetPaged" + `?${query}`);
        return result.data.result;
    },


};

export default InvoiceService;
