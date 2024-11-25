import HttpClient from "../base/HttpClient";
import { COMMON_API_URL } from "@src/constants";

const CommonClient = () => {
    const httpClient = HttpClient(COMMON_API_URL);
    return httpClient;
}

export default CommonClient;