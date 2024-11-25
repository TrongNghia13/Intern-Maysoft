import { RootState } from "@src/store";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Card, Grid } from "@mui/material";
import { useTranslation } from "next-i18next";
import { useEffect, useMemo, useState } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import { Box, Button, FormField, Typography, Autocomplete } from "@maysoft/common-component-react";

import Constants from "@src/constants";
import Helpers from "@src/commons/helpers";
import PathName from "@src/constants/PathName";
import CompanyLayout from "@src/layout/companyLayout";
import useDataBudgetPlan from "@src/hooks/useDataBudgetPlan.hook";
import RenderDetailPhase from "@src/components/BudgetPlan/detailPhase";
import BudgetService, { ICreateUpdateBudget } from "@src/services/sale/BudgetService";
import RenderDetailNotifyTarget, { IRecordUserProps } from "@src/components/BudgetPlan/detailNotifyTarget";

import { NextApplicationPage } from "../../_app";
import { ICodename } from "@src/commons/interfaces";
import { titleStyles } from "@src/styles/commonStyles";
import { withSSRErrorHandling } from "@src/commons/withSSRErrorHandling";
import { makeServerSideTranslations } from "@src/commons/translationHelpers";
import { Mode, NotifyTarget, RoleLevel, TimerangeBudget } from "@src/commons/enum";
import { hideLoading, showLoading, showSnackbar } from "@src/store/slice/common.slice";



export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: "blocking",
    };
};

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
    let props = { ...(await makeServerSideTranslations(locale, ["common", "setting"])) };

    const id = params?.id?.toString() || "";

    try {
        return {
            revalidate: true,
            props: {
                id,
                ...props,
            },
        };
    } catch (error) {
        return {
            revalidate: true,
            props: {
                error,
                ...props,
            },
        };
    }
};

interface IProps {
    id: string;
}

