import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";

import Constants from "@src/constants";
import Helpers from "@src/commons/helpers";
import PathName from "@src/constants/PathName";
import OrderService from "@src/services/sale/OrderService";
import useCheckIssueTicket from "./helpersCheckIssueTicket";
import UserService from "@src/services/identity/UserService";
import ItineraryService from "@src/services/booking/ItineraryService";
import useNavigateOnChangingOrganization from "../useNavigateOnChangingOrganization";

import { object, string } from "yup";
import { RootState } from "@src/store";
import { useRouter } from "next/router";
import { IErrorTrip } from "../../hooks/useDataTrip.hook";
import { BookingHelpers } from "@src/commons/bookingHelpers";
import { hideLoading, showLoading } from "@src/store/slice/common.slice";
import {
    IFlightExtraInformation,
    IHotelExtraInformation,
    ItineraryMemberProfile,
    IItineraryDetail,
    IItinerary,
    IOrder,
    IUser,
} from "@src/commons/interfaces";
import { TripTabs } from "@src/commons/enum";



export type IItineraryError = { [k in keyof IItinerary]?: string };

const useTrips = ({ id }: { id: string }) => {
    const { t } = useTranslation(["common", "tripbooking"]);

    const route = useRouter();
    const dispatch = useDispatch();

    const userInfo = useSelector((state: RootState) => state.userInfo);

    const [data, setData] = useState<IItinerary>({} as IItinerary);
    const [orderData, setOrderData] = useState<IOrder[]>([]);
    const [error, setError] = useState<IItineraryError>({} as IItineraryError);
    const [loading, setLoading] = useState<boolean>(false);
    const [users, setUsers] = useState<IUser[]>([]);
    const [selectedSequence, setSelectedSequence] = useState<number[]>([]);

    useNavigateOnChangingOrganization({ to: PathName.TRIPS });

    const { handleCheckIssueTicketByItineraryDetails } = useCheckIssueTicket();

    useEffect(() => {
        if (id) {
            getDetail(id);
        }
    }, [id]);

    useEffect(() => {
        if (
            !Helpers.isNullOrEmpty(data.id) &&
            [...data.itineraryDetails || []].length > 0
        ) {
            handleCheckIssueTicketByItineraryDetails({
                itineraryId: data.id,
                confirmStatus: data.confirmStatus,
                itineraryDetails: [...data.itineraryDetails || []],
                onCallBack: async () => {
                    await getDetail(data.id);
                },
            });
        };
    }, [data.id, data.itineraryDetails, data.confirmStatus]);

    const onUpdateMemberDetail = async (data: IUser[], itemBooking: IItineraryDetail) => {
        try {
            dispatch(showLoading());
            const result = await ItineraryService.updateMemberDetail({
                itineraryId: itemBooking.itineraryId,
                itineraryDetailId: itemBooking.id,
                userIds: data.map((el) => el.id),
            });
            // @ts-ignore
            setData((prev) => {
                const newItineraryDetails = (prev.itineraryDetails || []).map((el) => {
                    if (el.sequence === itemBooking.sequence)
                        return {
                            ...el,
                            itineraryMembers: result.map((user) => ({
                                id: "",
                                itineraryId: itemBooking.itineraryId,
                                detailId: itemBooking.id,
                                userId: user,

                                userProfile: {
                                    // fullName: user.,
                                    // email: string;
                                    // avatarId?: string;
                                    // avatarUrl?: string;
                                    // identityId: string;
                                    // phoneNumber?: string;
                                    // location: string;
                                } as ItineraryMemberProfile,
                                updateTime: "1",
                            })),
                        };
                    return el;
                });
                return {
                    ...prev,
                    itineraryDetails: newItineraryDetails,
                };
                // const index = newItineraryDetails.findIndex((el) => el.id === itemBooking.id);
                // if(index !== -1) {
                //     newItineraryDetails[index].itineraryMembers = data.map((user) => ({
                //         id: "",
                //         itineraryId: itemBooking.itineraryId,
                //         detailId: itemBooking.id,
                //         userId: user.id,
                //         userProfile: {} as ItineraryMemberProfile;
                //         updateTime: "1"
                //     }))
                // }
            });
            // setUserIds(result);
            // setAddMembersVisibled(false);
        } catch (error) {
        } finally {
            dispatch(hideLoading());
        }
    };

    const getUsers = async (selectedIds: string[]) => {
        try {
            if (Helpers.isNullOrEmpty(userInfo?.userProfile?.id)) return [];
            const pageSize = Constants.ROW_PER_PAGE;

            const newQuery: any = {
                pageSize: pageSize,
                pageNumber: 1,

                selectedIds: selectedIds,
                searchText: undefined,
                listStatus: [1],

                clientId: Constants.CLIENT_ID,
                organizationId: userInfo?.userProfile?.organizationId || 0,
            };

            const result = await UserService.getPaged(newQuery);

            if (result && result.selectedItems) {
                return result.selectedItems;
            }
        } catch (error) {
            console.log({ error });
            // Helpers.handleException(error);
        }
        return [];
    };

    const onChangeUser = (user: IUser) => {
        setUsers((prev) => {
            const temp = [...prev];
            const index = temp.findIndex((el) => el.id === user.id);
            if (index !== -1) temp[index] = user;
            return temp;
        });
    };

    const getOrders = async (ids: string[]) => {
        try {
            if (ids.length === 0) setOrderData([]);
            const result = await OrderService.getByIds({ ids });
            return result;
        } catch (error) {
            console.log({ error });
            // Helpers.handleException(error);
        }
        return [];
    };

    const getDetail = async (id: string) => {
        try {
            const result = await ItineraryService.detail(id);

            const details = result.itineraryDetails || []
            const orderIds = details.map((el) => el.orderId as string).filter((el) => !Helpers.isNullOrEmpty(el));

            const { users, orders } = await Promise.allSettled([
                getUsers((result?.itineraryMembers || []).map((el) => el.userId)),
                orderIds.length >= 1 ? getOrders(orderIds) : Promise.resolve([]),
            ]).then(([users, orders]) => {
                const usersValue = users.status === "fulfilled" ? users.value : [];
                const ordersValue = orders.status === "fulfilled" ? orders.value : [];
                return { users: usersValue, orders: ordersValue };
            });

            const newSelectedSequences = Array.from(new Set(details.filter((d) => BookingHelpers.isItineraryDetailSelectable(d)).map(d => d.sequence)));
            setSelectedSequence(newSelectedSequences);
            setData(result);
            setUsers(users);
            setOrderData(orders);

        } catch (e) {
            Helpers.handleError(e);
            route.push(PathName.TRIPS);
        } finally {
            setLoading(false);
        }
    };

    const onChangeUsers = (data: IUser[]) => {
        setUsers(data);
    };

    const onRemoveUser = (data: IUser) => {
        setUsers((prev) => prev.filter((el) => el.id !== data.id));
    };

    const requestSchema = object({
        name: string().required(),
    });

    const onSubmit = async () => {
        try {
            dispatch(showLoading());
            await requestSchema.validate(data, { abortEarly: false });
            // if (Helpers.isNullOrEmpty(id)) {
            //     dispatch(
            //         onAddNewTrip({
            //             ...data,
            //             usersIds: users.map((el) => el.id),
            //         })
            //     );
            //     router.push({ pathname: PathName.TRIPS_DETAIL, query: { id: id } });
            // } else {
            //     dispatch(
            //         onUpdateTrip({
            //             ...data,
            //             usersIds: users.map((el) => el.id),
            //         })
            //     );
            //     router.replace({ pathname: PathName.TRIPS_DETAIL, query: { id: id } });
            // }
        } catch (error: any) {
            if (error.name === "ValidationError") {
                const newError: IErrorTrip = Helpers.handleValidationError(error);
                setError(newError);
                Helpers.showAlert(t("common:message.message_required_field"), "error");
            } else {
                Helpers.handleError(error);
            }
        } finally {
            dispatch(hideLoading());
        }
    };

    const onChangeValue = (value: string, key: keyof IItinerary) => {
        if (!Helpers.isNullOrEmpty(error[key])) setError((prev) => ({ ...prev, [key]: "" }));
        setData((prev) => ({ ...prev, [key]: value }));
    };

    const onRefreshData = (data: IItinerary, users: IUser[]) => {
        setData(data);
        setUsers(users);
    };

    const onDeleteItineraryDetail = async (tripDetail: IItineraryDetail) => {
        Helpers.showConfirmAlert(t("tripbooking:conform_delete"), async () => {
            try {
                dispatch(showLoading());
                await ItineraryService.deleteItineraryDetail([tripDetail.id]);
                await getDetail(id);
                // setData((prev) => {
                //     const newItineraryDetails: IItineraryDetail[] = [...prev.itineraryDetails].filter((el) => el.sequence !== tripDetail.sequence);
                //     console.log({
                //         newItineraryDetails
                //     })
                //     return {
                //         ...prev,
                //         itineraryDetails: newItineraryDetails,
                //     };
                // });

                // if (tripDetail.type === TripType.Flight) {
                //     dispatch(
                //         onRemoveTripDetailBySearchKey({
                //             id: id,
                //             searchKey: tripDetail?.detailFlight?.searchKey || "",
                //         })
                //     );
                // } else {
                //     dispatch(
                //         onRemoveTripDetail({
                //             id: id,
                //             tripDetailId: tripDetail?.id,
                //         })
                //     );
                // }
            } catch (error) {
                Helpers.handleError(error);
            } finally {
                dispatch(hideLoading());
            }
        });
    };

    const onSelectItineraryDetail = (item: IItineraryDetail) => {
        setSelectedSequence((prev) => {
            const sequence = item.sequence;
            const index = prev.findIndex((el) => el === sequence);
            if (index === -1) return [...prev, sequence];
            return prev.filter((el) => el !== sequence);
        });
    };

    return {
        data,
        orderData,
        error,
        loading,
        users,
        selectedSequence,
        onChangeUsers,
        onRemoveUser,
        onChangeValue,
        onSubmit,
        onRefreshData,
        getDetail,
        onDeleteItineraryDetail,
        onUpdateMemberDetail,
        onSelectItineraryDetail,
        onChangeUser,
    };
};

const getNumberOfUser = (data: IHotelExtraInformation | IFlightExtraInformation | undefined) => {
    if (data !== undefined && "propertyId" in data) {
        return (data.occupancy || 0).reduce((acc, cur) => (acc = acc + cur?.adultSlot), 0);
    }
    if (data !== undefined && "flightId" in data) {
        const occupancy = data.occupancy[0];
        if (Helpers.isNullOrEmpty(occupancy)) return 0;
        return occupancy.adultSlot + occupancy.childrenOld.length;
    }
    return 0;
};

export default useTrips;
