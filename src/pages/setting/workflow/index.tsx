import { Grid, IconButton } from "@mui/material";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  FormField,
  Typography,
} from "@maysoft/common-component-react";

import Constants from "@src/constants";
import Helpers from "@src/commons/helpers";
import PathName from "@src/constants/PathName";
import CompanyLayout from "@src/layout/companyLayout";
import WorkFlowService, {
  IRecordWorkflow,
} from "@src/services/maywork/WorkFlow.service";
import CardListItemWorkflow from "@src/components/WorkflowNewVersion/cardListItemWorkflow";

import { RootState } from "@src/store";
import { Pagination } from "@src/components";
import { Mode, RoleLevel } from "@src/commons/enum";
import { IPagedList } from "@src/commons/interfaces";
import { NextApplicationPage } from "@src/pages/_app";
import { titleStyles } from "@src/styles/commonStyles";
import { withSSRErrorHandling } from "@src/commons/withSSRErrorHandling";
import { getServerSideTranslationsProps } from "@src/commons/translationHelpers";
import {
  hideLoading,
  showLoading,
  showSnackbar,
} from "@src/store/slice/common.slice";
import { Close, Search } from "@mui/icons-material";

const WorkflowListScreen: NextApplicationPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    t,
    i18n: { language },
  } = useTranslation(["common", "setting"]);

  const pageNumber = Number(router?.query?.page || 1);
  const searchText = router?.query?.searchText as string;

  const userProfile = useSelector(
    (state: RootState) => state.userInfo.userProfile
  );

  const permissionAdmin = true;
  // useMemo(
  //   () =>
  //     userProfile?.roleLevel === RoleLevel.Owner ||
  //     userProfile?.roleLevel === RoleLevel.Admin ||
  //     userProfile?.roleLevel === RoleLevel.SuperAdmin ||
  //     userProfile?.roleLevel === RoleLevel.ServiceAdmin,
  //   [userProfile?.roleLevel]
  // );

  const [valueSearchText, setValueSearchText] = useState<any>(undefined);
  const [dataWorkflow, setDataWorkflow] = useState<IPagedList<IRecordWorkflow>>(
    {
      totalPages: 1,
      totalCount: 0,
      currentPage: 1,
      hasNext: false,
      hasPrevious: false,
      pageSize: Constants.ROW_PER_PAGE_20,
      items: [],
    }
  );

  // const [dataRequest] = useState<any>({
  //     totalCount: 0,
  //     searchText: router?.query?.searchText,
  //     pageNumber: Number(router?.query?.pageNumber || 1),
  //     pageSize: Number(router?.query?.pageSize || Constants.ROW_PER_PAGE_20),
  // } as any);

  useEffect(() => {
    getPaged({
      pageNumber: pageNumber,
      searchText: searchText,
    });
  }, [pageNumber, searchText, userProfile.organizationId]);

  const getPaged = async ({
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
        dataWorkflow?.totalCount || 0
      );

      const resultGetpaged = await WorkFlowService.getPaged({
        pageSize,
        pageNumber: page,
        searchText: searchText,
        organizationId: userProfile?.organizationId || "0",
      });

      setValueSearchText(searchText);
      setDataWorkflow(resultGetpaged);
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

  const handleDeleteWF = (id: string) => {
    Helpers.showConfirmAlert(t("setting:workflow.confirm_delete"), async () => {
      try {
        dispatch(showLoading());

        await WorkFlowService.delete(id);

        await getPaged({ pageNumber: pageNumber });

        dispatch(
          showSnackbar({
            msg: t("setting:workflow.delete_success"),
            type: "success",
          })
        );
      } catch (error) {
        Helpers.handleError(error);
      } finally {
        dispatch(hideLoading());
      }
    });
  };

  return (
    <CompanyLayout>
      <>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              <Typography variant="h6" sx={titleStyles}>
                {t("setting:workflow_title_menu")}
              </Typography>
              {permissionAdmin && dataWorkflow?.items?.length > 0 && (
                <Box marginLeft="auto">
                  <Button
                    color="info"
                    onClick={() => {
                      router.push(PathName.WORKFLOW_CREATE);
                    }}
                  >
                    {t("setting:workflow_title_create_view")}
                  </Button>
                </Box>
              )}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box>
              {/* input search text by getpage */}
              <FormField
                maxLength={255}
                variant="outlined"
                value={valueSearchText || ""}
                placeholder={t("setting:workflow.search_text")}
                onChangeValue={(value: any) => {
                  setValueSearchText(value);
                }}
                onKeyPress={(e: any) => {
                  if (e.key === "Enter") {
                    getPaged({
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
                        getPaged({
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
                        getPaged({
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
          </Grid>

          <Grid item xs={12}>
            <CardListItemWorkflow
              dataItems={dataWorkflow?.items}
              onCreate={
                permissionAdmin
                  ? () => {
                      router.push(PathName.WORKFLOW_CREATE);
                    }
                  : undefined
              }
              onDelete={
                permissionAdmin
                  ? (newId) => {
                      handleDeleteWF(newId);
                    }
                  : undefined
              }
              onDetail={(newId) => {
                router.push({
                  pathname: PathName.WORKFLOW_DETAIL,
                  query: {
                    id: newId,
                    mode: Mode.View,
                  },
                });
              }}
              onUpdate={
                permissionAdmin
                  ? (newId) => {
                      router.push({
                        pathname: PathName.WORKFLOW_DETAIL,
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

          {dataWorkflow?.totalPages > 0 && (
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
                  {"Tổng: " + dataWorkflow?.totalCount}
                </Typography>
                <Pagination
                  onChange={handlePageChange}
                  page={dataWorkflow?.currentPage}
                  count={dataWorkflow?.totalPages}
                />
              </Box>
            </Grid>
          )}
        </Grid>
      </>

      {/* <WorkFlowContainer
                title={t("setting:workflow_title_list_view")}

                hidenActionCreate={!permissionAdmin}
                hidenActionDelete={!permissionAdmin}
                hidenActionUpdate={!permissionAdmin}

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
                        router.push({
                            pathname: PathName.WORKFLOW_DETAIL,
                            query: {
                                id: data?.id,
                                mode: data?.mode,
                            },
                        });
                    } else {
                        router.push(PathName.WORKFLOW_CREATE);
                    }
                }}
            /> */}
    </CompanyLayout>
  );
};

WorkflowListScreen.requiredAuth = true;
export default withSSRErrorHandling(WorkflowListScreen);

const getStaticProps = getServerSideTranslationsProps(["setting", "common"]);
export { getStaticProps };
