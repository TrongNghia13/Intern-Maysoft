import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  Box,
  Button,
  CircularProgress,
  StaffListContainer,
} from "@maysoft/common-component-react";
import { useCommonComponentContext } from "@maysoft/common-component-react";
import CompanyLayout from "@src/layout/companyLayout";
import UserService from "@src/services/identity/UserService";
import GroupService from "@src/services/identity/GroupService";
import RoleService from "@src/services/identity/RoleSerice";
import OrganizationService from "@src/services/identity/Organization.service";
import { RootState } from "@src/store";
import { withSSRErrorHandling } from "@src/commons/withSSRErrorHandling";
import { getServerSideTranslationsProps } from "@src/commons/translationHelpers";
import {
  IUser,
  IGroupUser,
  IUserRole,
  IOrganization,
} from "@src/commons/interfaces";
import { useQueryParams } from "@src/commons/useQueryParams";
import Constants from "@src/constants";
import { debounce } from "@mui/material";
import UserProfileBookingService, {
  IDataUpdate,
} from "@src/services/booking/UserProfileBookingService";

const UserPage = () => {
  const { t } = useTranslation(["common", "setting", "booking"]);
  const router = useRouter();

  const filter: any | undefined =
    useQueryParams(["searchText", "pageNumber", "pageSize"]) ?? {};
  const userProfile = useSelector(
    (state: RootState) => state.userInfo.userProfile
  );

  const [users, setUsers] = useState<IUser[]>([]);
  const [groups, setGroups] = useState<IGroupUser[]>([]);
  const [roles, setRoles] = useState<IUserRole[]>([]);
  const [organization, setOrganization] = useState<IOrganization | undefined>(
    undefined
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { getResourcePermissions } = useCommonComponentContext();
  const resourcePermissions = getResourcePermissions(
    Constants.ResourceURI.STAFF
  );
  const [dataBookingProfile, setDataBookingProfile] = useState<IDataUpdate>({});
  const [errrorBookingProfile, setErrorBookingProfile] = useState<IDataUpdate>(
    {}
  );
  const [dataBookingProfileBackup, setDataBookingProfileBackup] =
    useState<IDataUpdate>({});

  const dataRequest = {
    searchText: filter.searchText,
    pageNumber: Number(filter.pageNumber) || 1,
    pageSize: Number(filter.pageSize) || Constants.ROW_PER_PAGE_20,
    totalCount: 0,
    organizationId: userProfile?.organizationId,
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await UserService.getPaged(dataRequest);
      setUsers(response.items || []);
    } catch (err) {
      setError(t("common:fetchError"));
    } finally {
      setLoading(false);
    }
  };

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const groupData = await GroupService.getAll("");
      setGroups(groupData.items || []);
    } catch (error) {
      console.error("Error fetching groups:", error);
      setError(t("common:fetchError"));
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const roleData = await RoleService.getAll("");
      setRoles(roleData.items || []);
    } catch (error) {
      console.error("Error fetching roles:", error);
      setError(t("common:fetchError"));
    } finally {
      setLoading(false);
    }
  };

  const fetchOrganizationDetail = async (organizationId: string) => {
    setLoading(true);
    try {
      const result = await OrganizationService.getDetail({
        id: organizationId,
      });
      setOrganization(result);
    } catch (err) {
      console.error("Error fetching organization detail:", err);
      setError(t("common:fetchError"));
    } finally {
      setLoading(false);
    }
  };

  const getDetailBookingProfile = async (userId: string) => {
    try {
      const result = await UserProfileBookingService.getDetail(userId);
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
      setDataBookingProfileBackup(newData);
    } catch (error) {}
  };

  useEffect(() => {
    if (userProfile?.organizationId) {
      fetchOrganizationDetail(userProfile.organizationId);
    }
  }, [userProfile]);

  const debouncedSearch = debounce((value: string) => {
    router.push({ query: { ...filter, searchText: value, pageNumber: 1 } });
  }, 300);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  useEffect(() => {
    fetchUsers();
    fetchGroups();
    fetchRoles();
  }, [filter]);

  const handleViewUser = (userId: string) => {
    if (userProfile.id) {
      router.push(`/setting/staff/edit?id=${userId}&mode=1`);
    } else {
      console.error("Missing organization ID");
    }
  };

  const handleCreateUser = () => {
    router.push(`/setting/userpage/create`);
  };

  console.log("check btn Create: ", handleCreateUser);

  const handleEditUser = (userId: string) => {
    if (userProfile.id) {
      router.push(`/setting/userpage/edit?id=${userId}&mode=1`);
    } else {
      console.error("Missing organization ID");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!userId) {
      console.error("User ID is invalid");
      return;
    }
    try {
      // await UserService.deleteUser(userId);
      fetchUsers();
    } catch (error) {
      setError(t("common:deleteError"));
    }
  };

  return (
    <CompanyLayout>
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>{t("setting:userpage_title_list_view")}</h1>

        <Button color="success" onClick={handleCreateUser}>
          {t("userpage_title_create_view")}
        </Button>
      </Box>
      {loading && <CircularProgress />}
      <input
        type="text"
        placeholder={t("common:searchPlaceholder")}
        value={filter.searchText || ""}
        onChange={handleSearchChange}
      />
      <table>
        <thead>
          <tr>
            <th>{t("common:action")}</th>
            <th>{t("common:Full_Name")}</th>
            <th>{t("common:group")}</th>
            <th>{t("common:HR_Staff")}</th>
            <th>{t("common:state")}</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td>
                  <Button onClick={() => handleViewUser(user.id)}>
                    {t("common:view")}
                  </Button>
                  <Button onClick={() => handleEditUser(user.id)}>
                    {t("common:edit")}
                  </Button>
                  <Button onClick={() => handleDeleteUser(user.id)}>
                    {t("common:delete")}
                  </Button>
                </td>
                <td>{user.userName}</td>
                <td>
                  {
                    groups.find((group) => group.id === user.groupId)?.groupName
                      ?.value.env
                  }
                </td>
                <td>{userProfile?.roleName}</td>

                <td>{}</td>
              </tr>
            ))
          ) : (
            <tr></tr>
          )}
        </tbody>
      </table>
    </CompanyLayout>
  );
};

UserPage.requiredSettinglayout = true;
UserPage.requiredAuth = true;
export default withSSRErrorHandling(UserPage);

const getStaticProps = getServerSideTranslationsProps(["setting", "common"]);
export { getStaticProps };
