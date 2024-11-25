import {
  Box,
  DatePicker,
  PhoneNumberInput,
  RoleHelpers,
  useCommonComponentContext,
} from "@maysoft/common-component-react";
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  NativeSelect,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { GroupType, GroupUserDefault } from "@src/commons/enum";
import Helpers from "@src/commons/helpers";
import {
  ICodename,
  IItineraryMember,
  IUserRole,
} from "@src/commons/interfaces";
import { getServerSideTranslationsProps } from "@src/commons/translationHelpers";
import { withSSRErrorHandling } from "@src/commons/withSSRErrorHandling";
import Constants from "@src/constants";
import { IInformation } from "@src/hooks/booking/type";
import CompanyLayout from "@src/layout/companyLayout";
import { NextApplicationPage } from "@src/pages/_app";
import BookingPolicyService from "@src/services/booking/BookingPolicyService";
import UserProfileBookingService, {
  IDataCreate,
  IDataModalCreateUser,
  IDataUpdate,
  IRecordDetail,
} from "@src/services/booking/UserProfileBookingService";
import GroupService from "@src/services/identity/GroupService";
import ProfileService, {
  IRequestUpdateOrganizationProfile,
} from "@src/services/identity/ProfileService";
import RoleService from "@src/services/identity/RoleSerice";
import WorkFlowService from "@src/services/maywork/WorkFlow.service";
import BudgetService from "@src/services/sale/BudgetService";
import { RootState } from "@src/store";
import { hideLoading, showLoading } from "@src/store/slice/common.slice";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PhoneNumber } from "react-phone-number-input";
import { useDispatch, useSelector } from "react-redux";
import { number } from "yup";

