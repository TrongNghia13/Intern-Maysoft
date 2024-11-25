import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type AlertColor = 'success' | 'info' | 'warning' | 'error';

type ISnackbar = {
    message?: string,
    type?: AlertColor,
    visible?: boolean,
}

export interface BaseState {
    loading?: boolean,
    dataSnackbar?: ISnackbar,
}

const initialState: BaseState = {
    loading: false,
    dataSnackbar: undefined
}

export const baseSlice = createSlice({
    name: "base",
    initialState,
    reducers: {
        showLoading: (state) => {
            state.loading = true;
        },
        hideLoading: (state) => {
            state.loading = false;
        },

        showSnackbar: (state, action: PayloadAction<{ msg: string | undefined, type: AlertColor }>) => {
            state.dataSnackbar = {
                visible: true,
                type: action.payload?.type,
                message: action.payload?.msg,
            };
        },

        hideSnackbar: (state) => {
            state.dataSnackbar = {
                type: undefined,
                visible: undefined,
                message: undefined,
            };
        },
    }
})

// Action creators are generated for each case reducer function
export const {
    showLoading, hideLoading,
    showSnackbar, hideSnackbar,
} = baseSlice.actions;

export default baseSlice.reducer;