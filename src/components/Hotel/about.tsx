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

const About: React.FC<IProps> = ({ data }) => {
    const {
        t,
        i18n: { language },
    } = useTranslation(["detail"]);

    const languages = useMemo(() => Helpers.getMultipleAttributeValue(data.attributes, AttributeCodes.partner_booking_spoken_languages), [data]);
    const descriptionAmenity = useMemo(
        () => Helpers.getMultipleAttributeValue(data.attributes, AttributeCodes.partner_booking_description_amenity),
        [data]
    );
    const descriptionBusinessAmenities = useMemo(
        () => Helpers.getMultipleAttributeValue(data.attributes, AttributeCodes.partner_booking_description_business_amenities),
        [data]
    );

    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                    <Typography sx={titleStyles}>{t("about_this_property")}</Typography>
                </Grid>
                <Grid item xs={12} md={9} display="flex" flexDirection="column" gap={3}>
                    <Box display="flex" flexDirection="column">
                        <Typography sx={titleStyles}>{data.name}</Typography>
                        <Box>
                            {[descriptionAmenity, descriptionBusinessAmenities]
                                .filter((el) => !Helpers.isNullOrEmpty(el))
                                .map((item, key) => (
                                    <Typography key={key} sx={(theme) => descriptionStyles(theme, { numberOfLine: 20 })}>
                                        {item}
                                    </Typography>
                                ))}
                        </Box>
                    </Box>
                    <Box display="flex" flexDirection="column">
                        <Typography sx={titleStyles}>{t("languages")}</Typography>
                        <Typography sx={descriptionStyles}>- {languages.join(", ")}</Typography>
                    </Box>
                </Grid>
            </Grid>
        </>
    );
};

export default About;
