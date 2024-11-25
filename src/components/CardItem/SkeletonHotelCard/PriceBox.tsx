import { Box } from "@maysoft/common-component-react";

import Constants from "@src/constants";

import { Skeleton } from "@mui/material";

const PriceBox = () => {
    return (
        <Box
            sx={(theme) => ({
                display: "flex",
                flexWrap: "wrap",
                alignItems: "end",
                justifyContent: "right",
                flexDirection: "column",
            })}
        >
            <Skeleton
                variant="text"
                sx={{
                    fontSize: Constants.FONT_SIZE.SMALL_TEXT,
                }}
                width={150}
            />
            <Skeleton
                variant="text"
                sx={{
                    fontSize: Constants.FONT_SIZE.SMALL_TEXT,
                }}
                width={150}
            />
        </Box>
    );
};

export default PriceBox;
