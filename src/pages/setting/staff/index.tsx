import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import {
  Box,
  Button,
  StaffListContainer,
} from "@maysoft/common-component-react";

import { useCommonComponentContext } from "@maysoft/common-component-react";
import Constants from "@src/constants";
import Helpers from "@src/commons/helpers";
import PathName from "@src/constants/PathName";
import { RootState } from "@src/store";
import { NextApplicationPage } from "@src/pages/_app";
import { withSSRErrorHandling } from "@src/commons/withSSRErrorHandling";
import { getServerSideTranslationsProps } from "@src/commons/translationHelpers";

// import Stack from "@mui/material/Stack";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TableRow from "@mui/material/TableRow";
// import Paper from "@mui/material/Paper";
// import TextField from "@mui/material/TextField";
// import { Grid, Typography } from "@mui/material";
// import { useQueryParams } from "@src/commons/useQueryParams";
import CompanyLayout from "@src/layout/companyLayout";
import { useQueryParams } from "@src/commons/useQueryParams";

interface IRequestGetPage {
  orderby?: string;
  pageSize?: number;
  pageNumber?: number;
  totalCount?: number;
  searchText?: string;
  groupId?: string;
  fullName?: string;
  listStatus?: number[];
  roleCode?: string;
  isAll?: boolean;
}

const StaffListScreen: NextApplicationPage = () => {
  const {
    t,
    i18n: { language },
  } = useTranslation(["common", "setting"]);
  const router = useRouter();

  const { getResourcePermissions } = useCommonComponentContext();
  const resourcePermissions = getResourcePermissions(
    Constants.ResourceURI.STAFF
  );

  const filter: any | undefined = useQueryParams([
    "status",
    "searchText",
    "organizationCode",
  ]);

  const userProfile = useSelector(
    (state: RootState) => state.userInfo.userProfile
  );
  const [dataRequest] = useState<IRequestGetPage>({
    groupId: router?.query?.groupId,
    roleCode: router?.query?.roleCode,
    searchText: router?.query?.searchText,
    listStatus:
      !Helpers.isNullOrEmpty(router?.query?.listStatus) &&
      (Array.isArray(router?.query?.listStatus)
        ? router?.query?.listStatus
        : [router?.query?.listStatus]
      ).map((el) => Number(el)),
    pageNumber: Number(router?.query?.pageNumber || 1),
    pageSize: Number(router?.query?.pageSize || Constants.ROW_PER_PAGE_20),
    totalCount: 0,
  } as IRequestGetPage);

  // const [staffData, setStaffData] = useState<any[]>([]);
  // const [loading, setLoading] = useState<boolean>(false);

  // useEffect(() => {
  //   const pathTemp = Helpers.getLocalStorage(
  //     Constants.StorageKeys.PATH_NAME_SETTING,
  //     PathName.ORGANIZATION
  //   );
  //   if (!permissionAdmin) {
  //     router.push(pathTemp);
  //   } else {
  //     fetchStaffData();
  //   }
  // }, [permissionAdmin]);

  // const fetchStaffData = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await UserService.getPaged(dataRequest);
  //     console.log("Data received from API:", response);
  //     setStaffData(response.items || []);
  //   } catch (error) {
  //     console.error("Error fetching staff data:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <>
      <CompanyLayout>
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
          {/* <Typography variant="h5">
            {t("setting:staff_title_list_view")}
          </Typography>  */}
          {/* {resourcePermissions.canCreate && ( */}
          <Box
            sx={{
              gap: 1,
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "flex-end",
              marginLeft: "auto",
            }}
          >
            {/* <Button
              color="info"
              onClick={() => {
                router.push(PathName.STAFF_INVITATION);
              }}
            >
              {t("setting:invitation.invite_staff")}
            </Button> */}

            <Button
              color="success"
              onClick={() => {
                router.push(PathName.STAFF_CREATE);
              }}
            >
              {t("setting:staff_title_create_view")}
            </Button>
          </Box>
        </Box>

        <StaffListContainer
          hidenActionInvitation
          hidenActionDeleteAllService
          hidenActionCreate
          hidenActionDelete={!resourcePermissions.canDelete}
          hidenActionUpdate={!resourcePermissions.canUpdate}
          title={t("setting:staff_title_list_view")}
          lableGroup={t("setting:group_title_menu")}
          lableStaff={t("setting:staff_title_menu")}
          lableOrganization={t("setting:title_menu")}
          requestGetPaged={dataRequest}
          onGetPaged={({ query, totalCount }) => {
            router.push(
              {
                query: query.replace("?", ""),
              },
              undefined,
              { shallow: true }
            );
          }}
          onNavigate={(data) => {
            if (data?.id) {
              router.push(
                PathName.STAFF_EDIT + `?id=${data?.id}&mode=${data?.mode}`
              );
            } else {
              router.push(PathName.STAFF_EDIT);
            }
          }}
        />

        {/* <TableContainer component={Paper}>
          <div>
            <Stack
              spacing={2}
              sx={{ width: 250 }}
              style={{ marginLeft: "65%", marginBottom: "2%" }}
            >
              <TextField
                variant="outlined"
                size="small"
                placeholder={t("common:searchPlaceholder")}
              />
            </Stack>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow style={{ backgroundColor: "ButtonFace" }}>
                  <TableCell align="right">THAO TÁC</TableCell> 
                  <TableCell align="right">HỌ VÀ TÊN</TableCell>
                  <TableCell align="right">NHÓM LÀM VIỆC</TableCell>
                  <TableCell align="right">VAI TRÒ NHÂN SỰ</TableCell>
                  <TableCell align="right">TRẠNG THÁI</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      {t("common:loading")}
                    </TableCell>
                  </TableRow>
                ) : (
                  <div>
                    {staffData.length > 0 ? (
                      staffData.map((staff) => (
                        <TableRow key={staff.id}>
                          <TableCell align="right">{staff.fullName}</TableCell>
                          <TableCell align="right">{staff.groupName}</TableCell>
                          <TableCell align="right">{staff.roleName}</TableCell>
                          <TableCell align="right">{staff.status}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          {t("common:setting")}
                        </TableCell>
                      </TableRow>
                    )}
                  </div>
                )}
              </TableBody>
            </Table>
          </div>
        </TableContainer> */}
      </CompanyLayout>
    </>
  );
};

