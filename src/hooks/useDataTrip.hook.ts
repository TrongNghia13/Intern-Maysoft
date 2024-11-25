import { RootState } from "@src/store";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Constants from "@src/constants";
import Helpers from "@src/commons/helpers";
import { listDefaultUserProfile, listTripDefault } from "@src/assets/data";
import { setDataRowBookings, setDataRowTrips } from "@src/store/slice/dataTripBooking.slice";
import { hideLoading, showLoading } from "@src/store/slice/common.slice";

// interface
export interface IRecordBooking {
    idTrip: string;
    id?: string;
    name?: string;
    addressName?: string;
    startTime?: number | string;
    endTime?: number | string;
    distance?: string;
    price?: string;
    discount?: string;
    amount?: string;
    score?: string;
    reviewers?: string;
    freeCancelation?: boolean;
    star?: number;
    description?: string;
    listRooms?: {
        id?: string;
        name?: string;
        note?: string;
        listPrice?: {
            id?: string;
            price?: string;
            quantity?: number;
            tax?: number;
            breakfast?: boolean;
            freeCancelation?: boolean;
        };
    };
}

export interface IDataTrip {
    id?: string;
    name?: string;
    location?: string;
    userIds?: string[];
    description?: string;
    endTime?: number | string;
    startTime?: number | string;
}

export type IErrorTrip = { [key in keyof IDataTrip]?: string };

//

const useDataTrip = (id?: string) => {
    const dispatch = useDispatch();

    const dataTripBooking = useSelector((state: RootState) => state.tripbooking);

    useEffect(() => {
        if (Helpers.isNullOrEmpty(dataTripBooking?.dataRowTrips)) {
            const value = localStorage.getItem(Constants.StorageKeys.DATA_TRIPS);
            if (!Helpers.isNullOrEmpty(value) && value !== "undefined" && value !== "null" && value !== null) {
                dispatch(setDataRowTrips(JSON.parse(value)));
            }
        }
        if (Helpers.isNullOrEmpty(dataTripBooking?.dataRowBookings)) {
            const value = localStorage.getItem(Constants.StorageKeys.DATA_BOOKINGS);
            if (!Helpers.isNullOrEmpty(value) && value !== "undefined" && value !== "null" && value !== null) {
                dispatch(setDataRowBookings(JSON.parse(value)));
            }
        }
    }, [dataTripBooking?.dataRowTrips, dataTripBooking?.dataRowBookings]);

    const [listUserProfile, setListUserProfile] = useState<any[]>([]);
    const [dataTrip, setDataTrip] = useState<IDataTrip>({} as IDataTrip);
    const [errorTrip, setErrorTrip] = useState<IErrorTrip>({} as IErrorTrip);

    const dataRowTrips = useMemo(() => {
        if ([...(dataTripBooking?.dataRowTrips || [])].length === 0) {
            return [...listTripDefault];
        } else {
            return dataTripBooking?.dataRowTrips || [];
        }
    }, [dataTripBooking?.dataRowTrips, listTripDefault]);

    const dataRowBookings = useMemo(() => {
        const newData = [...(dataTripBooking?.dataRowBookings || [])].filter((el) => el.idTrip === dataTrip?.id);
        return newData;
    }, [dataTripBooking?.dataRowBookings, dataTrip.id]);

    const handleOnChangeDataTrip = (key: string, newValue: any) => {
        if (key === "userProfile") {
            setListUserProfile(newValue);
        } else {
            setDataTrip((prev) => ({
                ...prev,
                [key]: newValue,
            }));

            setErrorTrip((prev) => ({
                ...prev,
                [key]: undefined,
            }));
        }
    };

    useEffect(() => {
        if (id) {
            getDetail(id);
        }
    }, [id, dataRowTrips, listDefaultUserProfile]);

    const getDetail = (id: string) => {
        dispatch(showLoading());

        const itemFind = dataRowTrips.find((el) => el.id === id);
        const listUserTemp = listDefaultUserProfile.filter((el) => itemFind?.userIds?.includes(el.id));
        setErrorTrip({});
        setListUserProfile(listUserTemp);
        itemFind && setDataTrip(itemFind);
        dispatch(hideLoading());
    };

    const handleSetDataRowTrips = (data: IDataTrip) => {
        dispatch(setDataRowTrips([data, ...dataRowTrips]));
    };

    const handleUpdateDataRowTrip = (id: string) => {
        let newData = [...(dataRowTrips || [])];
        const index = newData.findIndex((el) => el.id === id);
        if (index !== -1) {
            newData[index] = { ...dataTrip };
        }
        dispatch(setDataRowTrips(newData));
    };

    const handleSetDataRowBookings = (data: IRecordBooking) => {
        dispatch(setDataRowBookings([data, ...(dataTripBooking?.dataRowBookings || [])]));
    };

    const handleDeleteRowBooking = (id: string) => {
        const newData = [...(dataTripBooking?.dataRowBookings || [] || [])].filter((el) => el.id !== id);
        dispatch(setDataRowBookings(newData));
    };

    const checkValidateDataTrip = () => {
        let isCheck = true;
        if (Helpers.isNullOrEmpty(dataTrip.name)) {
            setErrorTrip((prev) => ({
                ...prev,
                name: "Trường này bắt buột có giá trị",
            }));
            isCheck = false;
        }

        return isCheck;
    };

    return {
        dataTrip,
        setDataTrip,
        errorTrip,
        setErrorTrip,
        listUserProfile,
        setListUserProfile,
        dataRowTrips,
        handleSetDataRowTrips,
        handleUpdateDataRowTrip,
        dataRowBookings,
        handleSetDataRowBookings,
        handleDeleteRowBooking,

        getDetail,
        checkValidateDataTrip,
        handleOnChangeDataTrip,
    };
};

export default useDataTrip;
