import Drawer from "@mui/material/Drawer";
import { styled, Theme } from "@mui/material/styles";

export const CustomDrawer = styled(Drawer)(({ theme, ownerState }: { theme?: Theme; ownerState: any }) => {
    const boxShadows = theme?.boxShadows;
    const functions = theme?.functions;
    const transitions = theme?.transitions!;
    const breakpoints = theme?.breakpoints!;
    const { openConfigurator, width } = ownerState;

    const { lg } = boxShadows!;
    const { pxToRem } = functions!;

    // drawer styles when openConfigurator={true}
    const drawerOpenStyles = () => ({
        right: 0,
        width: width || "50%",
        left: "initial",
        [breakpoints.between(768, 1024)]: {
            width: width || "40%",
        },
        [breakpoints.between(425, 768)]: {
            width: "360px",
        },
        [breakpoints.between(0, 425)]: {
            width: "100%",
        },

        transition: transitions.create("right", {
            easing: transitions.easing.sharp,
            duration: transitions.duration.short,
        }),
    });

    // drawer styles when openConfigurator={false}
    const drawerCloseStyles = () => ({
        left: "initial",
        right: pxToRem(-350),
        transition: transitions.create("all", {
            easing: transitions.easing.sharp,
            duration: transitions.duration.short,
        }),
    });

    return {
        "& .MuiDrawer-paper": {
            height: "100%",
            margin: 0,
            padding: `0 ${pxToRem(10)}`,
            borderRadius: 0,
            boxShadow: lg,
            overflowY: "auto",
            ...(openConfigurator ? drawerOpenStyles() : drawerCloseStyles()),
        },
    };
});

export default CustomDrawer;
