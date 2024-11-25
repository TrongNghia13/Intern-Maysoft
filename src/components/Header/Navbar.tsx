import React from "react";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { Box, Typography } from "@maysoft/common-component-react";

import { navLink } from "./styles";
import Constants from "@src/constants";
import Helpers from "@src/commons/helpers";
import PathName from "@src/constants/PathName";
import MainMenu from "@src/constants/MainMenu";

const MainNavbar: React.FC = () => {
    const { t } = useTranslation("common");

    const pathname = window.location.pathname;
    const result = pathname.split("/");
    let path = result[1];

    if (window.location.pathname.length <= 1) {
        path = "/home";
    }

    const pathTemp = Helpers.getLocalStorage(Constants.StorageKeys.PATH_NAME_SETTING, PathName.ORGANIZATION);

    return (
        <Box display="flex">
            <Box display="flex" alignItems="center" gap={3}>
                {MainMenu.map((item, index) => {
                    const itemPath = item.path && item.path.length <= 1 ? "/home" : item.path;

                    return (
                        <Box key={index} sx={(theme) => navLink(theme, { isActive: itemPath?.indexOf(path) !== -1 && path !== "", isMobile: false })}>
                            <Link href={item.key === "setting" ? pathTemp : item.path}>{t("menu." + item.key)}</Link>
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
};

export default MainNavbar;
