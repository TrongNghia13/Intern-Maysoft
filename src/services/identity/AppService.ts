import IdentityClient from "./IdentityClient";
import { IAppSetting } from "@src/commons/interfaces";

const AppService = {
    async getDetail(id: string): Promise<IAppSetting> {
        const result = await IdentityClient().get("/App/Detail/" + id, {
            params: {
                id
            },
        });
        return result.data.result;
    },
};

export default AppService;
