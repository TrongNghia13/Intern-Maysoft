import Helpers from "../../commons/helpers";
import IdentityClient from "./IdentityClient";
import { IMultiLanguageContent, IPagedList } from "@src/commons/interfaces";

const OrganizationService = {

    async getDetail(data: { id: string; clientId?: string }): Promise<IOrganization> {
        const query = Helpers.handleFormatParams(data);

        const result = await IdentityClient().get(`/Organization/Detail?${query}`);

        return result.data.result;
    },

};

export default OrganizationService;

export interface IOrganization {
    id: string;
    isOwner: boolean;
    isAdmin: boolean;
    tenantCode: string;
    organizationCode: string;
    userNumber: number;
    groupNumber: number;
    type: number;
    gene: string;
    name: IMultiLanguageContent;
    email: string;
    taxNumber: string;
    faxNumber: string;
    phoneNumber: string;
    logoId: string;
    logoUrl: string;
    website: string;
    addressId: string;
    description: IMultiLanguageContent;
    organizationProfiles: IOrgProfile[];
    organizationUserProfiles: IOrgUserProfile[];

    status: number;
    searchText: string;
    createTime: string;
    createUser: string;
    updateTime: string;
    updateUser: string;

    currency: string; 
    location:string
};

export interface IOrgProfile {
    id: string;
    gene: string;
    location: any;
    addressId: string;
    organizationId: string;
    name: IMultiLanguageContent;
    description: IMultiLanguageContent;
    type: number;
    timeZone: any;
    email: string;
    website: string;
    faxNumber: string;
    taxNumber: string;
    phoneNumber: string;
    groupId: string;
    groupCode: string;
    groupStatus: number;
    parentGroup: string;
    parentGroupName: IMultiLanguageContent;
    userNumber: number;
    childNumber: number;

    status: number;
    createTime: string;
    createUser: string;
    updateTime: string;
    updateUser: string;
};

export interface IOrgUserProfile {
    id: string;
    userId: string;
    userType: number;
    userCode: string;
    isOwner: boolean;
    avatarId: string;
    avatarUrl: string;
    idCardNo: string;
    idCardIssuedDate: string;
    idCardIssuedPlace: string;
    lastName: string;
    firstName: string;
    email: string;
    gender: number;
    phoneNumber: string;
    dateOfBirth: string;
    employmentDate: string;
    terminationtDate: string;
    socialInsuranceCode: string;
    extraInformation: string;
    status: number;
    activeStatus?: number;
    organizationId: string;
    invitation?: any;
    groups?: {
        id: string;
        userId: string;
        userTitle: string;
        name: IMultiLanguageContent;
    }[];
    userRoles?: IUserRole[];
    createTime?: string;
    createUser?: string;
    updateTime?: string;
    updateUser?: string;
};

export interface IUserRole {
    id: string;
    userId: string;
    groupId: string;
    organizationId: string;
    title: string;
    roleCode: string;
    roleId: string;
    roleLevel: number;
    roleName: string;
    roleType: number;
    serviceCode: string;
    serviceName: string;
    tenantCode: string;
    tenantName: string;
    startTime: string;
    endTime: string;
    status: number;
    activeStatus: number;
    createTime: string;
    createUser: string;
    updateTime: string;
    updateUser: string;
};