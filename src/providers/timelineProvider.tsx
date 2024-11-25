import { IItinerary, IItineraryDetail } from "@src/commons/interfaces";
import { createContext, useContext, useState } from "react";

interface TimelineContext {
    itineraryDetails: IItineraryDetail[];
    reservationCode: string;
    setReservationCode: React.Dispatch<React.SetStateAction<string>>;
}

const TimelineContext = createContext<TimelineContext>(null!);

const useTimelineContext = () => useContext(TimelineContext);

const TimelineProvider = ({ itineraryDetails, children }: { itineraryDetails: IItineraryDetail[]; children: React.ReactNode }) => {
    const [reservationCode, setReservationCode] = useState<string>("");

    const value = {
        itineraryDetails,
        reservationCode,
        setReservationCode,
    };

    return <TimelineContext.Provider value={value}>{children}</TimelineContext.Provider>;
};

export { useTimelineContext, TimelineProvider };
