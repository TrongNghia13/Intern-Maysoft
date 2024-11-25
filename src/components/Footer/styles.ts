import { Theme } from "@mui/material/styles";
import Constants from "@src/constants";

export const logoBox = (theme: any) => ({
    display: "flex",
    // justifyContent: "center",
    flexDirection: "column",
    // alignItems: { xs: "center", md: "start" },
    gap: 1,
    "& p": {
        textAlign: { xs: "center", md: "start" },
        fontSize: Constants.FONT_SIZE.SMALL_TEXT,
        // fontWeight: 700,
        // color: theme.palette.text?.footer!,
    },
});

export const containerStyles = (theme: any) => ({
    px: {
        xs: 2,
        sm: 2,
        md: 7.5,
    },
    py: 3,
    pt: 6,
    // backgroundColor: theme.palette.background?.footer!,
    backgroundColor: "#ffffff"
});

export const navLink = (theme: Theme, ownerState?: { isCopyRight?: boolean }) => {
    const {
        palette: { text },
    } = theme;
    const isCopyRight = ownerState?.isCopyRight;
    const copyRightStyles = () => ({
        flexDirection: "row",
        alignItems: { xs: "center", md: "center" },
        justifyContent: "center",
    });
    return {
        display: "flex",
        flexDirection: "column",
        alignItems: { xs: "center", md: "start" },
        gap: 1.5,
        fontSize: Constants.FONT_SIZE.SMALL_TEXT,
        color: (text as any).footer,
        "& p": {
            fontWeight: 600,
            fontSize: Constants.FONT_SIZE.SMALL_TEXT,
            color: (text as any).footer,
        },
        ...(isCopyRight && copyRightStyles()),
        "& a": { ...linkStyles(theme, { isCopyRight: isCopyRight }) },
    };
};

export const linkStyles = (theme: Theme, ownerState?: { isCopyRight?: boolean }) => {
    const {
        palette: { link },
    } = theme;
    const isCopyRight = ownerState?.isCopyRight;

    return {
        fontSize: Constants.FONT_SIZE.SMALL_TEXT,
        lineHeight: "24px",
        letterSpacing: "0.03em",
        textDecoration: "none",
        color: link.main,
        "&:hover": {
            color: link.focus,
        },
        ...(isCopyRight && {
            fontWeight: "bold",
            textDecoration: "underline",
        }),
    };
};
