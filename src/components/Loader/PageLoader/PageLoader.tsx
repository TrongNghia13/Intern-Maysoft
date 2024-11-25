import React from "react";
import { Box } from "@maysoft/common-component-react";
import { ldsEllipsis } from "./styles";

export const PageLoader: React.FC = () => {
    return (
        <Box
            sx={{
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                background: "#FFF",
                zIndex: "9999",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Box  sx={ldsEllipsis}>
                <Box></Box>
                <Box></Box>
                <Box></Box>
                <Box></Box>
            </Box>
        </Box>
    );
};

export default PageLoader;
