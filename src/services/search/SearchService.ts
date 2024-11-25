import Constants from "@src/constants";
import SearchClient from "./SearchClient";
import { IPagedList, ISearch } from "@src/commons/interfaces";

interface IPartner {
    serviceCode?: string;
    tenantCode?: string;
    organizationIds?: string[];
    attributeValues?: string[];
    partnerName?: string;
    partnerCode?: string;
    referralCode?: string;
    referenceId?: string;
    externalId?: string;
    address_AddressLine?: string;
    address_AddressLine2?: string;
    address_WardName?: string;
    address_DistrictName?: string;
    address_CityName?: string;
    address_ProvinceName?: string;
    address_CountryCode?: string;
    address_PostalCode?: string;
    address_Longitude?: string;
    address_Lattitude?: string;
}

const SearchService = {
    search: async (data: { entity: string; pageNumber: number; pageSize: number; orderBy?: any; partner?: IPartner }): Promise<IPagedList<ISearch>> => {
        const result = await SearchClient().post(Constants.ApiPath.SEARCH.QUERY.replace("entity", data.entity), {
            serviceCode: Constants.SERVICE_CODE,
            pageNumber: data.pageNumber,
            pageSize: data.pageSize,
            partner: data?.partner,
        });
        return result.data.result;
    },
};

export default SearchService;
