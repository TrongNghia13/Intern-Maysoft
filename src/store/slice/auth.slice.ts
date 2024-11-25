import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ISessionUser } from "@src/commons/interfaces";

export interface AuthState {
    authInfo?: ISessionUser | null
}

const initialState: AuthState = {
    authInfo: undefined
}

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuthInfo: (state, action: PayloadAction<ISessionUser | null>) => {
            state.authInfo = action.payload;
        },

        resetAuth: () => initialState
    }
})

// Action creators are generated for each case reducer function
export const { 
    setAuthInfo,
    resetAuth
} = authSlice.actions;

export default authSlice.reducer;