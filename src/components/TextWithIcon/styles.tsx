import { Palette, Theme } from "@mui/material/styles";
import Constants from "@src/constants";

export const container = (theme: Theme, ownerState?: { isLink?: boolean }) => ({
    display: "flex",
    alignItems: "center",
    gap: "6px",
    justifyContent: "flex-start",
    ...(ownerState?.isLink && {
        "&:hover": {
            cursor: "pointer",
        },
    }),
});

export const typographyStyles = (
    theme: Theme,
    ownerState?: { color?: string | keyof Palette; fontSize?: string; isLink?: boolean; fontWeight?: number }
) => {
    const fontSize = ownerState?.fontSize || Constants.FONT_SIZE.TEXT;
    const color = ownerState?.color;
    const isLink = ownerState?.isLink;
    const fontWeight = ownerState?.fontWeight || 400;
    const { palette } = theme;
    return {
        // lineHeight: "120%",
        // letterSpacing: "-0.3px",
        fontWeight,
        lineHeight: "160%",
        letterSpacing: "-0.27px",
        ...(fontSize && { fontSize: fontSize }),
        ...(color && { color: palette[color as keyof Palette]?.main || color }),
        ...(isLink && {
            "&:hover": {
                textDecoration: "underline",
            },
        }),
    };
};
