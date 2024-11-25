import { Box } from "@maysoft/common-component-react";

import { Skeleton } from "@mui/material";
import { SkeletonTextWithIcon } from "@src/components";

const InfoBox = () => {
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
                <Skeleton variant="text" sx={{ fontSize: "1.5rem" }} width={"100%"} />
                <Box display="flex" alignItems="center"></Box>
            </Box>

            <SkeletonTextWithIcon />

            <Box
                sx={{
                    gap: 1,
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                }}
            >
                {Array(3)
                    .fill(0)
                    .map((_, key) => (
                        <SkeletonTextWithIcon key={key} />
                    ))}
            </Box>
        </Box>
    );
};

export default InfoBox;
