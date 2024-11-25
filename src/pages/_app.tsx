import { CacheProvider, EmotionCache } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { NextPage } from "next";
import { UserConfig, appWithTranslation } from "next-i18next";
import App, { AppProps } from "next/app";
import dynamic from "next/dynamic";
import Head from "next/head";
import { ReactElement, ReactNode } from "react";
import { Provider as StateProvider } from "react-redux";

import createEmotionCache from "@src/commons/createEmotionCache";
import Helpers from "@src/commons/helpers";
import { PageLoading, Snackbar } from "@src/components";
import Constants from "@src/constants";
import useSiteConfig from "@src/hooks/useSiteConfig.hook";
import RootProvider from "@src/providers/rootProvider";
import nextI18nConfig from "../../next-i18next.config";

import { MayworkCommonProvider } from "@maysoft/maywork-common-react";
import { ISiteConfig } from "@src/commons/interfaces";
import { MaterialUIControllerProvider } from "@src/context/muiContext";
import { MainLayout } from "@src/layout";
import { AuthProvider } from "@src/providers/authProvider";
import { store } from "@src/store";

import "@src/styles/calendarDefault.css";
import "@src/styles/calendarStyles.css";
import "@src/styles/utilities.css";
import "@src/styles/globals.css";

import "react-datepicker/dist/react-datepicker.min.css";

import "@maysoft/common-component-react/dist/index.css";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const SessionLoader = dynamic(
  () => import("@src/components/Loader/SessionLoader/SessionLoader"),
  { ssr: false }
);

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export type NextApplicationPage<P = any, IP = P> = NextPage<P, IP> & {
  requiredAuth?: boolean;
  requiredMainlayout?: boolean;
  requiredSettinglayout?: boolean;
  getLayout?: (page: ReactElement) => ReactNode;
};

interface MyAppProps extends AppProps {
  hostname: string;
  siteConfig: ISiteConfig;
  emotionCache?: EmotionCache;
}

const MyApp = (props: MyAppProps) => {
  const {
    siteConfig,
    hostname,
    emotionCache = clientSideEmotionCache,
    pageProps: { session, ...pageProps },
  } = props;

  const Component: NextApplicationPage = props.Component;

  const getLayout = !Helpers.isNullOrEmpty(Component.getLayout)
    ? Component.getLayout
    : Component.requiredMainlayout === false
      ? (page: ReactElement) => <>{page}</>
      : (page: ReactElement) => (
          <MainLayout
            iconUrl={siteConfig?.logoUrl}
            requiredSettinglayout={Component.requiredSettinglayout}
          >
            {page}
          </MainLayout>
        );

  const origin = !Helpers.isServerside() ? window.location.origin : "";

  pageProps.siteConfig = siteConfig;

  const { appName, description, type, faviconUrl, customTheme } =
    useSiteConfig(siteConfig);

  return (
    <StateProvider store={store}>
      <GoogleOAuthProvider clientId={Constants.GOOGLE_API.CLIENT_ID}>
        <AuthProvider hostname={hostname}>
          <CacheProvider value={emotionCache}>
            <Head>
              {/* <title>Booking-Corporate</title> */}
              <title>BiziTrip - Trip wiser Cost Saver</title>
              <meta
                name="viewport"
                content="initial-scale=1, width=device-width"
              />

              <meta property="og:type" content={type || "website"} />
              <meta
                property="og:title"
                content={appName || "booking-corporate"}
              />
              <meta
                property="og:url"
                content={origin || "https://demo.deeptech.vn/"}
              />
              <meta
                property="og:description"
                content={description || "booking-corporate"}
              />

              <link rel="icon" href={faviconUrl || "/favicon.ico"} />
              <link rel="shortcut icon" href={faviconUrl || "/favicon.ico"} />
            </Head>
            <ThemeProvider theme={customTheme}>
              <MaterialUIControllerProvider>
                <CssBaseline />
                <PageLoading />
                <Snackbar />
                <SessionLoader requiredAuth={Component.requiredAuth}>
                  <RootProvider theme={customTheme}>
                    <MayworkCommonProvider theme={customTheme}>
                      <>{getLayout(<Component {...pageProps} />)}</>
                    </MayworkCommonProvider>
                  </RootProvider>
                </SessionLoader>
              </MaterialUIControllerProvider>
            </ThemeProvider>
          </CacheProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </StateProvider>
  );
};

