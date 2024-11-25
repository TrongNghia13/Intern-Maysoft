import { Skeleton } from "@mui/material";

import { Box } from "@maysoft/common-component-react";
import Constants from "@src/constants";
import { container } from "./styles";

type IProps = {
    iconPosition?: "left" | "right";
};

export const SkeletonTextWithIcon: React.FC<IProps> = ({ iconPosition = "left" }) => {
    return (
        <Box sx={(theme) => container(theme)}>
            {iconPosition === "left" && <Skeleton variant="circular" width={18} height={18} />}
            <Skeleton
                variant="text"
                sx={{
                    fontSize: Constants.FONT_SIZE.TEXT,
                }}
                width={100}
            />
            {iconPosition === "right" && <Skeleton variant="circular" width={18} height={18} />}
        </Box>
    );
};

export default SkeletonTextWithIcon;
