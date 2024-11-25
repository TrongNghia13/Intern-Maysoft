import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AddCircleOutline } from "@mui/icons-material";
import { Card, Grid, IconButton, Tooltip } from "@mui/material";
// import { ModalCreateQuicklyWorkflow } from "@maysoft/maywork-common-react";
import {
  Autocomplete,
  Box,
  Button,
  EmailInput,
  FormField,
  ModalCreateUpdateGroup,
  RoleHelpers,
  Typography,
  useCommonComponentContext,
} from "@maysoft/common-component-react";

import Constants from "@src/constants";
import Helpers from "@src/commons/helpers";
import PathName from "@src/constants/PathName";
import CompanyLayout from "@src/layout/companyLayout";
import RoleService from "@src/services/identity/RoleSerice";
import BudgetService from "@src/services/sale/BudgetService";
import GroupService from "@src/services/identity/GroupService";
import WorkFlowService from "@src/services/maywork/WorkFlow.service";
import BookingPolicyService from "@src/services/booking/BookingPolicyService";
import ModalCreateUpdatePolicy from "@src/components/Policy/modalCreateUpdatePolicy";
import ModalCreateQuicklyBudget from "@src/components/BudgetPlan/modalCreateQuicklyBudget";
// import ModalCreatePolicyNewVersion from "@src/components/Policy/modalCreatePolicyNewVersion";
import UserProfileBookingService, {
  IDataInvite,
} from "@src/services/booking/UserProfileBookingService";

import { RootState } from "@src/store";
import { GroupType } from "@src/commons/enum";
import { ICodename } from "@src/commons/interfaces";
import { NextApplicationPage } from "@src/pages/_app";
import { withSSRErrorHandling } from "@src/commons/withSSRErrorHandling";
import { getServerSideTranslationsProps } from "@src/commons/translationHelpers";
import {
  hideLoading,
  showLoading,
  showSnackbar,
} from "@src/store/slice/common.slice";
import ModalCreateQuicklyWorkflow from "@src/components/WorkflowNewVersion/ModalCreateQuicklyWorkflow";
import ModalCreateQuicklyPolicyNewVersion from "@src/components/PolicyNewVersion/modalCreateQuicklyPolicyNewVersion";

