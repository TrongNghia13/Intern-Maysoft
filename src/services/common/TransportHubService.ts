import CommonClient from "./CommonClient";
import Helpers from "@src/commons/helpers";



const TransportHubService = {
    async getPaged(data: {
        type?: number;
        countryCode?: string;
        selectedCodes?: string[];
        searchText?: string;
        pageNumber?: number;
        pageSize?: number;
    }) {
        const query = Helpers.handleFormatParams(data);
        const result = await CommonClient().get("/TransportHub/GetPaged" + `?${query}`);
        return result.data.result;
    },
};

export default TransportHubService;