const BudgetPlanDetailPage: NextApplicationPage<IProps> = ({ id }) => {
    const {
        t,
        i18n: { language },
    } = useTranslation(["common", "setting"]);

    const router = useRouter();
    const dispatch = useDispatch();

    const {
        getAllGroup,
        getUserProfileByListID,
        listNotifyTarget,
        listPercentAlert,
        listTimerangeBudget,
    } = useDataBudgetPlan();

    const userProfile = useSelector((state: RootState) => state.userInfo.userProfile);

    const pramsMode = !Helpers.isNullOrEmpty(router?.query?.mode) ? Number(router?.query?.mode) : undefined;

    const [dataBudgetPlan, setDataBudgetPlan] = useState<ICreateUpdateBudget>({});
    const [errorBudgetPlan, setErrorBudgetPlan] = useState<{ [key in keyof ICreateUpdateBudget]?: string }>({});

    const [listGroup, setListGroup] = useState<ICodename[]>([]);
    const [listTargetProfile, setListTargetProfile] = useState<IRecordUserProps[]>([]);

    const [model, setModel] = useState<{ mode: number; title: string; route: any[] }>({
        mode: Mode.View,
        title: t("setting:budget_title_detail_view"),
        route: [
            { title: t("setting:budget_title_menu"), route: PathName.BUDGET },
            { title: t("common:detail"), route: "" },
        ],
    });

    const permissionAdmin = useMemo(() => (
        userProfile?.roleLevel === RoleLevel.Owner ||
        userProfile?.roleLevel === RoleLevel.Admin ||
        userProfile?.roleLevel === RoleLevel.SuperAdmin ||
        userProfile?.roleLevel === RoleLevel.ServiceAdmin
    ), [userProfile?.roleLevel]);

    useEffect(() => {
        (async () => {

            const listGroupTemp = await getAllGroup(userProfile?.organizationId);
            setListGroup(listGroupTemp);

            if (id === "create") {
                handleOnChangeMode(Mode.Create);
                setDataBudgetPlan({
                    serviceCode: [Constants.SERVICE_CODE],
                    organizationId: userProfile?.organizationId || "0",
                    groupId: userProfile?.groupId || undefined,

                    amount: 100000,
                    currency: Constants.CURRENCY_DEFAULT,
                    notifyTarget: Number(listNotifyTarget[0].code),
                    timerange: Number(listTimerangeBudget[0].code),
                    percentAlert: listPercentAlert[0].code.toString(),
                });
            } else {
                let mode = permissionAdmin ? (pramsMode || Mode.Update) : Mode.View;
                handleOnChangeMode(mode);
                getDetail(id);
            }
        })();
    }, [id, permissionAdmin]);

    const getDetail = async (id: string) => {
        try {
            dispatch(showLoading());


            const result = await BudgetService.detail(id);

            const notifyTargetCustom = result?.budgetNotifyTargets?.map(el => ({
                id: el.id,
                targetId: el.targetId,
                targetType: el.targetType,
            }));

            const timerangeCustom = result?.budgetTimeranges?.map(el => ({
                id: el.id,
                to: el.to,
                from: el.from,
                amount: el.amount,
                currency: el.currency,

            }));

            const ids = notifyTargetCustom?.map(el => el.targetId);
            const newData = await getUserProfileByListID(ids, userProfile?.organizationId);
            setListTargetProfile(newData);

            setDataBudgetPlan({
                groupId: result?.groupId,
                organizationId: result?.organizationId,
                serviceCode: result?.budgetService?.map(el => el.serviceCode),

                id: result?.id,
                name: result?.name,
                amount: result?.amount,
                currency: result?.currency,
                timerange: result?.timerange,
                notifyTarget: result?.notifyTarget,
                percentAlert: result?.budgetAlert?.percent?.toString(),

                timerangeCustom: timerangeCustom,
                notifyTargetCustom: notifyTargetCustom,
            })
        } catch (error) {
            Helpers.handleError(error);
        } finally {
            dispatch(hideLoading());
        }
    }

    const handleOnChangeMode = (value: number) => {
        if (value === Mode.Create) {
            setModel({
                mode: value,
                title: t("setting:budget_title_create_view"),
                route: [
                    { title: t("setting:budget_title_menu"), route: PathName.BUDGET },
                    { title: t("common:add_new"), route: "" },
                ],
            });
        }
        if (value === Mode.Update) {
            setModel({
                mode: value,
                title: t("setting:budget_title_update_view"),
                route: [
                    { title: t("setting:budget_title_menu"), route: PathName.BUDGET },
                    {
                        title: t("common:update"),
                        route: "",
                    },
                ],
            });
        }
        if (value === Mode.View) {
            setModel({
                mode: value,
                title: t("setting:budget_title_detail_view"),
                route: [
                    { title: t("setting:budget_title_menu"), route: PathName.BUDGET },
                    { title: t("common:detail"), route: "" },
                ],
            });
        }

        if (id !== "create") {
            router.push(
                {
                    query: {
                        ...router.query,
                        mode: value,
                    },
                },
                undefined,
                { shallow: true }
            );
        }
    };

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
                setListTargetProfile([]);
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
    }

    const handleGoBack = () => {
        router.push({ pathname: PathName.BUDGET })
    }

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

                if (req.id) {
                    await BudgetService.update(req);
                    dispatch(showSnackbar({ msg: t("setting:budget.update_success"), type: "success" }));
                } else {
                    await BudgetService.create(req);

                    dispatch(showSnackbar({ msg: t("setting:budget.create_success"), type: "success" }));

                    handleGoBack();
                }

            } catch (error) {
                Helpers.handleError(error);
            } finally {
                dispatch(hideLoading());
            }
        }
    }

    return (
        <CompanyLayout>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Box sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}>
                        <Typography variant="h6" sx={titleStyles}>
                            {model.title}
                        </Typography>
                        <Box sx={{ gap: 1, display: "flex", alignItems: "center" }}>
                            <Button color="secondary" onClick={() => { handleGoBack(); }}>
                                {t("common:go_back")}
                            </Button>
                            {permissionAdmin &&
                                <Button onClick={() => { handleSubmit(); }}>
                                    {t("common:save")}
                                </Button>
                            }
                        </Box>
                    </Box>
                </Grid>

                <Grid item xs={12}>
                    <Card>
                        <Grid container spacing={3} padding={3}>
                            <Grid item xs={12}>
                                <Typography variant="h6">{t("setting:budget.basic_detail")}</Typography>
                            </Grid>

                            <Grid item xs={12} md={8}>
                                <FormField
                                    required
                                    mode={model.mode}
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
                                    mode={model.mode}
                                    dataBudgetPlan={dataBudgetPlan}
                                    errorBudgetPlan={errorBudgetPlan}
                                    listTimerangeBudget={listTimerangeBudget}
                                    handleOnChangeValue={handleOnChangeValue}
                                />
                            </Grid>

                            {/* NOTIFY TARGET */}
                            <Grid item xs={12} md={8}>
                                <RenderDetailNotifyTarget
                                    mode={model.mode}
                                    listGroup={listGroup}
                                    listNotifyTarget={listNotifyTarget}

                                    dataBudgetPlan={dataBudgetPlan}
                                    errorBudgetPlan={errorBudgetPlan}
                                    handleOnChangeValue={handleOnChangeValue}

                                    listTargetProfile={listTargetProfile}
                                    setListTargetProfile={setListTargetProfile}
                                />
                            </Grid>

                            <Grid item xs={12} md={8}>
                                <Autocomplete
                                    required
                                    isSelectedBox
                                    mode={model.mode}
                                    variant={"outlined"}
                                    data={listPercentAlert || []}
                                    defaultValue={dataBudgetPlan?.percentAlert || listPercentAlert[0]?.code}
                                    errorMessage={errorBudgetPlan?.percentAlert}
                                    label={t("setting:budget.percent_alert")}
                                    onChange={(value) => {
                                        handleOnChangeValue("percentAlert", value);
                                    }}
                                />
                                <Typography variant="button" color="secondary">{t("setting:budget.note_percent_alert")}</Typography>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </CompanyLayout >
    );
};

BudgetPlanDetailPage.requiredAuth = true;
export default withSSRErrorHandling(BudgetPlanDetailPage);


