import rootSaga from "./saga/root.saga";
import createSagaMiddleware from "redux-saga";
import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slice/auth.slice";
import commonReducer from "./slice/common.slice";
import userInfoReducer from "./slice/userInfo.slice";
import tripbookingReducer from "./slice/dataTripBooking.slice";
import tripReducer from "./slice/trips.slice";

// DeepTech
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
// --- End DeepTech

const sagaMiddleware = createSagaMiddleware();

const defaultMiddlewareOptions = {
    serializableCheck: {
        ignoredActions: [
        FLUSH,
        REHYDRATE,
        PAUSE,
        PERSIST,
        PURGE,
        REGISTER,
        'booking/updateContactPassenger',
        'booking/saveMapSeatData',
        'search-flight/syncDataSelectedFlight',
        ],
        ignoredPaths: ['booking.mapSeatData', 'selectFlight.flightList'],
    },
};

export const store = configureStore({
    reducer: {
        authRoot: authReducer,
        base: commonReducer,
        userInfo: userInfoReducer,
        tripbooking: tripbookingReducer,
        trip: tripReducer,
    },
    devTools: true,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(defaultMiddlewareOptions).concat(sagaMiddleware), // DeepTech
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
