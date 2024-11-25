import { AirportShuttle, DirectionsCar, LocalTaxi } from "@mui/icons-material";
import { useState } from "react";

import { IFilter } from "@src/commons/interfaces";

export const useYourStay = () => {
    const [yourStayData, setYourStayData] = useState<IFilter[]>([
        {
            name: "i'm_interested_in_requesting_an_airport_shuttle",
            description: "we’ll_tell_your_accommodation_that_you’re_interested_so_they_can_provide_details_and_costs",
            checked: false,
            Icon: AirportShuttle,
        },
        {
            name: "i'm_interested_in_renting_a_car",
            description: "make_the_most_out_of_your_trip_and_check_car_hire_options_in_your_booking_confirmation",
            checked: false,
            Icon: DirectionsCar,
        },
        {
            name: "want_to_book_a_taxi_or_shuttle_ride_in_advance",
            description:
                "avoid_surprises_get_from_the_airport_to_your_accommodation_without_a_hitch_we'll_add_taxi_options_to_your_booking_confirmation",
            checked: false,
            Icon: LocalTaxi,
        },
    ]);

    const onChangeYourData = (index: number) => {
        setYourStayData((prev) => {
            const temp = [...prev];
            prev[index].checked = !prev[index].checked;
            return temp;
        });
    };

    return {
        yourStayData,
        onChangeYourData,
    };
};

export default useYourStay;
