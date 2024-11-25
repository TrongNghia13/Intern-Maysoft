import Constants from "@src/constants";
import Helpers from "@src/commons/helpers";
import BookingClient from "./BookingClient";
import { IPagedList } from "@src/commons/interfaces";
import { IDataCreateUpdatePolicy, IGetByCondition, IRecordPolicy, IRequestGetpagedPolicy } from "@src/hooks/useDataPolicy.hook";

const BookingPolicyService = {

    getPaged: async (data: IRequestGetpagedPolicy): Promise<IPagedList<IRecordPolicy>> => {
        const query = Helpers.handleFormatParams(data);
        const result = await BookingClient().get(Constants.ApiPath.BOOKING_POLICY.GETPAGED + `?${query}`);
        return result.data.result;
    },

    getByCondition: async (data: IGetByCondition): Promise<IRecordPolicy[]> => {
        const query = Helpers.handleFormatParams(data);
        const result = await BookingClient().get(Constants.ApiPath.BOOKING_POLICY.GET_BY_CONDITION + `?${query}`);
        return result.data.result;
    },

    getDetail: async (id: string): Promise<IRecordPolicy> => {
        const result = await BookingClient().get(Constants.ApiPath.BOOKING_POLICY.DETAIL + `/${id}`);
        return result.data.result;
    },

    create: async (data: IDataCreateUpdatePolicy): Promise<any> => {
        const result = await BookingClient().post(Constants.ApiPath.BOOKING_POLICY.CREATE, data);
        return result.data.result;
    },

    update: async (data: IDataCreateUpdatePolicy): Promise<any> => {
        const result = await BookingClient().put(Constants.ApiPath.BOOKING_POLICY.UPDATE, data);
        return result.data.result;
    },

    delete: async (id: string) => {
        const result = await BookingClient().delete(Constants.ApiPath.BOOKING_POLICY.DELETE,
            { data: { policyIds: [id] } }
        );
        return result.data.result;
    },
};

export default BookingPolicyService;
