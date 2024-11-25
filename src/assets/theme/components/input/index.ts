import colors from "src/assets/theme/base/colors";
import typography from "src/assets/theme/base/typography";
import borders from "src/assets/theme/base/borders";

const { info, inputBorderColor, dark } = colors;
const { size } = typography;
const { borderWidth } = borders;

type Types = any;

const input: Types = {
    styleOverrides: {
        root: {
            fontSize: size.sm,
            color: dark.main,

            "&:hover:not(.Mui-disabled):before": {
                borderBottom: `${borderWidth[1]} solid ${inputBorderColor}`,
            },

            "&:before": {
                borderColor: inputBorderColor,
            },

            "&:after": {
                borderColor: info.main,
            },
        },
    },
};

export default input;
