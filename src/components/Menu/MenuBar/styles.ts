import { Theme } from "@mui/material/styles";

function listItem(theme: Theme | any, ownerState: any) {
    const { palette, functions, borders } = theme;
    const { isActive, isParent } = ownerState;

    const { info, grey } = palette;
    const { pxToRem } = functions;
    const { borderRadius } = borders;

    const highLightColor = "#F5F5F5"
    const parentStyles = () => ({
        display: "flex",
        justifyContent: "space-between",
    });

    const childStyles = () => ({
        justifyContent: "flex-start",
        backgroundColor: `${isActive ? highLightColor : "transparent"} !important`,
    });

    return {
        width: "100%",
        height: "100%",
        cursor: "pointer",
        alignItems: "center",
        textAlign: "left",
        borderRadius: borderRadius.md,
        transition: "all 300ms linear",
        color: isActive ? "#000000" : "#637381",
        fontWeight: isActive ? "bold" : "regular",
        "& .MuiTypography-root": {
            color: isActive ? "#000000" : "#637381",
        },
        "&:hover": {
            backgroundColor: `${isParent ? grey[200] : highLightColor} !important`,
            color: "#000000 !important",
            ".MuiTypography-root": {
                fontWeight: "bold",
                color: isParent ? "#000000" : "#000000",
            },
            ".MuiSvgIcon-root": {
                color: isParent ? "#000000" : "#000000",
            }
        },
        padding: `${pxToRem(8)} ${pxToRem(16)}`,
        ...(isParent ? parentStyles() : childStyles())
    }
}

function iconItemMenu(theme:Theme) {

    return {
        minWidth: "24px",
        height: "24px",
        display: "grid",
        color: "#000000",
        marginRight: "8px",
        placeItems: "center",
    }
}


function textItemMenu(theme: Theme | any, ownerState: any) {
    const { isActive, isParent } = ownerState;
    const { palette } = theme;
    const { info } = palette;

    return {
        "&:hover": {
            color: "#FFFFFF",
        },
        ...(isParent
            ? ({
                color: "#000000",
                fontWeight: isActive ? "bold" : "regular",
            })
            : ({
                color: isActive ? "#FFFFFF" : "#000000",
                fontWeight: isActive ? "bold" : "regular",
            })
        )
    }
}

export {
    listItem,
    iconItemMenu,
    textItemMenu,
}