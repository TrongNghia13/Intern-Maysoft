import { Box, Typography } from "@maysoft/common-component-react";
import { useTranslation } from "next-i18next";
import { useState } from "react";

import Helpers from "@src/commons/helpers";

import { East } from "@mui/icons-material";
import { Grid } from "@mui/material";
import { IBookingDetail } from "@src/commons/interfaces";
import { CarrierMarketing, FlightInfoDuration, FreeBaggage } from "@src/components/CardItem/ItineraryFlightCard/Components";
import { DashedDivider } from "@src/components/DashedDivider";
import Constants from "@src/constants";
import { typographyStyles } from "../TextWithIcon/styles";

const Title = ({ value }: { value: string }) => (
    <Typography
        sx={{
            fontSize: "1rem",
            fontWeight: 600,
            color: "#1C252E",
        }}
    >
        {value}
    </Typography>
);

export const BookingDetails = ({ bookingDetails }: { bookingDetails?: IBookingDetail[] }) => {
    return (
        <Grid container spacing={2}>
            {(bookingDetails || []).map((item, key) => (
                <Grid item xs={12} key={key}>
                    <FlightBookingCard {...{ item, key }} />
                </Grid>
            ))}
        </Grid>
    );
};

const FlightBookingCard = ({ item }: { item: IBookingDetail }) => {
    const newExtraInfo = Helpers.toCamelCaseObj(Helpers.converStringToJson(item?.extraInfo));

    const {
        i18n: { language },
    } = useTranslation(["common", "tripbooking"]);

    return (
        <Box display="grid" gap={1}>
            <Box
                sx={{
                    gap: 1,
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                }}
            >
                <Title value={newExtraInfo?.departPlaceObj?.name} />
                <East />
                <Title value={newExtraInfo?.arrivalPlaceObj?.name} />
            </Box>
            <Box
                sx={{
                    borderRadius: "12px",
                    border: "1px solid #E4EBF7",
                }}
            >
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "40% 60%",
                        p: 2,
                    }}
                >
                    <Box>
                        <CarrierMarketing language={language} data={newExtraInfo} />
                    </Box>
                    <Box>
                        <FlightInfoDuration
                            showDate
                            language={language}
                            data={newExtraInfo}
                        />
                    </Box>
                </Box>

                <Box>
                    <DashedDivider />
                </Box>

                <Box p={2} display="grid" gap={1}>
                    <Typography
                        sx={(theme) => typographyStyles(theme, { fontWeight: 500, fontSize: Constants.FONT_SIZE.SMALL_TEXT, color: "#000000" })}
                    >
                        {"Thông tin hành lý"}
                    </Typography>
                    <FreeBaggage isColumns freeBaggage={newExtraInfo?.freeBaggage || []} />
                </Box>
            </Box>
        </Box>
    );
};

export default BookingDetails;
