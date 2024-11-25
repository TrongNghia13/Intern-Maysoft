import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import { Box, Button, FormField, Typography } from "@maysoft/common-component-react";
import { FormControl, FormControlLabel, Grid, Radio, RadioGroup } from "@mui/material";

import Helpers from "@src/commons/helpers";
import PathName from "@src/constants/PathName";
import CompanyLayout from "@src/layout/companyLayout";
import useDataWorkflow from "@src/hooks/useDataWorkflow.hook";
import CardApprovers from "@src/components/WorkflowNewVersion/cardApprovers";
import CardMemberApplies from "@src/components/WorkflowNewVersion/cardMemberApplies";

import { RootState } from "@src/store";
import { Mode, RoleLevel } from "@src/commons/enum";
import { NextApplicationPage } from "@src/pages/_app";
import { titleStyles } from "@src/styles/commonStyles";
import { withSSRErrorHandling } from "@src/commons/withSSRErrorHandling";
import { hideLoading, showLoading } from "@src/store/slice/common.slice";
import { makeServerSideTranslations } from "@src/commons/translationHelpers";



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
};

const WorkflowEditScreen: NextApplicationPage<IProps> = ({ id }) => {
    const router = useRouter();
    const dispatch = useDispatch();

    const {
        t,
        i18n: { language },
    } = useTranslation(["common", "setting"]);

    const userProfile = useSelector((state: RootState) => state.userInfo.userProfile);

    const pramsMode = !Helpers.isNullOrEmpty(router?.query?.mode) ? Number(router?.query?.mode) : undefined;

    const permissionAdmin = useMemo(() => (
        userProfile?.roleLevel === RoleLevel.Owner ||
        userProfile?.roleLevel === RoleLevel.Admin ||
        userProfile?.roleLevel === RoleLevel.SuperAdmin ||
        userProfile?.roleLevel === RoleLevel.ServiceAdmin
    ), [userProfile?.roleLevel]);

    const [model, setModel] = useState<{ mode: Mode; title: string; route: any[] }>({
        mode: Mode.View,
        title: t("setting:workflow_title_detail_view"),
        route: [
            { title: t("setting:workflow_title_menu"), route: PathName.WORKFLOW },
            { title: t("common:detail"), route: "" },
        ],
    });

    const {
        loadingMore,
        listCriteria,
        dataWorkFlow,
        errorWorkFlow,
        dataWorkflowBackup,
        dataDetailOrganization,
        listApprovers, setListApprovers,
        listMemberApplies, setListMemberApplies,

        getDataDetail,
        handleValidate,
        handleOnChangeValue,
        getDataDetailLoadMore,
        convertDataUpdateWorkFlow,
        convertDataCreateWorkFlow,
        handleCreateUpdateWorkFlow,
        getUserProfileByListSelectedId,
    } = useDataWorkflow();

    useEffect(() => {
        if (Helpers.isNullOrEmpty(id) || (id === "create")) {
            handleOnChangeMode(Mode.Create);
        } else {
            let mode = pramsMode || Mode.Update;
            handleOnChangeMode(mode);
        }
    }, [pramsMode, id]);

    useEffect(() => {
        getDataDetail({
            id: id,
            organizationId: userProfile?.organizationId,
        });
    }, [id, userProfile?.organizationId]);

    useEffect(() => {
        (async () => {
            await getDataDetailLoadMore({
                orgId: userProfile?.organizationId,
                listWorkflowPhase: dataWorkflowBackup?.phases,
            });
        })();
    }, [userProfile?.organizationId, dataWorkflowBackup?.phases]);

    const handleGoBack = () => { router.push(PathName.WORKFLOW); };

    const handleOnChangeMode = (value: number) => {
        if (value === Mode.Create) {
            setModel({
                mode: value,
                title: t("setting:workflow_title_create_view"),
                route: [
                    { title: t("setting:workflow_title_menu"), route: PathName.WORKFLOW },
                    { title: t("common:add_new"), route: "" },
                ],
            });
        }
        if (value === Mode.Update) {
            setModel({
                mode: value,
                title: t("setting:workflow_title_update_view"),
                route: [
                    { title: t("setting:workflow_title_menu"), route: PathName.WORKFLOW },
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
                title: t("setting:workflow_title_detail_view"),
                route: [
                    { title: t("setting:workflow_title_menu"), route: PathName.WORKFLOW },
                    { title: t("common:detail"), route: "" },
                ],
            });
        }

        if (!(Helpers.isNullOrEmpty(id) || (id === "create"))) {
            router.push(
                {
                    query: {
                        id: id,
                        mode: value,
                    },
                },
                undefined,
                { shallow: true }
            );
        }
    };

    const handleSubmit = async () => {
        if (model.mode === Mode.View) {
            handleOnChangeMode(Mode.Update);
        } else {
            if (!handleValidate()) {
                return;
            } else {
                handleCreateUpdateWorkFlow({
                    id: id,
                    onCallBack() {
                        handleGoBack()
                    },
                })
            }

        }
    };

    return (
        <CompanyLayout>
            <>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Box sx={{
                            gap: 2,
                            paddingBottom: 2,
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}>
                            <Typography variant="h6" sx={titleStyles}>
                                {model.title}
                            </Typography>
                            <Box sx={{
                                gap: 1,
                                display: "flex",
                                flexWrap: "wrap",
                                alignItems: "center",
                            }}>
                                <Button color="secondary" onClick={handleGoBack}>
                                    {t("common:go_back")}
                                </Button>
                                {permissionAdmin &&
                                    <Button color="info" onClick={handleSubmit}>
                                        {(model.mode === Mode.View) ? t("common:edit") : t("common:save")}
                                    </Button>
                                }
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        <FormField
                            required
                            maxLength={255}
                            mode={model.mode}
                            variant={"outlined"}
                            value={dataWorkFlow?.name}
                            errorMessage={errorWorkFlow.name}
                            label={t("setting:workflow.name_workflow")}
                            placeholder={t("setting:workflow.enter_name_workflow")}
                            onChangeValue={(value) => {
                                handleOnChangeValue("name", value)
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormField
                            multiline
                            minRows={3}
                            maxLength={500}
                            mode={model.mode}
                            variant={"outlined"}
                            value={dataWorkFlow?.description}
                            errorMessage={errorWorkFlow.description}
                            label={t("setting:workflow.description_workflow")}
                            placeholder={t("setting:workflow.enter_description_workflow")}
                            onChangeValue={(value) => {
                                handleOnChangeValue("description", value)
                            }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <CardMemberApplies
                            mode={model.mode}
                            loadingMore={loadingMore}
                            listMemberApplies={listMemberApplies}
                            setListMemberApplies={setListMemberApplies}
                            dataDetailOrganization={dataDetailOrganization}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <CardApprovers
                            mode={model.mode}
                            loadingMore={loadingMore}
                            listApprovers={listApprovers}
                            setListApprovers={setListApprovers}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Box gap={2} display="grid">
                            <Typography variant="button" fontWeight="bold">
                                {t("setting:workflow.common_setting_workflow")}
                            </Typography>

                            <Box gap={1} display="grid">
                                <Typography variant="button" fontWeight="medium">
                                    {t("setting:workflow.criteria")}
                                </Typography>
                                <FormControl
                                    disabled={model.mode === Mode.View}
                                    sx={{
                                        ".MuiFormControlLabel-label": {
                                            fontWeight: "400 !important",
                                        }
                                    }}
                                >
                                    <RadioGroup
                                        row
                                        name="radio-buttons-group"
                                        aria-labelledby="radio-buttons-group-label"
                                        key={dataWorkFlow?.settingCommon?.criteriaId}
                                        value={
                                            Helpers.isNullOrEmpty(dataWorkFlow?.settingCommon?.criteriaId)
                                                ? (listCriteria?.[0]?.code as string)
                                                : dataWorkFlow?.settingCommon?.criteriaId
                                        }
                                        onChange={(event, value) => {
                                            handleOnChangeValue("criteriaId", value)
                                        }}
                                    >
                                        {listCriteria?.map((item) => (
                                            <FormControlLabel
                                                key={item.code}
                                                value={item.code}
                                                label={item.name}
                                                control={<Radio sx={{ p: 0 }} />}
                                                sx={{ mb: 0, mt: 0, ml: 0, p: 0 }}
                                                disabled={model.mode === Mode.View}
                                            />
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </>

            {/* <WorkFlowDetailContainer
                idDetail={(id === "create") ? undefined : id}
                hidenSidaNavBar
                mode={model.mode}
                title={model.title}
                onGoBack={handleGoBack}
                onChangeMode={(value) => { handleOnChangeMode(value); }}

                onCallBackID={(workflowId) => {
                    router.push({
                        pathname: PathName.WORKFLOW_DETAIL,
                        query: { id: workflowId },
                    });
                }}

                targetType={["User"]}

                hidenActionCreate={!permissionAdmin}
                hidenActionUpdate={!permissionAdmin}

                hidenActionCreateWorkflowPhase
                hidenActionDeleteWorkflowPhase
                hidenActionUpdateWorkflowPhase={!permissionAdmin}

                hidenWorkflowSetting
                hidenActionCreateWorkflowSetting={!permissionAdmin}
                hidenActionDeleteWorkflowSetting={!permissionAdmin}
                hidenActionUpdateWorkflowSetting={!permissionAdmin}

                hidenInputCaseCode
                caseCode={"BOOK"}
                listCaseCode={[
                    { code: "BOOK", name: "Đặt chỗ" },
                    { code: "LEAVE", name: "Nghỉ phép" },
                ]}
            /> */}
        </CompanyLayout>
    );
};

WorkflowEditScreen.requiredAuth = true;
export default withSSRErrorHandling(WorkflowEditScreen);

