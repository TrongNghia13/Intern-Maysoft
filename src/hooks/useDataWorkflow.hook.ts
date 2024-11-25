import { useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import Constants from "@src/constants";
import Helpers from "@src/commons/helpers";
import UserService from "@src/services/identity/UserService";
import OrganizationService from "@src/services/identity/Organization.service";
import WorkflowCriteriaService from "@src/services/maywork/WorkflowCriteria.service";
import WorkFlowService, { IRecordWorkflow } from "@src/services/maywork/WorkFlow.service";

import { IsTrue } from "@src/commons/enum";
import { ICodename, IUser } from "@src/commons/interfaces";
import { hideLoading, showLoading, showSnackbar } from "@src/store/slice/common.slice";
import { IOrganization, IOrgUserProfile } from "@src/services/identity/Organization.service";
import { ICreateWorkflow, IRecordWorkflowPhase } from "@src/services/maywork/WorkFlow.service";



export enum PermissionByWorkflow {
    View = 0,
    Create = 1,
    Update = 2,
    Submit = 4,
    Approve = 8,
    Reject = 16,
    CancelOrDelete = 32,
};

export interface IDataWorkflow {
    id?: string,
    code?: string,
    name?: string,
    caseCode?: string,
    updateTime?: string,
    description?: string,
    organizationId?: string,
    settingCommon?: {
        settingCode?: string,
        criteriaId?: string,
    },
};

const useDataWorkflow = () => {
    const dispatch = useDispatch();
    const {
        t,
        i18n: { language },
    } = useTranslation(["common", "setting"]);

    const caseCode = "BOOK";
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [listCriteria, setListCriteria] = useState<ICodename[]>([]);

    const [listApprovers, setListApprovers] = useState<IUser[]>([]);
    const [listMemberApplies, setListMemberApplies] = useState<IOrgUserProfile[]>([]);

    const [dataWorkFlow, setDataWorkFlow] = useState<IDataWorkflow>({} as IDataWorkflow);
    const [errorWorkFlow, setErrorWorkFlow] = useState<IDataWorkflow>({} as IDataWorkflow);
    const [dataWorkflowBackup, setDataWorkflowBackup] = useState<IRecordWorkflow | undefined>(undefined);

    const [dataDetailOrganization, setDataDetailOrganization] = useState<IOrganization | undefined>(undefined);


    const getDataDetail = async ({ id, organizationId }: { organizationId: string, id: string }) => {
        if (!Helpers.isNullOrEmpty(organizationId)) {
            try {
                setLoadingMore(true);
                dispatch(showLoading());

                const listTemp: ICodename[] = [];

                const resultCriteria = await WorkflowCriteriaService.getByCaseCode(caseCode);

                for (const item of [...resultCriteria || []]) {
                    listTemp.push({ code: item.id, name: item.description?.value?.[language] });
                }

                if (Helpers.isNullOrEmpty(id) || (id === "create")) {
                    setErrorWorkFlow({});
                    setDataWorkFlow({
                        caseCode: caseCode,
                        organizationId: organizationId,
                        settingCommon: {
                            settingCode: undefined,
                            criteriaId: listTemp?.[0]?.code as string,
                        }
                    });
                } else {
                    const resultGetDetailWF = await WorkFlowService.getDetail(id);

                    setErrorWorkFlow({});
                    setDataWorkFlow({
                        id: resultGetDetailWF?.id,
                        name: resultGetDetailWF?.name,
                        code: resultGetDetailWF?.code,
                        caseCode: resultGetDetailWF?.caseCode,
                        updateTime: resultGetDetailWF?.updateTime,
                        description: resultGetDetailWF?.description,
                        organizationId: resultGetDetailWF?.organizationId,
                        settingCommon: {
                            criteriaId: resultGetDetailWF?.commonSetting?.criteriaId,
                            settingCode: resultGetDetailWF?.commonSetting?.settingCode,
                        },
                    });

                    setDataWorkflowBackup(resultGetDetailWF);
                };

                setListCriteria(listTemp);

            } catch (error) {
                Helpers.handleError(error);
            } finally {
                setLoadingMore(false);
                dispatch(hideLoading());
            }
        }
    };

    const getDataDetailLoadMore = async ({ orgId, listWorkflowPhase }: {
        orgId?: string,
        listWorkflowPhase?: IRecordWorkflowPhase[],
    }) => {
        if (!Helpers.isNullOrEmpty(orgId)) {
            try {
                setLoadingMore(true);

                const resultGetDetailOrg = await OrganizationService.getDetail({ id: orgId });
                setDataDetailOrganization(resultGetDetailOrg);

                if (listWorkflowPhase && [...listWorkflowPhase || []].length > 0) {

                    let userIds: string[] = [];
                    let userIdApprovies: string[] = [];

                    for (const itemPhase of [...listWorkflowPhase || []]) {
                        if (itemPhase.sequence === 0) {
                            for (const el of [...itemPhase?.stakeHolders || []]) {
                                if (!Helpers.isNullOrEmpty(el.stakeholderId)) {
                                    userIds.push(el.stakeholderId);
                                }
                            }
                        } else {
                            for (const el of [...itemPhase?.stakeHolders || []]) {
                                if (!Helpers.isNullOrEmpty(el.stakeholderId)) {
                                    userIdApprovies.push(el.stakeholderId);
                                }
                            }
                        }
                    };

                    const newApprovers = await getUserProfileByListSelectedId({
                        ids: userIdApprovies,
                        organizationId: orgId,
                    });

                    const newMemberApplies = [...resultGetDetailOrg?.organizationUserProfiles || []].filter(el => (
                        userIds.includes(el.userId)
                    ));

                    setListApprovers(newApprovers);

                    setListMemberApplies(newMemberApplies);
                }
            } catch (error) {

            } finally {
                setLoadingMore(false);
            }
        }
    };

    const getUserProfileByListSelectedId = async ({ ids, organizationId }: { ids: string[], organizationId: string }) => {
        try {

            const result = await UserService.getPaged({
                pageNumber: 1,
                pageSize: ids.length,
                listStatus: [1],
                selectedIds: ids,
                clientId: Constants.CLIENT_ID,
                organizationId: organizationId,
            });

            return [...result.selectedItems || []];
        } catch (error) {
            return [];
        }
    };

    const handleOnChangeValue = (key: string, value: any) => {
        setDataWorkFlow(prev => {
            let newData: any = { ...prev };

            if (key === "criteriaId" || key === "settingCode") {
                newData["settingCommon"] = {
                    ...newData["settingCommon"],
                    [key]: value,
                };
            } else {
                newData[key] = value;
            }

            return newData;
        });

        setErrorWorkFlow(prev => {
            let newData: any = { ...prev };

            if (key === "criteriaId" || key === "settingCode") {
                newData["settingCommon"] = {
                    ...newData["settingCommon"],
                    [key]: undefined,
                };
            } else {
                newData[key] = undefined;
            }

            return newData;
        });
    };

    const handleValidate = () => {
        let checked = true;
        let newErr = { ...errorWorkFlow };

        if (Helpers.isNullOrEmpty(dataWorkFlow?.name)) {
            newErr["name"] = t("common:message.required_field");
            checked = false;
        } else {
            if (listApprovers.length === 0) {
                checked = false;
                dispatch(showSnackbar({ msg: "Chưa có người phê duyệt cho quy trình", type: "error" }));
            };

            if (listMemberApplies.length === 0) {
                checked = false;
                dispatch(showSnackbar({ msg: "Chưa có nhân sự áp dụng quy trình phê duyệt", type: "error" }));
            };
        }


        if (!checked) {
            setErrorWorkFlow(newErr);
        };

        return checked;
    };

    const convertDataCreateWorkFlow = () => {
        //TargetType.User = 1;
        const stakeholderType = 1;

        // Giai đoạn tạo yêu cầu
        const newStakeholders: any[] = [];
        const valuePermissionCreate = (
            PermissionByWorkflow.View
            | PermissionByWorkflow.Create
            | PermissionByWorkflow.Update
            | PermissionByWorkflow.CancelOrDelete
        );

        for (const item of [...listMemberApplies || []]) {
            newStakeholders.push({
                stakeholderId: item.userId,
                sameHierachyGroup: IsTrue.False,
                stakeholderType: stakeholderType,
                permission: valuePermissionCreate,
            });
        }

        const itemPhaseCreateRequest = {
            sla: 0,
            index: 0,
            sequence: 0,
            phaseName: "Tạo yêu cầu phê duyệt",
            description: "Tạo yêu cầu phê duyệt",
            stakeholders: newStakeholders,
            actions: [
                {
                    nextPhase: 1,
                    results: undefined,
                    criteriaId: undefined,
                    nextStatus: undefined,
                    action: PermissionByWorkflow.Submit,
                }
            ],
        };
        // end - Giai đoạn tạo yêu cầu

        // Giai đoạn phê duyệt yêu cầu
        const listPhaseApproveRequests: any[] = [];
        const lengthArray = [...listApprovers || []].length;
        const valuePermissionApprove = (
            PermissionByWorkflow.View
            | PermissionByWorkflow.Reject
            | PermissionByWorkflow.Approve
            | PermissionByWorkflow.CancelOrDelete
        );

        [...listApprovers || []].forEach((item, index) => {
            let valuePhaseName = `Cấp duyệt thứ ${index + 1}`;
            let valueNextPhase: number | undefined = (index + 1) + 1;

            if (index === 0) {
                valuePhaseName = "Cấp duyệt đầu tiên";
            }

            if ((index + 1) === lengthArray) {
                valueNextPhase = undefined;
                valuePhaseName = "Cấp duyệt cuối";
            }

            listPhaseApproveRequests.push({
                sla: 0,
                index: index + 1,
                sequence: index + 1,
                phaseName: valuePhaseName,
                description: valuePhaseName,
                stakeholders: [{
                    stakeholderId: item.id,
                    sameHierachyGroup: IsTrue.False,
                    stakeholderType: stakeholderType,
                    permission: valuePermissionApprove,
                }],
                actions: [{
                    results: undefined,
                    criteriaId: undefined,
                    nextStatus: undefined,
                    nextPhase: valueNextPhase,
                    action: PermissionByWorkflow.Submit,
                }],
            });
        })
        // end - Giai đoạn phê duyệt yêu cầu

        const newDataCreate: ICreateWorkflow = {
            code: dataWorkFlow?.code,
            name: dataWorkFlow?.name || "",
            caseCode: dataWorkFlow?.caseCode,
            description: dataWorkFlow?.description,
            settingCommon: {
                settingCode: dataWorkFlow?.settingCommon?.settingCode || "000001",
                criteriaId: dataWorkFlow?.settingCommon?.criteriaId,
            },
            phases: [
                itemPhaseCreateRequest,
                ...listPhaseApproveRequests || [],
            ],
        };

        return newDataCreate;
        // 
    };

    const convertDataUpdateWorkFlow = () => {
        //TargetType.User = 1;
        const stakeholderType = 1;

        const phaseBackup = [...dataWorkflowBackup?.phases || []];

        // Giai đoạn tạo yêu cầu
        const newStakeholders: any[] = [];
        const valuePermissionCreate = (
            PermissionByWorkflow.View
            | PermissionByWorkflow.Create
            | PermissionByWorkflow.Update
            | PermissionByWorkflow.CancelOrDelete
        );

        [...listMemberApplies || []].forEach((item, index) => {
            const newId = phaseBackup?.[0]?.stakeHolders?.[index]?.id;
            const newUpdateTime = phaseBackup?.[0]?.stakeHolders?.[index]?.updateTime;

            newStakeholders.push({
                id: newId,
                updateTime: newUpdateTime,
                stakeholderId: item.userId,
                sameHierachyGroup: IsTrue.False,
                stakeholderType: stakeholderType,
                permission: valuePermissionCreate,
            });
        });

        const itemPhaseCreateRequest = {
            id: phaseBackup?.[0]?.id,
            updateTime: phaseBackup?.[0]?.updateTime,

            sla: 0,
            index: 0,
            sequence: 0,
            phaseName: "Tạo yêu cầu phê duyệt",
            description: "Tạo yêu cầu phê duyệt",
            stakeholders: newStakeholders,
            actions:
                Helpers.isNullOrEmpty(phaseBackup?.[0])
                    ? [{
                        nextPhase: 1,
                        results: undefined,
                        criteriaId: undefined,
                        nextStatus: undefined,
                        action: PermissionByWorkflow.Submit,
                    }]
                    : [...phaseBackup?.[0]?.actions || []].map(el => ({
                        ...el,
                        nextPhase: 1,
                    })),
        };
        // end - Giai đoạn tạo yêu cầu

        // Giai đoạn phê duyệt yêu cầu
        const listPhaseApproveRequests: any[] = [];
        const lengthArray = [...listApprovers || []].length;
        const valuePermissionApprove = (
            PermissionByWorkflow.View
            | PermissionByWorkflow.Reject
            | PermissionByWorkflow.Approve
            | PermissionByWorkflow.CancelOrDelete
        );

        [...listApprovers || []].forEach((item, index) => {
            let valuePhaseName = `Cấp duyệt thứ ${index + 1}`;
            let valueNextPhase: number | undefined = (index + 1) + 1;

            if (index === 0) {
                valuePhaseName = "Cấp duyệt đầu tiên";
            }

            if ((index + 1) === lengthArray) {
                valueNextPhase = undefined;
                valuePhaseName = "Cấp duyệt cuối";
            }

            listPhaseApproveRequests.push({
                id: phaseBackup?.[index + 1]?.id,
                updateTime: phaseBackup?.[index + 1]?.updateTime,

                sla: 0,
                index: index + 1,
                sequence: index + 1,
                phaseName: valuePhaseName,
                description: valuePhaseName,
                stakeholders: [{
                    id: phaseBackup?.[index + 1]?.stakeHolders?.[0]?.id,
                    updateTime: phaseBackup?.[index + 1]?.stakeHolders?.[0]?.updateTime,

                    stakeholderId: item.id,
                    sameHierachyGroup: IsTrue.False,
                    stakeholderType: stakeholderType,
                    permission: valuePermissionApprove,
                }],
                actions:
                    Helpers.isNullOrEmpty(phaseBackup?.[index + 1])
                        ? [{
                            results: undefined,
                            criteriaId: undefined,
                            nextStatus: undefined,
                            nextPhase: valueNextPhase,
                            action: PermissionByWorkflow.Submit,
                        }]
                        : [...phaseBackup?.[index + 1]?.actions || []].map(el => ({
                            ...el,
                            nextPhase: (index + 1) + 1,
                        })),
            });
        })
        // end - Giai đoạn phê duyệt yêu cầu


        const newDataUpdate: ICreateWorkflow = {
            id: dataWorkFlow?.id,
            code: dataWorkFlow?.code,
            name: dataWorkFlow?.name || "",
            caseCode: dataWorkFlow?.caseCode,
            updateTime: dataWorkFlow?.updateTime,
            description: dataWorkFlow?.description,
            settingCommon: {
                settingCode: dataWorkFlow?.settingCommon?.settingCode || "000001",
                criteriaId: dataWorkFlow?.settingCommon?.criteriaId,
            },
            phases: [
                itemPhaseCreateRequest,
                ...listPhaseApproveRequests || [],
            ],
        };

        return newDataUpdate;
        // 
    };

    const handleCreateUpdateWorkFlow = async ({ id, onCallBack }: { id: string; onCallBack: () => void; }) => {
        if (Helpers.isNullOrEmpty(id) || (id === "create")) {
            try {
                dispatch(showLoading());

                const dataCreate = convertDataCreateWorkFlow();

                await WorkFlowService.create(dataCreate);

                dispatch(showSnackbar({ msg: t("setting:workflow.create_success"), type: "success" }));
                onCallBack();
            } catch (error) {
                Helpers.handleError(error);
            } finally {
                dispatch(hideLoading());
            }
        } else {
            try {
                dispatch(showLoading());

                const dataUpdate = convertDataUpdateWorkFlow();

                await WorkFlowService.fullUpdate(dataUpdate);

                dispatch(showSnackbar({ msg: t("setting:workflow.update_success"), type: "success" }));
                onCallBack();
            } catch (error) {
                Helpers.handleError(error);
            } finally {
                dispatch(hideLoading());
            }
        }
    };

    return {
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
        convertDataCreateWorkFlow,
        convertDataUpdateWorkFlow,
        handleCreateUpdateWorkFlow,
        getUserProfileByListSelectedId,
    };
};

export default useDataWorkflow;