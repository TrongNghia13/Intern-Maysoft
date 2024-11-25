import { Theme } from "@mui/material/styles";

const circularProgress = () => {
    return {
        position: "relative",
        display: "flex",
    }
};

const circularBox = () => {
    return {
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }
};

const circularColor = () => {
    // const { gradients } = palette;
    return {
        color: "#344767",
    }
};

const circularText = (theme: Theme, ownerState: any  )=> {
    const { palette } = theme;
    // const { gradients } = palette;
    const { size, color } = ownerState;
    return {
        fontSize: size || 18,
        color: "#344767",
        // color: gradients[color].main,
        fontWeight: 500
    }
};

export {
    circularProgress,
    circularBox,
    circularColor,
    circularText
}