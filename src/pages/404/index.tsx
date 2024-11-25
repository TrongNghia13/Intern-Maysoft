import Head from "next/head";
import { NextPage } from "next";
import { useTranslation } from "next-i18next";
import { Box, Button } from "@maysoft/common-component-react";

import PathName from "@src/constants/PathName";

import { BaseLayout } from "@src/layout";
import { getServerSideTranslationsProps } from "@src/commons/translationHelpers";

export const getStaticProps = getServerSideTranslationsProps(["error"]);

const PageNotFound: NextPage = () => {
    const { t } = useTranslation("error");
    return (
        <>
            <Head>
                <title>Page Not Found | Maybaze Travel Corporate</title>
            </Head>
            <BaseLayout>
                <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" minHeight="50vh">
                    <h1>{t("404_title")}</h1>
                    <Button className="mt-3" variant="contained" size="large" color="primary" href={PathName.HOME}>
                        {t("go_home")}
                    </Button>
                </Box>
            </BaseLayout>
        </>
    );
};

export default PageNotFound;
