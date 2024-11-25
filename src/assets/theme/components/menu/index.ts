import boxShadows from "@src/assets/theme/base/boxShadows";
import typography from "@src/assets/theme/base/typography";
import colors from "@src/assets/theme/base/colors";
import borders from "@src/assets/theme/base/borders";
import pxToRem from "@src/assets/theme/functions/pxToRem";

const { md } = boxShadows;
const { size } = typography;
const { text, white } = colors;
const { borderRadius } = borders;

// types
type Types = any;

const menu: Types = {
    defaultProps: {
        disableAutoFocusItem: true,
    },

    styleOverrides: {
        paper: {
            minWidth: pxToRem(160),
            boxShadow: md,
            // padding: `${pxToRem(16)} ${pxToRem(8)}`,
            fontSize: size.sm,
            color: text.main,
            textAlign: "left",
            backgroundColor: `${white.main} !important`,
            borderRadius: borderRadius.lg,
        },
    },
};

export default menu;