import { Typography } from "@maysoft/common-component-react";
import { Grid } from "@mui/material";

import { IDetailBooking } from "@src/commons/interfaces";
import BookingDetails from "./BookingDetails";
import ContactInformation from "./ContactInformation";
import PassengerInformation from "./PassengerInformation";

const CardBookingDetailFlightByCheckout = ({ dataMember, dataBooking }: { dataMember: any[]; dataBooking?: IDetailBooking }) => {
    return (
        <Grid container spacing={3} padding={2.5}>
            <Grid item xs={12}>
                <BookingDetails bookingDetails={dataBooking?.bookingDetails || []} />
            </Grid>

            {/* thông tin hành khách */}
            <Grid item xs={12}>
                <PassengerInformation members={dataMember || []} />
            </Grid>

            {/* thông tin liên hệ */}
            {dataBooking && (
                <Grid item xs={12}>
                    <ContactInformation bookingData={dataBooking} />
                </Grid>
            )}
        </Grid>
    );
};

export default CardBookingDetailFlightByCheckout;
