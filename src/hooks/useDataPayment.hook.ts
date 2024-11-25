import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import Constants from "@src/constants";
import Helpers from "@src/commons/helpers";
import GroupService from "@src/services/identity/GroupService";
import PaymentAccountService from "@src/services/sale/PaymentAccountService";

import { GroupType } from "@src/commons/enum";
import { ICodename } from "@src/commons/interfaces";
import { hideLoading, showLoading, showSnackbar } from "@src/store/slice/common.slice";

export interface IDataDetailPayment {
    id?: string
    updateTime?: string | number

    organizationId?: string
    partnerId?: string
    groupId?: string
    userId?: string

    name?: string
    type?: number
    default?: number
    bankCode?: string
    accountId?: string
    accountName?: string
    description?: string
    expiredDate?: string | number
    cvc?: number

    balance?: number
    availableBalance?: number
}

const useDataPayment = () => {
    const {
        t,
        i18n: { language },
    } = useTranslation(["common", "setting"]);

    const dispatch = useDispatch();

    const getAllDataGroup = async (organizationId: string) => {
        let listGroupTemp: ICodename[] = [];

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
                    detail: {
                        type: item.type,
                        gene: item.gene,
                    }
                });
            }
        });

        return listGroupTemp;
    }
    const handleCreatePayment = async (row: IDataDetailPayment, callBack: () => void) => {
        try {
            dispatch(showLoading());

            await PaymentAccountService.create({
                organizationId: row.organizationId,
                groupId: row.groupId,

                name: row.name,
                cvc: row.cvc,
                type: row.type,
                default: row.default || 0,
                bankCode: row.bankCode,
                accountId: row.accountId,
                accountName: row.accountName,
                description: row.description,
                expiredDate: Number(row.expiredDate),
            });

            dispatch(showSnackbar({ msg: t("setting:payment.create_success"), type: "success" }))

            callBack();
        } catch (error) {
            Helpers.handleError(error);
        } finally {
            dispatch(hideLoading());
        }
    };

    const handleUpdateRowPayment = async (row: IDataDetailPayment, callBack: () => void) => {
        try {
            dispatch(showLoading());

            await PaymentAccountService.update({
                id: row.id,
                updateTime: row.updateTime,

                name: row.name,
                cvc: row.cvc,
                default: row.default || 0,
                bankCode: row.bankCode,
                accountId: row.accountId,
                accountName: row.accountName,
                description: row.description,
                expiredDate: Number(row.expiredDate),
            });

            dispatch(showSnackbar({ msg: t("setting:payment.update_success"), type: "success" }))

            callBack();
        } catch (error) {
            Helpers.handleError(error);
        } finally {
            dispatch(hideLoading());
        }
    };

    const handleDeleteRowPayment = async (id: string) => {
        try {
            dispatch(showLoading());

            await PaymentAccountService.delete(id);

            dispatch(showSnackbar({ msg: t("setting:payment.delete_success"), type: "success" }))
        } catch (error) {
            Helpers.handleError(error);
        } finally {
            dispatch(hideLoading());
        }
    };

    const getDetailById = async (id: string) => {
        try {
            dispatch(showLoading());

            const result = await PaymentAccountService.detail(id);

            return ({
                id: result?.id,
                updateTime: result?.updateTime,

                organizationId: result?.organizationId,
                partnerId: result?.partnerId,
                groupId: result?.groupId,
                userId: result?.userId,

                type: result?.type,
                cvc: result?.cvc,
                name: result?.name,
                default: result?.default,
                bankCode: result?.bankCode,
                accountId: result?.accountId,
                accountName: result?.accountName,
                description: result?.description,
                expiredDate: Number(result?.expiredDate),

                balance: result?.balance,
                availableBalance: result?.availableBalance,
            } as IDataDetailPayment);
        } catch (error) {
            Helpers.handleError(error);
            return ({
                id: id
            } as IDataDetailPayment);
        } finally {
            dispatch(hideLoading());
        }
    };

    return {
        getAllDataGroup,
        getDetailById,
        handleCreatePayment,
        handleUpdateRowPayment,
        handleDeleteRowPayment,
    };
};

export default useDataPayment;