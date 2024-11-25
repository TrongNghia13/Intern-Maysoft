import HttpClient from "../base/HttpClient";
import { MAYWORK_API_URL } from "@src/constants";


const MayworkClient = () => {
    const httpClient = HttpClient(MAYWORK_API_URL);
    return httpClient;
}

export default MayworkClient;