import { Icon as MuiIcon, SvgIconTypeMap } from "@mui/material";
import { Palette } from "@mui/material/styles";
import { OverridableComponent } from "@mui/material/OverridableComponent";

import { Box, Typography } from "@maysoft/common-component-react";
import { container, typographyStyles } from "./styles";
import Constants from "@src/constants";
import Helpers from "@src/commons/helpers";

type IIconOrIconName = { Icon: OverridableComponent<SvgIconTypeMap> } | { iconName: string };
type IProps = {
    value: string;
    isLink?: boolean;
    color?: "disabled" | "action" | "inherit" | "success" | "primary" | "secondary" | "error" | "info" | "warning" | "white";
    iconPosition?: "left" | "right";
    fontWeight?: number;
    onClick?: () => void;
} & IIconOrIconName;

export const TextWithIcon: React.FC<IProps> = ({ color, value, isLink, iconPosition = "left", onClick, ...props }) => {
    return (
        <Box sx={(theme) => container(theme, { isLink })} onClick={() => Helpers.isFunction(onClick) && onClick()}>
            {iconPosition === "left" && <CurIcon {...{ ...props, color }} />}
            <Typography sx={(theme) => typographyStyles(theme, { isLink, color })}>{value}</Typography>
            {iconPosition === "right" && <CurIcon {...{ ...props, color }} />}
        </Box>
    );
};

const CurIcon = ({
    color,
    ...props
}: IIconOrIconName & {
    color?: "disabled" | "action" | "inherit" | "success" | "primary" | "secondary" | "error" | "info" | "warning" | "white";
}) => {
    if ("iconName" in props)
        return (
            <MuiIcon
                sx={(theme) => {
                    const { palette } = theme;
                    return { fontSize: Constants.FONT_SIZE.TEXT, color: palette[color as keyof Palette]?.main || color };
                }}
            >
                {props.iconName}
            </MuiIcon>
        );
    return (
        <props.Icon
            sx={(theme) => {
                const { palette } = theme;
                return { fontSize: Constants.FONT_SIZE.TEXT, color: palette[color as keyof Palette]?.main || color };
            }}
        />
    );
};

export default TextWithIcon;
