import { useTranslation } from "react-i18next";

import Constants from "@src/constants";
import Helpers from "@src/commons/helpers";
import UserService from "@src/services/identity/UserService";
import GroupService from "@src/services/identity/GroupService";

import { ICodename } from "@src/commons/interfaces";
import { GroupType, NotifyTarget, TimerangeBudget } from "@src/commons/enum";
import { IRecordUserProps } from "@src/components/BudgetPlan/detailNotifyTarget";



const useDataBudgetPlan = () => {
    const {
        t,
        i18n: { language },
    } = useTranslation(["common", "setting"]);

    const listTimerangeBudget: ICodename[] = [
        { code: TimerangeBudget.Monthly, name: t("setting:budget.monthly"), },
        { code: TimerangeBudget.Quarterly, name: t("setting:budget.quarterly"), },
        { code: TimerangeBudget.Yearly, name: t("setting:budget.yearly"), },
        { code: TimerangeBudget.CustomRange, name: t("setting:budget.custom"), },
    ];

    const listNotifyTarget: ICodename[] = [
        { code: NotifyTarget.Owner, name: t("setting:budget.owner"), },
        { code: NotifyTarget.GroupAdmin, name: t("setting:budget.group_admin"), },
        { code: NotifyTarget.Custom, name: t("setting:budget.custom"), }
    ];

    const listPercentAlert: ICodename[] = [
        { code: "0.9", name: t("setting:budget.spend_up_to_of_budget", { percent: "90%" }), },
        { code: "0.75", name: t("setting:budget.spend_up_to_of_budget", { percent: "75%" }), },
        { code: "0.5", name: t("setting:budget.spend_up_to_of_budget", { percent: "50%" }), },
        { code: "0.25", name: t("setting:budget.spend_up_to_of_budget", { percent: "25%" }), },
        { code: "0", name: t("setting:budget.no_need_receive_notifications"), },
    ];

    const getAllGroup = async (organizationId: string) => {
        try {
            const listGroupTemp: ICodename[] = [];

            const resultGetAllGroup = await GroupService.getAll(Helpers.handleFormatParams({
                listStatus: [1],
                clientId: Constants.CLIENT_ID,
                organizationId: organizationId,
            }));

            [...resultGetAllGroup || []].forEach((item: any) => {
                if (Number(item.detail?.type) !== GroupType.Company) {
                    listGroupTemp.push({
                        code: item.id,
                        name: Helpers.getDefaultValueMultiLanguage(item.name, language),
                    });
                }
            });

            return listGroupTemp;
        } catch (error) {
            return [];
        }
    };

    const getUserProfileByListID = async (ids: string[], organizationId: string) => {
        try {

            const result = await UserService.getPaged({
                pageNumber: 1,
                pageSize: ids.length,
                listStatus: [1],
                selectedIds: ids,
                clientId: Constants.CLIENT_ID,
                organizationId: organizationId,
            });

            const newData: IRecordUserProps[] = [];
            [...result.items || []].forEach(el => {
                if (ids.includes(el.id)) {
                    let fullName = el.fullName || el.userName;
                    if (!Helpers.isNullOrEmpty(el.organizationUserProfile?.firstName)
                        || !Helpers.isNullOrEmpty(el.organizationUserProfile?.lastName)) {
                        fullName = `${el.organizationUserProfile?.lastName || ""} ${el.organizationUserProfile?.firstName || ""}`;
                    }

                    newData.push({
                        id: el.id,
                        avatarId: el.avatarId,
                        avatarUrl: el.avatarUrl,
                        userCode: el.organizationUserProfile?.userCode,
                        email: el.organizationUserProfile?.email || el.email,
                        fullName: fullName,
                        phoneNumber: el.organizationUserProfile?.phoneNumber || el.phoneNumber,
                    });
                }
            });
            return newData;
        } catch (error) {
            return [];
        }
    };

    const getMapUserProfileByListID = async (ids: string[], organizationId: string) => {
        try {

            const result = await UserService.getPaged({
                pageNumber: 1,
                pageSize: ids.length,
                listStatus: [1],
                selectedIds: ids,
                clientId: Constants.CLIENT_ID,
                organizationId: organizationId,
            });

            const newData: Map<string, {
                id: string,
                fullName: string,
                avatarUrl: string,
            }> = new Map();

            [...result.selectedItems || []].forEach(el => {
                let fullName = el.fullName || el.userName;
                if (!Helpers.isNullOrEmpty(el.organizationUserProfile?.firstName)
                    || !Helpers.isNullOrEmpty(el.organizationUserProfile?.lastName)) {
                    fullName = `${el.organizationUserProfile?.lastName || ""} ${el.organizationUserProfile?.firstName || ""}`;
                }

                newData.set(el.id, {
                    id: el.id,
                    fullName: fullName,
                    avatarUrl: el.avatarUrl,
                });
            });

            return newData;

        } catch (error) { return new Map(); }
    };

    const getMapGroupByListID = async (ids: string[], organizationId: string) => {
        try {
            const resultGetAllGroup = await GroupService.getAll(Helpers.handleFormatParams({
                listStatus: [1],
                clientId: Constants.CLIENT_ID,
                organizationId: organizationId,
            }));

            const newData: Map<string, any> = new Map();

            [...resultGetAllGroup || []].forEach((item: any) => {
                if (Number(item.detail?.type) !== GroupType.Company && ids.includes(item.id)) {
                    newData.set(item.id, {
                        name: Helpers.getDefaultValueMultiLanguage(item.name, language),
                    });
                }
            });

            return newData;
        } catch (error) {
            return new Map();
        }
    };

    return {
        getAllGroup,
        getMapGroupByListID,

        getUserProfileByListID,
        getMapUserProfileByListID,

        listNotifyTarget,
        listPercentAlert,
        listTimerangeBudget,
    };
};

export default useDataBudgetPlan;