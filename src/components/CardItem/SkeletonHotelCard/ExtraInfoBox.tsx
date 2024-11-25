import { Box } from "@maysoft/common-component-react";

import { Skeleton } from "@mui/material";

const ExtraInfoBox = () => {
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
            <Skeleton
                variant="text"
                sx={{
                    fontSize: "0.85rem",
                }}
                width={150}
            />
        </Box>
    );
};

export default ExtraInfoBox;
