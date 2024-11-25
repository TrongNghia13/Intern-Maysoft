import HttpClient from "../base/HttpClient";
import { ASSET_API_URL } from "@src/constants";

const AssetClient = () => {
    const httpClient = HttpClient(ASSET_API_URL);
    return httpClient;
}

export default AssetClient;