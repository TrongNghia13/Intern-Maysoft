import Constants from "@src/constants";
import IdentityClient from "./IdentityClient";

export interface IRequestUpdateOrganizationProfile {
    id: string;
    userId: string;
    organizationId: string;
    userType: number;
    firstName: string;
    lastName: string;
    dateOfBirth: number;
    gender: number;
    employmentDate: number;
    idCardNo: string;
    idCardIssuedDate: number;
    idCardIssuedPlace: string;
    socialInsuranceCode: string;
    extraInformation?: {
        description: string
    };
    email: string;
    phoneNumber: string;
    passportNo: string;
    passportExpiredDate: number;
    passportIssuedPlace: string;
    nationality: string;
}

const ProfileService = {
    getUserInfo: async () => {
        const result = await IdentityClient().get("/Profile/UserInfo");
        return result.data.result;
    },

    getUserAuthorization: async (organizationId?: string) => {
        const result = await IdentityClient().get("/Profile/UserAuthorization", {
            params: {
                serviceCode: Constants.SERVICE_CODE,
                organizationId,
            },
        });
        return result.data.result;
    },

    changeAvatar: async (avatarId: string) => {
        const result = await IdentityClient().post("/Profile/ChangeAvatar", {
            data: {
                avatarId,
            },
        });
        return result.data.result;
    },

    updateUserProfile: async (data?: { email: string; fullName: string; phoneNumber: string }) => {
        const result = await IdentityClient().post("/Profile/UpdateUserProfile", {
            data: {
                ...data,
                username: data?.email,
            },
        });
        return result.data.result;
    },

    updateOrganizationProfile: async (data: IRequestUpdateOrganizationProfile[]) => {
        const result = await IdentityClient().post("/Profile/UpdateOrganizationProfile", data);
        return result.data.result;
    },

    changePassword: async (data?: { oldPassword: string; newPassword: string; confirmPassword: string }) => {
        const result = await IdentityClient().post("/Profile/ChangePassword", {
            data,
        });
        return result.data.result;
    },
};

export default ProfileService;