StaffListScreen.requiredAuth = true;

export default withSSRErrorHandling(StaffListScreen);

const getStaticProps = getServerSideTranslationsProps(["setting", "common"]);
export { getStaticProps };

// import { useRouter } from "next/router";
// import { useSelector } from "react-redux";
// import { useTranslation } from "react-i18next";
// import { useEffect, useMemo, useState } from "react";
// import {
//   Box,
//   Button,
//   RoleHelpers,
//   StaffListContainer,
//   Typography,
//   useCommonComponentContext,
// } from "@maysoft/common-component-react";

// import Constants from "@src/constants";
// import Helpers from "@src/commons/helpers";
// import PathName from "@src/constants/PathName";
// import CompanyLayout from "@src/layout/companyLayout";

// import { RootState } from "@src/store";
// import { NextApplicationPage } from "@src/pages/_app";
// import { withSSRErrorHandling } from "@src/commons/withSSRErrorHandling";
// import { getServerSideTranslationsProps } from "@src/commons/translationHelpers";

// interface IRequestGetPage {
//   orderby?: string;
//   pageSize?: number;
//   pageNumber?: number;
//   totalCount?: number;
//   searchText?: string;
//   groupId?: string;
//   fullName?: string;
//   listStatus?: number[];
//   roleCode?: string;
//   isAll?: boolean;
// }

// const StaffPage: NextApplicationPage = () => {
//   const {
//     t,
//     i18n: { language },
//   } = useTranslation(["common", "setting"]);

//   const router = useRouter();
//   const { getResourcePermissions } = useCommonComponentContext();

//   const resourcePermissions = getResourcePermissions(
//     Constants.ResourceURI.STAFF
//   );

//   const userProfile = useSelector(
//     (state: RootState) => state.userInfo.userProfile
//   );

//   const [dataRequest] = useState<IRequestGetPage>({
//     groupId: router?.query?.groupId,
//     roleCode: router?.query?.roleCode,
//     searchText: router?.query?.searchText,
//     listStatus:
//       !Helpers.isNullOrEmpty(router?.query?.listStatus) &&
//       (Array.isArray(router?.query?.listStatus)
//         ? router?.query?.listStatus
//         : [router?.query?.listStatus]
//       ).map((el) => Number(el)),
//     pageNumber: Number(router?.query?.pageNumber || 1),
//     pageSize: Number(router?.query?.pageSize || Constants.ROW_PER_PAGE_20),
//     totalCount: 0,
//   } as IRequestGetPage);

//   return (
//     <>
//       <Box>
//         <Box
//           sx={{
//             mb: 3,
//             gap: 1,
//             display: "flex",
//             flexWrap: "wrap",
//             alignItems: "center",
//             justifyContent: "space-between",
//           }}
//         >
//           <Typography variant="h5">
//             {t("setting:staff_title_list_view")}
//           </Typography>
//           {resourcePermissions.canCreate && (
//             <Box
//               sx={{
//                 gap: 1,
//                 display: "flex",
//                 flexWrap: "wrap",
//                 alignItems: "center",
//                 justifyContent: "flex-end",
//                 marginLeft: "auto",
//               }}
//             >
//               {/* <Button color="info" onClick={() => { router.push(PathName.STAFF_INVITATION); }} >
//                             {t("setting:invitation.invite_staff")}
//                         </Button> */}
//               <Button
//                 onClick={() => {
//                   router.push(PathName.STAFF_CREATE);
//                 }}
//               >
//                 {t("setting:staff_title_create_view")}
//               </Button>
//             </Box>
//           )}
//         </Box>

//         <StaffListContainer
//           hidenActionCreate
//           hidenActionInvitation
//           hidenActionDeleteAllService
//           hidenActionDelete={!resourcePermissions.canDelete}
//           hidenActionUpdate={!resourcePermissions.canUpdate}
//           lableGroup={t("setting:group_title_menu")}
//           lableStaff={t("setting:staff_title_menu")}
//           lableOrganization={t("setting:title_menu")}
//           requestGetPaged={dataRequest}
//           onGetPaged={({ query, totalCount }) => {
//             router.push(
//               {
//                 query: query.replace("?", ""),
//               },
//               undefined,
//               { shallow: true }
//             );
//           }}
//           onNavigate={(data) => {
//             if (data?.id) {
//               router.push(
//                 PathName.STAFF_EDIT + `?id=${data?.id}&mode=${data?.mode}`
//               );
//             } else {
//               router.push(PathName.STAFF_EDIT);
//             }
//           }}
//         />
//       </Box>
//     </>
//   );
// };

// StaffPage.requiredAuth = true;
// StaffPage.requiredSettinglayout = true;
// export default withSSRErrorHandling(StaffPage);

// const getStaticProps = getServerSideTranslationsProps(["setting", "common"]);
// export { getStaticProps };
