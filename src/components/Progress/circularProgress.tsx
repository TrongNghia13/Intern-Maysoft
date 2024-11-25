import { FC, forwardRef } from "react";
import { Box, CircularProgressProps, Typography} from "@mui/material";
import {
    circularProgress,
    circularBox,
    circularText
} from "@src/components/Progress/styles";

import CircularProgressRoot from "./circularProgressRoot";

interface Props extends Omit<CircularProgressProps, "color"> {
    color?:
    | "white"
    | "primary"
    | "secondary"
    | "info"
    | "success"
    | "warning"
    | "error"
    | "light"
    | "dark"
    | "default";
    value: number;
    size: number;
    [key: string]: any;
}

const CircularProgress: FC<Props> = forwardRef(({ color, value, size, ...rest }, ref) => {
    return (
        <Box sx={circularProgress} >
            <CircularProgressRoot
                ref={ref}
                variant="determinate"
                ownerState={{ color: color }}
                size={size}
                value={value}
                {...rest}
            />
            <Box sx={circularBox} >
                <Typography
                    variant="caption"
                    component="div"
                    color="text.secondary"
                    sx={(theme: any) => circularText(theme, { size: size - 45, color: color })}
                >{`${Math.round(value)}%`}</Typography>
            </Box>
        </Box>
    );
})

CircularProgress.defaultProps = {
    color: "dark",
};

CircularProgress.displayName = "CircularProgress";

export default CircularProgress;
