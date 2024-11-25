import { Box } from "@maysoft/common-component-react";
import { CircularProgress } from "@mui/material";

export const LoadingModal = ({ height }: { height?: string }) => {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: height ? height : "auto",
                minHeight: height ? height : "30vh"
            }}
        >
            <CircularProgress />
        </Box>
    );
};

export default LoadingModal;
