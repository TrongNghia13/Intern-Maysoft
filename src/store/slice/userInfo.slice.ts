import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUserProfile } from "@maysoft/common-component-react";

import Helpers from "@src/commons/helpers";
import { ICodename, IRecordMenuDetail } from "@src/commons/interfaces";

export interface IResourcePermission {
    resourceURI: string;
    permission: number;
}

export type UserProfile = IUserProfile & { location: string };

export interface UserInfoState {
    fetching?: boolean;
    firstLogin?: boolean;
    userProfile: UserProfile;
    listOrganization: ICodename[];
    listGroup: ICodename[];
    resourceMenu: string[];
    resourceCodes: IResourcePermission[];
    loading?: boolean;
    menuDetails?: IRecordMenuDetail[];
}

const initialState: UserInfoState = {
    fetching: false,
    firstLogin: false,
    userProfile: {} as UserProfile,
    listGroup: [],
    listOrganization: [],
    resourceMenu: [],
    resourceCodes: [],
    menuDetails: [],
    loading: false,
};

export const userInfoSlice = createSlice({
    name: "userInfo",
    initialState,
    reducers: {
        fetchUserInfo: (state) => {
            state.fetching = true;
        },

        fetchUserInfoSuccess: (state, action: PayloadAction<UserInfoState | undefined>) => {
            state.fetching = false;
            if (!Helpers.isNullOrEmpty(action.payload)) {
                state.firstLogin = action.payload.firstLogin
                state.userProfile = action.payload.userProfile;
                state.listGroup = action.payload.listGroup;
                state.listOrganization = action.payload.listOrganization;
                state.resourceMenu = action.payload.resourceMenu;
                state.resourceCodes = action.payload.resourceCodes;
                state.menuDetails = action.payload.menuDetails;
            }
        },

        fetchUserInfoFailed: (state) => {
            state.fetching = false;
        },

        storePhoneNumber: (state, action: PayloadAction<string>) => {
            state.userProfile.phoneNumber = action.payload;
        },
        storeEmail: (state, action: PayloadAction<string>) => {
            state.userProfile.email = action.payload;
        },
        updateUserProfile: (state, action: PayloadAction<any>) => {
            state.userProfile.fullName = action.payload.fullName;
            state.userProfile.birthDate = action.payload.birthDate;
            state.userProfile.gender = action.payload.gender;
        },
        updateAvatar: (state, action: PayloadAction<any>) => {
            state.userProfile.avatarId = action.payload.avatarId;
            state.userProfile.avatarUrl = action.payload.avatarUrl;
        },
        updateOrganization: (state, action: PayloadAction<any>) => {
            state.userProfile.organizationId = action.payload;
        },
        storeOrganizationID: (state, action: PayloadAction<string>) => {
            state.userProfile.organizationId = action.payload;
        },
        storeListOrganization: (state, action: PayloadAction<ICodename[]>) => {
            state.listOrganization = action.payload;
        },
        storeResourceMenu: (state, action: PayloadAction<string[]>) => {
            state.resourceMenu = action.payload;
        },
        storeResourcePermission: (state, action: PayloadAction<IResourcePermission[]>) => {
            state.resourceCodes = action.payload;
        },
        storeDataUserProfile: (state, action: PayloadAction<UserProfile>) => {
            state.userProfile = action.payload;
        },
        resetUserInfo: () => initialState,
        onLoadEnd: (state) => {
            state.loading = false;
        },

        storeFirstLogin: (state, action: PayloadAction<boolean>) => {
            state.firstLogin = action.payload;
        },
    },
});

// Action creators are generated for each case reducer function
export const {
    fetchUserInfo,
    fetchUserInfoSuccess,
    fetchUserInfoFailed,
    storePhoneNumber,
    storeEmail,
    updateUserProfile,
    updateAvatar,
    updateOrganization,
    resetUserInfo,
    storeListOrganization,
    storeResourceMenu,
    storeResourcePermission,
    storeOrganizationID,
    storeDataUserProfile,
    onLoadEnd,

    storeFirstLogin,
} = userInfoSlice.actions;

export default userInfoSlice.reducer;
