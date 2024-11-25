import colors from "src/assets/theme/base/colors";
import borders from "src/assets/theme/base/borders";
import typography from "src/assets/theme/base/typography";

import pxToRem from "src/assets/theme/functions/pxToRem";

const { inputBorderColor, info, grey, transparent } = colors;
const { borderRadius } = borders;
const { size } = typography;

type Types = any;

const inputOutlined: Types = {
    styleOverrides: {
        root: {
            backgroundColor: transparent.main,
            fontSize: size.sm,
            borderRadius: borderRadius.md,

            "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: inputBorderColor,
            },

            "&.Mui-focused": {
                "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: info.main,
                },
            },
        },

        notchedOutline: {
            borderColor: inputBorderColor,
        },

        input: {
            color: grey[700],
            padding: pxToRem(12),
            backgroundColor: transparent.main,
        },

        inputSizeSmall: {
            fontSize: size.xs,
            padding: pxToRem(10),
        },

        multiline: {
            color: grey[700],
            padding: 0,
        },
    },
};

export default inputOutlined;
