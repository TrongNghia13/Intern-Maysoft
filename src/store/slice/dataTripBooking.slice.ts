import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import Constants from "@src/constants";
import { IDataTrip, IRecordBooking } from "@src/hooks/useDataTrip.hook";

export interface TripBookingState {
    dataRowTrips?: IDataTrip[],
    dataRowBookings?: IRecordBooking[],
}

const initialState: TripBookingState = {
    dataRowTrips: [],
    dataRowBookings: [],
}

export const tripBookingSlice = createSlice({
    name: "tripBooking",
    initialState,
    reducers: {
        setDataRowTrips: (state, action: PayloadAction<IDataTrip[]>) => {
            state.dataRowTrips = action.payload;
            localStorage.setItem(Constants.StorageKeys.DATA_TRIPS, JSON.stringify(action.payload));
        },

        setDataRowBookings: (state, action: PayloadAction<IRecordBooking[]>) => {
            state.dataRowBookings = action.payload;
            localStorage.setItem(Constants.StorageKeys.DATA_BOOKINGS, JSON.stringify(action.payload));
        },
    }
})

// Action creators are generated for each case reducer function
export const {
    setDataRowTrips,
    setDataRowBookings,
} = tripBookingSlice.actions;

export default tripBookingSlice.reducer;