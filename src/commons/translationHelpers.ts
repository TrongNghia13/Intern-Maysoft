import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18nConfig from "../../next-i18next.config";
import { UserConfig } from "next-i18next";
import { GetStaticPropsContext } from "next";


export const makeServerSideTranslations = (locale?: string, namespace?: string[]) => {
    return serverSideTranslations(
        locale || "vi",
        ["common"].concat(namespace || []),
        nextI18nConfig as UserConfig
    )
}

export const getServerSideTranslationsProps = (namespace?: string[]) =>
    async (context: GetStaticPropsContext) => ({
        props: {
            ...(await makeServerSideTranslations(context.locale, namespace))
        },
    })