import Constants from "@src/constants";
import AssetClient from "./AssetClient";
import Helpers from "@src/commons/helpers";
import { IAssetInfo, ICreateUrlAssetRequest } from "@src/commons/interfaces";

const AssetService = {
    async createUrlAsset(request: ICreateUrlAssetRequest) {
        const result = await AssetClient().post(Constants.ApiPath.CREATE_URL_ASSET, {
            serviceCode: Constants.SERVICE_CODE,
            tenantCode: Constants.TENANT_CODE,
            ...request
        });
        return result.data.result;
    },

    async getAssetInfo(id: string): Promise<IAssetInfo> {
        const result = await AssetClient().get(Helpers.urlJoin(Constants.ApiPath.GET_ASSET_INFO, id));
        return result.data.result;
    },

    async getExternalUrlIds(ids: string[]): Promise<{ id: string; url: string }[]> {
        const result = await AssetClient().post(Constants.ApiPath.GET_EXTERNAL_URL_IDS, {
            ids: [...ids]
        });
        return result.data.result;
    },

    async getM3u8Url(id: string): Promise<string> {
        const result = await AssetClient().get(Helpers.urlJoin(Constants.ApiPath.GET_M3U8_URL, id));
        return result.data.result;
    },

    async setActiveById(id: string) {
        const result = await AssetClient().put(Constants.ApiPath.SET_ACTIVE_BY_ID + `/${id}`);
        return result.data.result;
    }
}

export default AssetService;