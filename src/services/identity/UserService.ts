import Helpers from "@src/commons/helpers";
import IdentityClient from "./IdentityClient";
import { IPagedList, IUser } from "@src/commons/interfaces";

interface IUserGetPagedRequest {
    organizationId?: string;
    fullName?: string;
    roleCode?: string;
    searchText?: string;
    pageNumber?: number;
    pageSize?: number;
    orderBy?: string;
    groupId?: string;
    selectedIds?: string[];
    listStatus?: number[];
    clientId?: string;
    roleIncludes?: number[],
    roleNotIncludes?: number[],
}

const UserService = {
    async getUserByEmail(email: string) {
        const result = await IdentityClient().get(`/User/GetByEmail`, {
            params: {
                email,
            },
        });
        return result.data.result;
    },

    async getUserByIds(ids: string[]) {
        if (Object.keys(ids).length === 0) {
            return [];
        }
        ids = ids.filter((id) => !Helpers.isNullOrEmpty(id));
        const result = await IdentityClient().post(`/IdentityService/GetUserInfoByUserIds`, {
            userIdList: ids,
        });
        return result.data.result;
    },

    async getPaged(params: IUserGetPagedRequest): Promise<IPagedList<IUser>> {
        const query = Helpers.handleFormatParams(params);
        const result = await IdentityClient().get(`/User/GetPaged` + `?${query}`);
        return result.data.result;
    },

    // Get tất cả user của tổ chức hông phân quyền hạn
    async getPagedUserByOrganization(params: {
        organizationId: string;
        orderBy?: string;
        pageSize?: number;
        pageNumber?: number;
        searchText?: string;
        selectedUserIds?: string[];
    }): Promise<IPagedList<IUser>> {
        const query = Helpers.handleFormatParams(params);

        const result = await IdentityClient().get(`/Organization/GetUserPaged` + `?${query}`);

        return result.data.result;
    },

    async getUserDetail(id: string, organizationId: string) {
        const result = await IdentityClient().get(`/User/Detail/${id}/${organizationId}`);
        return result.data.result;
    },

};

export default UserService;
