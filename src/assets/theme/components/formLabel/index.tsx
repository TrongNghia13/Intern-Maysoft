import colors from "../../base/colors";
import typography from "../../base/typography";

const { text } = colors;
const { size } = typography;

type Types = any;

const formLabel: Types = {
    styleOverrides: {
        root: {
            color: text.main,
            fontSize: size.sm,
        },
    },
};

export default formLabel;
