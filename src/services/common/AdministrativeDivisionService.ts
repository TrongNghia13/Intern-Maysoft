import Constants from "@src/constants";
import CommonClient from "./CommonClient";
import Helpers from "@src/commons/helpers";
import { ICountry } from "@src/commons/interfaces";



const AdministrativeDivisionService = {
    async getPaged(data: {
        type?: number;
        name?: string;
        countryCode?: string;
        selectedCodes?: string[];
        parentDivision?: number;
        pageNumber?: number;
        pageSize?: number;
    }) {
        const query = Helpers.handleFormatParams(data);
        const result = await CommonClient().get("/AdministrativeDivision/GetPaged" + `?${query}`);
        return result.data.result;
    },

    async getAll(data: {
        type?: number,
        name?: string,
        parentDivision?: string,
    }): Promise<ICountry[]> {
        const newdata = Helpers.handleFormatParams(data);
        const query = Helpers.isNullOrEmpty(newdata) ? "" : `?${newdata}`;

        const result = await CommonClient().get(`${Constants.ApiPath.ADMINISTRATIVE_DIVISION.GET_ALL}${query}`);
        return result.data.result;
    },
    
};

export default AdministrativeDivisionService;
