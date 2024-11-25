import { Box } from "@maysoft/common-component-react";

import { Skeleton } from "@mui/material";

const PhotoBox = () => {
    return (
        <Box
            sx={{
                width: "35%",
                overflow: "hidden",
                maxHeight: "350px",
            }}
        >
            <Skeleton variant="rounded" width="100%" height="100%" />
        </Box>
    );
};

export default PhotoBox;
