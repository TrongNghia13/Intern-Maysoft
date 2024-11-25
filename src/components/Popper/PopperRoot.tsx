import { Popper as MuiPopper, styled } from "@mui/material";

const PopperRoot = styled(MuiPopper)(({ theme }) => ({
    // You can replace with `PopperUnstyled` for lower bundle size.
    zIndex: 1200,
    width: "max-content",
    '&[data-popper-placement*="bottom"] .arrow': {
        top: 0,
        left: 0,
        marginTop: "-0.9em",
        width: "3em",
        height: "1em",
        "&::before": {
            borderWidth: "0 1em 1em 1em",
            borderColor: `transparent transparent ${theme.palette.background.paper} transparent`,
        },
    },
    '&[data-popper-placement*="top"] .arrow': {
        bottom: 0,
        left: 0,
        marginBottom: "-0.9em",
        width: "3em",
        height: "1em",
        "&::before": {
            borderWidth: "1em 1em 0 1em",
            borderColor: `${theme.palette.background.paper} transparent transparent transparent`,
        },
    },
    '&[data-popper-placement*="right"] .arrow': {
        left: 0,
        marginLeft: "-0.9em",
        height: "3em",
        width: "1em",
        "&::before": {
            borderWidth: "1em 1em 1em 0",
            borderColor: `transparent ${theme.palette.background.paper} transparent transparent`,
        },
    },
    '&[data-popper-placement*="left"] .arrow': {
        right: 0,
        marginRight: "-0.9em",
        height: "3em",
        width: "1em",
        "&::before": {
            borderWidth: "1em 0 1em 1em",
            borderColor: `transparent transparent transparent ${theme.palette.background.paper}`,
        },
    },
}));

export default PopperRoot;
