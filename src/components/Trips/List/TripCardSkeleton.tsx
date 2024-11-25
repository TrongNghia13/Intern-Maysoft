import { Box } from "@maysoft/common-component-react";
import { Divider, Skeleton } from "@mui/material";
import React from "react";

interface IProps {
    // item: IItinerary;
    // onClick?: () => void;
}

export const TripCardSkeleton: React.FC<IProps> = ({}: IProps) => {
    return (
        <Box
            sx={{
                padding: 2,
                display: "flex",
                flexDirection: "column",
                gap: 1,
                borderRadius: "8px",
                border: "1px #c3c3c3 solid",
                width: "100%",
                backgroundColor: "#ffffff"
            }}
        >
            <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
                <Box
                    sx={{
                        display: "grid",
                        "&:hover": { cursor: "pointer" },
                    }}
                >
                    <Skeleton variant="text" sx={{ fontSize: "1rem" }} width={400} />
                    <Skeleton variant="text" sx={{ fontSize: "0.85rem" }} width={200} />
                </Box>
                <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1 }}>
                    <Skeleton variant="text" sx={{ fontSize: "0.85rem" }} width={150} />
                    <Skeleton variant="rounded" width={50} />
                    <Skeleton variant="rounded" width={18} height={18} />
                </Box>
            </Box>
            <Box>
                <Divider />
            </Box>

            <Box display="flex" flexDirection="column" gap={1}>
                {Array.from({ length: 3 })
                    .fill(0)
                    .map((_, index) => {
                        return (
                            <Box sx={{ gap: 1, display: "flex", flexWrap: "wrap", alignItems: "center" }} key={index}>
                                <Skeleton variant="rounded" width={18} height={18} />
                                <Skeleton variant="text" sx={{ fontSize: "0.85rem" }} width={500} />
                            </Box>
                        );
                    })}
            </Box>
        </Box>
    );
};

export default TripCardSkeleton;
