import Helpers from "@src/commons/helpers";
import { IItineraryDetail } from "@src/commons/interfaces";
import Constants from "@src/constants";
import BookingClient from "./BookingClient";

const ItineraryDetailService = {
    detail: async (id: string): Promise<IItineraryDetail> => {
        const result = await BookingClient().get(Helpers.urlJoin(Constants.ApiPath.ITINERARY_DETAIL.DETAIL, id));
        return result.data.result;
    },

    cancel: async(id: string): Promise<string> => {
        const result = await BookingClient().patch(Helpers.urlJoin(Constants.ApiPath.ITINERARY_DETAIL.CANCEL, id));
        return result.data.result;
    }
};

export default ItineraryDetailService;
