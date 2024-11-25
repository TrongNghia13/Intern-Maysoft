import { Grid } from "@mui/material";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Autocomplete, FormField, Modal } from "@maysoft/common-component-react";

import Constants from "@src/constants";
import Helpers from "@src/commons/helpers";
import RenderDetailPhase from "./detailPhase";
import RenderDetailNotifyTarget from "./detailNotifyTarget";
import useDataBudgetPlan from "@src/hooks/useDataBudgetPlan.hook";
import BudgetService, { ICreateUpdateBudget } from "@src/services/sale/BudgetService";

import { ICodename } from "@src/commons/interfaces";
import { Mode, NotifyTarget, TimerangeBudget } from "@src/commons/enum";
import { hideLoading, showLoading, showSnackbar } from "@src/store/slice/common.slice";



const ModalCreateQuicklyBudget = ({
    openModal,
    setOpenModal,

    groupId,
    listGroup,
    organizationId,

    onSubmit,
}: {
    groupId?: string,
    openModal: boolean,
    organizationId: string,
    listGroup?: ICodename[],
    setOpenModal: Dispatch<SetStateAction<boolean>>,

    onSubmit: (data: ICreateUpdateBudget) => void,
}) => {
    const {
        t,
        i18n: { language },
    } = useTranslation(["common", "setting"]);

    const dispatch = useDispatch();
    const { listPercentAlert } = useDataBudgetPlan();

    const [listTargetProfile, setListTargetProfile] = useState<any[]>([]);
    const [dataBudgetPlan, setDataBudgetPlan] = useState<ICreateUpdateBudget>({});
    const [errorBudgetPlan, setErrorBudgetPlan] = useState<{ [key in keyof ICreateUpdateBudget]?: string }>({});

    useEffect(() => {
        openModal && setDataBudgetPlan({
            groupId: groupId || undefined,
            organizationId: organizationId || "0",
            serviceCode: [Constants.SERVICE_CODE],

            amount: 100000,
            timerange: TimerangeBudget.Monthly,
            currency: Constants.CURRENCY_DEFAULT,

            percentAlert: listPercentAlert[0].code.toString(),

            notifyTarget: NotifyTarget.Owner,
        });
    }, [openModal])

    const handleOnChangeValue = (key: string, value: any) => {
        setDataBudgetPlan(prev => {
            let newData: any = { ...prev };

            newData[key] = value;

            if (key === "timerange") {
                newData["timerangeCustom"] = [];
                if (Number(value) === TimerangeBudget.CustomRange) {
                    newData["amount"] = 0;
                } else {
                    newData["amount"] = 100000;
                }
            }
            if (key === "notifyTarget") {
                newData["notifyTargetCustom"] = [];
            }

            return newData;
        });

        setErrorBudgetPlan(prev => {
            let newData: any = { ...prev };

            newData[key] = undefined;

            if (key === "timerange") {
                newData["amount"] = undefined;
                newData["timerangeCustom"] = undefined;
            }
            if (key === "notifyTarget") {
                newData["notifyTargetCustom"] = undefined;
            }

            return newData;
        });
    };

    const handleValidateValue = () => {
        let checked = true;
        let newErr: any = { ...errorBudgetPlan };

        if (Helpers.isNullOrEmpty(dataBudgetPlan?.name)) {
            checked = false;
            newErr["name"] = t("setting:budget.required_name");
        }

        if (Number(dataBudgetPlan?.notifyTarget) === NotifyTarget.GroupAdmin
            && dataBudgetPlan?.notifyTargetCustom?.length === 0) {
            checked = false;
            newErr["notifyTargetCustom"] = t("setting:payment.required_group");
        }
        if (Number(dataBudgetPlan?.notifyTarget) === NotifyTarget.Custom
            && dataBudgetPlan?.notifyTargetCustom?.length === 0) {
            checked = false;
            newErr["notifyTargetCustom"] = t("setting:budget.required_user_manager");
        }
        if (Number(dataBudgetPlan?.timerange) === TimerangeBudget.CustomRange
            && dataBudgetPlan?.timerangeCustom?.length === 0) {
            checked = false;
            newErr["timerangeCustom"] = t("setting:budget.required_timerange_custom");
        }

        if (!checked) {
            setErrorBudgetPlan(newErr);
        }

        return checked;
    }

    const handleSubmit = async () => {
        if (!handleValidateValue()) {
            return;
        } else {
            try {
                dispatch(showLoading());

                let totalAmount = 0;
                if (dataBudgetPlan?.timerange === TimerangeBudget.CustomRange) {
                    for (const item of (dataBudgetPlan?.timerangeCustom || [])) {
                        totalAmount = totalAmount + Number(item.amount);
                    }
                } else {
                    totalAmount = dataBudgetPlan?.amount || 0;
                }

                const req: any = {
                    ...dataBudgetPlan,
                    amount: totalAmount,
                    notifyTargetCustom: dataBudgetPlan?.notifyTargetCustom?.map(el => ({
                        targetId: el.targetId,
                        targetType: el.targetType || dataBudgetPlan?.notifyTarget,
                    })),
                    percentAlert: Number(dataBudgetPlan.percentAlert),
                    timerangeCustom: dataBudgetPlan?.timerangeCustom?.map(el => ({
                        to: el.to,
                        from: el.from,
                        amount: el.amount,
                        currency: dataBudgetPlan?.currency,
                    }))
                };

                const result = await BudgetService.create(req);

                dispatch(showSnackbar({ msg: t("setting:budget.create_success"), type: "success" }));

                setDataBudgetPlan({});
                setErrorBudgetPlan({});
                setOpenModal(false);

                onSubmit({
                    ...req,
                    id: result?.id || result,
                } as any);

            } catch (error) {
                Helpers.handleException(error);
            } finally {
                dispatch(hideLoading());
            }
        }
    }

    const handleClose = () => {
        setDataBudgetPlan({});
        setErrorBudgetPlan({});

        setOpenModal(false);
    };

    return (
        <Modal
            fullWidth
            maxWidth="md"
            hasActionButton

            onClose={() => { handleClose(); }}
            onAction={() => { handleSubmit(); }}

            title={t("setting:budget_title_create_view")}
            visible={openModal}
        >
            <Grid container spacing={3} padding={2}>
                <Grid item xs={12} md={12}>
                    <FormField
                        required
                        variant={"outlined"}
                        value={dataBudgetPlan?.name}
                        errorMessage={errorBudgetPlan?.name}
                        label={t("setting:cost_package.name")}
                        placeholder={t("setting:cost_package.enter_name")}
                        onChangeValue={(value) => {
                            handleOnChangeValue("name", value);
                        }}
                    />
                </Grid>
                <Grid item xs={12} md={12}>
                    <RenderDetailPhase
                        mode={Mode.Create}
                        dataBudgetPlan={dataBudgetPlan}
                        errorBudgetPlan={errorBudgetPlan}
                        handleOnChangeValue={handleOnChangeValue}
                        listTimerangeBudget={[
                            { code: TimerangeBudget.Monthly, name: t("setting:budget.monthly"), },
                            { code: TimerangeBudget.Quarterly, name: t("setting:budget.quarterly"), },
                            { code: TimerangeBudget.Yearly, name: t("setting:budget.yearly"), },
                        ]}
                    />
                </Grid>
                <Grid item xs={12}>
                    <RenderDetailNotifyTarget
                        mode={Mode.Create}
                        listGroup={listGroup || []}
                        listNotifyTarget={[
                            { code: NotifyTarget.Owner, name: t("setting:budget.owner"), },
                            { code: NotifyTarget.GroupAdmin, name: t("setting:budget.group_admin"), },
                            { code: NotifyTarget.Custom, name: t("setting:budget.custom"), },
                        ]}

                        dataBudgetPlan={dataBudgetPlan}
                        errorBudgetPlan={errorBudgetPlan}
                        handleOnChangeValue={handleOnChangeValue}

                        listTargetProfile={listTargetProfile}
                        setListTargetProfile={setListTargetProfile}
                    />
                </Grid>
                <Grid item xs={12} md={12}>
                    <Autocomplete
                        required
                        isSelectedBox
                        variant={"outlined"}
                        data={listPercentAlert || []}
                        label={t("setting:budget.percent_alert")}
                        errorMessage={errorBudgetPlan?.percentAlert}
                        defaultValue={dataBudgetPlan?.percentAlert || listPercentAlert[0]?.code}
                        onChange={(value) => {
                            handleOnChangeValue("percentAlert", value);
                        }}
                    />
                </Grid>
            </Grid>
        </Modal>
    );
};

export default ModalCreateQuicklyBudget;