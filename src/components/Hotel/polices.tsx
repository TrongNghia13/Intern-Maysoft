import { Grid } from "@mui/material";
import { useTranslation } from "next-i18next";

import { Box, Typography } from "@maysoft/common-component-react";
import { titleStyles } from "@src/styles/commonStyles";
import { IDetailHotel } from "@src/commons/interfaces";
import { useMemo } from "react";
import Helpers from "@src/commons/helpers";
import { AttributeCodes } from "@src/commons/enum";
import { descriptionStyles } from "./styles";

interface IProps {
    data: IDetailHotel;
}

const Polices: React.FC<IProps> = ({ data }) => {
    const {
        t,
        i18n: { language },
    } = useTranslation(["detail"]);

    const checkInBeginTime = useMemo(() => Helpers.getAttributeValue(data.attributes, AttributeCodes.partner_booking_checkin_begin_time), [data]);
    const checkInEndTime = useMemo(() => Helpers.getAttributeValue(data.attributes, AttributeCodes.partner_booking_checkin_end_time), [data]);
    const minimumAge = useMemo(() => Helpers.getAttributeValue(data.attributes, AttributeCodes.partner_booking_checkin_min_age), [data]);
    const checkoutTime = useMemo(() => Helpers.getAttributeValue(data.attributes, AttributeCodes.partner_booking_checkout_time), [data]);

    const pet = useMemo(() => Helpers.getAttributeValue(data.attributes, AttributeCodes.partner_booking_attribute_pets), [data]);
    const checkInSpecialInstruction = useMemo(
        () => Helpers.getAttributeValue(data.attributes, AttributeCodes.partner_booking_checkin_special_instructions),
        [data]
    );

    const paymentMethods = useMemo(
        () => Helpers.getMultipleAttributeValue(data.attributes, AttributeCodes.partner_booking_onsite_payment_type),
        [data]
    );

    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                    <Typography sx={titleStyles}>{t("polices")}</Typography>
                </Grid>
                <Grid item xs={12} md={9}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Typography sx={titleStyles}>{t("check-in")}</Typography>
                            <Typography sx={descriptionStyles}>{t("check-in_time_starts_at", { time: checkInBeginTime })}</Typography>
                            <Typography sx={descriptionStyles}>{t("check-in_time_end_at", { time: checkInEndTime })}</Typography>
                            <Typography sx={descriptionStyles}>{t("minimum_check-in_age", { age: minimumAge })}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography sx={titleStyles}>{t("check-out")}</Typography>
                            <Typography sx={descriptionStyles}>{t("check-out_before", { time: checkoutTime })}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography sx={titleStyles}>{t("special_check-in_instructions")}</Typography>
                            <Typography sx={(theme) => descriptionStyles(theme, { numberOfLine: 15 })}>{checkInSpecialInstruction}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography sx={titleStyles}>{t("pets")}</Typography>
                            <Typography sx={descriptionStyles}>{pet}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography sx={titleStyles}>{t("children_and_extra_beds")}</Typography>
                            <Typography sx={descriptionStyles}>{t("children_are_welcome")}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography sx={titleStyles}>{t("payment_method")}</Typography>
                            {paymentMethods.map((item, key) => (
                                <Typography sx={descriptionStyles} key={key}>
                                    - {item}
                                </Typography>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
};

export default Polices;
