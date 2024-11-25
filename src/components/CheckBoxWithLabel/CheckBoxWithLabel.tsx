import { Box, CheckBox, Typography } from "@maysoft/common-component-react";
import rgba from "@src/assets/theme/functions/rgba";
import Helpers from "@src/commons/helpers";
import Constants from "@src/constants";
import { typographyStyles } from "@src/styles/commonStyles";

export const CheckBoxWithLabel = ({
    onClick,
    label,
    checked,
    description,
}: {
    onClick: () => void;
    label: string;
    checked: boolean;
    description?: string;
}) => {
    return (
        <Box
            display="flex"
            alignItems="center"
            justifyItems="center"
            gap={1}
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
            sx={(theme) => ({
                "&:hover": {
                    cursor: "pointer",
                    "& .MuiButtonBase-root span": {
                        boxShadow: `inset 0 0 0 1px ${rgba(theme.palette.primary.main, 0.5)}, inset 0 -1px 0 ${rgba(
                            theme.palette.primary.main,
                            0.1
                        )}`,
                    },
                },
            })}
        >
            <CheckBox
                checked={checked}
                onClick={(e) => {
                    e.stopPropagation();
                    onClick();
                }}
            />
            <Box>
                <Typography sx={(theme) => typographyStyles(theme, { fontWeight: 400 })}>{label}</Typography>
                {!Helpers.isNullOrEmpty(description) && description !== "undefined" && (
                    <Typography sx={(theme) => typographyStyles(theme, { fontWeight: 400, fontSize: Constants.FONT_SIZE.SMALL_TEXT })}>
                        {description}
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default CheckBoxWithLabel;
