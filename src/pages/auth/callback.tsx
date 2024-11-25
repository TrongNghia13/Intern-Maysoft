import { useRouter } from "next/router";
import { useEffect } from "react";

import { PageLoader } from "@src/components";
import Constants from "@src/constants";
import PathName from "@src/constants/PathName";
import { useAuth } from "@src/providers/authProvider";
import { NextApplicationPage } from "../_app";

const CallbackPage: NextApplicationPage = () => {
    const router = useRouter();
    const auth = useAuth();

    useEffect(() => {
        const user = auth.user;
        const func = async () => {
            if (user) {
                const from = localStorage.getItem(Constants.StorageKeys.FROM) || PathName.HOME;
                await router.replace(from);
                localStorage.removeItem(Constants.StorageKeys.FROM);
            } else if (user === null) {
                auth.signinRedirect();
            }
        };
        func();
    }, [auth.user]);

    return <PageLoader />;
};

export default CallbackPage;
