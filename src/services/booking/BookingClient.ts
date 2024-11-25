import HttpClient from "../base/HttpClient";
import { BOOKING_API_URL } from "@src/constants";

const BookingClient = () => {
    const httpClient = HttpClient(BOOKING_API_URL);
    return httpClient;
}

export default BookingClient;