import { Box, Typography } from "@maysoft/common-component-react";
import { Divider } from "@mui/material";
import { East, TwistArrow } from "@src/assets/svg";
import { FlightType } from "@src/commons/enum";
import Helpers from "@src/commons/helpers";
import { IFlightExtraInformation, IItineraryDetail } from "@src/commons/interfaces";
import { CarrierMarketing, FlightInfoDuration, FreeBaggage } from "@src/components/CardItem/ItineraryFlightCard/Components";
import Constants from "@src/constants";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import ItineraryDetailStatusChip from "./ItineraryDetailStatusChip";
import { typographyStyles } from "@src/styles/commonStyles";

export const FlightInfoCard = ({ detail, hiddenHeader }: { detail: IItineraryDetail; hiddenHeader?: boolean }) => {
    const {
        i18n: { language },
    } = useTranslation();

    const extraInfo = JSON.parse(detail.extraInfo);

    const data: IFlightExtraInformation = Helpers.toCamelCaseObj(extraInfo);

    if (Helpers.isNullOrEmpty(extraInfo)) return <></>;

    return (
        <Box sx={{ gap: 1, display: "grid" }}>
            {!hiddenHeader && (
                <Box>
                    <Box
                        sx={{
                            gap: 1,
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                        }}
                    >
                        <Title value={data?.departPlaceObj?.name} />
                        {data.flightType === FlightType.OneWay && <East size={24} />}
                        {data.flightType === FlightType.RoundTrip && <TwistArrow size={24} />}
                        {data.flightType === FlightType.MultiCity && <East size={24}/>}
                        <Title value={data?.arrivalPlaceObj?.name} />
                        <ItineraryDetailStatusChip item={detail} />
                    </Box>
                    <Typography
                        variant="caption"
                        sx={(theme) =>
                            typographyStyles(theme, {
                                fontSize: Constants.FONT_SIZE.SMALL_TEXT,
                                color: "secondary",
                            })
                        }
                    >
                        {Helpers.getVietnameseDateFormat(data.arrivalDate)}
                    </Typography>
                </Box>
            )}

            <Box sx={{ display: "grid", gap: 1, gridTemplateColumns: "40% 60%" }}>
                <Box>
                    <CarrierMarketing data={data} language={language} />
                </Box>
                <Box display="grid" alignContent="center">
                    <FlightInfoDuration {...{ language, data }} />
                </Box>
            </Box>
            <Divider />
            <FreeBaggage freeBaggage={data.freeBaggage || []} px={0} />
        </Box>
    );
};

const Title = ({ value }: { value: string }) => (
    <Typography
        sx={(theme) =>
            typographyStyles(theme, {
                fontWeight: 600,
            })
        }
    >
        {value}
    </Typography>
);

export default FlightInfoCard;
