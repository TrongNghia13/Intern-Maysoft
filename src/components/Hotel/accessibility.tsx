import { Grid } from "@mui/material";
import { useTranslation } from "next-i18next";

import { Typography } from "@maysoft/common-component-react";
import { AttributeCodes } from "@src/commons/enum";
import Helpers from "@src/commons/helpers";
import { IDetailHotel } from "@src/commons/interfaces";
import { titleStyles } from "@src/styles/commonStyles";
import { useMemo } from "react";
import { descriptionStyles } from "./styles";

interface IProps {
    data: IDetailHotel;
}

const Accessibility: React.FC<IProps> = ({ data }) => {
    const {
        t,
        i18n: { language },
    } = useTranslation(["detail"]);

    const accessibilities = useMemo(
        () => Helpers.getMultipleAttributeValue(data.attributes, AttributeCodes.partner_booking_attribute_general),
        [data]
    );

    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                    <Typography sx={titleStyles}>{t("accessibility")}</Typography>
                    <Typography sx={(theme) => descriptionStyles(theme, { numberOfLine: 10 })}>{t("accessibility_description")}</Typography>
                </Grid>
                <Grid item xs={12} md={9}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Typography sx={titleStyles}>{t("common_areas")}</Typography>
                            {accessibilities.map((item, key) => (
                                <Typography sx={descriptionStyles} key={key}>
                                    {item}
                                </Typography>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
};

export default Accessibility;
