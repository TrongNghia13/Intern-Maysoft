import { Box, Typography } from "@maysoft/common-component-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import Helpers from "@src/commons/helpers";
import Constants from "@src/constants";

import { AttributeCodes } from "@src/commons/enum";
import { IDetailHotel } from "@src/commons/interfaces";
import { titleStyles, typographyStyles } from "@src/styles/commonStyles";
import { TextWithIcon, Stars } from "@src/components";

const InfoBox = ({ item }: { item: IDetailHotel }) => {
    const { t } = useTranslation(["search", "common", "detail"]);

    const star = useMemo(() => Helpers.getAttributeValue(item.attributes, AttributeCodes.partner_booking_ratings_property_rating), [item.attributes]);

    const description = useMemo(
        () => Helpers.getAttributeValue(item.attributes, AttributeCodes.partner_booking_description_headline),
        [item.attributes]
    );

    const amentitiesProperty = useMemo(
        () => item.attributes.filter((el) => Constants.POPULAR_AMENTITY.includes(el.referenceId || "")),
        [item.attributes]
    );
    return (
        <Box display="flex" flexDirection="column" gap={1}>
            <Box
                sx={{
                    gap: 1,
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                }}
            >
                <Typography component="span" sx={titleStyles}>
                    {item.name}
                </Typography>
                <Stars value={Number(star) | 0} />
            </Box>

            <TextWithIcon iconName={"location_on"} value={Helpers.getAddressInfo(item.address)} />

            <Box
                sx={{
                    gap: 1,
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                }}
            >
                {amentitiesProperty.map((item, key) => (
                    <TextWithIcon
                        iconName={Helpers.getIconByReferencyId(item?.referenceId || "")}
                        value={t("detail:" + Helpers.getTextByReferencyId(item?.referenceId || ""))}
                        key={key}
                    />
                ))}
            </Box>

            {!Helpers.isNullOrEmpty(description) && (
                <Box>
                    <Typography color={"secondary"} sx={typographyStyles}>
                        {description}
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default InfoBox;
