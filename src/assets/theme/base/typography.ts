import colors from "src/assets/theme/base/colors";

import pxToRem from "src/assets/theme/functions/pxToRem";

const { dark } = colors;

interface DisplayTypes {
    fontFamily: string;
    color: string;
    fontWeight: number;
    lineHeight: number;
    fontSize: string;
}

interface Types {
    fontFamily: string;
    fontWeightLight: number;
    fontWeightRegular: number;
    fontWeightMedium: number;
    fontWeightBold: number;
    h1: {
        fontFamily: string;
        fontSize: string;
        fontWeight: number;
        color: string;
        lineHeight: number;
    };
    h2: {
        fontFamily: string;
        fontSize: string;
        fontWeight: number;
        color: string;
        lineHeight: number;
    };
    h3: {
        fontFamily: string;
        fontSize: string;
        fontWeight: number;
        color: string;
        lineHeight: number;
    };
    h4: {
        fontFamily: string;
        fontSize: string;
        fontWeight: number;
        color: string;
        lineHeight: number;
    };
    h5: {
        fontFamily: string;
        fontSize: string;
        fontWeight: number;
        color: string;
        lineHeight: number;
    };
    h6: {
        fontFamily: string;
        fontSize: string;
        fontWeight: number;
        color: string;
        lineHeight: number;
    };
    subtitle1: {
        fontFamily: string;
        fontSize: string;
        fontWeight: number;
        lineHeight: number;
    };
    subtitle2: {
        fontFamily: string;
        fontSize: string;
        fontWeight: number;
        lineHeight: number;
    };
    body1: {
        fontFamily: string;
        fontSize: string;
        fontWeight: number;
        lineHeight: number;
    };
    body2: {
        fontFamily: string;
        fontSize: string;
        fontWeight: number;
        lineHeight: number;
    };
    button: {
        fontFamily: string;
        fontSize: string;
        fontWeight: number;
        lineHeight: number;
        textTransform: any;
    };
    caption: {
        fontFamily: string;
        fontSize: string;
        fontWeight: number;
        lineHeight: number;
    };
    overline: {
        fontFamily: string;
    };
    d1: DisplayTypes;
    d2: DisplayTypes;
    d3: DisplayTypes;
    d4: DisplayTypes;
    d5: DisplayTypes;
    d6: DisplayTypes;
    size: {
        xxs: string;
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
        "2xl": string;
        "3xl": string;
    };
    lineHeight: {
        sm: number;
        md: number;
        lg: number;
    };
}

const baseProperties = {
    fontFamily: "Public Sans",
    fontWeightLight: 400,
    fontWeightRegular: 400,
    fontWeightMedium: 600,
    fontWeightBold: 700,
    fontSizeXXS: pxToRem(10.4),
    fontSizeXS: pxToRem(12),
    fontSizeSM: pxToRem(14),
    fontSizeMD: pxToRem(14),
    fontSizeLG: pxToRem(18),
    fontSizeXL: pxToRem(20),
    fontSize2XL: pxToRem(24),
    fontSize3XL: pxToRem(30),
};

const baseHeadingProperties = {
    fontFamily: baseProperties.fontFamily,
    color: dark.main,
    fontWeight: baseProperties.fontWeightBold,
};

const baseDisplayProperties = {
    fontFamily: baseProperties.fontFamily,
    color: dark.main,
    fontWeight: baseProperties.fontWeightLight,
    lineHeight: 1.2,
};

const typography: Types = {
    fontFamily: baseProperties.fontFamily,
    fontWeightLight: baseProperties.fontWeightLight,
    fontWeightRegular: baseProperties.fontWeightRegular,
    fontWeightMedium: baseProperties.fontWeightMedium,
    fontWeightBold: baseProperties.fontWeightBold,

    h1: {
        fontSize: pxToRem(48),
        lineHeight: 1.25,
        ...baseHeadingProperties,
    },

    h2: {
        fontSize: pxToRem(36),
        lineHeight: 1.3,
        ...baseHeadingProperties,
    },

    h3: {
        fontSize: pxToRem(30),
        lineHeight: 1.375,
        ...baseHeadingProperties,
    },

    h4: {
        fontSize: pxToRem(24),
        lineHeight: 1.375,
        ...baseHeadingProperties,
    },

    h5: {
        fontSize: pxToRem(20),
        lineHeight: 1.375,
        ...baseHeadingProperties,
    },

    h6: {
        fontSize: pxToRem(16),
        lineHeight: 1.625,
        ...baseHeadingProperties,
    },

    subtitle1: {
        fontFamily: baseProperties.fontFamily,
        fontSize: baseProperties.fontSizeXL,
        fontWeight: baseProperties.fontWeightLight,
        lineHeight: 1.625,
    },

    subtitle2: {
        fontFamily: baseProperties.fontFamily,
        fontSize: baseProperties.fontSizeMD,
        fontWeight: baseProperties.fontWeightLight,
        lineHeight: 1.6,
    },

    body1: {
        fontFamily: baseProperties.fontFamily,
        fontSize: baseProperties.fontSizeXL,
        fontWeight: baseProperties.fontWeightRegular,
        lineHeight: 1.625,
    },

    body2: {
        fontFamily: baseProperties.fontFamily,
        fontSize: baseProperties.fontSizeMD,
        fontWeight: baseProperties.fontWeightLight,
        lineHeight: 1.6,
    },

    button: {
        fontFamily: baseProperties.fontFamily,
        fontSize: baseProperties.fontSizeSM,
        fontWeight: baseProperties.fontWeightLight,
        lineHeight: 1.5,
        textTransform: "uppercase",
    },

    caption: {
        fontFamily: baseProperties.fontFamily,
        fontSize: baseProperties.fontSizeXS,
        fontWeight: baseProperties.fontWeightLight,
        lineHeight: 1.25,
    },

    overline: {
        fontFamily: baseProperties.fontFamily,
    },

    d1: {
        fontSize: pxToRem(80),
        ...baseDisplayProperties,
    },

    d2: {
        fontSize: pxToRem(72),
        ...baseDisplayProperties,
    },

    d3: {
        fontSize: pxToRem(64),
        ...baseDisplayProperties,
    },

    d4: {
        fontSize: pxToRem(56),
        ...baseDisplayProperties,
    },

    d5: {
        fontSize: pxToRem(48),
        ...baseDisplayProperties,
    },

    d6: {
        fontSize: pxToRem(40),
        ...baseDisplayProperties,
    },

    size: {
        xxs: baseProperties.fontSizeXXS,
        xs: baseProperties.fontSizeXS,
        sm: baseProperties.fontSizeSM,
        md: baseProperties.fontSizeMD,
        lg: baseProperties.fontSizeLG,
        xl: baseProperties.fontSizeXL,
        "2xl": baseProperties.fontSize2XL,
        "3xl": baseProperties.fontSize3XL,
    },

    lineHeight: {
        sm: 1.25,
        md: 1.5,
        lg: 2,
    },
};

export default typography;
