import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ItineraryType, Status } from "@src/commons/enum";
import { IDetailHotel, IFlightDetail, IRequestCreateBooking } from "@src/commons/interfaces";
import Constants from "@src/constants";

export enum BookingStatus {
    Cancel = -1,
    Pending,
    Completed,
}

export type ITrip = {
    id: string;
    status: Status;
    name: string;
    description: string;
    usersIds: string[];
    tripsDetail: ITripDetail[];
};

export type ITripDetail = {
    id: string;
    type: ItineraryType;
    startTime: number;
    endTime: number;
    quantity: number;
    requestBooking: IRequestCreateBooking;
    status: BookingStatus;
    detail: IDetailHotel;
    detailFlight?: IFlightDetail;
    shoppingCardId: string;
};

export interface TripsState {
    data: ITrip[];
}

const initialState: TripsState = {
    data: [],
};

export const tripsSlice = createSlice({
    name: "trips",
    initialState,
    reducers: {
        onStoreTrip: (state, action: PayloadAction<ITrip[]>) => {
            state.data = action.payload;
            localStorage.setItem(Constants.StorageKeys.TRIPS, JSON.stringify(action.payload));
        },
        onAddNewTrip: (state, action: PayloadAction<ITrip>) => {
            const newData = [...state.data, action.payload];
            state.data = newData;
            localStorage.setItem(Constants.StorageKeys.TRIPS, JSON.stringify(newData));
        },
        onApproveTrip: (state, action: PayloadAction<string>) => {
            const index = state.data.findIndex((el) => el.id === action.payload);
            if (index !== -1) {
                state.data[index].status = Status.Active;
                localStorage.setItem(Constants.StorageKeys.TRIPS, JSON.stringify([...state.data]));
            }
        },
        onRejectTrip: (state, action: PayloadAction<string>) => {
            const index = state.data.findIndex((el) => el.id === action.payload);
            if (index !== -1) {
                state.data[index].status = Status.Reject;
                localStorage.setItem(Constants.StorageKeys.TRIPS, JSON.stringify([...state.data]));
            }
        },
        onUpdateTrip: (state, action: PayloadAction<ITrip>) => {
            const index = state.data.findIndex((el) => el.id === action.payload.id);
            if (index !== -1) {
                state.data[index] = action.payload;
                localStorage.setItem(Constants.StorageKeys.TRIPS, JSON.stringify([...state.data]));
            }
        },
        onRemoveTrip: (state, action: PayloadAction<string>) => {
            state.data = [...state.data.filter((el) => el.id !== action.payload)];
            localStorage.setItem(Constants.StorageKeys.TRIPS, JSON.stringify([...state.data]));
        },
        onPaymentTripDetail: (state, action: PayloadAction<{ id: string; tripDetailId: string }>) => {
            const index = state.data.findIndex((el) => el.id === action.payload.id);
            if (index !== -1) {
                const subIndex = state.data[index].tripsDetail.findIndex((el) => el.id === action.payload.tripDetailId);
                if (subIndex !== -1) {
                    state.data[index].tripsDetail[subIndex].status = BookingStatus.Completed;
                    localStorage.setItem(Constants.StorageKeys.TRIPS, JSON.stringify([...state.data]));
                }
            }
        },
        onPaymentTripDetailBySearchKey: (state, action: PayloadAction<{ id: string; searchKey: string }>) => {
            const index = state.data.findIndex((el) => el.id === action.payload.id);
            if (index !== -1) {
                const tripDetails = [...state.data[index].tripsDetail].map((el) => {
                    if (el.detailFlight?.searchKey === action.payload.searchKey)
                        return {
                            ...el,
                            status: BookingStatus.Completed,
                        };
                    return el;
                });

                state.data[index].tripsDetail = [...tripDetails];
                localStorage.setItem(Constants.StorageKeys.TRIPS, JSON.stringify([...state.data]));
            }
        },
        onRemoveTripDetail: (state, action: PayloadAction<{ id: string; tripDetailId: string }>) => {
            const index = state.data.findIndex((el) => el.id === action.payload.id);
            if (index !== -1) {
                state.data[index].tripsDetail = [...(state.data[index].tripsDetail || [])].filter((el) => el.id !== action.payload.tripDetailId);
                localStorage.setItem(Constants.StorageKeys.TRIPS, JSON.stringify([...state.data]));
            }
        },
        onRemoveTripDetailBySearchKey: (state, action: PayloadAction<{ id: string; searchKey: string }>) => {
            const index = state.data.findIndex((el) => el.id === action.payload.id);
            if (index !== -1) {
                state.data[index].tripsDetail = [...(state.data[index].tripsDetail || [])].filter((el) => {
                    if (el.type === ItineraryType.Flight) return el.detailFlight?.searchKey !== action.payload.searchKey;
                    return el;
                });
                localStorage.setItem(Constants.StorageKeys.TRIPS, JSON.stringify([...state.data]));
            }
        },
        onAddNewTripDetail: (
            state,
            action: PayloadAction<{
                id: string;
                detail: ITripDetail;
            }>
        ) => {
            const index = state.data.findIndex((el) => el.id === action.payload.id);
            if (index !== -1) {
                state.data[index].tripsDetail = [...state.data[index].tripsDetail, action.payload.detail];
                localStorage.setItem(Constants.StorageKeys.TRIPS, JSON.stringify([...state.data]));
            }
        },
        onAddNewMultipleTripDetail: (
            state,
            action: PayloadAction<{
                id: string;
                details: ITripDetail[];
            }>
        ) => {
            const index = state.data.findIndex((el) => el.id === action.payload.id);
            if (index !== -1) {
                state.data[index].tripsDetail = [...state.data[index].tripsDetail, ...action.payload.details];
                localStorage.setItem(Constants.StorageKeys.TRIPS, JSON.stringify([...state.data]));
            }
        },
    },
});

// Action creators are generated for each case reducer function
export const {
    onAddNewTrip,
    onUpdateTrip,
    onRemoveTrip,
    onRemoveTripDetail,
    onAddNewTripDetail,
    onAddNewMultipleTripDetail,
    onPaymentTripDetailBySearchKey,
    onRemoveTripDetailBySearchKey,
    onPaymentTripDetail,
    onStoreTrip,
    onRejectTrip,
    onApproveTrip,
} = tripsSlice.actions;

export default tripsSlice.reducer;
