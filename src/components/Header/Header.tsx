import { AppBar, CircularProgress, Container, Grid, Hidden, Toolbar, useMediaQuery, useScrollTrigger } from "@mui/material";
import { useTranslation } from "next-i18next";
import dynamic from "next/dynamic";
import Image from "next/image";
import React, { useState } from "react";
import { useSelector } from "react-redux";

import { Box, Button } from "@maysoft/common-component-react";
import PathName from "@src/constants/PathName";
import Resources from "@src/constants/Resources";
import { useAuth } from "@src/providers/authProvider";
import { RootState } from "@src/store";
import MobileMenu from "./MobileMenu";

import Helpers from "@src/commons/helpers";
import Constants from "@src/constants";
import Link from "next/link";
import { useRouter } from "next/router";
import MainNavbar from "./Navbar";

const UserDropdownMenu = dynamic(() => import("./UserDropdownMenu"));

interface IElevationScroll {
    children?: any;
}

const ElevationScroll = (props: IElevationScroll) => {
    const { children } = props;
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,
    });

    return React.cloneElement(children, {
        elevation: trigger ? 2 : 0,
    });
};

export const Header: React.FC<{ iconUrl: string }> = ({ iconUrl }) => {
    const { t } = useTranslation("common");
    const router = useRouter();

    const matches = useMediaQuery("(min-width:1000px)");

    const [loginProcessing, setLoginProcessing] = useState(false);

    const auth = useAuth();

    const handleLogin = async () => {
        const query = router.query;
        delete query?.id;
        const extraUrl = new URLSearchParams(query as any).toString();

        const fromUrl = Helpers.isNullOrEmpty(extraUrl)
            ? window.location.pathname + window.location.search
            : [window.location.pathname, extraUrl].join("?");

        localStorage.setItem(Constants.StorageKeys.FROM, fromUrl);

        setLoginProcessing(true);
        await auth.signinRedirect();
    };

    return (
        <AppBar position="absolute" color="inherit" sx={(theme: any) => ({ background: theme.palette.background.header!, boxShadow: "none" })}>
            <Toolbar sx={{ px: 0 }}>
                <Container maxWidth={false} className="d-flex justify-content-between align-items-center" sx={{ py: 1.75 }}>
                    <Grid container>
                        <Grid item xs={9} lg={2} display={"flex"} alignItems={"center"}>
                            <Hidden lgUp implementation="css">
                                <MobileMenu onLogin={handleLogin} loginProcessing={loginProcessing} />
                            </Hidden>
                            <Link href={PathName.HOME}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        "& img": {
                                            width: "170px",
                                            maxWidth: "200px",
                                            height: "50px",
                                        },
                                    }}
                                >
                                    <Image src={Resources.Icon.APP_LOGO} alt="app logo" width={0} height={0} sizes="100vw" quality={1} />
                                </Box>
                            </Link>
                        </Grid>
                        <Grid
                            item
                            xs={0}
                            lg={8}
                            display={"flex"}
                            marginLeft="auto"
                            marginRight="auto"
                            justifyContent={"center"}
                            alignItems={"center"}
                        >
                            <Hidden lgDown implementation="css">
                                <MainNavbar />
                            </Hidden>
                        </Grid>
                        <Grid item xs={2} display={"flex"} justifyContent={"end"} alignItems={"center"}>
                            <RightNav {...{ loginProcessing, handleLogin }} />
                        </Grid>
                    </Grid>
                </Container>
            </Toolbar>
        </AppBar>
    );
};

const RightNav = ({ loginProcessing, handleLogin }: { loginProcessing: boolean; handleLogin: () => void }) => {
    const {
        t,
        i18n: { language },
    } = useTranslation("common");

    const userInfo = useSelector((state: RootState) => state.userInfo);

    if (Boolean(userInfo?.fetching)) {
        return <CircularProgress size={20} color="info" />;
    }

    if (userInfo?.userProfile.identityId) {
        return (
            <Box sx={{ zIndex: 9999, display: "flex", alignItems: "center", "& .MuiIconButton-root": { p: 0 } }}>
                <UserDropdownMenu />
            </Box>
        );
    }

    return (
        <Button color="info" aria-label="Login" loading={loginProcessing} onClick={handleLogin}>
            {t("menu.login")}
        </Button>
    );
};

export default Header;
