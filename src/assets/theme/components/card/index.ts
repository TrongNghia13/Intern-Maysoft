import colors from "@src/assets/theme/base/colors";
import borders from "@src/assets/theme/base/borders";
import boxShadows from "@src/assets/theme/base/boxShadows";

import rgba from "@src/assets/theme/functions/rgba";

const { black, white } = colors;
const { borderWidth, borderRadius } = borders;
const { md } = boxShadows;

type Types = any;

const card: Types = {
  styleOverrides: {
    root: {
      display: "flex",
      flexDirection: "column",
      position: "relative",
      minWidth: 0,
      wordWrap: "break-word",
      backgroundColor: white.main,
      backgroundClip: "border-box",
      border: `${borderWidth[0]} solid ${rgba(black.main, 0.125)}`,
      borderRadius: borderRadius.lg,
      boxShadow: md,
      overflow: "visible",
      color: "inherit"
    },
  },
};

export default card;