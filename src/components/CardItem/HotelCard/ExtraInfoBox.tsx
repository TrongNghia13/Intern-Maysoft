import { Box, Typography } from "@maysoft/common-component-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import HotelRating from "../../Hotel/rating";

import { IDetailHotel, IRoom } from "@src/commons/interfaces";

const ExtraInfoBox = ({ roomDefault, item }: { item: IDetailHotel; roomDefault: IRoom | undefined }) => {
    const { t } = useTranslation(["search", "common", "detail"]);
    const refunable = useMemo(() => roomDefault?.rates[0]?.refunable, [roomDefault]);

    return (
        <Box
            sx={{
                gap: 1,
                display: "flex",
                flexWrap: "wrap",
                flexDirection: "column",
                justifyContent: "space-between",
            }}
        >
            <HotelRating attributes={item.attributes || []} />
            {roomDefault && (
                <Typography
                    color={refunable ? "info" : "error"}
                    variant="caption"
                    fontWeight="bold"
                    sx={(theme) => {
                        const {
                            palette: { info, error },
                        } = theme;
                        return {
                            border: `1px solid ${refunable ? info.main : error.main}`,
                            borderRadius: 2,
                            px: 1.5,
                            py: 0.5,
                        };
                    }}
                >
                    {refunable ? t("search:free_cancel") : t("search:cancel_no_refund")}
                </Typography>
            )}
        </Box>
    );
};

export default ExtraInfoBox;
