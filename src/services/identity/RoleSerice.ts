import IdentityClient from "./IdentityClient";

const RoleService = {
    async getAll(data: string) {
        const result = await IdentityClient().get(`/Role/GetAll?${data}`);
        return result.data.result;
    },
};

export default RoleService;