const create: NextApplicationPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    t,
    i18n: { language },
  } = useTranslation(["common", "setting"]);

  // const id = router.query.id as string;
  // console.log(id);
  const { userInfo } = useCommonComponentContext();

  const organizationId = userInfo?.userProfile?.organizationId || "0";

  const userProfile = useSelector(
    (state: RootState) => state.userInfo.userProfile
  );
  // const [user, setUser] = useState<any>({
  //   lastName: "",
  //   firstName: "",
  //   fullName: "",
  //   phone: "",
  //   email: "",
  //   gender: "",
  //   birthDate: "",
  //   passportNumber: "",
  //   passportExpiry: "",
  //   passportIssuedBy: [],
  //   nationality: "",
  //   role: "",
  //   workingMode: "",
  //   approvalProcess: "",
  // });

  // const [countryList, setCountryList] = useState<ICodename[]>([]);

  const [error, setError] = useState<any>({});
  // const [departments, setDepartments] = useState<any[]>([]);
  const [dataBookingProfile, setDataBookingProfile] =
    useState<IDataModalCreateUser>({});
  // const [errrorBookingProfile, setErrorBookingProfile] =
  //   useState<IDataModalCreateUser>({});
  const [createUser, setCreateUser] = useState<IDataCreate>({ organizationId });
  // const [dataBookingProfileBackup, setDataBookingProfileBackup] =
  //   useState<IDataUpdate>({});

  // const [UserProfile, setUserProfile] = useState<IRecordDetail>();
  // const [errrorUserProfile, setErrorUserProfile] = useState<IDataCreate>({});
  // const [UserProfileBackup, setUserProfileBackup] = useState<IDataCreate>({});

  // const { getResourcePermissions } = useCommonComponentContext();

  // const pramsMode = !Helpers.isNullOrEmpty(router?.query?.mode)
  //   ? Number(router?.query?.mode)
  //   : undefined;

  // const resourcePermissions = getResourcePermissions(
  //   Constants.ResourceURI.STAFF
  // );

  // const [dataModal, setDataModal] = useState<IDataCreate>({});
  const [roleList, setRoleList] = useState<IUserRole[]>([]);
  // const [roleCodes, setRoleCodes] = useState<string[]>([]);
  const [policyList, setPolicyList] = useState<ICodename[]>([]);
  // const [budgetList, setBudgetList] = useState<ICodename[]>([]);
  const [workflowList, setWorkflowList] = useState<ICodename[]>([]);
  // const [flowList, setFlowList] = useState<IItineraryMember[]>([]);
  const [groupList, setGroupList] = useState<ICodename[]>([]);

  // const [information, setInformation] = useState<IInformation>({
  //   firstName: "",
  //   lastName: "",
  //   email: "",
  //   country: "",
  //   phoneNumber: "",
  //   sendEmail: false,
  //   phoneCode: "",
  // });

  useEffect(() => {
    (async () => {
      try {
        dispatch(showLoading());

        // Role
        const roleListTemp: IUserRole[] = [];
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
              roleName: e.roleName,
              roleCode: e.roleCode,
            } as IUserRole);
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
            id: e.id,
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
            id: e.id,
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
            id: e.id,
            code: e.id,
            name: e.name,
          });
        });
      } catch (error) {
        Helpers.handleError(error);
      } finally {
        dispatch(hideLoading());
      }
    })();
  }, []);

  const createNewUser = async () => {
    // const newRoleCodes = [...(createUser.roleCodes || [])];
    // console.log("check rolecodes: ", newRoleCodes);
    // console.log("checck rolecoes:", newRoleCodes);
    // if (newRoleCodes.length === 0) {
    //   const itemRoleMember = [...(roleList || [])].find((el) =>
    //     RoleHelpers.isOrganizationMember(el.detail?.roleType)
    //   );

    //   itemRoleMember && newRoleCodes.push(itemRoleMember?.code as string);
    // }

    // const newUserData = {
    //   organizationId: organizationId,
    //   email: user.email,
    //   // lastName: user.lastName,
    //   // firstName: user.firstName,
    //   fullName:
    //     `${dataModal.organizationUserProfile?.lastName || ""} ${dataModal.organizationUserProfile?.firstName}`.trim(),
    //   gender: user.gender,
    //   phoneNumber: user.phone,
    //   dateOfBirth: user.dateOfBirth ? Number(user.dateOfBirth) : 0,
    //   flowId: dataModal.flowId,
    //   policyId: dataModal.policyId,
    //   budgetId: dataModal.budgetId,

    //   organizationUserProfile: {
    //     gender: dataModal.gender,
    //     lastName: user.lastName,
    //     firstName: user.firstName,
    //     dateOfBirth: user.dateOfBirth ? Number(user.dateOfBirth) : 0,
    //   },

    //   userGroups: [...(dataModal?.groupIds || [])]?.map((el, index) => ({
    //     groupId: el,
    //     action: 0,
    //     manager: 0,
    //     userTitle: undefined,
    //     default: index === 0 ? GroupUserDefault.Default : GroupUserDefault.None,
    //   })),

    //   roleCodes: newRoleCodes,
    //   isActive: true,
    // };

    try {
      const result = await UserProfileBookingService.create(createUser);

      console.log("User created successfully:", result);
    } catch (error) {
      console.error("Error creating user:", error);
    }
    router.push(`/setting/userpage`);
  };

  const onSubmit = () => {};

  return (
    <CompanyLayout>
      <div>
        <Box p={4}>
          <Grid container spacing={50}>
            <Grid item xs={6}>
              <Typography variant="h5">{t("Tạo mới nhân sự")}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Button
                variant="contained"
                style={{
                  marginRight: "10px",
                  background: "rgb(116, 123, 138)",
                  color: "white",
                }}
                onClick={onSubmit}
              >
                {t("common:go_back")}
              </Button>
              <Button
                variant="contained"
                color="primary"
                style={{ color: "white" }}
                onClick={createNewUser}
              >
                {t("common:create")}
              </Button>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={6}>
              <TextField
                label={t("setting:user_lastname")}
                value={createUser.organizationUserProfile?.lastName || ""}
                onChange={(e) =>
                  setCreateUser({
                    ...createUser,
                    organizationUserProfile: {
                      ...createUser.organizationUserProfile,
                      lastName: e.target.value,
                    },
                  })
                }
                variant="standard"
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label={t("setting:user_firstname")}
                value={createUser.organizationUserProfile?.firstName || ""}
                onChange={(e) =>
                  setCreateUser({
                    ...createUser,
                    organizationUserProfile: {
                      ...createUser.organizationUserProfile,
                      firstName: e.target.value,
                    },
                  })
                }
                variant="standard"
              />
              {/* {error.firstName && (
                <span style={{ color: "red" }}>{error.firstName}</span>
              )} */}
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Email"
                value={createUser.email || ""}
                onChange={(e) =>
                  setCreateUser({ ...createUser, email: e.target.value })
                }
                variant="standard"
              />
              {error.email && (
                <span style={{ color: "red" }}>{error.email}</span>
              )}
            </Grid>

            <Grid item xs={6}>
              <PhoneNumberInput
                country={"vn"}
                label={t("setting:user_phone")}
                value={createUser.phoneNumber || ""}
                defaultValue={createUser.phoneNumber || ""}
                onChangeValue={(value: string) =>
                  setCreateUser({ ...createUser, phoneNumber: value })
                }
                variant="standard"
              />
            </Grid>

            <Grid item xs={6}>
              <FormControl variant="standard" fullWidth>
                <InputLabel>Giới tính</InputLabel>
                <Select
                  value={createUser.gender}
                  onChange={(e) =>
                    setCreateUser({ ...createUser, gender: e.target.value })
                  }
                  label="Giới tính"
                >
                  <MenuItem value={0}>Nam</MenuItem>
                  <MenuItem value={1}>Nữ</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <DatePicker
                key={createUser.organizationUserProfile?.dateOfBirth}
                label="Ngày sinh"
                value={Helpers.getDateValue(
                  createUser.organizationUserProfile?.dateOfBirth
                )}
                onChangeValue={(e) =>
                  setCreateUser({
                    ...createUser,
                    organizationUserProfile: {
                      ...createUser.organizationUserProfile,
                      dateOfBirth: e.unix(),
                    },
                  })
                }
                variant="standard"
              />
            </Grid>
            <div style={{ marginTop: "3%" }}>
              <Grid item xs={12}>
                <Box mb={2}>
                  <Typography variant="h6">
                    {t("setting:invitation.role")}
                  </Typography>
                </Box>
                <Select
                  multiple
                  label={t("Vai Tro")}
                  value={createUser.roleCodes || []}
                  placeholder={t("setting:invitation.select_role")}
                  onChange={(e) => {
                    setCreateUser({
                      ...createUser,
                      roleCodes: e.target.value as string[],
                    });
                  }}
                >
                  {roleList.map((r) => (
                    <MenuItem key={r.roleCode} value={r.roleCode}>
                      {r.roleName}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
            </div>

            <div style={{ marginTop: "3%" }}>
              <Box p={5}>
                <Grid container spacing={50}>
                  <Grid item xs={12}>
                    <Typography variant="h5">
                      {t("Thông tin cài đặt ")}
                    </Typography>
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item xs={24}>
                    <FormControl fullWidth>
                      <InputLabel>{t("Phòng ban")}</InputLabel>
                      <NativeSelect
                        style={{ marginTop: "5%" }}
                        value={createUser.userGroups?.[0]?.groupId || ""}
                        onChange={(e) => {
                          const selectedGroupId = e.target.value;

                          setCreateUser((prev) => ({
                            ...prev,
                            userGroups: [
                              {
                                groupId: selectedGroupId,
                              },
                            ],
                          }));
                        }}
                      >
                        <option value="">{t("chọn phòng ban")}</option>
                        {groupList.map((Icodename) => (
                          <option key={Icodename.code} value={Icodename.code}>
                            {Icodename.name}
                          </option>
                        ))}
                      </NativeSelect>
                    </FormControl>
                  </Grid>

                  <Grid item xs={24}>
                    <FormControl fullWidth>
                      <InputLabel>{t("Chế độ công tác")}</InputLabel>
                      <NativeSelect
                        style={{ marginTop: "5%" }}
                        value={createUser.policyId}
                        onChange={
                          (e) =>
                            setCreateUser({
                              ...createUser,
                              policyId: e.target.value,
                            })
                          // console.log("check onchange flowID:", e.target.value)
                        }
                      >
                        <option value="">{t("Chọn chế độ công tác")}</option>
                        {policyList.map((Icodename) => (
                          <option key={Icodename.id} value={Icodename.id}>
                            {Icodename.name}
                          </option>
                        ))}
                      </NativeSelect>
                    </FormControl>
                  </Grid>

                  {/* <Grid item xs={24}>
                    <FormControl fullWidth>
                      <InputLabel>{t("phòng ban")}</InputLabel>
                      <NativeSelect
                        style={{ marginTop: "5%" }}
                        value={createUser.userGroups}
                        onChange={(e) =>
                          setCreateUser({
                            ...createUser,
                            userGroups: e.target.value,
                          })
                        }
                      >
                        <option value="">{t("chọn phòng ban")}</option>
                        {policyList.map((Icodename) => (
                          <option key={Icodename.id} value={Icodename.id}>
                            {Icodename.name}
                          </option>
                        ))}
                      </NativeSelect>
                    </FormControl>
                  </Grid> */}

                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>{t("Quy trình phê duyệt")}</InputLabel>
                      <NativeSelect
                        style={{ marginTop: "5%" }}
                        value={createUser.flowId || ""}
                        onChange={(e) =>
                          setCreateUser({
                            ...createUser,
                            flowId: e.target.value,
                          })
                        }
                      >
                        <option value="">
                          {t("Chọn quy trình phê duyệt")}
                        </option>
                        {workflowList.map((Icodename) => (
                          <option key={Icodename.id} value={Icodename.id}>
                            {Icodename.name}
                          </option>
                        ))}
                      </NativeSelect>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>
            </div>
          </Grid>
        </Box>
      </div>
    </CompanyLayout>
  );
};

create.requiredAuth = true;

export default withSSRErrorHandling(create);

const getStaticProps = getServerSideTranslationsProps(["setting", "common"]);
export { getStaticProps };
