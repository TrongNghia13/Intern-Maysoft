import { Theme } from "@mui/material/styles";
import { PublishedStatus } from "@src/commons/enum";
import Constants from "@src/constants";

export const rowStyles = (theme: Theme, ownerState?: { gap?: number; justifyContent?: string }) => {
    const justifyContent = ownerState?.justifyContent;
    const gap = ownerState?.gap || 0.5;
    return {
        display: "flex",
        alignItems: "center",
        gap: gap,
        ...(justifyContent && { justifyContent }),
    };
};

export const contentStyles = (theme: Theme) => {
    return {
        display: "flex",
        flexDirection: "column",
        // height: "95px",
        p: 2,
        flexGrow: 1,
        gap: 1,
    };
};

export const extraStyles = (theme: Theme) => {
    return {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        justifyContent: "end",
        // height: "95px",
        p: 2,
        flexGrow: 1,
        gap: 1,
    };
};

export const titleStyles = (theme: Theme, ownerState: { fullWidth: boolean }) => {
    return {
        overflow: "hidden",
        display: "-webkit-box !important",
        WebkitBoxOrient: "vertical",
        WebkitLineClamp: "1",
        textOverflow: "ellipsis",
        fontSize: "1.4rem",
        fontWeight: "600",
        width: ownerState?.fullWidth ? "100%" : "90%",
    };
};

export const descriptionStyles = (theme: Theme, ownerState?: { numberOfLine?: number }) => {
    const numberOfLine = ownerState?.numberOfLine || 1;

    return {
        overflow: "hidden",
        display: "-webkit-box !important",
        fontSize: Constants.FONT_SIZE.SMALL_TEXT,
        WebkitBoxOrient: "vertical",
        color: "#717171",
        WebkitLineClamp: numberOfLine,
        // color: "#7b809a",
        "& p": {
            m: 0,
        },
    };
};

export const priceStyles = (theme: Theme, ownerState?: { textAlign?:string, fontSize?: string; textDecoration?: string; fontWeight?: number; color?: string }) => {
    const fontSize = ownerState?.fontSize || Constants.FONT_SIZE.TEXT;
    const textDecoration = ownerState?.textDecoration || "none";
    const fontWeight = ownerState?.fontWeight || 600;
    const color = ownerState?.color;
    const textAlign = ownerState?.textAlign || "unset";

    return {
        overflow: "hidden",
        display: "-webkit-box !important",
        WebkitBoxOrient: "vertical",
        WebkitLineClamp: 1,
        fontWeight,
        fontSize,
        textAlign,
        textDecoration,
        ...(color && { color }),

        // color: "#7b809a",
        "& p": {
            m: 0,
        },
    };
};

export const containerStyles = (theme: Theme, ownerState?: { backgroundColor?: string; isCircle?: boolean }) => {
    const {
        functions: { rgba },
    } = theme;
    const backgroundColor = ownerState?.backgroundColor;
    const isCircle = ownerState?.isCircle;
    return {
        mt: isCircle ? 6 : 3,
        boxShadow: `0 4px 6px -1px ${rgba("#000000", 0.1)}, 0 2px 4px 3px ${rgba("#000000", 0.06)}`,
        borderRadius: 2,
        filter: "brightness(1)",
        transition: ".3s ease-in",
        display: "flex",
        flexDirection: "column",
        ...(backgroundColor && { backgroundColor }),
        "&:hover": {
            // cursor: "pointer",
            backgroundColor: rgba("#0d8e93", 0.05),
            // filter: "brightness(0.5)",
            "& img": {
                transform: "scale(1.5)",
            },
        },
    };
};

export const headerStyles = (
    theme: Theme,
    ownerState: { backgroundImage: string; size?: number | string; isCircle?: boolean; isPublished?: PublishedStatus }
) => {
    const { functions, palette } = theme;
    const { rgba } = functions;
    const { white } = palette;

    const size = ownerState?.size || "100%";
    const isCircle = ownerState?.isCircle;
    const isPublished = ownerState?.isPublished || PublishedStatus.Draft;

    const circleStyles = () => ({
        width: size,
        height: size,
        borderRadius: "50%",
        left: "unset",
    });

    return {
        mx: 2,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        "& > div:nth-of-type(1)": {
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 2,
            width: "100%",
            mt: isCircle ? -6 : -3,
            border: "1px solid #d4d4d4",
            "& img": {
                borderRadius: 2,
                width: "100%",
                height: "225px",
                objectFit: "cover",
                // boxShadow: `0 4px 6px -1px ${rgba("#0d8e93", 0.1)}, 0 2px 4px 3px ${rgba("#0d8e93", 0.06)}`,
                transition: "transform 0.3s ease-in-out",
                ...(isCircle && circleStyles()),
            },
        },
        "& div:nth-of-type(2)": {
            transform: "scale(.94)",
            top: "3.5%",
            filter: "blur(12px)",
            position: "absolute",
            left: "0",
            width: size,
            height: size,
            backgroundSize: "cover",
            zIndex: -1,
            background: `url(${ownerState.backgroundImage})`,
            ...(isCircle && circleStyles()),
        },
        // "& .MuiTypography-root": {
        //     background: rgba(isPublished !== PublishedStatus.Published ? "rgb(46, 125, 50)" : "#ffd91e", 0.5),
        //     position: "absolute",
        //     top: "-1rem",
        //     right: "1rem",
        //     px: 1,
        //     py: 0.5,
        //     color: white.main,
        //     borderRadius: 6,
        //     fontSize: Constants.FONT_SIZE.SMALL_TEXT,
        //     fontWeight: 600,
        // },
    };
};
