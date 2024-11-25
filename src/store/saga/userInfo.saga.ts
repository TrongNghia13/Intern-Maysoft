import Constants from "@src/constants";
import Helpers from "@src/commons/helpers";
import PathName from "@src/constants/PathName";
import ProfileService from "@src/services/identity/ProfileService";

import { call, put, takeLatest } from "redux-saga/effects";
import { GroupUserDefault, OrganizationType } from "@src/commons/enum";
import { RoleHelpers, RoleLevel, RoleType } from "@maysoft/common-component-react";
import { ICodename, IGroupUser, IOrganizationUserProfile, IUserAuthorization, IUserInfo } from "@src/commons/interfaces";
import { UserInfoState, UserProfile, fetchUserInfo, fetchUserInfoFailed, fetchUserInfoSuccess } from "../slice/userInfo.slice";



const ROLE_DEFAULT = RoleType.Normal | RoleType.Member;

function* fetchingUser() {
    try {
        // const oldState: UserInfoState = yield select(state => state.userInfo);
        // if (oldState?.userProfile?.id) {
        //     yield put(fetchUserInfoSuccess(undefined));
        //     return;
        // }

        let organizationId = Helpers.getLocalStorage(Constants.StorageKeys.ORGANIZATION_ID, "");

        const resultProfile: IUserInfo = yield call(ProfileService.getUserInfo);

        let organizationType = OrganizationType.Normal;

        const currentServiceOrganizations =
            [...(resultProfile?.currentServiceOrganizations || [])].filter((el) => el.tenantCode === Constants.TENANT_CODE) || [];
        if (currentServiceOrganizations.length > 0) {
            const itemFirst = currentServiceOrganizations?.[0];
            const index = currentServiceOrganizations?.findIndex((el) => el.id === organizationId);
            if (index === -1 && organizationId !== "0") {
                organizationId = itemFirst?.id;
                organizationType = itemFirst?.type;
            }
        } else {
            organizationId = "0";
        }

        const userAuthorization: IUserAuthorization = yield call(
            ProfileService.getUserAuthorization,
            organizationId === "0" ? undefined : organizationId
        );

        let currency: string = "";
        let itemGroupDefaul: IGroupUser | undefined;

        let itemOrganizationUserProfile: IOrganizationUserProfile | undefined = [...(resultProfile.organizationUserProfiles || [])]?.find(
            (item) => item.organizationId === organizationId
        );

        let itemUserAuthorizationResponse = {
            roleCode: "",
            roleType: ROLE_DEFAULT,
            roleLevel: RoleLevel.Default,
            roleName: "Organization Member",
        } as any;

        if ([...userAuthorization?.userAuthorizationResponse || []].length > 0) {
            itemUserAuthorizationResponse = [...userAuthorization?.userAuthorizationResponse || []].reduce(
                (acc, curr) => {
                    return (Number(acc.roleLevel) < Number(curr.roleLevel)) ? acc : curr;
                },
                [...userAuthorization?.userAuthorizationResponse || []][0]
            );
        }

        let listOrganization: ICodename[] = currentServiceOrganizations?.map((e) => {
            if (e.id === organizationId) {
                currency = e.currency;
                organizationType = e.type;
            }
            return {
                code: e.id,
                name: Helpers.getDefaultValueMultiLanguage(e.name, "vi") || "",
                detail: {
                    gene: e.gene,
                    type: e.type,
                    organizationCode: e.organizationCode,
                },
            } as ICodename;
        });

        let listGroup: ICodename[] = [...(resultProfile.groupUsers || [])]?.map((item) => {
            if (item.default === GroupUserDefault.Default && item.organizationId === organizationId) {
                itemGroupDefaul = item;
            }

            return {
                code: item.groupId,
                name: Helpers.getDefaultValueMultiLanguage(item.groupName, "vi") || "",
                detail: {
                    gene: item.groupGene,
                    group: item.organizationId,
                },
            } as ICodename;
        });

        if (Helpers.isNullOrEmpty(currency)) {
            currency = resultProfile?.defaultCurrency || Constants.CURRENCY_DEFAULT;
        }

        const resourceCodes = [...(userAuthorization?.roleResourcePermissions || [])]?.map((item: any) => {
            return { resourceURI: item.resourceURI, permission: item.permission };
        });

        const resourceMenu: string[] = userAuthorization?.menus || [];

        let propsTemp: any = {
            email: resultProfile?.userProfile?.email,
            gender: resultProfile?.userProfile?.gender,
            birthDate: resultProfile?.userProfile?.birthDate,
            phoneNumber: resultProfile?.userProfile?.phoneNumber,
            fullName: resultProfile?.userProfile?.fullName || resultProfile?.userProfile?.email,
            status: resultProfile?.userProfile?.status || 0,
        };

        if (itemOrganizationUserProfile) {
            const fullName = `${itemOrganizationUserProfile?.lastName || ""} ${itemOrganizationUserProfile?.firstName || ""}`.trim();

            propsTemp = {
                email: itemOrganizationUserProfile?.email || "",
                gender: itemOrganizationUserProfile?.gender || 0,
                fullName: fullName || itemOrganizationUserProfile?.email,
                birthDate: itemOrganizationUserProfile?.dateOfBirth || 0,
                phoneNumber: itemOrganizationUserProfile?.phoneNumber || "",
                employmentDate: itemOrganizationUserProfile?.employmentDate,
                idCardNo: itemOrganizationUserProfile?.idCardNo,
                idCardIssuedDate: itemOrganizationUserProfile?.idCardIssuedDate,
                idCardIssuedPlace: itemOrganizationUserProfile?.idCardIssuedPlace,
                socialInsuranceCode: itemOrganizationUserProfile?.socialInsuranceCode,
                passportNo: itemOrganizationUserProfile?.passportNo,
                nationality: itemOrganizationUserProfile?.nationality || "",
                passportExpiredDate: itemOrganizationUserProfile?.passportExpiredDate,
                passportIssuedPlace: itemOrganizationUserProfile?.passportIssuedPlace,

                status: itemOrganizationUserProfile?.activeStatus || 0,
            }
        }

        const userProfile: UserProfile = {
            id: itemOrganizationUserProfile?.id || resultProfile?.userProfile?.id, //Son le 
            organizationId: (organizationId === "0") ? "" : organizationId,
            groupId: itemGroupDefaul?.groupId ?? "",
            organizationType: organizationType,

            roleCode: itemUserAuthorizationResponse?.roleCode || "",
            roleName: itemUserAuthorizationResponse?.roleName || "Default",
            roleType: itemUserAuthorizationResponse?.roleType ?? ROLE_DEFAULT,
            roleLevel: itemUserAuthorizationResponse?.roleLevel ?? RoleLevel.Default,

            userName: resultProfile?.userProfile?.userName || "",
            avatarId: resultProfile?.userProfile?.avatarId || "",
            avatarUrl: resultProfile?.userProfile?.avatarUrl || "",
            identityId: resultProfile?.userProfile?.identityId || "",

            ...propsTemp,

            currency,

            location: resultProfile?.userProfile?.location || "VN",
        };

        const menuSetting = [...userAuthorization?.menuDetails || []].find(el => (el.resourceURI === Constants.MenuResourceURI.SETTING));

        if (menuSetting) {
            const listP = [...userAuthorization?.menuDetails || []].filter(el => (
                (el.gene.startsWith(menuSetting.gene) && !Helpers.isNullOrEmpty(el.externalUrl))
            ));

            const pathNameSetting = listP[0]?.externalUrl;

            Helpers.setLocalStorage(Constants.StorageKeys.PATH_NAME_SETTING, pathNameSetting);
        } else {
            Helpers.setLocalStorage(Constants.StorageKeys.PATH_NAME_SETTING, "");
        }

        const result: UserInfoState = {
            listGroup,
            userProfile,
            resourceMenu,
            resourceCodes,
            listOrganization,
            menuDetails: [...userAuthorization?.menuDetails || []],
            firstLogin: resultProfile?.firstLogin,
        };

        Helpers.setLocalStorage(Constants.StorageKeys.ORGANIZATION_ID, organizationId || "");

        yield put(fetchUserInfoSuccess(result));
    } catch (error) {
        yield put(fetchUserInfoFailed());
    }
}

export default function* userInfoSaga() {
    yield takeLatest(fetchUserInfo().type, fetchingUser);
}
