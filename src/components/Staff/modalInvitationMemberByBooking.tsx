import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AddCircleOutline } from "@mui/icons-material";
import { Grid, IconButton, Tooltip } from "@mui/material";
import { ModalCreateQuicklyWorkflow } from "@maysoft/maywork-common-react";
import {
  Autocomplete,
  Box,
  Button,
  EmailInput,
  FormField,
  Modal,
  ModalCreateUpdateGroup,
  Typography,
} from "@maysoft/common-component-react";

import Constants from "@src/constants";
import Helpers from "../../commons/helpers";
import RoleService from "@src/services/identity/RoleSerice";
import BudgetService from "../../services/sale/BudgetService";
import GroupService from "@src/services/identity/GroupService";
import WorkFlowService from "../../services/maywork/WorkFlow.service";
import ModalCreateUpdatePolicy from "../Policy/modalCreateUpdatePolicy";
import ModalCreateQuicklyBudget from "../BudgetPlan/modalCreateQuicklyBudget";
import BookingPolicyService from "../../services/booking/BookingPolicyService";
import UserProfileBookingService, {
  IDataInvite,
} from "../../services/booking/UserProfileBookingService";

import { RootState } from "@src/store";
import { ICodename } from "../../commons/interfaces";
import { GroupType, RoleType } from "@src/commons/enum";
import {
  hideLoading,
  showLoading,
  showSnackbar,
} from "@src/store/slice/common.slice";

interface IPropsModalInvitationMemberBooking {
  groupId?: string;
  requiredRole: boolean;
  organizationId: string;
  onCallBack: () => void;
}

function ModalInvitationMemberByBooking(
  props: IPropsModalInvitationMemberBooking
) {
  const {
    t,
    i18n: { language },
  } = useTranslation(["common", "setting"]);

  const dispatch = useDispatch();

  const userProfile = useSelector(
    (state: RootState) => state.userInfo.userProfile
  );

  const [visible, setVisible] = useState(false);

  const [dataModal, setDataModal] = useState<IDataInvite>({});
  const [errorModal, setErrorModal] = useState<{
    [key in keyof IDataInvite]?: string;
  }>({});

  const [roleList, setRoleList] = useState<ICodename[]>([]);
  const [groupList, setGroupList] = useState<ICodename[]>([]);
  const [policyList, setPolicyList] = useState<ICodename[]>([]);
  const [budgetList, setBudgetList] = useState<ICodename[]>([]);
  const [workflowList, setWorkflowList] = useState<ICodename[]>([]);

  const [openCreateGroup, setOpenCreateGroup] = useState<boolean>(false);
  const [openCreatePolicy, setOpenCreatePolicy] = useState<boolean>(false);
  const [openCreateBudget, setOpenCreateBudget] = useState<boolean>(false);
  const [openCreateWorkflow, setOpenCreateWorkflow] = useState<boolean>(false);

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

    if (!checked) {
      setErrorModal(newError);
    }
    return checked;
  };

  const handleActionModal = async () => {
    if (handleValidate()) {
      try {
        dispatch(showLoading());

        const newValueGroupIds = Helpers.isNullOrEmpty(props.groupId)
          ? dataModal.groupIds
          : [props.groupId];
        await UserProfileBookingService.invite({
          note: dataModal.note,
          roles: dataModal.roles,
          emails: dataModal.emails,
          groupIds: newValueGroupIds,
          organizationId: props.organizationId,
          extraInformation: dataModal.extraInformation,

          flowId: dataModal.flowId,
          budgetId: dataModal.budgetId,
          policyId: dataModal.policyId,
        });

        dispatch(
          showSnackbar({ msg: "Đã gửi lời mời thành công", type: "success" })
        );

        setVisible(false);
        setDataModal({});
        setErrorModal({});

        props.onCallBack();
      } catch (error) {
        Helpers.handleError(error);
      } finally {
        dispatch(hideLoading());
      }
    }
  };

  useEffect(() => {
    if (visible) {
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
              organizationId: props?.organizationId,
            })
          );

          [...(resultGetAllRole || [])].forEach((e: any) => {
            if (Number(e.type) > RoleType.OrganizationOwner) {
              roleListTemp.push({
                name: e.roleName,
                code: e.roleCode,
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
              organizationId: props?.organizationId,
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
            organizationId: props?.organizationId,
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
    }
  }, [visible, language, props.organizationId]);

  return (
    <>
      <Button
        color="info"
        onClick={() => {
          setVisible(true);
          setDataModal({});
          setErrorModal({});
        }}
      >
        {t("setting:invitation.invite_staff")}
      </Button>
      <Modal
        fullWidth
        maxWidth="md"
        hasActionButton
        visible={visible}
        buttonAction={t("setting:invitation.send_invitation")}
        title={t("setting:invitation.invite_staff")}
        onClose={() => {
          setVisible(false);
          setDataModal({});
          setErrorModal({});
        }}
        onAction={() => {
          handleActionModal();
        }}
      >
        <Grid container spacing={3} p={2}>
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
              defaultValue={dataModal?.roles}
              errorMessage={errorModal?.roles}
              label={t("setting:invitation.role")}
              placeholder={t("setting:invitation.select_role")}
              onChange={(value: any) => onChangeValue(value, "roles")}
              data={roleList.filter(
                (el) =>
                  Number(el.detail?.roleType) > Number(userProfile?.roleType) &&
                  Number(el.detail?.roleType) !== RoleType.OrganizationOwner
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
            {Helpers.isNullOrEmpty(props.groupId) && (
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
            )}
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
      </Modal>

      {openCreateGroup && (
        <ModalCreateUpdateGroup
          lable={"Phòng ban"}
          openModal={openCreateGroup}
          organizationId={props.organizationId}
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
          listCaseCode={[]}
          hidenInputCaseCode
          organizationId={props.organizationId}
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
        <ModalCreateUpdatePolicy
          title={t("setting:policy_title_create_view")}
          serviceCode={Constants.SERVICE_CODE}
          organizationId={props.organizationId}
          hidenFlightTime={true}
          hidenBookingTime={true}
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
          groupId={props.groupId}
          listGroup={[...(groupList || [])]}
          organizationId={props.organizationId}
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
}

export default ModalInvitationMemberByBooking;
