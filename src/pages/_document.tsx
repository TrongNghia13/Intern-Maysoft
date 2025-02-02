import Document, { Head, Html, Main, NextScript } from "next/document";

import createEmotionServer from "@emotion/server/create-instance";
import createEmotionCache from "@src/commons/createEmotionCache";
import nextI18nConfig from "../../next-i18next.config";

export default class MyDocument extends Document {
    render() {
        const currentLocale = this.props.__NEXT_DATA__.locale || nextI18nConfig.i18n.defaultLocale;

        // const appName = this.props?.siteConfig?.metaData?.["og:title"] || "Maybaze Travel Corporate";
        // const description = this.props?.siteConfig?.metaData?.["og:description"] || "Maybaze Travel Corporate";
        // const type = this.props?.siteConfig?.metaData?.["og:type"] || "website";
        // const faviconUrl = this.props?.siteConfig?.faviconUrl || "/favicon.ico";

        return (
            <Html lang={currentLocale}>
                <Head>
                    <meta name="theme-color" content="#FFFFFF" />
                    <link rel="icon" href="/favicon.ico" />
                    <link rel="shortcut icon" href="/favicon.ico" />
                    <link rel="stylesheet" href="/assets/css/common.css" />
                    <link rel="stylesheet" href="/assets/css/muiIcon.css" />
                    <meta name="emotion-insertion-point" content="" />
                    {/* Inject MUI styles first to match with the prepend: true configuration. */}
                    {(this.props as any).emotionStyleTags}
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it"s compatible with static-site generation (SSG).
MyDocument.getInitialProps = async (ctx) => {
    // Resolution order
    //
    // On the server:
    // 1. app.getInitialProps
    // 2. page.getInitialProps
    // 3. document.getInitialProps
    // 4. app.render
    // 5. page.render
    // 6. document.render
    //
    // On the server with error:
    // 1. document.getInitialProps
    // 2. app.render
    // 3. page.render
    // 4. document.render
    //
    // On the client
    // 1. app.getInitialProps
    // 2. page.getInitialProps
    // 3. app.render
    // 4. page.render

    const originalRenderPage = ctx.renderPage;

    // You can consider sharing the same emotion cache between all the SSR requests to speed up performance.
    // However, be aware that it can have global side effects.
    const cache = createEmotionCache();
    const { extractCriticalToChunks } = createEmotionServer(cache);

    ctx.renderPage = () =>
        originalRenderPage({
            enhanceApp: (App: any) =>
                function EnhanceApp(props) {
                    return <App emotionCache={cache} hostname={ctx?.req?.headers.host} {...props} />;
                },
        });

    const initialProps = await Document.getInitialProps(ctx);
    // This is important. It prevents emotion to render invalid HTML.
    // See https://github.com/mui-org/material-ui/issues/26561#issuecomment-855286153
    const emotionStyles = extractCriticalToChunks(initialProps.html);
    const emotionStyleTags = emotionStyles.styles.map((style) => (
        <style
            data-emotion={`${style.key} ${style.ids.join(" ")}`}
            key={style.key}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: style.css }}
        />
    ));

    return {
        ...initialProps,
        emotionStyleTags,
    };
};
