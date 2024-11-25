// #region Policy New Version Page

import { Grid } from "@mui/material";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import {
  Box,
  Button,
  Typography,
  useCommonComponentContext,
} from "@maysoft/common-component-react";

import Constants from "@src/constants";
import Helpers from "@src/commons/helpers";
import PathName from "@src/constants/PathName";
import ModalCopyPolicy from "@src/components/Policy/modalCopyPolicy";
import BookingPolicyService from "@src/services/booking/BookingPolicyService";
import useDataPolicyNewVersion from "@src/hooks/useDataPolicyNewVersion.hook";
import CardListItemPolicyNewVersion from "@src/components/PolicyNewVersion/cardListItemPolicyNewVersion";

import { RootState } from "@src/store";
import { Mode } from "@src/commons/enum";
import { Pagination } from "@src/components";
import { NextApplicationPage } from "../../_app";
import { IPagedList } from "@src/commons/interfaces";
import { titleStyles } from "@src/styles/commonStyles";
import { IRecordPolicy } from "@src/hooks/useDataPolicy.hook";
import { hideLoading, showLoading } from "@src/store/slice/common.slice";
import { withSSRErrorHandling } from "@src/commons/withSSRErrorHandling";
import { getServerSideTranslationsProps } from "@src/commons/translationHelpers";
import CompanyLayout from "@src/layout/companyLayout";

