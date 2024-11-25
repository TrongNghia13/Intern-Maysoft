import IdentityClient from "./IdentityClient";

export interface IUserRoleData {
    clientId: string;
    organizationId: string;
    userId: string;
    roleCodes: string[];
}

const UserRoleService = {
    async updateUserRole(userRoleData: IUserRoleData) {
        console.log("Sending data:", userRoleData);
        try {
            const result = await IdentityClient().post('/UserRoleService/Update', userRoleData);
            console.log("Response data:", result.data);
            return result.data;
        } catch (error) {
            console.error('Error updating user role:', error);
            throw error;
        }
    },
    

    async getAll(data: string) {
        const result = await IdentityClient().get(`/Role/GetAll?${data}`);
        return result.data.result;
    },
};

export default UserRoleService;
