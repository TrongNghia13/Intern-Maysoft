import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Helpers from "@src/commons/helpers";
import Constants from "@src/constants";
import PathName from "@src/constants/PathName";

import { UserProfileDropdown } from "@maysoft/common-component-react";
import { useAuth } from "@src/providers/authProvider";
import { RootState } from "@src/store";
import { hideLoading, showLoading } from "@src/store/slice/common.slice";
import { fetchUserInfo } from "@src/store/slice/userInfo.slice";

const UserDropdownMenu: React.FC = () => {
    const { t } = useTranslation("common");

    const auth = useAuth();
    const router = useRouter();
    const dispatchRedux = useDispatch();

    const userProfile = useSelector((state: RootState) => state.userInfo.userProfile);

    const anchorEl = useRef<HTMLButtonElement>(null);
    const [openDropDown, setOpenDropDown] = useState<any>(false);

    useEffect(() => {
        // const handleSetOpenMenu = () => { setOpenDropDown(anchorEl.current) };

        // __EventEmitter.addListener(Constants.EventName.CHOOSE_ORGANIZATION, handleSetOpenMenu);

        // return () => {
        //     __EventEmitter.removeListener(Constants.EventName.CHOOSE_ORGANIZATION, handleSetOpenMenu);
        // };
    }, []);

    const handleSwitchAccount = async () => {
        await auth.onSwitchAccount();
    };

    const handleLogout = () => {
        Helpers.showConfirmAlert(t("message.confirm_logout"), async () => {
            await auth.signoutRedirect();
        });
    };

    const handleChangeOrganization = (orgId: string) => {
        dispatchRedux(showLoading());

        Helpers.setLocalStorage(Constants.StorageKeys.ORGANIZATION_ID, orgId || "");

        dispatchRedux(fetchUserInfo());

        dispatchRedux(hideLoading());
    };

    if (!userProfile?.id) {
        return null;
    }

    return (
        <>
            <UserProfileDropdown
                light
                anchorEl={anchorEl}

                isCorporateMode

                openDropDown={openDropDown}
                setOpenDropDown={setOpenDropDown}

                pathNameProfile={PathName.PROFILE}
                onNavigate={(pathName) => { router.push(pathName || "#"); }}

                onLogout={() => { handleLogout(); }}
                onChangeOrganization={(orgId) => {
                    handleChangeOrganization(orgId);
                }}
                onSubmitManageOrganization={() => {
                    Helpers.setLocalStorage(Constants.StorageKeys.ORGANIZATION_ID, userProfile?.organizationId || "");
                    dispatchRedux(fetchUserInfo());
                }}

                lableOrganization={"Công ty"}
                hidenItemDropDown={{
                    itemManagementOrganization: true
                }}

            // listItemDropDown={[
            //     {
            //         icon: <Link />,
            //         title: t("menu.switch_account"),
            //         onCallBack: () => handleSwitchAccount(),
            //     }
            // ]}
            />
        </>
    );
};

export default UserDropdownMenu;
