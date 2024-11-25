import Constants from "@src/constants";
import CommonClient from "./CommonClient";

export interface ICodeNameRequest {
    name: string;
    group: string;
}

export interface IUpdateCodenameRequest {
    name: string;
    group: string;
    id: string;
    code: string;
}

const CodenameService = {
    async getByGroup(group: string) {
        const result = await CommonClient().get(Constants.ApiPath.CODE_NAME.GET_BY_GROUP, {
            params: {
                group,
                serviceCode: Constants.SERVICE_CODE
            },
        });
        return result.data.result;
    },
    
    async createCodename(codenameRequest: ICodeNameRequest) {
        const result = await CommonClient().post(Constants.ApiPath.CODE_NAME.CREATE, {
            ...codenameRequest,
        });
        return result.data.result;
    },

    async updateCodename(codenameRequest: IUpdateCodenameRequest) {
        const result = await CommonClient().post(Constants.ApiPath.CODE_NAME.UPDATE, {
            ...codenameRequest,
        });
        return result.data.result;
    },
};

export default CodenameService;
