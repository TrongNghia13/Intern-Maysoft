import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { PageLoader } from "@src/components";
import { useAuth } from "@src/providers/authProvider";
import { resetUserInfo } from "@src/store/slice/userInfo.slice";
import { NextApplicationPage } from "../_app";

const LogoutRedirectPage: NextApplicationPage = () => {
    const auth = useAuth();
    const dispatch = useDispatch();

    useEffect(() => {
        const handleSignOut = async () => {
            dispatch(resetUserInfo());
            sessionStorage.clear();
            localStorage.clear();
            delete axios.defaults.headers.common["Authorization"];
            await auth.signoutRedirect();
        };
        handleSignOut();
    }, [dispatch]);

    return <PageLoader />;
};

export default LogoutRedirectPage;
