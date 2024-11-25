import { Palette, Theme } from "@mui/material/styles";
import Constants from "@src/constants";

export const numberOfLinesStyles = (numberOfLines: number) => ({
    verticalAlign: "unset",
    textDecoration: "none",
    display: "-webkit-box",
    WebkitLineClamp: numberOfLines,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
});

export const titleStyles = (theme: Theme, ownerState?: { color?: string; fontSize?: string; textAlign?: string; numberOfLines?: number }) => {
    const {
        palette: { heading },
    } = theme;
    const fontSize = ownerState?.fontSize || Constants.FONT_SIZE.LARGE_TITLE;
    const color = ownerState?.color || heading.main;
    const textAlign = ownerState?.textAlign;
    const numberOfLines = ownerState?.numberOfLines;
    return {
        fontSize: fontSize,
        fontWeight: 600,
        lineHeight: "120%",
        letterSpacing: "-0.3px",
        m: 0,
        p: 0,
        ...(color && { color }),
        ...(textAlign && { textAlign }),
        ...(numberOfLines && numberOfLinesStyles(numberOfLines)),
        "& p": {
            m: 0,
            p: 0,
        },
    };
};

export const typographyStyles = (
    theme: Theme,
    ownerState?: {
        color?: keyof Palette | string;
        fontSize?: string;
        textAlign?: string;
        fontWeight?: number;
        fontStyle?: string;
        numberOfLines?: number;
        textDecoration?: string;
    }
) => {
    const { palette } = theme;
    const fontSize = ownerState?.fontSize || Constants.FONT_SIZE.TEXT;
    const color = ownerState?.color || "#1C252E";
    const textAlign = ownerState?.textAlign;
    const fontStyle = ownerState?.fontStyle;
    const numberOfLines = ownerState?.numberOfLines;
    const textDecoration = ownerState?.textDecoration;
    const fontWeight = ownerState?.fontWeight || 400;
    return {
        // lineHeight: "120%",
        // letterSpacing: "-0.3px",
        m: 0,
        p: 0,
        lineHeight: "160%",
        letterSpacing: "-0.27px",
        fontWeight: 400,
        ...(fontSize && { fontSize }),
        ...(color && { color: palette[color as keyof Palette]?.main || color }),
        ...(textAlign && { textAlign }),
        ...(fontWeight && { fontWeight }),
        ...(fontStyle && { fontStyle }),
        ...(textDecoration && { textDecoration }),
        ...(numberOfLines && numberOfLinesStyles(numberOfLines)),
        "& p": {
            m: 0,
            p: 0,
        },
    };
};

export const fullHeight = { height: "100%" };

export const linkStyle = (theme: Theme, ownerState: { isActive: boolean }) => {
    const { isActive } = ownerState;
    const {
        palette: { link, info },
    } = theme;

    const isActiveStyles = () => ({
        color: info.main,
        fontWeight: 500,
    });

    return {
        // color: link.main,
        color: "#637381",
        ...(isActive && isActiveStyles()),
        "&:hover": {
            color: link.focus,
        },
        "&:focus": {
            color: link.focus,
            fontWeight: 500,
        },
    };
};
