import { createTheme } from "@mui/material";
import borders from "@src/assets/theme/base/borders";
import boxShadows from "@src/assets/theme/base/boxShadows";
import breakpoints from "@src/assets/theme/base/breakpoints";
import colors from "@src/assets/theme/base/colors";

import button from "@src/assets/theme/components/button";
import boxShadow from "@src/assets/theme/functions/boxShadow";
import hexToRgb from "@src/assets/theme/functions/hexToRgb";
import linearGradient from "@src/assets/theme/functions/linearGradient";
import pxToRem from "@src/assets/theme/functions/pxToRem";
import rgba from "@src/assets/theme/functions/rgba";

import autocomplete from "./components/autocomplete";
import card from "./components/card";
import menu from "./components/menu";

import formControlLabel from "./components/formControlLabel";
import formLabel from "./components/formLabel";
import menuItem from "./components/menu/menuItem";

import input from "src/assets/theme/components/input";
import inputLabel from "src/assets/theme/components/input/inputLabel";
import inputOutlined from "src/assets/theme/components/input/inputOutlined";
import typography from "./base/typography";

export default createTheme({
    breakpoints: { ...breakpoints },
    palette: { ...colors },
    boxShadows: { ...boxShadows },
    borders: { ...borders },
    functions: {
        boxShadow,
        hexToRgb,
        linearGradient,
        pxToRem,
        rgba,
    },

    components: {
        MuiButton: { ...button },
        MuiCard: { ...card },
        MuiAutocomplete: { ...autocomplete },
        MuiMenu: { ...menu },
        MuiInput: { ...input },
        MuiInputLabel: { ...inputLabel },
        MuiOutlinedInput: { ...inputOutlined },
        MuiFormControlLabel: { ...formControlLabel },
        MuiFormLabel: { ...formLabel },
        MuiMenuItem: { ...menuItem },
    },
    typography: {
        ...typography,
    },
});
