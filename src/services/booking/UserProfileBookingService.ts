import BookingClient from "./BookingClient";

export interface IDataModalCreateUser {
    groupIds?: string[]
    roleCodes?: string[]
    organizationId?: string

    email?: string
    gender?: number
    lastName?: string
    firstName?: string
    phoneNumber?: string
    birthDate?: number | string
    flowId?: string
    policyId?: string
    budgetId?: string
    passportNumber?: string
    passportExpDate?: string
    passportIssuingCountry?: string

    note?: string
}

export interface IDataInvite {
    organizationId?: string,
    roles?: string[],
    emails?: string[],
    groupIds?: string[],
    note?: string,
    flowId?: string,
    policyId?: string,
    budgetId?: string,
    extraInformation?: string
}

export interface IDataCreate {
    organizationId?: string
    email?: string
    gender?: number
    fullName?: string
    avatarId?: string
    avatarUrl?: string
    phoneNumber?: string
    birthDate?: string | number
    note?: string
    flowId?: string
    policyId?: string
    budgetId?: string
    extraInformation?: string

    isActive?: boolean
    roleCodes?: string[]
    userGroups?: {
        id?: string
        groupId?: string
        userTitle?: string
        manager?: number
        default?: number
        action?: number
    }[]
    organizationUserProfile?: {
        id?: string
        gender?: number
        userType?: number
        lastName?: string
        firstName?: string
        dateOfBirth?: string | number
        employmentDate?: string | number
        terminationtDate?: string | number
        idCardNo?: string
        idCardIssuedPlace?: string
        idCardIssuedDate?: string | number
        socialInsuranceCode?: string
        passportNo?: string
        nationality?: string
        passportIssuedPlace?: string
        passportExpiredDate?: string | number
    };
}

export interface IDataUpdate {
    id?: string
    flowId?: string
    policyId?: string
    budgetId?: string
    extraInformation?: string
    updateTime?: string | number
    name?: string,
    userId?: string
    organizationId?: string
}

export interface IRecordDetail {
    passportExpiredDate: string;
    nationality: string;
    passportIssuedPlace: string;
    passportNo: string;
    dateOfBirth: string;
    firstName: string;
    firstname: any;
    lastname: any;
    userType: any;
    gender: number | undefined;
    id: string
    status: number
    updateTime: string
    tenantCode: string
    serviceCode: string
    organizationId: string

    email: string
    userId: string
    phoneNumber: string
    flowId: string
    policyId: string
    budgetId: string
    name:string
    fullName: string
    extraInformation: any
}

const UserProfileBookingService = {
    getDetail: async (userId: string): Promise<IRecordDetail> => {
        const result = await BookingClient().get("/User/Detail" + `/${userId}`);
        return result.data.result;
    },

    invite: async (data: IDataInvite): Promise<any> => {
        const result = await BookingClient().post("/Invitation/Create", data);
        return result.data.result;
    },

    create: async (data: IDataCreate): Promise<any> => {
        const result = await BookingClient().post("/User/Create", data);
        return result.data.result;
    },

    update: async (data: IDataUpdate): Promise<any> => {
        const result = await BookingClient().post("/User/Update", data);
        return result.data.result;
    },

    getByCondition: async (data: {
        organizationId?: string;
        serviceCode?: string;
        email?: string;
        userId?: string;
    }): Promise<any> => {
        const result = await BookingClient().get("/User/GetByCondition", { params: data });
        return result.data.result;
    },
};

export default UserProfileBookingService;