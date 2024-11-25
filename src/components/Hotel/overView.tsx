import { Box, Typography } from "@maysoft/common-component-react";
import { Grid } from "@mui/material";
import { useTranslation } from "next-i18next";

import { AttributeCodes } from "@src/commons/enum";
import Helpers from "@src/commons/helpers";
import { IDetailHotel } from "@src/commons/interfaces";
import { Stars, TextWithIcon } from "@src/components";
import Constants from "@src/constants";
import { titleStyles } from "@src/styles/commonStyles";
import { useMemo } from "react";
import ImageLibrary from "../ImageLibrary";
import HotelRating from "./rating";
import { descriptionStyles } from "./styles";

interface IProps {
    data: IDetailHotel;
}

const Overview: React.FC<IProps> = ({ data }) => {
    const {
        t,
        i18n: { language },
    } = useTranslation(["common", "detail"]);

    const star = useMemo(() => Helpers.getAttributeValue(data.attributes, AttributeCodes.partner_booking_ratings_property_rating), [data]);
    const description = useMemo(() => Helpers.getAttributeValue(data.attributes, AttributeCodes.partner_booking_description_headline), [data]);
    const amentitiesProperty = useMemo(() => Helpers.getHighlightAttributes(data.attributes), [data]);

    const reserveNow = useMemo(
        () => Helpers.getAttributeValue(data.attributes, AttributeCodes.partner_booking_business_model_expedia_collect),
        [data]
    );

    const fullyRefundable = useMemo(() => {
        let result = true;
        for (const room of data.rooms) {
            const refunableCount = room.rates.reduce((acc, cur) => {
                if (cur.refunable) acc = acc + 1;
                return acc;
            }, 0);
            if (refunableCount !== room.rates.length) {
                result = false;
                break;
            }
        }
        return result;
    }, [data]);

    return (
        <Box display="flex" flexDirection="column" gap={2}>
            <Box>
                <ImageLibrary images={data.photos} key={data.propertyId} />
            </Box>
            <Box>
                <Grid container spacing={3}>
                    <Grid item xs={12} display="flex" flexDirection="column" gap={1}>
                        <Typography sx={titleStyles}>{data.name}</Typography>
                        <Stars value={Number(star) | 1} />
                        <Typography sx={descriptionStyles}>{description}</Typography>

                        <HotelRating attributes={data.attributes || []} />
                        <Box display="flex" gap={1}>
                            {fullyRefundable && <TextWithIcon iconName="check" value={t("detail:fully_refundable")} color="success" />}
                            {reserveNow === "1" && <TextWithIcon iconName="check" value={t("detail:reserve_now_pay_later")} color="success" />}
                        </Box>
                        <Box display="flex" flexDirection="column" gap={1}>
                            <Typography sx={(theme) => titleStyles(theme, { fontSize: Constants.FONT_SIZE.TEXT })}>
                                {t("detail:popular_amenities")}
                            </Typography>
                            {amentitiesProperty.map((item, key) => (
                                <TextWithIcon
                                    iconName={Helpers.getIconByReferencyId(item?.referenceId || "")}
                                    value={t("detail:" + Helpers.getTextByReferencyId(item?.referenceId || ""))}
                                    key={key}
                                />
                            ))}
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default Overview;
