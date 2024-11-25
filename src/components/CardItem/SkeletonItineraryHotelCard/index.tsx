import { Box } from "@maysoft/common-component-react";
import React from "react";

import { Skeleton } from "@mui/material";

interface IProps {}

export const SkeletonItineraryHotelCard: React.FC<IProps> = ({}) => {
    const BasicInfo = () => (
        <Box sx={{ display: "grid" }}>
            <Skeleton variant="text" sx={{ fontSize: "1rem" }} width={100} />
            <Skeleton variant="text" sx={{ fontSize: "1.5rem" }} />
            <Box
                sx={{
                    gap: 1,
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    alignItems: "center",
                }}
            >
                <Skeleton variant="circular" width={20} height={20} />
                <Skeleton variant="text" sx={{ fontSize: "0.85rem" }} width={"90%"} />
            </Box>
        </Box>
    );

    const Attributes = () => (
        <Box
            sx={{
                gap: 1,
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
            }}
        >
            <Skeleton variant="circular" width={20} height={20} />
            <Skeleton variant="circular" width={20} height={20} />
            <Skeleton variant="circular" width={20} height={20} />
            <Skeleton variant="circular" width={20} height={20} />
        </Box>
    );

    const Price = () => (
        <Box
            sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 1,
            }}
        >
            <Skeleton variant="text" sx={{ fontSize: "0.85rem" }} width={"50%"} />
        </Box>
    );

    const CheckInOut = () => (
        <Box
            sx={(theme) => ({
                pt: "8px",
                display: "flex",
                flexWrap: "wrap",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                [theme.breakpoints.between(0, 1212)]: {
                    display: "none",
                },
            })}
        >
            <Box display="grid">
                <Skeleton variant="text" sx={{ fontSize: "0.85rem" }} width={100} />
                <Skeleton variant="text" sx={{ fontSize: "0.85rem" }} width={150} />
                <Skeleton variant="text" sx={{ fontSize: "0.85rem" }} width={50} />
            </Box>
            <Box display="grid">
                <Skeleton variant="text" sx={{ fontSize: "0.85rem" }} width={100} />
                <Skeleton variant="text" sx={{ fontSize: "0.85rem" }} width={150} />
                <Skeleton variant="text" sx={{ fontSize: "0.85rem" }} width={50} />
            </Box>
        </Box>
    );

    return (
        <Box
            sx={{
                borderRadius: 2,
                border: "1px solid #c3c3c3",
                p: 2,
                display: "grid",
                gap: 1,
                backgroundColor: "#ffffff"
            }}
        >
            <Box
                onClick={() => {}}
                sx={(theme) => ({
                    display: "flex",
                    flexWrap: "wrap",
                    flexDirection: "row",
                    borderRadius: 2,
                    overflow: "hidden",
                })}
            >
                <Box
                    sx={(theme) => ({
                        width: "40%",
                        gap: 1,
                        overflow: "hidden",
                        borderRadius: 2,
                        "& img": {
                            width: "100%",
                            height: "100%",
                            maxHeight: "300px",
                            transform: "scale(1.5)",
                            filter: "brightness(1)",
                            transitionDuration: ".3s",
                            transitionTimingFunction: "ease-out",
                            transitionProperty: "transform, filter",
                        },
                        "&:hover": {
                            "& img": {
                                transform: "scale(1)",
                                filter: "brightness(0.5)",
                            },
                        },
                    })}
                >
                    <Skeleton variant="rounded" width={"100%"} height={"100%"} />
                </Box>
                <Box
                    sx={(theme) => ({
                        width: "60%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                    })}
                >
                    <Box
                        sx={{
                            display: "grid",
                            gap: 1,
                            p: 2,
                        }}
                    >
                        <BasicInfo />
                        <Attributes />
                        <Price />
                        <CheckInOut />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default SkeletonItineraryHotelCard;
