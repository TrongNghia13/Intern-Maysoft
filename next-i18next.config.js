const isDev = process.env.NODE_ENV === "development";

module.exports = {
    debug: isDev,
    i18n: {
        defaultLocale: "vi",
        locales: ["vi", "en"],
        localeDetection: false,
    },
    defaultNS: "common",
    serializeConfig: false,
    reloadOnPrerender: isDev,
};