const siteConfig: ISiteConfig = {
  title: {
    value: {
      vi: "Booking-Corporate",
      en: "Booking-Corporate",
    },
  },
  description: {
    value: {
      vi: "Booking-Corporate",
      en: "Booking-Corporate",
    },
  },
  metaData: {
    "og:title": "Booking-Corporate",
    "og:type": "Booking-Corporate",
    "og:url": "",
    "og:description": "Booking-Corporate",
  },
  bannerUrl:
    "https://scontent.fsgn5-10.fna.fbcdn.net/v/t39.30808-6/306101408_462785629225441_2867307756415786811_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=5f2048&_nc_ohc=Kg-Wo4SK-qQAX-Q0kM_&_nc_ht=scontent.fsgn5-10.fna&_nc_e2o=f&oh=00_AfDhFSw-ulZ3JtRXu8OKz38yjshLWkTQAkQ_6071fMyfOg&oe=652CAF2E",
  logoUrl:
    "https://scontent.fsgn5-10.fna.fbcdn.net/v/t39.30808-6/306101408_462785629225441_2867307756415786811_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=5f2048&_nc_ohc=Kg-Wo4SK-qQAX-Q0kM_&_nc_ht=scontent.fsgn5-10.fna&_nc_e2o=f&oh=00_AfDhFSw-ulZ3JtRXu8OKz38yjshLWkTQAkQ_6071fMyfOg&oe=652CAF2E",
  faviconUrl:
    "https://scontent.fsgn5-10.fna.fbcdn.net/v/t39.30808-6/306101408_462785629225441_2867307756415786811_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=5f2048&_nc_ohc=Kg-Wo4SK-qQAX-Q0kM_&_nc_ht=scontent.fsgn5-10.fna&_nc_e2o=f&oh=00_AfDhFSw-ulZ3JtRXu8OKz38yjshLWkTQAkQ_6071fMyfOg&oe=652CAF2E",
  style: {
    fontFamily: "Public Sans",
    header: {
      // background: "rgb(248, 249, 250)",
      // background: "#000e36",
      background: "tranparent",
      color: "#000000",
    },
    body: {
      background: "transparent",
      color: "#000000",
    },
    footer: {
      background: "#f0f2f5",
      color: "#000000",
    },
    link: {
      color: "#000000",
      focus: "#1A73E8",
    },
    heading: {
      color: "#000000",
    },
    subtitle: {
      color: "#000000",
    },
    button: {
      color: "#005efe",
    },
  },
};

MyApp.getInitialProps = async (ctx: any) => {
  const initialProps = await App.getInitialProps(ctx);
  try {
    // const result = (await AppService.getDetail("532405410372599808")) || null;

    // let host = ctx?.req.headers.host; // will give you localhost:3000

    const result = {
      name: {
        value: {
          vi: "Maybaze Travel Corporate",
          en: "Maybaze Travel Corporate",
        },
      },
      description: {
        value: {
          vi: "............................",
          en: "............................",
        },
      },
    };
    // const setting = {} as any;
    // const setting: ISiteConfig = JSON.parse(result.setting);
    // const siteConfig: ISiteConfig = {
    //     title: result.name,
    //     description: result.description,
    //     metaData: setting?.metaData,
    //     logoUrl: setting?.logoUrl,
    //     faviconUrl: setting?.faviconUrl,
    //     bannerUrl: setting?.bannerUrl,
    //     style: setting?.style,
    // };

    return { ...initialProps, siteConfig };
  } catch (error) {
    return { ...initialProps };
  }
};

export default appWithTranslation(MyApp, nextI18nConfig as UserConfig);
