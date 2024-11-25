import { Button as MayButton } from "@maysoft/common-component-react";

import { ButtonProps, CircularProgress } from "@mui/material";
import { FC, ReactNode, forwardRef } from "react";

interface IProps extends Omit<ButtonProps, "color" | "variant"> {
    loading?: boolean;
    circular?: boolean;
    iconOnly?: boolean;
    component?: string;
    children?: ReactNode;
    size?: "small" | "medium" | "large";
    variant?: "text" | "contained" | "outlined" | "gradient";
    color?: "white" | "primary" | "secondary" | "info" | "success" | "warning" | "error" | "light" | "dark" | "default";
}

export const Button = (props: IProps) => {
    return (
        <MayButton
            {...props}
            sx={{
                fontSize: "1rem",
                py: 1.25,
                px: 3,
                ...props.sx
            }}
        />
    );
};

export default Button;
