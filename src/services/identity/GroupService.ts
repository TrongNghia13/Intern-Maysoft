import IdentityClient from "./IdentityClient";

export interface IGroupUserData{
    clientId: string;
    organizationId: string;
    userId: string;
    groupId : string;
    manager: number;
    default: number;
}


const GroupService = {
    async getAll(data: string) {
        const result = await IdentityClient().get(`/Group/GetAll?${data}`);
        return result.data.result;
    },
}

export default GroupService;