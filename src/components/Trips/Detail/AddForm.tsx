import { TypeSearchForm } from "@src/commons/enum";
import { IItinerary } from "@src/commons/interfaces";
 
import AddFlightForm from "./AddFlightForm";
import AddHotelForm from "./AddHotelForm";

export const AddForm = ({
    typeForm,
    data,
    getDetail,
    handleCancelAddTrips,
}: {
    typeForm: number | undefined;
    getDetail: (id: string) => Promise<void>;
    data: IItinerary;
    handleCancelAddTrips: () => void;
}) => {
    if (typeForm === TypeSearchForm.Stays)
        return (
            <AddHotelForm
                {...{
                    data,
                    getDetail,
                    handleCancelAddTrips,
                }}
            />
        );

    if (typeForm === TypeSearchForm.Flight)
        return (
            <AddFlightForm
                {...{
                    data,
                    getDetail,
                    handleCancelAddTrips,
                }}
            />
        );
    return <></>;
};

export default AddForm;
