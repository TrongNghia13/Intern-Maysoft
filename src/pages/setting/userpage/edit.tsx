import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useRef, useState } from "react";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import {
  Card,
  Grid,
  Button,
  Typography,
  Box,
  TextField,
  NativeSelect,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  DialogContent,
  Dialog,
  DialogActions,
  DialogTitle,
  Switch,
  Checkbox,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useTranslation } from "react-i18next";
import CompanyLayout from "@src/layout/companyLayout";
import { withSSRErrorHandling } from "@src/commons/withSSRErrorHandling";
import { getServerSideTranslationsProps } from "@src/commons/translationHelpers";
import UserProfileBookingService, {
  IDataCreate,
  IDataUpdate,
} from "@src/services/booking/UserProfileBookingService";
import BookingPolicyService from "@src/services/booking/BookingPolicyService";
import {
  DatePicker,
  PhoneNumberInput,
  useCommonComponentContext,
} from "@maysoft/common-component-react";
import Constants from "@src/constants";
import Helpers from "@src/commons/helpers";
import { ICodename, IGroupUser, IUserRole } from "@src/commons/interfaces";
import { RootState } from "@src/store";
import BudgetService from "@src/services/sale/BudgetService";
import WorkFlowService from "@src/services/maywork/WorkFlow.service";
import IdentityClient from "@src/services/identity/IdentityClient";
import { IRequestUpdateOrganizationProfile } from "@src/services/identity/ProfileService";
import AdministrativeDivisionService from "@src/services/common/AdministrativeDivisionService";
import RoleService from "@src/services/identity/RoleSerice";
import { IInformation } from "@src/hooks/booking/type";
import { IUserRoleData } from "@src/services/identity/UserRoleService";
import GroupService from "@src/services/identity/GroupService";
import { DeleteIcon, EditIcon } from "@src/assets/svg";

const UserEditPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    t,
    i18n: { language },
  } = useTranslation(["common", "setting"]);

  const id = router.query.id as string;
  console.log(id);
  const { userInfo } = useCommonComponentContext();

  const organizationId = userInfo?.userProfile?.organizationId || "0";

  const userProfile = useSelector(
    (state: RootState) => state.userInfo.userProfile
  );
  const [user, setUser] = useState<any>({
    lastName: "",
    firstName: "",
    phone: "",
    email: "",
    gender: "",
    birthDate: "",
    passportNumber: "",
    passportExpiry: "",
    passportIssuedPlace: [],
    nationality: "",
    role: "",
    workingMode: "",
    approvalProcess: "",
  });

  const [countryList, setCountryList] = useState<ICodename[]>([]);

  const [error, setError] = useState<any>({});
  const [departments, setDepartments] = useState<any[]>([]);
  const [dataBookingProfile, setDataBookingProfile] = useState<IDataUpdate>({});
  const [errrorBookingProfile, setErrorBookingProfile] = useState<IDataUpdate>(
    {}
  );
  // const [dataBookingProfileBackup, setDataBookingProfileBackup] =
  //   useState<IDataUpdate>({});

  // const [UserProfile, setUserProfile] = useState<IRecordDetail>();
  // const [errrorUserProfile, setErrorUserProfile] = useState<IDataCreate>({});
  // const [UserProfileBackup, setUserProfileBackup] = useState<IDataCreate>({});

  const { getResourcePermissions } = useCommonComponentContext();

  const [open, setOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);

  const [roleList, setRoleList] = useState<IUserRole[]>([]);
  const [groupData, setGroupData] = useState<IGroupUser[]>([]);
  const [roleCodes, setRoleCodes] = useState<string[]>([]);
  const [policyList, setPolicyList] = useState<ICodename[]>([]);
  const [budgetList, setBudgetList] = useState<ICodename[]>([]);
  const [workflowList, setWorkflowList] = useState<ICodename[]>([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [information, setInformation] = useState<IInformation>({
    firstName: "",
    lastName: "",
    email: "",
    country: "",
    phoneNumber: "",
    sendEmail: false,
    phoneCode: "",
  });
  const handleEdit = (group: any) => {
    setSelectedGroup(group);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedGroup(null);
  };

  const handleOpenAddDialog = () => {
    setSelectedGroup(null); // Clear previous selection if any
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleOpenDeleteDialog = (group) => {
    setSelectedGroup(group); // Store the item to be deleted
    setOpenDeleteDialog(true);
  };

  // Close Delete confirmation dialog
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleConfirmDelete = async (groupUser: IGroupUser) => {
    try {
      console.log("Deleting group user:", groupUser);
      const payload = {
        userId: userProfile.identityId,
        id: groupUser.id,
        isInvitationDetail: true,
        organizationId: organizationId,
      };

      const result = await IdentityClient().post(
        "/GroupUser/DeleteGroupUser",
        payload
      );

      if (result.status === 200) {
        console.log("Group user deleted successfully:", result.data);
        alert("Xóa thành công!");

        // Optionally, update your UI or fetch the updated data after deletion
      } else {
        console.error("Failed to delete group user");
      }
    } catch (error) {
      console.error("Error deleting group user:", error);
    }
  };

  const ref = useRef<IInformation | undefined>(undefined);

  // useEffect(() => {
  //   const getDetailUserProfile = async (userId: string) => {
  //     try {
  //       const result = await UserProfileBookingService.getDetail(userId);
  //       // Gán dữ liệu người dùng vào state
  //       const newDataUser = {
  //         lastName: result.lastname || "",
  //         firstName: result.firstname || "",
  //         phone: result.phoneNumber || "",
  //         email: result.email || "",
  //         gender: result.gender?.toString() || "",
  //         birthDate: result.dateOfBirth || "",
  //         passportNumber: result.passportNo || "",
  //         passportExpiry: result.passportExpiredDate || "",
  //         passportIssuedBy: result.passportIssuedPlace || "",
  //         nationality: result.nationality || "",
  //       };
  //       setUser(newDataUser);
  //     } catch (error) {
  //       console.error("Error fetching user details:", error);
  //     }
  //   };

  //   getDetailUserProfile(id);
  // }, [id]);

  useEffect(() => {
    if (id) {
      // fetchUserDetails(id);
      getDetailBookingProfile(id);
      getDataICodeName();
      getCountry();
      getRole();
      getUser(id, organizationId);
      getGroup(id);
    }
  }, [id]);
  console.log("Giá trị hiện tại:", user.passportIssuedBy);
  console.log("Danh sách nơi cấp hộ chiếu:", countryList);

  const getRole = async () => {
    const response = await RoleService.getAll(
      Helpers.handleFormatParams({
        status: 1,
        clientId: Constants.CLIENT_ID,
        serviceCode: Constants.SERVICE_CODE,
        organizationId: organizationId,
      })
    );
    setRoleList(response);

    console.log("check response role:", response);
  };

  const getCountry = async () => {
    const result = await AdministrativeDivisionService.getAll({ type: 1 });
    setCountryList(
      result.map((item) => {
        return {
          code: item.code,
          name: item.name,
        };
      })
    );
  };

  // const getDataUser = async (userId:string, organizationId:string) => {
  //   try{
  //     const result = await UserService.getUserDetail(id, organizationId);

  //   }

  // }
  const getUser = async (id: string, organizationId: string) => {
    try {
      const response = await IdentityClient().get(
        `/User/Detail?id=${id}&OrganizationId=${organizationId}`
      );
      if (response.status == 200) {
        const result = response.data.result;

        console.log("check UserService: ", response.data.result);
        const newDataUser = {
          lastName: result.organizationUserProfile.lastName || "",
          firstName: result.organizationUserProfile.firstName || "",
          phone: result.organizationUserProfile.phoneNumber || "",
          email: result.organizationUserProfile.email || "",
          gender: result.organizationUserProfile.gender,
          dateOfBirth: result.organizationUserProfile.dateOfBirth,
          passportNumber: result.organizationUserProfile.passportNo || "",
          passportExpiry: result.organizationUserProfile.passportExpiredDate,
          passportIssuedPlace:
            result.organizationUserProfile.passportIssuedPlace || [],
          nationality: result.organizationUserProfile.nationality || "",
        };
        setUser(newDataUser);
        setRoleCodes(result.userRoles.map((e: IUserRole) => e.roleCode));
        console.log("roleCodes", roleCodes);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async () => {
    try {
      if (
        !userProfile?.id ||
        !userProfile?.identityId ||
        !userProfile?.organizationId
      ) {
        throw new Error("Missing required fields.");
      }

      const updatedData: IRequestUpdateOrganizationProfile = {
        id: userProfile.id,
        userId: userProfile.identityId,
        organizationId: userProfile.organizationId,
        userType: 0,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        dateOfBirth: user.dateOfBirth ? Number(user.dateOfBirth) : 0,
        gender: user.gender || 0,
        employmentDate: userProfile.employmentDate
          ? Number(userProfile.employmentDate)
          : 0,
        idCardNo: userProfile.idCardNo || "",
        idCardIssuedDate: userProfile.idCardIssuedDate
          ? Number(userProfile.idCardIssuedDate)
          : 0,
        idCardIssuedPlace: userProfile.idCardIssuedPlace || "",
        socialInsuranceCode: userProfile.socialInsuranceCode || "",
        email: user?.email || "",
        phoneNumber: user.phone,
        passportNo: userProfile.passportNo || "",
        passportExpiredDate: userProfile.passportExpiredDate
          ? Number(userProfile.passportExpiredDate)
          : 0,
        passportIssuedPlace: user.passportIssuedPlace || "",
        nationality: user.nationality || "",
      };
      console.log("Data to be sent:", updatedData);

      const result = await IdentityClient().post(
        "/User/UpdateOrganizationProfile",
        updatedData
      );

      console.log("Update successful:", result);
    } catch (error: any) {
      console.error("Update failed:", error.message || error);
    }
  };
  const handleUpdateRole = async () => {
    const userRoleData: IUserRoleData = {
      clientId: Constants.CLIENT_ID,
      organizationId: userProfile.organizationId,
      userId: userProfile.identityId,
      roleCodes: roleCodes,
    };

    try {
      const result = await IdentityClient().post(
        "/UserRole/Update",
        userRoleData
      );
      console.log("check role:", result);
      alert("Cập nhật thành công!");
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleUpdatePolicy = async () => {
    const policyData: IDataUpdate = {
      id: userProfile.identityId,
      userId: userProfile.identityId,
      flowId: dataBookingProfile.flowId,
      policyId: dataBookingProfile.policyId,
      organizationId: organizationId,
      budgetId: dataBookingProfile.budgetId,
      extraInformation: dataBookingProfile.extraInformation,
      updateTime: dataBookingProfile.updateTime,
    };

    try {
      const result = await UserProfileBookingService.update(policyData);
      console.log("check policy:", result);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const getDetailBookingProfile = async (userId: string) => {
    try {
      const result = await UserProfileBookingService.getDetail(userId);
      console.log("check:", result);

      const newData: IDataUpdate = {
        userId: userId,
        id: result?.id,
        flowId: result?.flowId,
        policyId: result?.policyId,
        budgetId: result?.budgetId,
        organizationId: result?.organizationId,
        extraInformation: result?.extraInformation,
        updateTime: result?.updateTime,
      };

      setDataBookingProfile(newData);
    } catch (error) {}
  };

  const handleActionModal = () => {};

  const getGroup = async () => {
    const newDataGroup: IGroupUser = {
      id: groupData[0]?.organizationProfile?.groupId || "",
      organizationId: organizationId,
      userId: id,
      groupId: groupData[0]?.organizationProfile?.groupId || "",
      manager: groupData[0]?.manager,
      default: groupData[0]?.default,
    };

    try {
      const responseData = await GroupService.getAll(
        new URLSearchParams(newDataGroup as any).toString()
      );
      setGroupData(responseData);
      console.log("Fetched groupData:", responseData);
    } catch (error) {
      console.error("Error fetching group data:", error);
    }
  };

  const updateGroupsUser = async () => {
    const UpdateGroup: IGroupUser = {
      id: groupData[0]?.organizationProfile?.id || "",
      groupId: groupData[0]?.organizationProfile?.groupId || "",
      organizationId: userProfile.organizationId,
      userId: id,
      manager: selectedGroup.isManager ? 1 : 0,
      default: selectedGroup.isDefault ? 1 : 0,
    };

    console.log("UpdateGroup payload:", UpdateGroup);

    try {
      const result = await IdentityClient().post(
        `/GroupUser/UpdateGroupUser`,
        UpdateGroup
      );

      const updatedData = result?.data;
      if (updatedData) {
        setGroupData((prevData) =>
          prevData.map((group) =>
            group.id === updatedData.id ? updatedData : group
          )
        );
      } else {
        console.warn("No updated data returned from API.");
      }

      setOpen(false);
      console.log("check UpdateGroup: ", result);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const getDataICodeName = async () => {
    try {
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

      setBudgetList(budgetListTemp);
    } catch (error) {}
  };

  // const onChangeValue = (val: any, key: string) => {
  //   setRoleList((prev) => ({
  //     ...prev,
  //     [key]: val,
  //   }));

  //   setError((prev) => ({
  //     ...prev,
  //     [key]: undefined,
  //   }));
  // };

  // const handleUpdateUser = async () => {
  //   if (!user.lastName || !user.firstName || !user.phone || !user.email) {
  //     setError({
  //       lastName: t("setting:required_lastname"),
  //       firstName: t("setting:required_firstname"),
  //       phone: t("setting:required_phone"),
  //       email: t("setting:required_email"),
  //     });
  //     return;
  //   }

  //   try {
  //     dispatch(showLoading());
  //     const updateData = {
  //       ...user,
  //       // organizationId,
  //     };
  //     console.log("Updating user data:", updateData);
  //     // await UserService.updateUser(user.id, updateData);
  //     dispatch(
  //       showSnackbar({ msg: t("common:update_success"), type: "success" })
  //     );
  //     router.push("/setting/userpage");
  //   } catch (error) {
  //     console.error("Error updating user:", error);
  //     dispatch(
  //       showSnackbar({ msg: t("common:error_updating_data"), type: "error" })
  //     );
  //   } finally {
  //     dispatch(hideLoading());
  //   }
  // };

  return (
    <CompanyLayout>
      <Box p={4}>
        <Grid container spacing={50}>
          <Grid item xs={6}>
            <Typography variant="h5">{t("Cập nhật nhân sự")}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Button
              style={{ background: "rgb(116, 123, 138)", color: "white" }}
              onClick={() => router.push("/setting/userpage")}
            >
              {t("common:go_back")}
            </Button>
          </Grid>
        </Grid>
      </Box>
      <div>
        <Box p={4}>
          <Grid container spacing={50}>
            <Grid item xs={6}>
              <Typography variant="h5">{t("Thông tin nhân sự ")}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Button
                variant="contained"
                color="primary"
                style={{ color: "white" }}
                onClick={onSubmit}
              >
                {t("common:save")}
              </Button>
              <Button
                variant="contained"
                style={{
                  marginLeft: "10px",
                  background: "rgb(116, 123, 138)",
                  color: "white",
                }}
                onClick={() => router.push("/setting/userpage")}
              >
                {t("common:cancel")}
              </Button>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={6}>
              <TextField
                label={t("setting:user_lastname")}
                value={user.lastName || ""}
                onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                variant="standard"
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label={t("setting:user_firstname")}
                value={user.firstName || ""}
                onChange={(e) =>
                  setUser({ ...user, firstName: e.target.value })
                }
                variant="standard"
              />
              {error.firstName && (
                <span style={{ color: "red" }}>{error.firstName}</span>
              )}
            </Grid>

            <Grid item xs={6}>
              <PhoneNumberInput
                country={"vn"}
                label={t("setting:user_phone")}
                value={user.phone || ""}
                defaultValue={user.phone || ""}
                onChangeValue={(value: string) =>
                  setUser({ ...user, phone: value })
                }
                variant="standard"
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Email"
                value={user.email || ""}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                variant="standard"
              />
              {error.email && (
                <span style={{ color: "red" }}>{error.email}</span>
              )}
            </Grid>

            <Grid item xs={6}>
              <FormControl variant="standard" fullWidth>
                <InputLabel>Giới tính</InputLabel>
                <Select
                  value={user.gender}
                  onChange={(e) => setUser({ ...user, gender: e.target.value })}
                  label="Giới tính"
                >
                  <MenuItem value={0}>Nam</MenuItem>
                  <MenuItem value={1}>Nữ</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <DatePicker
                key={user.dateOfBirth}
                label="Ngày sinh"
                value={Helpers.getDateValue(user.dateOfBirth)}
                onChangeValue={(e) =>
                  setUser({ ...user, dateOfBirth: e.unix() })
                }
                variant="standard"
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Số hộ chiếu"
                value={user.passportNumber}
                onChange={(e) =>
                  setUser({ ...user, passportNumber: e.target.value })
                }
                variant="standard"
              />
            </Grid>

            <Grid item xs={6}>
              <DatePicker
                label="Hạn hộ chiếu"
                // type="month"
                value={Helpers.getDateValue(user.passportExpiry)}
                onChangeValue={(e) =>
                  setUser({ ...user, passportExpiry: e.unix() })
                }
                variant="standard"
              />
            </Grid>

            <Grid item xs={6}>
              <FormControl variant="standard" fullWidth>
                <InputLabel>Nơi cấp hộ chiếu</InputLabel>
                <Select
                  label="Nơi cấp hộ chiếu"
                  value={user.passportIssuedPlace}
                  onChange={(e) =>
                    setUser({ ...user, passportIssuedPlace: e.target.value })
                  }
                >
                  <MenuItem value=""></MenuItem>
                  {countryList.map((country) => (
                    <MenuItem key={country.code} value={country.code}>
                      {country.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl variant="standard" fullWidth>
                <InputLabel>Quốc tịch</InputLabel>
                <Select
                  label="Quốc tịch"
                  value={user.nationality}
                  onChange={(e) =>
                    setUser({ ...user, nationality: e.target.value })
                  }
                >
                  <MenuItem value=""></MenuItem>
                  {countryList.map((country) => (
                    <MenuItem key={country.code} value={country.code}>
                      {country.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </div>
      <div style={{ marginTop: "3%" }}>
        <Box p={4}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="h5">{t("Vai trò ")}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="contained"
                color="primary"
                style={{ color: "white" }}
                onClick={handleUpdateRole}
              >
                {t("common:save")}
              </Button>
              <Button
                variant="contained"
                style={{
                  marginLeft: "10px",
                  background: "rgb(116, 123, 138)",
                  color: "white",
                }}
                onClick={() => router.push("/setting/userpage")}
              >
                {t("common:cancel")}
              </Button>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Box mb={2}>
              <Typography variant="h6">
                {t("setting:invitation.role")}
              </Typography>
            </Box>
            <Select
              multiple={true}
              label={t("Vai Tro")}
              defaultValue={roleCodes}
              value={roleCodes}
              placeholder={t("setting:invitation.select_role")}
              onChange={(e) => {
                setRoleCodes(e.target.value as string[]);
              }}
            >
              {roleList.map((r) => (
                <MenuItem key={r.roleCode} value={r.roleCode}>
                  {r.roleName}
                </MenuItem>
              ))}
            </Select>
          </Grid>
        </Box>
      </div>
      <div style={{ marginTop: "3%" }}>
        <Box p={4}>
          <Grid container spacing={50}>
            <Grid item xs={6}>
              <Typography variant="h5">{t("Thông tin cài đặt ")}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Button
                variant="contained"
                color="primary"
                style={{ color: "white" }}
                onClick={handleUpdatePolicy}
              >
                {t("common:save")}
              </Button>
              <Button
                variant="contained"
                style={{
                  marginLeft: "10px",
                  background: "rgb(116, 123, 138)",
                  color: "white",
                }}
                onClick={() => router.push("/setting/userpage")}
              >
                {t("common:cancel")}
              </Button>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>{t("Chế độ công tác")}</InputLabel>
                <NativeSelect
                  style={{ marginTop: "5%" }}
                  value={dataBookingProfile.policyId || ""}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    setDataBookingProfile((prev) => ({
                      ...prev,
                      policyId: e.target.value,
                    }));
                    setErrorBookingProfile((prev) => ({
                      ...prev,
                      policyId: undefined,
                    }));
                  }}
                >
                  {policyList.map((Icodename) => (
                    <option key={Icodename.id} value={Icodename.id}>
                      {Icodename.name}
                    </option>
                  ))}
                </NativeSelect>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>{t("Quy trình phê duyệt")}</InputLabel>
                <NativeSelect
                  style={{ marginTop: "5%" }}
                  value={dataBookingProfile.flowId || ""}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    setDataBookingProfile((prev) => ({
                      ...prev,
                      flowId: e.target.value,
                    }));
                    setErrorBookingProfile((prev) => ({
                      ...prev,
                      flowId: undefined,
                    }));
                  }}
                >
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
      {/* Phòng ban làm việc */}
      <div style={{ marginTop: "3%" }}>
        <Box p={3}>
          <Grid container spacing={50}>
            <Grid item xs={6}>
              <Typography variant="h5">Phòng ban làm việc</Typography>
            </Grid>
            <Grid item xs={6} style={{ textAlign: "right" }}>
              <Button
                style={{ background: "rgb(116, 123, 138)", color: "white" }}
                onClick={handleOpenAddDialog}
              >
                Thêm mới
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell>Thao tác</TableCell>
                  <TableCell>Tên phòng ban</TableCell>
                  <TableCell>Phòng ban mặc định</TableCell>
                  <TableCell>Quản lý phong ban </TableCell>
                  <TableCell>Chức danh nhân sự </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {groupData.map((group: IGroupUser, index: number) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Button onClick={() => handleEdit(group)}>
                        <EditIcon />
                      </Button>
                      <Button onClick={() => handleOpenDeleteDialog(group)}>
                        <DeleteIcon />
                      </Button>
                    </TableCell>
                    <TableCell>
                      {group.organizationProfile?.name?.value?.vi || "N/A"}
                    </TableCell>
                    <TableCell>
                      <Checkbox checked={group.default === 1} disabled />
                    </TableCell>
                    <TableCell>
                      <Checkbox checked={group.manager === 1} disabled />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Add Dialog */}
        <Dialog
          open={openAddDialog}
          onClose={handleCloseAddDialog}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Thêm mới</DialogTitle>
          <DialogContent>
            <Box display="flex" flexDirection="column" gap={2}>
              <TextField
                fullWidth
                placeholder="Tìm kiếm theo tên phòng ban"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
              />
              <Typography
                variant="body2"
                color="textSecondary"
                align="center"
                style={{ marginTop: "16px" }}
              >
                Không có dữ liệu
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseAddDialog}
              variant="contained"
              style={{ backgroundColor: "#757575", color: "#fff" }}
            >
              Đóng
            </Button>
            <Button
              onClick={handleCloseAddDialog}
              variant="contained"
              color="primary"
            >
              Lưu
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={open} onClose={handleClose} fullWidth>
          <DialogTitle>Cập nhật phòng ban</DialogTitle>
          <DialogContent>
            <Box display="flex" flexDirection="column" gap={2}>
              <Typography variant="button">
                Mã phòng ban:{" "}
                {selectedGroup?.organizationProfile?.name?.value?.vi || ""}
              </Typography>
              <Typography variant="button">
                Tên phòng ban:{" "}
                {selectedGroup?.organizationProfile?.name?.value?.vi || ""}
              </Typography>
              <Box display="flex" alignItems="center">
                <Switch
                  checked={selectedGroup?.isDefault || false}
                  onChange={(e) => {
                    setSelectedGroup((prev) => ({
                      ...prev,
                      isDefault: e.target.checked,
                    }));
                  }}
                />
                <Typography variant="button">Phòng ban mặc định</Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <Switch
                  checked={selectedGroup?.manager || false}
                  onChange={(e) => {
                    setSelectedGroup((prev) => ({
                      ...prev,
                      manager: e.target.checked,
                    }));
                  }}
                />
                <Typography variant="button">Quản lý phòng ban</Typography>
              </Box>

              <Autocomplete
                options={["Nhân viên", "Quản lý", "Giám đốc"]}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Chức danh nhân sự"
                    placeholder="Chọn chức danh"
                  />
                )}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Đóng</Button>
            <Button onClick={updateGroupsUser}>Lưu</Button>
          </DialogActions>
        </Dialog>

        {/* xoa */}

        <Dialog
          open={openDeleteDialog}
          onClose={handleCloseDeleteDialog}
          fullWidth
          maxWidth="xs"
        >
          <DialogContent style={{ textAlign: "center", padding: "20px" }}>
            <WarningAmberIcon
              color="warning"
              style={{ fontSize: 50, marginBottom: "10px" }}
            />
            <Typography variant="h6">Bạn có thực sự muốn xóa?</Typography>
          </DialogContent>
          <DialogActions
            style={{ justifyContent: "center", paddingBottom: "20px" }}
          >
            <Button
              onClick={handleCloseDeleteDialog}
              variant="contained"
              style={{ backgroundColor: "#757575", color: "#fff" }}
            >
              Hủy
            </Button>
            <Button
              onClick={handleConfirmDelete}
              variant="contained"
              color="primary"
            >
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </CompanyLayout>
  );
};

UserEditPage.requiredAuth = true;

export default withSSRErrorHandling(UserEditPage);

const getStaticProps = getServerSideTranslationsProps(["setting", "common"]);
export { getStaticProps };
