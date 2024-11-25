import { styled, Theme } from "@mui/material/styles";
import { CircularProgress } from "@mui/material";

export default styled(CircularProgress)(({ theme, ownerState }: { theme?: Theme | any, ownerState: any }) => {
    const { palette } = theme;
    const { color } = ownerState;
    const { gradients } = palette;

    return {
        color: gradients[color].main,
    }
})