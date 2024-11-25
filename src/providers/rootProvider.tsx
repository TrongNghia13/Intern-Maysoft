import { CommonComponentProvider } from "@maysoft/common-component-react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import Constants from "@src/constants";

import { IV, SECRECT_KEY } from "@src/commons/aesHelpers";
import { RootState } from "@src/store";
import { hideLoading, showLoading, showSnackbar } from "@src/store/slice/common.slice";

interface IProps {
    children: JSX.Element;
    theme: Partial<any>;
}

const RootProvider = (props: IProps) => {
    const {
        i18n: { language },
    } = useTranslation();

    const dispatch = useDispatch();
    const userInfo = useSelector((state: RootState) => state.userInfo);

    return (
        <CommonComponentProvider
            value={{
                theme: props.theme,
                axios: axios,
                userInfo: userInfo,
                language: language || "vi",
                listMultiLanguage: [
                    {
                        code: "vi",
                        name: "Tiếng Việt",
                    },
                    {
                        code: "en",
                        name: "English",
                    },
                ],
                aesIV: IV,
                aesKey: SECRECT_KEY,
                tenantCode: Constants.TENANT_CODE,
                serviceCode: Constants.SERVICE_CODE,
                clientId: process.env.NEXT_PUBLIC_CLIENT_ID || "",
                organizationId: userInfo?.userProfile.organizationId || "0",
                onShowLoading() {
                    dispatch(showLoading());
                },
                onHideLoading() {
                    dispatch(hideLoading());
                },
                onSuccess(msg) {
                    dispatch(showSnackbar({ msg: msg, type: "success" }));
                },
                onError(msg) {
                    dispatch(hideLoading());
                    dispatch(showSnackbar({ msg: msg, type: "error" }));
                },
            }}
        >
            {props.children}
        </CommonComponentProvider>
    );
};

export default RootProvider;
