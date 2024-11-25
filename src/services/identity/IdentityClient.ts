import HttpClient from "../base/HttpClient";
import { IDENTITY_API_URL } from "@src/constants";

const IdentityClient = () => {
    const httpClient = HttpClient(IDENTITY_API_URL);
    return httpClient;
}

export default IdentityClient;