const StaffInvitationPage: NextApplicationPage = () => {
  const {
    t,
    i18n: { language },
  } = useTranslation(["common", "setting"]);

  const router = useRouter();
  const dispatch = useDispatch();
  const { getResourcePermissions } = useCommonComponentContext();

  const resourcePermissions = getResourcePermissions(
    Constants.ResourceURI.STAFF
  );
  const userProfile = useSelector(
    (state: RootState) => state.userInfo.userProfile
  );

  const [roleList, setRoleList] = useState<ICodename[]>([]);
  const [groupList, setGroupList] = useState<ICodename[]>([]);
  const [openCreateGroup, setOpenCreateGroup] = useState<boolean>(false);

  const [policyList, setPolicyList] = useState<ICodename[]>([]);
  const [openCreatePolicy, setOpenCreatePolicy] = useState<boolean>(false);

  const [budgetList, setBudgetList] = useState<ICodename[]>([]);
  const [openCreateBudget, setOpenCreateBudget] = useState<boolean>(false);

  const [workflowList, setWorkflowList] = useState<ICodename[]>([]);
  const [openCreateWorkflow, setOpenCreateWorkflow] = useState<boolean>(false);

  const [dataModal, setDataModal] = useState<IDataInvite>({});
  const [errorModal, setErrorModal] = useState<{
    [key in keyof IDataInvite]?: string;
  }>({});

  useEffect(() => {
    (async () => {
      try {
        dispatch(showLoading());

        // Role
        const roleListTemp: ICodename[] = [];
        const resultGetAllRole = await RoleService.getAll(
          Helpers.handleFormatParams({
            status: 1,
            clientId: Constants.CLIENT_ID,
            serviceCode: Constants.SERVICE_CODE,
            organizationId: userProfile?.organizationId,
          })
        );

        [...(resultGetAllRole || [])].forEach((e: any) => {
          let groupName = "";

          if (
            e?.organizationId === "0" ||
            Number(e?.organizationId) === 0 ||
            Helpers.isNullOrEmpty(e?.organizationId)
          ) {
            groupName = "Mặc định";
          } else {
            groupName = "Bổ sung";
          }

          if (!RoleHelpers.isOrganizationOwner(e.type)) {
            roleListTemp.push({
              name: e.roleName,
              code: e.roleCode,
              group: groupName,
              detail: {
                roleType: e.type,
                roleLevel: e.roleLevel,
              },
            });
          }
        });

        setRoleList(roleListTemp);

        // Group
        let listGroupTemp: ICodename[] = [];
        const resultGetAllGroup = await GroupService.getAll(
          Helpers.handleFormatParams({
            listStatus: [1],
            clientId: Constants.CLIENT_ID,
            organizationId: userProfile?.organizationId,
          })
        );

        [...(resultGetAllGroup || [])].forEach((item: any) => {
          if (Number(item.detail?.type) !== GroupType.Company) {
            listGroupTemp.push({
              code: item.id,
              name: Helpers.getDefaultValueMultiLanguage(item.name, language),
              detail: {
                type: item.type,
                gene: item.gene,
              },
            });
          }
        });

        setGroupList(listGroupTemp);

        // Policy
        const policyListTemp: ICodename[] = [];
        const resultGetPolicy = await BookingPolicyService.getByCondition({
          tenantCode: Constants.TENANT_CODE,
          serviceCode: Constants.SERVICE_CODE,
          organizationId: userProfile?.organizationId,
        });

        [...(resultGetPolicy || [])].forEach((e) => {
          policyListTemp.push({
            code: e.id,
            name: e.name?.value?.[language],
          });
        });

        setPolicyList(policyListTemp);

        // Workflow
        const flowListTemp: ICodename[] = [];
        const resultGetFlow = await WorkFlowService.getAll();

        [...(resultGetFlow || [])].forEach((e) => {
          flowListTemp.push({
            code: e.id,
            name: e.name,
          });
        });

        setWorkflowList(flowListTemp);

        // Buget
        const budgetListTemp: ICodename[] = [];
        const resultGetBudget = await BudgetService.getAll({
          serviceCode: [Constants.SERVICE_CODE],
        });

        [...(resultGetBudget || [])].forEach((e) => {
          budgetListTemp.push({
            code: e.id,
            name: e.name,
          });
        });

        setBudgetList(budgetListTemp);
      } catch (error) {
        Helpers.handleError(error);
      } finally {
        dispatch(hideLoading());
      }
    })();
  }, []);

  const onChangeValue = (val: any, key: string) => {
    setDataModal((prev) => ({
      ...prev,
      [key]: val,
    }));

    setErrorModal((prev) => ({
      ...prev,
      [key]: undefined,
    }));
  };

  const handleValidate = () => {
    let checked: boolean = true;
    let newError: any = { ...errorModal };

    if ([...(dataModal?.emails || [])].length === 0) {
      checked = false;
      newError["emails"] = t("setting:invitation.required_email");
    }
    if ([...(dataModal?.emails || [])].length === 0) {
      newError["emails"] = t("setting:invitation.required_email");
    }

    if (Helpers.isNullOrEmpty(dataModal?.policyId)) {
      checked = false;
      newError["policyId"] = t("setting:invitation.required_policy");
    }

    if (Helpers.isNullOrEmpty(dataModal?.flowId)) {
      checked = false;
      newError["flowId"] = t("setting:invitation.required_workflow");
    }

    if (Helpers.isNullOrEmpty(dataModal?.budgetId)) {
      checked = false;
      newError["budgetId"] = t("setting:invitation.required_budget");
    }

    if ([...(dataModal?.roles || [])].length === 0) {
      checked = false;
      newError["roles"] = t("setting:invitation.required_role");
    }

    if (!checked) {
      setErrorModal(newError);
    }
    return checked;
  };

  const handleActionModal = async () => {
    if (handleValidate()) {
      try {
        dispatch(showLoading());

        const newRoleCodes = [...(dataModal.roles || [])];

        if (newRoleCodes.length === 0) {
          const itemRoleMember = [...(roleList || [])].find((el) =>
            RoleHelpers.isOrganizationMember(el.detail?.roleType)
          );

          itemRoleMember && newRoleCodes.push(itemRoleMember?.code as string);
        }

        await UserProfileBookingService.invite({
          emails: dataModal.emails,

          roles: newRoleCodes,
          groupIds: dataModal.groupIds,

          flowId: dataModal.flowId,
          budgetId: dataModal.budgetId,
          policyId: dataModal.policyId,

          organizationId: userProfile?.organizationId,
          extraInformation: dataModal.extraInformation,
          note: dataModal.note,
        });

        dispatch(
          showSnackbar({ msg: "Đã gửi lời mời thành công", type: "success" })
        );

        router.push(PathName.STAFF);
      } catch (error) {
        Helpers.handleError(error);
      } finally {
        dispatch(hideLoading());
      }
    }
  };

  return (
    <>
      <Box
        sx={{
          mb: 3,
          gap: 1,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h5">
          {t("setting:invitation.invite_staff")}
        </Typography>
        <Box
          sx={{
            gap: 1,
            display: "flex",
            alignItems: "center",
            marginLeft: "auto",
            justifyContent: "flex-end",
            flexWrap: "wrap",
          }}
        >
          <Button
            color="secondary"
            onClick={() => {
              router.push(PathName.STAFF);
            }}
          >
            {t("common:cancel")}
          </Button>
          {resourcePermissions.canCreate && (
            <Button
              onClick={() => {
                handleActionModal();
              }}
            >
              {t("setting:invitation.send_invitation")}
            </Button>
          )}
        </Box>
      </Box>
      <Card>
        <Grid container spacing={3} p={3}>
          <Grid item xs={12}>
            {/* List Email invatation */}
            <EmailInput
              required
              maxEmails={255}
              variant="standard"
              value={dataModal?.emails || []}
              errorMessage={errorModal?.emails}
              label={t("setting:invitation.email")}
              placeholder={t("setting:invitation.enter_email")}
              onChangeValue={(value) => {
                onChangeValue(value, "emails");
              }}
            />
            <Typography variant="button" color="secondary">
              {t("setting:invitation.note_email")}
            </Typography>
          </Grid>

          {/* Message invatation */}
          <Grid item xs={12}>
            <FormField
              multiline
              minRows={3}
              maxLength={500}
              value={dataModal?.note}
              errorMessage={errorModal?.note}
              label={t("setting:invitation.message")}
              placeholder={t("setting:invitation.enter_message")}
              onChangeValue={(value: any) => {
                onChangeValue(value, "note");
              }}
            />
            <Typography
              variant="button"
              color="secondary"
            >{`${t("setting:invitation.note_message")} (${(dataModal?.note || "").length}/500)`}</Typography>
          </Grid>

          {/* Role invatation */}
          <Grid item xs={12}>
            <Box mb={2}>
              <Typography variant="h6">
                {t("setting:invitation.role")}
              </Typography>
            </Box>
            <Autocomplete
              multiple
              isGroupBy
              defaultValue={dataModal?.roles}
              errorMessage={errorModal?.roles}
              label={t("setting:invitation.role")}
              placeholder={t("setting:invitation.select_role")}
              onChange={(value: any) => onChangeValue(value, "roles")}
              data={roleList.filter(
                (el) => !RoleHelpers.isOrganizationOwner(el.detail?.roleType)
              )}
            />
          </Grid>

          {/* Group invatation */}
          <Grid item xs={12}>
            <Box mb={2}>
              <Typography variant="h6">
                {t("setting:invitation.account_settings")}
              </Typography>
            </Box>
            <Box
              sx={{
                gap: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box width={"94%"}>
                <Autocomplete
                  multiple
                  data={groupList || []}
                  defaultValue={dataModal?.groupIds}
                  errorMessage={errorModal?.groupIds}
                  label={t("setting:invitation.group")}
                  placeholder={t("setting:invitation.select_group")}
                  onChange={(value: any) => onChangeValue(value, "groupIds")}

                  // isAllowCreateNew
                  // createNewCallback={() => { setOpenCreateGroup(true); }}
                />
              </Box>
              <Box width={"5%"} display={"flex"} justifyContent={"end"}>
                <Tooltip title={t("common:add_new")}>
                  <IconButton
                    color="info"
                    sx={{ padding: 0 }}
                    onClick={() => {
                      setOpenCreateGroup(true);
                    }}
                  >
                    <AddCircleOutline />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Grid>

          {/* Policy invatation */}
          <Grid item xs={12}>
            <Box
              sx={{
                gap: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box width={"94%"}>
                <Autocomplete
                  required
                  data={policyList || []}
                  defaultValue={dataModal?.policyId}
                  errorMessage={errorModal?.policyId}
                  label={t("setting:invitation.policy")}
                  placeholder={t("setting:invitation.select_policy")}
                  onChange={(value: any) => onChangeValue(value, "policyId")}

                  // isAllowCreateNew
                  // createNewCallback={() => { setOpenCreatePolicy(true); }}
                />
              </Box>
              <Box width={"5%"} display={"flex"} justifyContent={"end"}>
                <Tooltip title={t("common:add_new")}>
                  <IconButton
                    color="info"
                    sx={{ padding: 0 }}
                    onClick={() => {
                      setOpenCreatePolicy(true);
                    }}
                  >
                    <AddCircleOutline />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Grid>

          {/* Workflow invatation */}
          <Grid item xs={12}>
            <Box
              sx={{
                gap: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box width={"94%"}>
                <Autocomplete
                  required
                  data={workflowList || []}
                  defaultValue={dataModal?.flowId}
                  errorMessage={errorModal?.flowId}
                  label={t("setting:invitation.workflow")}
                  placeholder={t("setting:invitation.select_workflow")}
                  onChange={(value: any) => onChangeValue(value, "flowId")}

                  // isAllowCreateNew
                  // createNewCallback={() => { setOpenCreateWorkflow(true); }}
                />
              </Box>
              <Box width={"5%"} display={"flex"} justifyContent={"end"}>
                <Tooltip title={t("common:add_new")}>
                  <IconButton
                    color="info"
                    sx={{ padding: 0 }}
                    onClick={() => {
                      setOpenCreateWorkflow(true);
                    }}
                  >
                    <AddCircleOutline />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Grid>

          {/* Budget invatation */}
          <Grid item xs={12}>
            <Box
              sx={{
                gap: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box width={"94%"}>
                <Autocomplete
                  required
                  data={budgetList || []}
                  defaultValue={dataModal?.budgetId}
                  errorMessage={errorModal?.budgetId}
                  label={t("setting:invitation.budget")}
                  placeholder={t("setting:invitation.select_budget")}
                  onChange={(value: any) => onChangeValue(value, "budgetId")}

                  // isAllowCreateNew
                  // createNewCallback={() => { setOpenCreateBudget(true); }}
                />
              </Box>
              <Box width={"5%"} display={"flex"} justifyContent={"end"}>
                <Tooltip title={t("common:add_new")}>
                  <IconButton
                    color="info"
                    sx={{ padding: 0 }}
                    onClick={() => {
                      setOpenCreateBudget(true);
                    }}
                  >
                    <AddCircleOutline />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Card>

      {openCreateGroup && (
        <ModalCreateUpdateGroup
          lable={"Phòng ban"}
          openModal={openCreateGroup}
          organizationId={userProfile?.organizationId}
          hidenInputSelectGroupParent
          onCloseModal={() => {
            setOpenCreateGroup(false);
          }}
          onActionModal={(newdata) => {
            if (!Helpers.isNullOrEmpty(newdata?.id)) {
              setGroupList((prev) => [
                ...(prev || []),
                {
                  code: newdata?.id || "",
                  name: newdata?.name?.value?.[language] || "",
                },
              ]);
            }
            setOpenCreateGroup(false);

            onChangeValue(
              [...(dataModal?.groupIds || []), newdata?.id],
              "groupIds"
            );
          }}
        />
      )}

      {openCreateWorkflow && (
        <ModalCreateQuicklyWorkflow
          visibled={openCreateWorkflow}
          setVisibled={setOpenCreateWorkflow}
          caseCode={"BOOK"}
          // listCaseCode={[]}
          // hidenInputCaseCode
          organizationId={userProfile?.organizationId}
          onSubmit={(newdata) => {
            if (
              !Helpers.isNullOrEmpty(newdata?.id) &&
              !Helpers.isNullOrEmpty(newdata?.name)
            ) {
              setWorkflowList((prev) => [
                ...(prev || []),
                {
                  code: newdata?.id || "",
                  name: newdata?.name || "",
                },
              ]);

              onChangeValue(newdata?.id, "flowId");
            }
          }}
        />
      )}
      {openCreatePolicy && (
        // <ModalCreateUpdatePolicy
        //     title={t("setting:policy_title_create_view")}

        //     openCreate={openCreatePolicy}
        //     setOpenCreate={setOpenCreatePolicy}

        //     hidenFlightTime={true}
        //     hidenBookingTime={true}
        //     serviceCode={Constants.SERVICE_CODE}
        //     organizationId={userProfile?.organizationId}

        //     onCallBack={(newdata) => {
        //         if (!Helpers.isNullOrEmpty(newdata?.id)
        //             && !Helpers.isNullOrEmpty(newdata?.name)) {
        //             setPolicyList(prev => [
        //                 ...prev || [],
        //                 {
        //                     code: newdata?.id || "",
        //                     name: newdata?.name || "",
        //                 },
        //             ]);

        //             onChangeValue(newdata?.id, "policyId");
        //         }
        //     }}
        // />

        <ModalCreateQuicklyPolicyNewVersion
          serviceCode={Constants.SERVICE_CODE}
          organizationId={userProfile.organizationId}
          openCreate={openCreatePolicy}
          setOpenCreate={setOpenCreatePolicy}
          onCallBack={(newdata) => {
            if (
              !Helpers.isNullOrEmpty(newdata?.id) &&
              !Helpers.isNullOrEmpty(newdata?.name)
            ) {
              setPolicyList((prev) => [
                ...(prev || []),
                {
                  code: newdata?.id || "",
                  name: newdata?.name || "",
                },
              ]);

              onChangeValue(newdata?.id, "policyId");
            }
          }}
        />
      )}
      {openCreateBudget && (
        <ModalCreateQuicklyBudget
          listGroup={groupList}
          groupId={userProfile?.groupId}
          organizationId={userProfile?.organizationId}
          openModal={openCreateBudget}
          setOpenModal={setOpenCreateBudget}
          onSubmit={(newdata) => {
            if (
              !Helpers.isNullOrEmpty(newdata?.id) &&
              !Helpers.isNullOrEmpty(newdata?.name)
            ) {
              setBudgetList((prev) => [
                ...(prev || []),
                {
                  code: newdata?.id || "",
                  name: newdata?.name || "",
                },
              ]);

              onChangeValue(newdata?.id, "budgetId");
            }
          }}
        />
      )}
    </>
  );
};

StaffInvitationPage.requiredAuth = true;
StaffInvitationPage.requiredSettinglayout = true;
export default withSSRErrorHandling(StaffInvitationPage);

const getStaticProps = getServerSideTranslationsProps(["setting", "common"]);
export { getStaticProps };
