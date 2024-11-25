import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Card, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  RoleHelpers,
  StaffEditContainer,
  Typography,
  useCommonComponentContext,
} from "@maysoft/common-component-react";

import Constants from "@src/constants";
import Helpers from "@src/commons/helpers";
import PathName from "@src/constants/PathName";
import CompanyLayout from "@src/layout/companyLayout";
import BudgetService from "@src/services/sale/BudgetService";
import WorkFlowService from "@src/services/maywork/WorkFlow.service";
import BookingPolicyService from "@src/services/booking/BookingPolicyService";
import UserProfileBookingService, {
  IDataUpdate,
} from "@src/services/booking/UserProfileBookingService";

import { RootState } from "@src/store";
import { Mode } from "@src/commons/enum";
import { ICodename } from "@src/commons/interfaces";
import { NextApplicationPage } from "@src/pages/_app";
import { withSSRErrorHandling } from "@src/commons/withSSRErrorHandling";
import { getServerSideTranslationsProps } from "@src/commons/translationHelpers";
import {
  hideLoading,
  showLoading,
  showSnackbar,
} from "@src/store/slice/common.slice";
import { useQueryParams } from "@src/commons/useQueryParams";

const StaffEditPage: NextApplicationPage = () => {
  const {
    t,
    i18n: { language },
  } = useTranslation(["common", "setting"]);

  const router = useRouter();
  const { getResourcePermissions } = useCommonComponentContext();

  const id: string = router?.query?.id as string;
  const pramsMode = !Helpers.isNullOrEmpty(router?.query?.mode)
    ? Number(router?.query?.mode)
    : undefined;

  const resourcePermissions = getResourcePermissions(
    Constants.ResourceURI.STAFF
  );

  const userProfile = useSelector(
    (state: RootState) => state.userInfo.userProfile
  );

  const filter: any | undefined =
    useQueryParams(["searchText", "pageNumber", "pageSize"]) ?? {};

  const [model, setModel] = useState<{
    mode: number;
    title: string;
    route: any[];
  }>({
    mode: Mode.View,
    title: t("setting:staff_title_detail_view"),
    route: [
      { title: t("setting:staff_title_menu"), route: PathName.STAFF },
      { title: t("common:detail"), route: "" },
    ],
  });

  useEffect(() => {
    if (Helpers.isNullOrEmpty(id)) {
      handleOnChangeMode(Mode.Create);
    } else {
      let mode = pramsMode || Mode.Update;
      handleOnChangeMode(mode);
    }
  }, [id, pramsMode]);

  const handleGoBack = () => {
    router.push(PathName.STAFF);
  };

  const handleOnChangeMode = (value: number) => {
    if (value === Mode.Create) {
      setModel({
        mode: value,
        title: t("setting:staff_title_create_view"),
        route: [
          { title: t("setting:staff_title_menu"), route: PathName.STAFF },
          { title: t("common:add_new"), route: "" },
        ],
      });
    }
    if (value === Mode.Update) {
      setModel({
        mode: value,
        title: t("setting:staff_title_update_view"),
        route: [
          { title: t("setting:staff_title_menu"), route: PathName.STAFF },
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
        title: t("setting:staff_title_detail_view"),
        route: [
          { title: t("setting:staff_title_menu"), route: PathName.STAFF },
          { title: t("common:detail"), route: "" },
        ],
      });
    }

    if (!Helpers.isNullOrEmpty(id)) {
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

  return (
    <CompanyLayout>
      <StaffEditContainer
        lableGroup={t("setting:group_title_menu")}
        lableStaff={t("setting:staff_title_menu")}
        lableOrganization={t("setting:title_menu")}
        hidenStatus
        requiredInputRole
        hidenActionUpdate={!resourcePermissions.canUpdate}
        idDetail={id}
        mode={model.mode}
        title={model.title}
        hidenIdCardInfo={true}
        onGoBack={handleGoBack}
        onChangeMode={(mode) => {
          handleOnChangeMode(mode);
        }}
        cardChildrens={(newData) => [
          <>
            <CardBookingProfile
              idStaff={id}
              mode={model.mode}
              possessionKey={newData?.possessionKey}
              hidenActionUpdate={!resourcePermissions.canUpdate}
            />
          </>,
        ]}
      />
    </CompanyLayout>
  );
};

StaffEditPage.requiredAuth = true;
StaffEditPage.requiredSettinglayout = true;
export default withSSRErrorHandling(StaffEditPage);

const getStaticProps = getServerSideTranslationsProps(["setting", "common"]);
export { getStaticProps };

const CardBookingProfile = (props: {
  mode: Mode;
  idStaff?: string;
  hidenActionUpdate?: boolean;
}) => {
  const {
    t,
    i18n: { language },
  } = useTranslation(["common", "setting"]);

  const dispatch = useDispatch();

  const userProfile = useSelector(
    (state: RootState) => state.userInfo.userProfile
  );

  const [mode, setMode] = useState<number>(Mode.View);
  const [dataBookingProfile, setDataBookingProfile] = useState<IDataUpdate>({});
  const [errrorBookingProfile, setErrorBookingProfile] = useState<IDataUpdate>(
    {}
  );
  const [dataBookingProfileBackup, setDataBookingProfileBackup] =
    useState<IDataUpdate>({});

  const [policyList, setPolicyList] = useState<ICodename[]>([]);
  const [budgetList, setBudgetList] = useState<ICodename[]>([]);
  const [workflowList, setWorkflowList] = useState<ICodename[]>([]);

  useEffect(() => {
    setMode(props.mode);
  }, [props.mode]);

  useEffect(() => {
    (async () => {
      if (!Helpers.isNullOrEmpty(props.idStaff)) {
        try {
          await getDataICodeName();

          await getDetailBookingProfile(props.idStaff);
        } catch (error) {}
      }
    })();
  }, [props.idStaff]);

  const getDetailBookingProfile = async (userId: string) => {
    try {
      const result = await UserProfileBookingService.getDetail(userId);

      const newData: IDataUpdate = {
        userId: userId,
        id: result?.id,
        flowId: result?.flowId,
        policyId: result?.policyId,
        name: result?.name,
        budgetId: result?.budgetId,
        organizationId: result?.organizationId,
        extraInformation: result?.extraInformation,
        updateTime: result?.updateTime,
      };
      setDataBookingProfile(newData);
      setDataBookingProfileBackup(newData);
    } catch (error) {}
  };

  const getDataICodeName = async () => {
    try {
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
    } catch (error) {}
  };

  const handleValidate = () => {
    let checked: boolean = true;
    let newError: any = { ...errrorBookingProfile };

    if (Helpers.isNullOrEmpty(dataBookingProfile?.policyId)) {
      checked = false;
      newError["policyId"] = t("setting:invitation.required_policy");
    }

    if (Helpers.isNullOrEmpty(dataBookingProfile?.flowId)) {
      checked = false;
      newError["flowId"] = t("setting:invitation.required_workflow");
    }

    if (Helpers.isNullOrEmpty(dataBookingProfile?.budgetId)) {
      checked = false;
      newError["budgetId"] = t("setting:invitation.required_budget");
    }

    if (!checked) {
      setErrorBookingProfile(newError);
    }

    return checked;
  };

  const handleUpdateBookingProfile = async () => {
    if (handleValidate()) {
      try {
        dispatch(showLoading());

        await UserProfileBookingService.update(dataBookingProfile);

        dispatch(
          showSnackbar({
            msg: "Đã cập nhật thông tin cài đặt thành công",
            type: "success",
          })
        );

        props.idStaff && getDetailBookingProfile(props.idStaff);

        setMode(Mode.View);
      } catch (error) {
        Helpers.handleError(error);
      } finally {
        dispatch(hideLoading());
      }
    }
  };

  return (
    <Card>
      <Box p={2}>
        <Box
          sx={{
            gap: 1,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h5">{"Thông tin cài đặt"}</Typography>
          {!Helpers.isNullOrEmpty(props.idStaff) &&
            props?.mode !== Mode.View && (
              <Box
                gap={1}
                display="flex"
                flexWrap="wrap"
                alignItems="center"
                justifyContent="flex-end"
                marginLeft="auto"
              >
                {mode !== Mode.View && (
                  <Button
                    color="secondary"
                    onClick={() => {
                      setMode(Mode.View);
                      setDataBookingProfile({ ...dataBookingProfileBackup });
                    }}
                  >
                    {t("common:cancel")}
                  </Button>
                )}
                {!props.hidenActionUpdate && (
                  <Button
                    onClick={() => {
                      if (mode === Mode.View) {
                        setMode(Mode.Update);
                      } else {
                        handleUpdateBookingProfile();
                      }
                    }}
                  >
                    {mode === Mode.View ? t("common:edit") : t("common:save")}
                  </Button>
                )}
              </Box>
            )}
        </Box>
        <Box p={2}>
          <Grid container spacing={2}>
            {/* Policy invatation */}
            <Grid item xs={12}>
              <Autocomplete
                required
                mode={mode}
                data={policyList || []}
                key={dataBookingProfile?.policyId}
                defaultValue={dataBookingProfile?.policyId}
                errorMessage={errrorBookingProfile?.policyId}
                label={t("setting:invitation.policy")}
                placeholder={t("setting:invitation.select_policy")}
                onChange={(value: any) => {
                  setDataBookingProfile((prev) => ({
                    ...prev,
                    policyId: value,
                  }));
                  setErrorBookingProfile((prev) => ({
                    ...prev,
                    policyId: undefined,
                  }));
                }}
              />
            </Grid>
            {/* Workflow invatation */}
            <Grid item xs={12}>
              <Autocomplete
                key={dataBookingProfile?.flowId}
                required
                mode={mode}
                data={workflowList || []}
                // defaultValue={dataBookingProfile?.flowId}
                errorMessage={errrorBookingProfile?.flowId}
                label={t("setting:invitation.workflow")}
                placeholder={t("setting:invitation.select_workflow")}
                onChange={(value: any) => {
                  setDataBookingProfile((prev) => ({ ...prev, flowId: value }));
                  setErrorBookingProfile((prev) => ({
                    ...prev,
                    flowId: undefined,
                  }));
                }}
              />
            </Grid>
            {/* Budget invatation */}
            <Grid item xs={12}>
              <Autocomplete
                required
                mode={mode}
                data={budgetList || []}
                key={dataBookingProfile?.budgetId}
                defaultValue={dataBookingProfile?.budgetId}
                errorMessage={errrorBookingProfile?.budgetId}
                label={t("setting:invitation.budget")}
                placeholder={t("setting:invitation.select_budget")}
                onChange={(value: any) => {
                  setDataBookingProfile((prev) => ({
                    ...prev,
                    budgetId: value,
                  }));
                  setErrorBookingProfile((prev) => ({
                    ...prev,
                    budgetId: undefined,
                  }));
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Card>
  );
};
