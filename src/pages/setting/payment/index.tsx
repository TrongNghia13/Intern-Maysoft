import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Card, Grid } from "@mui/material";
import { useTranslation } from "next-i18next";
import { useEffect, useMemo, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Typography,
} from "@maysoft/common-component-react";

import Constants from "@src/constants";
import Helpers from "@src/commons/helpers";
import PathName from "@src/constants/PathName";
import CompanyLayout from "@src/layout/companyLayout";
import useDataPayment from "@src/hooks/useDataPayment.hook";
import CardListItemPayment from "@src/components/Payment/cardListItemPayment";
import PaymentAccountService, {
  IRecordPayment,
} from "@src/services/sale/PaymentAccountService";

import { RootState } from "@src/store";
import { NextApplicationPage } from "../../_app";
import { titleStyles } from "@src/styles/commonStyles";
import { ICodename, IPagedList } from "@src/commons/interfaces";
import { Mode, PaymentAccountType, RoleLevel } from "@src/commons/enum";
import { withSSRErrorHandling } from "@src/commons/withSSRErrorHandling";
import { hideLoading, showLoading } from "@src/store/slice/common.slice";
import { getServerSideTranslationsProps } from "@src/commons/translationHelpers";

const PaymentPage: NextApplicationPage = () => {
  const {
    t,
    i18n: { language },
  } = useTranslation(["common", "setting"]);

  const router = useRouter();
  const dispatch = useDispatch();

  const { handleDeleteRowPayment } = useDataPayment();

  const userProfile = useSelector(
    (state: RootState) => state.userInfo?.userProfile
  );

  const permissionAdmin = useMemo(
    () =>
      userProfile?.roleLevel === RoleLevel.Owner ||
      userProfile?.roleLevel === RoleLevel.Admin ||
      userProfile?.roleLevel === RoleLevel.SuperAdmin ||
      userProfile?.roleLevel === RoleLevel.ServiceAdmin,
    [userProfile?.roleLevel]
  );

  const { getAllDataGroup } = useDataPayment();

  const [groupList, setGroupList] = useState<ICodename[]>([]);
  const [requestGetPaged, setRequestGetPaged] = useState<{
    type?: number;
    groupId?: string;
    pageSize?: number;
    pageNumber?: number;
  }>({
    type: PaymentAccountType.Debit,
  });

  const [dataPayment, setDataPayment] = useState<IPagedList<IRecordPayment>>({
    totalPages: 1,
    totalCount: 0,
    currentPage: 1,
    hasNext: false,
    hasPrevious: false,
    pageSize: Constants.ROW_PER_PAGE,
    items: [],
  });

  const type = Number(router?.query?.type || PaymentAccountType.Debit);

  useEffect(() => {
    const groupId = router?.query?.groupId as string;
    const pageNumber = Number(router?.query?.page || 1);

    getPaged({ pageNumber, type, groupId });
  }, [userProfile?.organizationId]);

  useEffect(() => {
    (async () => {
      if (type === PaymentAccountType.Group) {
        let listGroupTemp: ICodename[] = await getAllDataGroup(
          userProfile?.organizationId
        );
        setGroupList(listGroupTemp);
      }
    })();
  }, [type, userProfile?.organizationId]);

  const getPaged = async (req?: any) => {
    try {
      dispatch(showLoading());

      const pageSize = Constants.ROW_PER_PAGE;
      const pageNumber = Helpers.getPageNumber(
        req.pageNumber || 1,
        pageSize,
        dataPayment?.totalCount || 0
      );

      const newReq = {
        groupId: req.groupId,
        organizationId: userProfile?.organizationId,
        type: req.type || PaymentAccountType.Debit,
        pageSize,
        pageNumber,
      };

      const result = await PaymentAccountService.getPaged(newReq);

      setDataPayment(result);

      setRequestGetPaged({
        pageSize,
        pageNumber,
        type: newReq.type,
        groupId: newReq.groupId,
      });

      router.push(
        {
          query: Helpers.handleFormatParams({
            type: newReq.type,
            groupId: newReq.groupId,
            page: newReq.pageNumber,
          }),
        },
        undefined,
        { shallow: true }
      );
    } catch (error) {
      Helpers.handleError(error);
    } finally {
      dispatch(hideLoading());
    }
  };

  return (
    <CompanyLayout>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6" sx={titleStyles}>
            {t("setting:payment_title_menu")}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            <Box sx={{ gap: 2, display: "flex", alignItems: "center" }}>
              {/* <Box
                                sx={{
                                    ".MuiTypography-root": {
                                        fontWeight: (requestGetPaged?.type === PaymentAccountType.Organization) ? "bold" : "unset",
                                        textDecoration: (requestGetPaged?.type === PaymentAccountType.Organization) ? "underline" : "none",
                                    },
                                    ":hover": {
                                        cursor: "pointer",
                                        ".MuiTypography-root": {
                                            fontWeight: "bold",
                                            textDecoration: "underline",
                                        },
                                    }
                                }}
                                onClick={() => {
                                    getPaged({
                                        page: 1,
                                        type: PaymentAccountType.Organization,
                                    })
                                }}
                            >
                                <Typography variant="button">{`${t("setting:organization_title_menu")}`}</Typography>
                            </Box> */}
              {/* <Box
                                sx={{
                                    ".MuiTypography-root": {
                                        fontWeight: (requestGetPaged?.type === PaymentAccountType.Group) ? "bold" : "unset",
                                        textDecoration: (requestGetPaged?.type === PaymentAccountType.Group) ? "underline" : "none",
                                    },
                                    ":hover": {
                                        cursor: "pointer",
                                        ".MuiTypography-root": {
                                            fontWeight: "bold",
                                            textDecoration: "underline",
                                        },
                                    }
                                }}
                                onClick={() => {
                                    getPaged({
                                        page: 1,
                                        type: PaymentAccountType.Group,
                                    })
                                }}
                            >
                                <Typography variant="button" sx={{ marginLeft: "auto" }}>{`${t("setting:group_title_menu")}`}</Typography>
                            </Box> */}
              {(userProfile?.roleLevel === RoleLevel.Admin ||
                userProfile?.roleLevel === RoleLevel.Owner) && (
                <Box
                  sx={{
                    ".MuiTypography-root": {
                      fontWeight:
                        requestGetPaged?.type === PaymentAccountType.Debit
                          ? "bold"
                          : "unset",
                      textDecoration:
                        requestGetPaged?.type === PaymentAccountType.Debit
                          ? "underline"
                          : "none",
                    },
                    ":hover": {
                      cursor: "pointer",
                      ".MuiTypography-root": {
                        fontWeight: "bold",
                        textDecoration: "underline",
                      },
                    },
                  }}
                  onClick={() => {
                    getPaged({
                      page: 1,
                      type: PaymentAccountType.Debit,
                    });
                  }}
                >
                  <Typography
                    variant="button"
                    sx={{ marginLeft: "auto" }}
                  >{`${t("setting:payment.debt_wallet")}`}</Typography>
                </Box>
              )}
            </Box>
            {permissionAdmin &&
              dataPayment?.items?.length > 0 &&
              requestGetPaged?.type !== PaymentAccountType.Debit && (
                <Button
                  onClick={() => {
                    router.push({
                      pathname: PathName.PAYMENT_CREATE,
                      query: Helpers.handleFormatParams({
                        type:
                          requestGetPaged?.type ||
                          PaymentAccountType.Organization,
                        groupId: requestGetPaged?.groupId,
                      }),
                    });
                  }}
                >
                  {t("setting:payment_title_create_view")}
                </Button>
              )}
          </Box>
        </Grid>

        <Grid item xs={12}>
          {requestGetPaged?.type === PaymentAccountType.Group && (
            <Box marginBottom={3}>
              <Autocomplete
                variant="outlined"
                data={groupList || []}
                defaultValue={requestGetPaged?.groupId}
                label={t("setting:invitation.group")}
                placeholder={t("setting:invitation.select_group")}
                onChange={(value) => {
                  getPaged({ ...requestGetPaged, groupId: value });
                }}
              />
            </Box>
          )}
          <CardListItemPayment
            hidenPagination
            isLoading={false}
            dataPayment={dataPayment}
            onPageChange={(e, page) => {
              getPaged({ ...requestGetPaged, pageNumber: page });
            }}
            type={requestGetPaged?.type || PaymentAccountType.Organization}
            hidenDelete={!permissionAdmin}
            hidenUpdate={!permissionAdmin}
            hidenCreate={
              !permissionAdmin &&
              requestGetPaged?.type === PaymentAccountType.Debit
            }
            onButtonCreate={() => {
              router.push({
                pathname: PathName.PAYMENT_CREATE,
                query: Helpers.handleFormatParams({
                  type:
                    requestGetPaged?.type || PaymentAccountType.Organization,
                  groupId: requestGetPaged?.groupId,
                }),
              });
            }}
            onEdit={(id) => {
              router.push({
                pathname: PathName.PAYMENT_DETAIL,
                query: { id: id, mode: Mode.Update },
              });
            }}
            onDelete={(id) => {
              Helpers.showConfirmAlert(
                t("setting:payment.confirm_delete"),
                async () => {
                  await handleDeleteRowPayment(id);
                  await getPaged(requestGetPaged);
                }
              );
            }}
          />
        </Grid>
      </Grid>
    </CompanyLayout>
  );
};

PaymentPage.requiredAuth = true;
export default withSSRErrorHandling(PaymentPage);

const getStaticProps = getServerSideTranslationsProps(["setting", "common"]);
export { getStaticProps };
