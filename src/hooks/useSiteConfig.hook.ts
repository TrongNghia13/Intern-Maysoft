import theme from "@src/assets/theme";
import Helpers from "@src/commons/helpers";

import { GlobalStyles } from "@src/constants/global";
import { ISiteConfig } from "./../commons/interfaces";


const useSiteConfig = (siteConfig: ISiteConfig) => {
    const type = siteConfig?.metaData?.["og:type"] || "website";
    const appName = siteConfig?.metaData?.["og:title"] || "Maybaze Travel Corporate";
    const description = siteConfig?.metaData?.["og:description"] || "Maybaze Travel Corporate";
    const faviconUrl = siteConfig?.faviconUrl ? Helpers.getFileAccessUrl(siteConfig?.faviconUrl) : "/favicon.ico";

    const style = siteConfig?.style;

    const baseHeadingProperties = {
        fontFamily: style?.fontFamily || "Roboto Flex",
    };
    const baseProperties = {
        fontFamily: style?.fontFamily || "Roboto Flex",
    };
    const baseDisplayProperties = {
        fontFamily: style?.fontFamily || "Roboto Flex",
    };
    GlobalStyles.PrimaryColor = style?.button.color || "#1A73E8";

    const customTheme: Partial<any> = {
        ...theme,
        palette: {
            ...theme.palette,
            background: {
                ...theme.palette.background,
                header: style?.header?.background || (theme as any).palette.background.header,
                body: style?.body?.background || (theme as any).palette.background.body,
                footer: style?.footer?.background || (theme as any).palette.background.footer,
            },
            link: {
                main: style?.link?.color || theme.palette.link.main,
                focus: style?.link?.focus || theme.palette.link.focus,
            },
            text: {
                ...theme.palette.text,
                main: style?.body?.color || theme.palette.dark.main,
                footer: style?.footer?.color || (theme as any).palette.text.footer,
            },
            heading: {
                main: style?.heading?.color || theme.palette.heading.main,
                focus: style?.heading?.color || theme.palette.heading.focus,
            },
            dark: {
                ...theme.palette.dark,
                main: style?.body?.color || theme.palette.dark.main,
            },
            primary: {
                ...theme.palette.primary,
                main: style?.button?.color || theme.palette.primary.main,
                focus: style?.button?.color || theme.palette.primary.main,
            },
            gradients: {
                ...theme.palette.gradients,
                primary: {
                    main: style?.button?.color || theme.palette.primary.main,
                    state: style?.button?.color || theme.palette.primary.main,
                },
            },
        },
        typography: {
            ...theme.typography,
            fontFamily: baseProperties.fontFamily,

            h1: {
                ...theme.typography.h1,
                ...baseHeadingProperties,
            },

            h2: {
                ...theme.typography.h2,
                ...baseHeadingProperties,
            },

            h3: {
                ...theme.typography.h3,
                ...baseHeadingProperties,
            },

            h4: {
                ...theme.typography.h4,
                ...baseHeadingProperties,
            },

            h5: {
                ...theme.typography.h5,
                ...baseHeadingProperties,
            },

            h6: {
                ...theme.typography.h6,
                ...baseHeadingProperties,
            },

            subtitle1: {
                ...theme.typography.subtitle1,
                fontFamily: baseProperties.fontFamily,
            },

            subtitle2: {
                ...theme.typography.subtitle2,
                fontFamily: baseProperties.fontFamily,
            },

            body1: {
                ...theme.typography.body1,
                fontFamily: baseProperties.fontFamily,
            },

            body2: {
                ...theme.typography.body2,
                fontFamily: baseProperties.fontFamily,
            },

            button: {
                ...theme.typography.button,
                fontFamily: baseProperties.fontFamily,
            },

            caption: {
                ...theme.typography.caption,
                fontFamily: baseProperties.fontFamily,
            },

            overline: {
                fontFamily: baseProperties.fontFamily,
            },

            d1: {
                ...theme.typography.d1,
                ...baseDisplayProperties,
            },

            d2: {
                ...theme.typography.d2,
                ...baseDisplayProperties,
            },

            d3: {
                ...theme.typography.d3,
                ...baseDisplayProperties,
            },

            d4: {
                ...theme.typography.d4,
                ...baseDisplayProperties,
            },

            d5: {
                ...theme.typography.d5,
                ...baseDisplayProperties,
            },

            d6: {
                ...theme.typography.d6,
                ...baseDisplayProperties,
            },
        },
    };

    return {
        appName,
        description,
        type,
        faviconUrl,
        customTheme,
    };
};

export default useSiteConfig;
