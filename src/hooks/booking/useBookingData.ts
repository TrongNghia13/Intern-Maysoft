import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import Helpers from "@src/commons/helpers";
import { IDetailHotel, IFlightDetail, IFlightExtraInformation, IHotelExtraInformation, IItineraryDetail, IRate } from "@src/commons/interfaces";
import ItineraryService from "@src/services/booking/ItineraryService";
import PropertyContentService from "@src/services/booking/PropertyContentService";
import { hideLoading, showLoading } from "@src/store/slice/common.slice";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { IRoomInfo } from "./type";
import { ItineraryType } from "@src/commons/enum";

interface IProps {
    ids: string[];
    itineraryId?: string | null;
}

export type HotelBookingDataHookResponse = {
    type: ItineraryType.Hotel;
    searchData: {
        isApartment: false,
        searchText: undefined,
        endDate: number;
        startDate: number;
        occupancy: { adultSlot: number; childrenOld: number[] }[];
    },
    roomInfo: IRoomInfo[];
    data: IDetailHotel;
    itineraryDetail: IItineraryDetail;

    // prices
    tax: number;
    taxInclusivePrice: number;
    taxEnclusivePrice: number;
}
export type FlightBookingDataHookResponse = {
    type: ItineraryType.Flight;
    data: IFlightExtraInformation[];
    itineraryDetail: IItineraryDetail;

    // // prices
    // tax: number;
    // taxInclusivePrice: number;
    // taxEnclusivePrice: number;
}

export const useBookingData = ({ ids, itineraryId }: IProps) => {
    const router = useRouter();
    const { i18n: { language } } = useTranslation();
    const dispatch = useDispatch();

    const [data, setData] = useState<(HotelBookingDataHookResponse | FlightBookingDataHookResponse)[]>([]);
    const [firstLoading, setFirstLoading] = useState<boolean>(false);

    const processHotelItinerary = useCallback(async (extraInfo: IHotelExtraInformation, item: IItineraryDetail) => {
        const detailHotel =  await PropertyContentService.detail({
            language: Helpers.getSearchLanguge(language),
            checkinTime: item.startTime || 0,
            checkoutTime: item.endTime || 0,
            propertyId: extraInfo.propertyId,
            occupancy: extraInfo.occupancy,
        });
        const roomInfo = extraInfo.occupancy.map(() => ({ ...detailHotel.rooms[0], guestName: "", email: "" }));

        // price calculation
        const currentRate = roomInfo[0].rates?.[0] as IRate;
        // const quantity = extraInfo.occupancy.length || 1;
        // const taxEnclusivePrice = Helpers.getTotalByKey(currentRate.prices[0], "exclusive");
        // const taxInclusivePrice = Helpers.getTotalByKey(currentRate.prices[0], "inclusive");
        // const tax = Math.round(taxInclusivePrice.value - taxEnclusivePrice.value);

        return {
            type: ItineraryType.Hotel,
            searchData: {
                endDate: Number(item.endTime || 0),
                startDate: Number(item.startTime || 0),
                occupancy: extraInfo.occupancy,
            },
            roomInfo,
            data: Helpers.getCurrentRoomAndRateOfHotel(detailHotel, extraInfo.roomId, extraInfo.itemId),
            itineraryDetail: item,

            // tax,
            // taxInclusivePrice,
            // taxEnclusivePrice,
        } as HotelBookingDataHookResponse;
    }, [language])
    const processFlightItinerary = useCallback(async (extraInfo: IFlightExtraInformation, item: IItineraryDetail) => {
        return {
            type: ItineraryType.Flight,
            data: [extraInfo],
            itineraryDetail: item,
        } as FlightBookingDataHookResponse;
    }, [])
    useEffect(() => {
        const getData = async () => {
            try {
                dispatch(showLoading());
                const result = await ItineraryService.getListDetail({
                    // @ts-ignore
                    itineraryId,
                    detailIds: ids,
                });
                const data = await Promise.all(result.map((item) => {
                    const extraInfo = JSON.parse(item.extraInfo);
                    if (!Helpers.isNullOrEmpty(extraInfo)) {
                        if (item.type === ItineraryType.Flight) {
                            return processFlightItinerary(Helpers.toCamelCaseObj(extraInfo), item);
                        }
                        if (item.type === ItineraryType.Hotel) {
                            return processHotelItinerary(Helpers.toCamelCaseObj(extraInfo), item);
                        }
                    }
                    return null;
                }));
                // check if any item in data is null
                if (data.every((item) => item !== null)) {
                    setFirstLoading(true);
                    setData(data as any);
                }
            } catch (error) {
                Helpers.handleError(error);
            } finally {
                dispatch(hideLoading());
            }
        };

        if (ids.length > 0 && itineraryId) {
            getData();
        }
    }, [dispatch, ids, itineraryId, language, processFlightItinerary, processHotelItinerary]);

    if (firstLoading && Helpers.isNullOrEmpty(data)) {
        router.replace("/404");
    }

    return { data, firstLoading, };
};

export default useBookingData;
