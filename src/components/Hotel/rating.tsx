import { Box, Typography } from "@maysoft/common-component-react";
import { AttributeCodes } from "@src/commons/enum";
import Helpers from "@src/commons/helpers";
import { IAttribute } from "@src/commons/interfaces";
import Constants from "@src/constants";
import { typographyStyles } from "@src/styles/commonStyles";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Chip } from "../Chip";

const RATINGS_GUEST = [
    AttributeCodes.partner_booking_ratings_guess_cleanliness,
    AttributeCodes.partner_booking_ratings_guess_overall,
    AttributeCodes.partner_booking_ratings_guess_service,
    AttributeCodes.partner_booking_ratings_guess_comfort,
    AttributeCodes.partner_booking_ratings_guess_condition,
    AttributeCodes.partner_booking_ratings_guess_location,
    AttributeCodes.partner_booking_ratings_guess_neighborhood,
    AttributeCodes.partner_booking_ratings_guess_amenities,
    // AttributeCodes.partner_booking_ratings_guess_recommendation,
];

const HotelRating = ({ attributes }: { attributes: IAttribute[] }) => {
    const { t } = useTranslation("common");

    const numberOfReviews = useMemo(() => Helpers.getAttributeValue(attributes, AttributeCodes.partner_booking_ratings_guess_count), [attributes]);

    const getEmotion = useCallback(
        (point: number) => {
            if (point >= 9.5) return "exceptional";
            if (point >= 9) return "wonderful";
            if (point >= 8.5) return "excellent";
            if (point >= 8) return "very_good";
            return "";
        },
        [t]
    );

    const point = useMemo(() => {
        const points: number[] = [];
        let summary: number = 0;
        for (const code of RATINGS_GUEST) {
            const number = Number(Helpers.getAttributeValue(attributes, code) || 0);
            points.push(number);
            summary += number;
        }

        return (summary / points.length) * 2;
    }, [attributes]);

    const emotion = getEmotion(point);

    return (
        <Box display="flex" flexDirection="row" alignItems="center" gap={1}>
            {Number(numberOfReviews) > 0 && <Chip value={point.toFixed(1)} color="success" />}
            <Box display="flex" flexDirection="column">
                {emotion && (
                    <Typography sx={(theme) => typographyStyles(theme, { fontSize: Constants.FONT_SIZE.SMALL_TEXT, fontWeight: 600 })}>
                        {t(emotion)}
                    </Typography>
                )}

                {Number(numberOfReviews) > 0 && (
                    <Typography sx={(theme) => typographyStyles(theme, { fontSize: Constants.FONT_SIZE.SMALL_TEXT })}>
                        {numberOfReviews} {t("reviews")}
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default HotelRating;
