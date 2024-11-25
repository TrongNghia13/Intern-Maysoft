import HttpClient from "../base/HttpClient";
import { SEARCH_API_URL } from "@src/constants";

const SearchClient = () => {
    const httpClient = HttpClient(SEARCH_API_URL);
    return httpClient;
}

export default SearchClient;