import HttpClient from "../base/HttpClient";
import { SALE_API_URL } from "@src/constants";

const SaleClient = () => {
    const httpClient = HttpClient(SALE_API_URL);
    return httpClient;
}

export default SaleClient;