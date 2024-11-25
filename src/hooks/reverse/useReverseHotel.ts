import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

import Helpers from "@src/commons/helpers";
import { IBookingDetailRequest, IDetailHotel, IInfoRoomGuest, IItineraryDetail, IOccupancy, IRate, IRoom } from "@src/commons/interfaces";

import { ActionSubmit, ItineraryType, SupplierCode } from "@src/commons/enum";
import Constants from "@src/constants";
import PathName from "@src/constants/PathName";
import { IRoomInfo } from "@src/hooks/booking/type";
import { ISearchHotelData } from "@src/hooks/searchHotel/useData";
import { useAuth } from "@src/providers/authProvider";
import ItineraryService, { IRequestCreateItineraryAndBooking, IRequestUpdateItinerary } from "@src/services/booking/ItineraryService";
import { RootState } from "@src/store";
import { hideLoading, showLoading } from "@src/store/slice/common.slice";

const useReverseHotel = () => {
    const router = useRouter();
    const auth = useAuth();

    const dispatch = useDispatch();
    const userInfo = useSelector((state: RootState) => state.userInfo.userProfile);

    const getCurrentUserIdsByOccupany = (occupancy: IOccupancy[]) => {
        const userIds = occupancy.reduce((acc, cur) => {
            acc.push(...cur.userIds || [])
            return acc
        },[] as string[])
        return Array.from(new Set(userIds));
    }
    const getUpdateRequestUserIds = (occupancy: IOccupancy[], userIds: string[] = []) => {
        const currentUserIds = getCurrentUserIdsByOccupany(occupancy);
        const unionUserIds = currentUserIds.concat(...userIds);
        const unionSet = new Set(unionUserIds);
        return Array.from(unionSet);
    }

    const handleReverse = async (
        room: IRoom,
        detail: IDetailHotel,
        searchData: ISearchHotelData,
        updateData?: {
            description: string;
            itineraryId: string;
            nameDefault: string;
            updateTime: string | number;
            userIds: string[];
            action: ActionSubmit;
        }
    ) => {
        try {
            // await Helpers.handleReverseStay(undefined, detail, room, searchData, userInfo.identityId, auth.signinRedirect, dispatch, router);
            if (Helpers.isNullOrEmpty(userInfo?.identityId)) {
                localStorage.setItem(Constants.StorageKeys.FROM, window.location.href);
                await auth.signinRedirect();
                return;
            }
            dispatch(showLoading());

            const roomInfo: IRoomInfo[] = [];
            for (let i = 0; i < searchData.occupancy.length; i++) {
                roomInfo.push({ ...room, guestName: "", email: "" });
            }

            const currentRate = roomInfo[0].rates.find((el) => el.referenceId === roomInfo[0].selectedRate) as IRate;
            const inclusive = Helpers.getTotalByKey(currentRate.prices[0], "inclusive");

            const occupancy: IOccupancy[] = searchData.occupancy;

            const infoRoomGuest: IInfoRoomGuest[] = [];
            const { firstName, lastName } = Helpers.getFirstAndLastname(userInfo?.fullName);

            for (const room of roomInfo) {
                infoRoomGuest.push({
                    firstName: firstName,
                    lastName: lastName,
                });
            }

            const bookingDetailRequests: IBookingDetailRequest[] = [
                {
                    roomId: roomInfo[0].referenceId,
                    bedGroupId: currentRate.bedId,
                    itemId: currentRate.referenceId,
                    quantity: 1,
                    occupancy,
                    bookingInfoRequest: infoRoomGuest,
                    type: ItineraryType.Hotel,
                    bookingClass: undefined,
                    bookingNo: undefined,
                    extraInfo: undefined,
                    unitPrice: undefined,
                    amount: undefined,
                },
            ];

            const requestData: IRequestCreateItineraryAndBooking = {
                serviceCode: Constants.SERVICE_CODE,
                organizationId: userInfo?.organizationId,
                firstName: firstName,
                lastName: lastName,
                phoneNumber: userInfo?.phoneNumber,
                countryPhoneNumber: undefined,
                propertyId: detail.propertyId,
                email: userInfo?.email,
                startTime: searchData.startDate,
                endTime: searchData.endDate,
                location: userInfo?.location,
                currency: inclusive.currency,
                bookingDetailRequests,
                supplierCode: SupplierCode.Expedia,
                nameDefault: detail.name,
                userIds: getCurrentUserIdsByOccupany(occupancy),
            };

            if (updateData && !Helpers.isNullOrEmpty(updateData.itineraryId)) {
                const itemBooking = Helpers.getSessionStorage(Constants.PAGE_LOCALSTORAGE_KEY.TRIP_DETAIL.RESELECT) as IItineraryDetail;
                const updateRequest: IRequestUpdateItinerary = {
                    id: updateData?.itineraryId || "",
                    // itineraryDetailId: undefined,
                    nameDefault: updateData?.nameDefault || "",
                    serviceCode: Constants.SERVICE_CODE,
                    organizationId: userInfo?.organizationId,
                    description: updateData?.description || "",
                    updateTime: updateData?.updateTime || "",
                    userIds: getUpdateRequestUserIds(occupancy, updateData.userIds || []),
                    detailAddBooking: {
                        itineraryDetailId: itemBooking?.id,
                        bookingRequest: requestData,
                        userIds: getCurrentUserIdsByOccupany(occupancy),
                        action: itemBooking ? ActionSubmit.ReSelect : (updateData.action || ActionSubmit.Create),
                    }
                };
                await ItineraryService.update(updateRequest);
                Helpers.removeSessionStorage(Constants.PAGE_LOCALSTORAGE_KEY.TRIP_DETAIL.RESELECT);
                return;
            }

            const result = await ItineraryService.createByBooking(requestData);

            router.push({
                pathname: PathName.TRIPS_DETAIL,
                query: {
                    id: result.id,
                },
            });
        } catch (error) {
            console.log({ error });
            Helpers.handleError(error);
        } finally {
            dispatch(hideLoading());
        }
    };

    return {
        handleReverse,
    };
};

export default useReverseHotel;
