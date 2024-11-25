import Helpers from "@src/commons/helpers";
import BookingClient from "./BookingClient";
import { IDetailHotel, IPagedList } from "@src/commons/interfaces";

interface IRequestSearch {
    maxPrice?: number;
    minPrice?: number;
    amenityIds?: string[];
    orderby?: string;
    pageSize?: number;
    pageNumber?: number;

    language: string;
    propertyIds: string[];
    checkinTime: string | number;
    checkoutTime: string | number;
    occupancy: {
        adultSlot: number;
        childrenOld: number[];
    }[];
}

interface IRequestDetail {
    language: string;
    propertyId: string;
    checkinTime: string | number;
    checkoutTime: string | number;
    occupancy: {
        adultSlot: number;
        childrenOld: number[];
    }[];
}

const PropertyContentService = {
    search: async (req: IRequestSearch): Promise<IPagedList<IDetailHotel>> => {
        let amenityIds: string[] = [];
        req.amenityIds?.forEach((val, index) => {
            amenityIds.push(`amenityIds[${index}]=${val}`);
        });

        let propertyIds: string[] = [];
        req.propertyIds.forEach((val, index) => {
            propertyIds.push(`propertyIds[${index}]=${val}`);
        });

        let occupancys: string[] = [];
        req.occupancy.forEach((item, index) => {
            occupancys.push(`occupancy[${index}].adultSlot=${item.adultSlot}`);
            item.childrenOld?.forEach((el, i) => {
                occupancys.push(`occupancy[${index}].childrenOld[${i}]=${el}`);
            });
        });

        let query = "";

        query = query + `language=${req.language}`;

        if (!Helpers.isNullOrEmpty(req.minPrice)) {
            query = query + `&minPrice=${req.minPrice}`;
        }
        if (!Helpers.isNullOrEmpty(req.maxPrice)) {
            query = query + `&maxPrice=${req.maxPrice}`;
        }
        if (!Helpers.isNullOrEmpty(req.pageNumber)) {
            query = query + `&pageNumber=${req.pageNumber}`;
        }
        if (!Helpers.isNullOrEmpty(req.pageSize)) {
            query = query + `&pageSize=${req.pageSize}`;
        }
        if (!Helpers.isNullOrEmpty(req.orderby)) {
            query = query + `&orderby=${req.orderby}`;
        }

        query = query + `&checkinTime=${req.checkinTime}`;
        query = query + `&checkoutTime=${req.checkoutTime}`;

        query = query + `&${propertyIds.join("&")}`;
        query = query + `&${occupancys.join("&")}`;

        if (amenityIds.length > 0) {
            query = query + `&${amenityIds.join("&")}`;
        }

        const result = await BookingClient().get("/PropertyContent/Search" + `?${query}`);
        return result.data.result;
    },

    detail: async (req: IRequestDetail): Promise<IDetailHotel> => {
        let occupancys: string[] = [];
        req.occupancy.forEach((item, index) => {
            occupancys.push(`occupancy[${index}].adultSlot=${item.adultSlot}`);
            item.childrenOld?.forEach((el, i) => {
                occupancys.push(`occupancy[${index}].childrenOld[${i}]=${el}`);
            });
        });

        let query = "";

        query = query + `language=${req.language}`;
        query = query + `&propertyId=${req.propertyId}`;
        query = query + `&checkinTime=${req.checkinTime}`;
        query = query + `&checkoutTime=${req.checkoutTime}`;
        query = query + `&${occupancys.join("&")}`;

        const result = await BookingClient().get("/PropertyContent/Detail" + `?${query}`);
        return result.data.result;
    },
};

export default PropertyContentService;
