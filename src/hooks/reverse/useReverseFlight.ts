import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

import Helpers from "@src/commons/helpers";
import { IBookingDetailRequest, IFlight, IInfoRoomGuest, IItineraryDetail, IUser } from "@src/commons/interfaces";

import { ActionSubmit, ItineraryType, SupplierCode } from "@src/commons/enum";
import Constants from "@src/constants";
import PathName from "@src/constants/PathName";
import { useAuth } from "@src/providers/authProvider";
import ItineraryService, { IRequestCreateItineraryAndBooking, IRequestUpdateItinerary } from "@src/services/booking/ItineraryService";
import { RootState } from "@src/store";
import { hideLoading, showLoading } from "@src/store/slice/common.slice";

const useReverseFlight = () => {
    const router = useRouter();
    const auth = useAuth();

    const dispatch = useDispatch();
    const userInfo = useSelector((state: RootState) => state.userInfo.userProfile);

    const handleReverseFlight = async (
        data: IFlight,
        users: IUser[],
        updateData?: {
            itineraryId: string;
            nameDefault: string;
            description: string;
            updateTime: string;
            userIds: string[];
            action?: ActionSubmit;
        }
    ) => {
        try {
            if (Helpers.isNullOrEmpty(userInfo?.identityId)) {
                localStorage.setItem(Constants.StorageKeys.FROM, window.location.href);
                await auth.signinRedirect();
                return;
            }
            dispatch(showLoading());

            const newData = Helpers.formatFlightData(data);

            const { firstName, lastName } = Helpers.getFirstAndLastname(userInfo?.fullName);

            const numberOfGuest = Helpers.getGuestsOfFlight(newData[0]);

            const infoRoomGuest: IInfoRoomGuest[] = [];
            for (const guest of new Array(numberOfGuest).fill(0)) {
                infoRoomGuest.push({
                    firstName: firstName,
                    lastName: lastName,
                });
            }

            const bookingDetailRequests: IBookingDetailRequest[] = [];
            const usersMap = new Map<string, IUser>();
            users.forEach((user) => {
                usersMap.set(user.id, user);
            });
            const newDistinctUserIds = Array.from(usersMap.keys());
            const members = newDistinctUserIds.map((userId) => {
                const user = usersMap.get(userId);
                return ({
                    userId: userId,
                    groupId: user?.groupDefaultId ?? undefined,
                })
            });

            for (const flight of newData) {
                const numberOfGuest = flight.passengerQuantity?.adt || 0 + flight.passengerQuantity?.chd || 0;

                const chdOld = Array.from({ length: flight.passengerQuantity?.chd || 0 }).fill(8);
                const inf = Array.from({ length: flight.passengerQuantity?.inf || 0 }).fill(1);

                bookingDetailRequests.push({
                    roomId: undefined,
                    bedGroupId: undefined,
                    itemId: undefined,
                    quantity: members.length,
                    occupancy: [
                        {
                            adultSlot: numberOfGuest,
                            childrenOld: [...chdOld, ...inf] as number[],
                        },
                    ],
                    bookingInfoRequest: infoRoomGuest,
                    type: ItineraryType.Flight,
                    bookingClass: flight.bookingClass,
                    bookingNo: flight.carrierOperator + flight.flightNumber,
                    extraInfo: JSON.stringify({
                        ...flight,
                        totalFareAmount: flight.totalFareAmount / newData.length,
                        totalFareBasic: flight.totalFareBasic / newData.length,
                        totalTaxAmount: flight.totalTaxAmount / newData.length,
                        amount: flight.totalFareAmount,
                    }),
                    // amount: flight.totalFareAmount,
                    // unitPrice: flight.totalFareBasic,
                });
            }

            const time = {
                startTime: newData[0].departDate,
                endTime: newData[newData.length - 1].arrivalDate,
            };

            const requestData: IRequestCreateItineraryAndBooking = {
                serviceCode: Constants.SERVICE_CODE,
                organizationId: userInfo?.organizationId,
                firstName: firstName,
                lastName: lastName,
                phoneNumber: userInfo?.phoneNumber,
                countryPhoneNumber: undefined,
                propertyId: undefined,
                email: userInfo?.email,
                startTime: time.startTime,
                endTime: time.endTime,
                location: userInfo?.location,
                currency: newData[0]?.currency,
                bookingDetailRequests,
                supplierCode: SupplierCode.Deeptech,
                nameDefault: Helpers.getFlightName(newData[0]),
                members,
            };

            if (updateData && !Helpers.isNullOrEmpty(updateData.itineraryId)) {
                const itemBooking = Helpers.getSessionStorage(Constants.PAGE_LOCALSTORAGE_KEY.TRIP_DETAIL.RESELECT) as IItineraryDetail;
                const updateRequest: IRequestUpdateItinerary = {
                    id: updateData.itineraryId || "",
                    serviceCode: Constants.SERVICE_CODE,
                    organizationId: userInfo?.organizationId,
                    description: updateData.description || "",
                    // itineraryDetailId: undefined,
                    nameDefault: updateData.nameDefault || "",
                    updateTime: updateData.updateTime || "",
                    userIds: Array.from(new Set(newDistinctUserIds.concat(updateData.userIds) || [])),
                    detailAddBooking: {
                        itineraryDetailId: itemBooking?.id,
                        bookingRequest: requestData,
                        members,
                        action: itemBooking ? ActionSubmit.ReSelect : updateData?.action || ActionSubmit.Create,
                    },
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
        handleReverseFlight,
    };
};

export default useReverseFlight;
