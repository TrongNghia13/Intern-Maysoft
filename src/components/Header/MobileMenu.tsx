import { Box, Button } from "@maysoft/common-component-react";
import { Menu } from "@mui/icons-material";
import { Drawer, Hidden, IconButton, List, ListItem } from "@mui/material";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import Helpers from "@src/commons/helpers";
import Constants from "@src/constants";
import MainMenu from "@src/constants/MainMenu";
import PathName from "@src/constants/PathName";
import { useAuth } from "@src/providers/authProvider";
import { useRouter } from "next/router";
import { drawerStyles, navLink } from "./styles";

interface IProps {
    onLogin: () => void;
    loginProcessing?: boolean;
}

const MobileMenu: React.FC<IProps> = (props: IProps) => {
    const { t } = useTranslation("common");
    const [open, setOpen] = useState(false);
    const auth = useAuth();
    const router = useRouter();

    const pathname = window.location.pathname;
    const result = pathname.split("/");
    let path = result[1];
    if (window.location.pathname.length <= 1) {
        path = "/home";
    }

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setOpen(false);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [open]);

    const handleClose = (event: any) => {
        if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
            return;
        }
        setOpen(false);
    };

    const pathTemp = Helpers.getLocalStorage(Constants.StorageKeys.PATH_NAME_SETTING, PathName.ORGANIZATION);

    return (
        <>
            <IconButton edge="start" onClick={() => setOpen(true)} aria-label="mobile menu">
                <Menu sx={{ color: "#000000" }} />
            </IconButton>
            <Drawer anchor={"left"} open={open} onClose={handleClose}>
                <Box role="presentation" onClick={handleClose} onKeyDown={handleClose} sx={drawerStyles}>
                    <List>
                        {MainMenu.map((item, index) => {
                            const itemPath = item.path && item.path.length <= 1 ? "/home" : item.path;
                            const url = item.key === "setting" ? pathTemp : item.path || "#";

                            return (
                                <ListItem
                                    key={index}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        router.push(url);
                                    }}
                                    sx={(theme) => navLink(theme, { isActive: itemPath?.indexOf(path) !== -1 && path !== "", isMobile: true })}
                                >
                                    <Link href={url}>{t("menu." + item.key)}</Link>
                                </ListItem>
                            );
                        })}
                        {!auth?.user && (
                            <Hidden mdUp implementation="css">
                                <ListItem className="px-3">
                                    <Button color="primary" onClick={props.onLogin} fullWidth loading={props.loginProcessing}>
                                        {t("menu.login")}
                                    </Button>
                                </ListItem>
                            </Hidden>
                        )}
                    </List>
                </Box>
            </Drawer>
        </>
    );
};

export default MobileMenu;
