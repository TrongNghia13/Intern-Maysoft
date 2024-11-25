import { Box, Typography } from "@maysoft/common-component-react";
import { typographyStyles } from "@src/styles/commonStyles";

import { useTranslation } from "react-i18next";

export const DataNotFound = () => {
    const { t } = useTranslation("common");

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 2,
                border: "1px solid #c7c7c7",
                background: "#f3f3f3",
                height: "20vh",
            }}
        >
            <Typography sx={typographyStyles}>{t("no_data")}</Typography>
        </Box>
    );
};

export default DataNotFound;
