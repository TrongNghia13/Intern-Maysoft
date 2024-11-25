import { Box } from "@maysoft/common-component-react";
import { useMemo } from "react";

import { IDetailHotel } from "@src/commons/interfaces";
import ExtraInfoBox from "./ExtraInfoBox";
import InfoBox from "./InfoBox";
import PhotoBox from "./PhotoBox";
import PriceBox from "./PriceBox";

export const SkeletonHotelCard = () => {
    return (
        <Box
            sx={(theme) => ({
                borderRadius: 2,
                display: "flex",
                flexWrap: "wrap",
                overflow: "hidden",
                maxHeight: "350px",
                flexDirection: "row",
                border: "1px solid #c7c7c7",
                transitionDuration: ".3s",
                transitionProperty: "border-color",
                transitionTimingFunction: "ease-out",
                backgroundColor: "#ffffff",
                "& img": {
                    width: "100%",
                    height: "100%",
                    transform: "scale(1.3)",
                    transitionDuration: ".3s",
                    transitionTimingFunction: "ease-out",
                    transitionProperty: "transform, filter",
                },
                "&:hover": {
                    cursor: "pointer",
                    borderColor: theme.palette.primary.main,
                    "& img": {
                        transform: "scale(1)",
                        filter: "brightness(0.5)",
                    },
                },
            })}
        >
            <PhotoBox />

            <Box
                sx={{
                    px: 2,
                    py: 2,
                    gap: 1,
                    width: "65%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                }}
            >
                <InfoBox />
                <Box
                    sx={{
                        gap: 1,
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "end",
                        justifyContent: "space-between",
                    }}
                >
                    <ExtraInfoBox />
                    <PriceBox   />
                </Box>
            </Box>
        </Box>
    );
};

export default SkeletonHotelCard;