const PolicyPage: NextApplicationPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { getResourcePermissions } = useCommonComponentContext();

  const {
    t,
    i18n: { language },
  } = useTranslation(["common", "setting"]);

  const pageNumber = Number(router?.query?.page || 1);

  const resourcePermissions = getResourcePermissions(
    Constants.ResourceURI.POLICY
  );

  const userProfile = useSelector(
    (state: RootState) => state.userInfo?.userProfile
  );

  const [valueSearchText, setValueSearchText] = useState<any>(undefined);

  const [itemPolicyCopy, setItemPolicyCopy] = useState<
    IRecordPolicy | undefined
  >(undefined);

  const [dataPolicy, setDataPolicy] = useState<IPagedList<IRecordPolicy>>({
    totalPages: 1,
    totalCount: 0,
    currentPage: 1,
    hasNext: false,
    hasPrevious: false,
    pageSize: Constants.ROW_PER_PAGE_20,
    items: [],
  });

  const { handleDeletePolicy } = useDataPolicyNewVersion({
    serviceCode: Constants.SERVICE_CODE,
    organizationId: userProfile?.organizationId || "0",
  });

  useEffect(() => {
    getPagedPolicy({ pageNumber: pageNumber });
  }, [pageNumber, userProfile.organizationId]);

  const getPagedPolicy = async ({
    pageNumber,
    searchText,
  }: {
    pageNumber?: number;
    searchText?: string;
  }) => {
    try {
      dispatch(showLoading());

      const pageSize = Constants.ROW_PER_PAGE;
      const page = Helpers.getPageNumber(
        pageNumber || 1,
        pageSize,
        dataPolicy?.totalCount || 0
      );

      const resultGetpaged = await BookingPolicyService.getPaged({
        pageSize,
        pageNumber: page,
        searchText: searchText,
        organizationId: userProfile?.organizationId || "0",
      });

      setDataPolicy(resultGetpaged);
      setValueSearchText(searchText);
    } catch (error) {
      Helpers.handleError(error);
    } finally {
      dispatch(hideLoading());
    }
  };

  const handlePageChange = (event: any, newPage: number) => {
    router.push(
      {
        query: {
          ...router.query,
          page: newPage,
        },
      },
      undefined,
      { shallow: true }
    );
  };

  return (
    <CompanyLayout>
      <Grid container spacing={3}>
        {/* title */}
        <Grid item xs={12}>
          <Box
            sx={{
              gap: 1,
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h6" sx={titleStyles}>
              {t("setting:policy_title_menu")}
            </Typography>
            {resourcePermissions.canCreate && dataPolicy?.items?.length > 0 && (
              <Box marginLeft="auto">
                <Button
                  color="info"
                  onClick={() => {
                    router.push(PathName.POLICY_CREATE);
                  }}
                >
                  {t("setting:policy_title_create_view")}
                </Button>
              </Box>
            )}
          </Box>
        </Grid>

        {/* <Grid item xs={12}>
                    <Box>
                        <FormField
                            maxLength={255}
                            variant="outlined"
                            value={valueSearchText || ""}
                            placeholder={t("setting:policy.search_text")}
                            onChangeValue={(value: any) => {
                                setValueSearchText(value);
                            }}
                            onKeyPress={(e: any) => {
                                if (e.key === "Enter") {
                                    getPagedPolicy({
                                        pageNumber: pageNumber,
                                        searchText: valueSearchText,
                                    });
                                }
                            }}
                            InputProps={{
                                startAdornment: (
                                    <IconButton
                                        color="info"
                                        onClick={() => {
                                            getPagedPolicy({
                                                pageNumber: pageNumber,
                                                searchText: valueSearchText,
                                            });
                                        }}
                                    >
                                        <Search />
                                    </IconButton>
                                ),
                                endAdornment: valueSearchText && (
                                    <IconButton
                                        color="secondary"
                                        onClick={() => {
                                            getPagedPolicy({
                                                searchText: undefined,
                                                pageNumber: pageNumber,
                                            });
                                        }}
                                    >
                                        <Close />
                                    </IconButton>
                                ),
                            }}
                        />
                    </Box>
                </Grid> */}

        {/* List Item */}
        <Grid item xs={12}>
          <CardListItemPolicyNewVersion
            dataPolicies={dataPolicy?.items}
            onCoppy={
              resourcePermissions.canCreate
                ? (newItem) => {
                    setItemPolicyCopy(newItem);
                  }
                : undefined
            }
            onCreate={
              resourcePermissions.canCreate
                ? () => {
                    router.push(PathName.POLICY_CREATE);
                  }
                : undefined
            }
            onDelete={
              resourcePermissions.canDelete
                ? (newId) => {
                    Helpers.showConfirmAlert(
                      t("setting:policy.confirm_delete"),
                      async () => {
                        await handleDeletePolicy(newId);
                        await getPagedPolicy({ pageNumber: pageNumber });
                      }
                    );
                  }
                : undefined
            }
            onDetail={(newId) => {
              router.push({
                pathname: PathName.POLICY_DETAIL,
                query: {
                  id: newId,
                  mode: Mode.View,
                },
              });
            }}
            onUpdate={
              resourcePermissions.canUpdate
                ? (newId) => {
                    router.push({
                      pathname: PathName.POLICY_DETAIL,
                      query: {
                        id: newId,
                        mode: Mode.Update,
                      },
                    });
                  }
                : undefined
            }
          />
        </Grid>

        {/* Pagination */}
        {dataPolicy?.totalPages > 0 && (
          <Grid item xs={12}>
            <Box
              sx={{
                my: 2,
                gap: 1,
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="button" sx={{ paddingLeft: 1 }}>
                {"Tổng: " + dataPolicy?.totalCount}
              </Typography>
              <Pagination
                onChange={handlePageChange}
                page={dataPolicy?.currentPage}
                count={dataPolicy?.totalPages}
              />
            </Box>
          </Grid>
        )}

        {itemPolicyCopy?.id && (
          <ModalCopyPolicy
            dataPolicyCopy={itemPolicyCopy}
            onClose={() => {
              setItemPolicyCopy(undefined);
            }}
            onSubmit={async () => {
              setItemPolicyCopy(undefined);
              await getPagedPolicy({ pageNumber: 1 });
            }}
          />
        )}
      </Grid>
    </CompanyLayout>
  );
};

PolicyPage.requiredAuth = true;
PolicyPage.requiredSettinglayout = true;
export default withSSRErrorHandling(PolicyPage);

const getStaticProps = getServerSideTranslationsProps(["setting", "common"]);
export { getStaticProps };

// #endregion Policy New Version Page

// #region Policy Old Version Page

// import { Grid } from "@mui/material";
// import { useRouter } from "next/router";
// import { useSelector } from "react-redux";
// import { useTranslation } from "next-i18next";
// import { useEffect, useMemo, useState } from "react";
// import { Box, Button, Typography } from "@maysoft/common-component-react";

// import Helpers from "@src/commons/helpers";
// import CompanyLayout from "@src/layout/companyLayout";
// import ModalCopyPolicy from "@src/components/Policy/modalCopyPolicy";
// import CardListItemPolicy from "@src/components/Policy/cardListItemPolicy";
// import ModalCreateUpdatePolicy from "../../../components/Policy/modalCreateUpdatePolicy";

// import { RootState } from "@src/store";
// import { RoleLevel } from "@src/commons/enum";
// import { NextApplicationPage } from "../../_app";
// import { titleStyles } from "@src/styles/commonStyles";
// import { ModalPolicyStay } from "@src/components/Policy/PolicyStay";
// import { ModalPolicyFlight } from "@src/components/Policy/PolicyFlight";
// import { withSSRErrorHandling } from "@src/commons/withSSRErrorHandling";
// import { getServerSideTranslationsProps } from "@src/commons/translationHelpers";
// import { ModalPolicyStay_V2Multiple } from "@src/components/Policy/PolicyStay_V2Multiple";
// import { ModalPolicyFlight_V2Multiple } from "@src/components/Policy/PolicyFlight_V2Multiple";
// import useDataPolicy, { IPolicyCriteria, IRecordPolicy } from "@src/hooks/useDataPolicy.hook";

// const PolicyListPage: NextApplicationPage = () => {
//     const {
//         t,
//         i18n: { language },
//     } = useTranslation(["common", "setting"]);

//     const router = useRouter();

//     const {
//         dataPolicy,

//         listAriLines,

//         listStaySelected,
//         listDomesticStayDefaule,
//         listInternationalStayDefaule,

//         listFlightSelected,
//         listDomesticFlightDefaule,
//         listInternationalFlightDefaule,

//         getPagedPolicy,
//         handleDeletePolicy,
//         handleCreateCopyPolicy,
//         handleUpdateDataDetailPolicy,

//         getDataAirpostBySelectCodes,
//         getDataAddressBySelectCodes,
//     } = useDataPolicy();

//     const isLoading = false;
//     const pageNumber = Number(router?.query?.page || 1);

//     const userProfile = useSelector((state: RootState) => state.userInfo?.userProfile);

//     const permissionAdmin = useMemo(() => (
//         userProfile?.roleLevel === RoleLevel.Owner ||
//         userProfile?.roleLevel === RoleLevel.Admin ||
//         userProfile?.roleLevel === RoleLevel.SuperAdmin ||
//         userProfile?.roleLevel === RoleLevel.ServiceAdmin
//     ), [userProfile?.roleLevel]);

//     const [isActive, setIsActive] = useState<boolean>(true);
//     const [listIdOpen, setListIdOpen] = useState<string[]>([]);

//     //
//     const [itemPolicyCopy, setItemPolicyCopy] = useState<IRecordPolicy | undefined>(undefined);

//     //
//     const [openCreatePolicy, setOpenCreatePolicy] = useState<boolean>(false);
//     const [dataItemPolicy, setDataItemPolicy] = useState<IRecordPolicy | undefined>(undefined);

//     //
//     const [openModalPolicyStay, setOpenModalPolicyStay] = useState<boolean>(false);
//     const [dataModalPolicyStay, setDataModalPolicyStay] = useState<Map<string, IPolicyCriteria>>(new Map());
//     //
//     const [openModalPolicyFlight, setOpenModalPolicyFlight] = useState<boolean>(false);
//     const [dataModalPolicyFlight, setDataModalPolicyFlight] = useState<Map<string, IPolicyCriteria>>(new Map());

//     useEffect(() => {
//         getDataAirpostBySelectCodes({ isDefault: true, });
//         getDataAirpostBySelectCodes({ isDefault: true, countryCode: "VN" });

//         getDataAddressBySelectCodes({ isDefault: true });
//         getDataAddressBySelectCodes({ isDefault: true, countryCode: "VN" });
//     }, []);

//     useEffect(() => {
//         getPagedPolicy({ pageNumber: pageNumber });
//     }, [pageNumber, userProfile.organizationId]);

//     const handlePageChange = (event: any, newPage: number) => {
//         router.push(
//             {
//                 query: {
//                     ...router.query,
//                     page: newPage,
//                 },
//             },
//             undefined,
//             { shallow: true }
//         );
//     };

//     return (
//         <CompanyLayout>
//             <Grid container spacing={3}>
//                 <Grid item xs={12}>
//                     <Box sx={{
//                         display: "flex",
//                         flexWrap: "wrap",
//                         alignItems: "center",
//                         justifyContent: "space-between",
//                         gap: 2,
//                     }}>
//                         <Typography variant="h6" sx={titleStyles}>
//                             {t("setting:policy_title_menu")}
//                         </Typography>
//                         {permissionAdmin &&
//                             (dataPolicy?.items?.length > 0) &&
//                             <Box marginLeft="auto">
//                                 <Button onClick={() => {
//                                     setOpenCreatePolicy(true);
//                                 }}>
//                                     {t("setting:policy_title_create_view")}
//                                 </Button>
//                             </Box>
//                         }
//                     </Box>
//                 </Grid>

//                 <Grid item xs={12}>
//                     <CardListItemPolicy
//                         isActive={isActive}
//                         isLoading={isLoading}
//                         dataPolicy={dataPolicy}

//                         listAriLines={listAriLines}
//                         listStaySelected={listStaySelected}
//                         listFlightSelected={listFlightSelected}

//                         hidenCreate={!permissionAdmin}
//                         hidenDelete={!permissionAdmin}
//                         hidenUpdate={!permissionAdmin}

//                         hidenFlightTime={true}
//                         hidenBookingTime={true}

//                         listIdOpen={listIdOpen}
//                         setListIdOpen={setListIdOpen}

//                         onPageChange={handlePageChange}
//                         onButtonCreate={() => { setOpenCreatePolicy(true); }}

//                         onEditPolicyFlight={(data) => {
//                             setOpenModalPolicyFlight(true);
//                             setDataModalPolicyFlight(data);
//                         }}
//                         onEditPolicyStay={(data) => {
//                             setOpenModalPolicyStay(true);
//                             setDataModalPolicyStay(data);
//                         }}

//                         onArchive={(idRow) => { }}

//                         onDelete={(idRow) => {
//                             Helpers.showConfirmAlert(
//                                 t("setting:policy.confirm_delete"),
//                                 async () => {
//                                     await handleDeletePolicy(idRow);
//                                     await getPagedPolicy({ pageNumber: 1 });
//                                 },
//                             );
//                         }}

//                         onCoppy={(itemRow) => {
//                             Helpers.showConfirmAlert(
//                                 t("setting:policy.confirm_create_copy"),
//                                 () => {
//                                     setItemPolicyCopy(itemRow);
//                                 }
//                             );
//                         }}

//                         onEdit={(itemRow) => {
//                             setOpenCreatePolicy(true);
//                             setDataItemPolicy(itemRow);
//                         }}

//                     />
//                 </Grid>

//                 {
//                     openModalPolicyFlight &&
//                     (
//                         // <ModalPolicyFlight
//                         //     open={openModalPolicyFlight}
//                         //     setOpen={setOpenModalPolicyFlight}

//                         //     hidenFlightTime={true}

//                         //     data={dataModalPolicyFlight}
//                         //     setDataModalPolicyFlight={setDataModalPolicyFlight}

//                         //     listAriLines={listAriLines}
//                         //     listFlightSelected={listFlightSelected}
//                         //     listDomesticFlightDefaule={listDomesticFlightDefaule}
//                         //     listInternationalFlightDefaule={listInternationalFlightDefaule}

//                         //     onSubmit={async (data) => {
//                         //         await handleUpdateDataDetailPolicy(data);

//                         //         await getPagedPolicy({ pageNumber: 1 });
//                         //     }}
//                         // />
//                         <ModalPolicyFlight_V2Multiple
//                             open={openModalPolicyFlight}
//                             setOpen={setOpenModalPolicyFlight}

//                             hidenFlightTime={true}
//                             hidenBookingTime={true}

//                             data={dataModalPolicyFlight}
//                             setDataModalPolicyFlight={setDataModalPolicyFlight}

//                             listAriLines={listAriLines}
//                             listFlightSelected={listFlightSelected}
//                             listDomesticFlightDefaule={listDomesticFlightDefaule}
//                             listInternationalFlightDefaule={listInternationalFlightDefaule}

//                             onSubmit={async (data) => {
//                                 await handleUpdateDataDetailPolicy(data);

//                                 await getPagedPolicy({ pageNumber: 1 });
//                             }}
//                         />
//                     )
//                 }

//                 {
//                     openModalPolicyStay &&
//                     // <ModalPolicyStay
//                     //     open={openModalPolicyStay}
//                     //     data={dataModalPolicyStay}

//                     //     listStaySelected={listStaySelected}
//                     //     listDomesticStayDefaule={listDomesticStayDefaule}
//                     //     listInternationalStayDefaule={listInternationalStayDefaule}

//                     //     setOpen={setOpenModalPolicyStay}
//                     //     setDataModalPolicyStay={setDataModalPolicyStay}
//                     //     onSubmit={async (data) => {
//                     //         await handleUpdateDataDetailPolicy(data);

//                     //         await getPagedPolicy({ pageNumber: 1 });
//                     //     }}
//                     // />
//                     <ModalPolicyStay_V2Multiple
//                         open={openModalPolicyStay}
//                         data={dataModalPolicyStay}

//                         hidenBookingTime={true}

//                         listStaySelected={listStaySelected}
//                         listDomesticStayDefaule={listDomesticStayDefaule}
//                         listInternationalStayDefaule={listInternationalStayDefaule}

//                         setOpen={setOpenModalPolicyStay}
//                         setDataModalPolicyStay={setDataModalPolicyStay}
//                         onSubmit={async (data) => {
//                             await handleUpdateDataDetailPolicy(data);

//                             await getPagedPolicy({ pageNumber: 1 });
//                         }}
//                     />
//                 }

//                 {
//                     itemPolicyCopy?.id &&
//                     <ModalCopyPolicy
//                         dataPolicyCopy={itemPolicyCopy}
//                         onClose={() => { setItemPolicyCopy(undefined); }}
//                         onSubmit={async () => {
//                             setItemPolicyCopy(undefined);
//                             await getPagedPolicy({ pageNumber: 1 });
//                         }}
//                     />
//                 }

//                 {openCreatePolicy &&
//                     <ModalCreateUpdatePolicy
//                         title={dataItemPolicy?.id
//                             ? t("setting:policy_title_update_view")
//                             : t("setting:policy_title_create_view")
//                         }

//                         hidenFlightTime={true}
//                         hidenBookingTime={true}

//                         openCreate={openCreatePolicy}
//                         setOpenCreate={setOpenCreatePolicy}

//                         dataItemPolicy={dataItemPolicy}

//                         onCallBack={(data) => {
//                             setDataItemPolicy(undefined);
//                             getPagedPolicy({ pageNumber: 1 });
//                         }}
//                     />
//                 }
//             </Grid>
//         </CompanyLayout>
//     );
// };

// PolicyListPage.requiredAuth = true;
// export default withSSRErrorHandling(PolicyListPage);

// const getStaticProps = getServerSideTranslationsProps(["setting", "common"]);
// export { getStaticProps };

// #endregion Policy Old Version Page
