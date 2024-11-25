import { Box, Typography } from "@maysoft/common-component-react";
import { useTranslation } from "react-i18next";

import { IDetailHotel } from "@src/commons/interfaces";
import { HotelCard, SkeletonHotelCard } from "../CardItem";

const HotelList = ({
    numberOfNights,
    dataRows,
    onClick,
    loading,
}: {
    numberOfNights: number;
    dataRows: IDetailHotel[];
    onClick: (item: IDetailHotel) => void;
    loading: boolean;
}) => {
    const { t } = useTranslation("common");

    if (loading)
        return (
            <Box display="grid" gap={2}>
                {Array(5)
                    .fill(0)
                    .map((_, key) => (
                        <SkeletonHotelCard key={key} />
                    ))}
            </Box>
        );

    if (dataRows.length === 0)
        return (
            <Box
                sx={{
                    height: "150px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Typography color="secondary" variant="h4">
                    {t("no_data")}
                </Typography>
            </Box>
        );

    return (
        <Box display="grid" gap={2}>
            {dataRows.map((item, key) => (
                <HotelCard key={key} {...{ item, numberOfNights, onClick }} />
            ))}
        </Box>
    );
};

export default HotelList;
