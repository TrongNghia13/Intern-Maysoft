import Constants from "@src/constants";
import BookingClient from "./BookingClient";

export interface IReqIssueTicket {
    bookingCode: string
    itineraryId: string
    acceptChange: number
    itineraryDetailId: string
    changeTimes: IChangeTime[]
}

export interface IChangeTime {
    leg: number
    departDT: string
    arrivalDT: string
    departDate: number
    arrivalDate: number
    segment: ISegment[]
}

export interface ISegment {
    index: number
    departDT: string
    departDate: string
    arrivalDT: string
    arrivalDate: string
}

const FlightService = {
    issue: async (data: IReqIssueTicket): Promise<string> => {
        const result = await BookingClient().patch(Constants.ApiPath.FLIGHT.ISSUE, data);
        return result.data;
    },

    retrieveBooking: async (bookingCode: string): Promise<any> => {
        const result = await BookingClient().get(Constants.ApiPath.FLIGHT.RETRIEVE_BOOKING + `/${bookingCode}`);
        return result.data.result;
    },
};

export default FlightService;
