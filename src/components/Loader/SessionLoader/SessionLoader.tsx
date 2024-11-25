import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SWRConfig } from "swr";

import Helpers from "@src/commons/helpers";
import Constants from "@src/constants";

import PathName from "@src/constants/PathName";
import { useAuth } from "@src/providers/authProvider";
import { RootState } from "@src/store";
import { storeFirstLogin } from "@src/store/slice/userInfo.slice";
import { PageLoader } from "../PageLoader";

interface IProps {
    requiredAuth?: boolean;
    children: React.ReactNode;
}

export const SessionLoader: React.FC<IProps> = (props: IProps) => {
    const auth = useAuth();
    const router = useRouter();
    const dispatch = useDispatch();
    const userInfo = useSelector((rootState: RootState) => rootState.userInfo);

    useEffect(() => {
        if (router.isReady && router.pathname === PathName.PROFILE && userInfo?.firstLogin) {
            dispatch(storeFirstLogin(false));
        }
    }, [dispatch, router.isReady, router.pathname, userInfo?.firstLogin]);

    if (props.requiredAuth && auth.user === null) {
        localStorage.setItem(Constants.StorageKeys.FROM, window.location.pathname + window.location.search);
        auth.signinRedirect();
        return null;
    }

    // const { data } = useSWR(
    //     ["sessionLoader", { auth, dispatch, userInfo }],
    //     ([_, query]) => {
    //         if (!query?.auth.loading) {
    //             query?.dispatch(onLoadEnd());
    //         }
    //         if (query.auth.user) {
    //             // axios.defaults.headers.common["Authorization"] = "Bearer " + query.auth.user.access_token;
    //             return Boolean(userInfo);
    //         }
    //         return false;
    //     },
    //     {
    //         revalidateOnFocus: false,
    //     }
    // );

    if (!userInfo.fetching && userInfo?.firstLogin === true && !router.pathname.startsWith(PathName.PROFILE)) {
        router.replace(PathName.PROFILE);
        return <PageLoader />;
    }
    if (props.requiredAuth && Helpers.isNullOrEmpty(userInfo?.userProfile?.id)) {
        return <PageLoader />;
    }

    return (
        <SWRConfig
            value={{
                revalidateOnFocus: false,
                onError: (error, key) => {
                    Helpers.handleError(error, router, dispatch);
                },
                onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
                    if (error.status === 401 || error.status === 403 || error.status === 404) return;
                    // Only retry up to 3 times.
                    if (retryCount >= 3) return;
                    // Retry after 5 seconds.
                    setTimeout(() => revalidate({ retryCount }), 5000);
                },
            }}
        >
            {props.children}
        </SWRConfig>
    );
};

export default SessionLoader;
