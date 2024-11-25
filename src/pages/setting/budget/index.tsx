import moment from "moment";
import { RootState } from "@src/store";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import { useEffect, useMemo, useState } from "react";
import { Close, FilterList, Search } from "@mui/icons-material";
import {
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  RadioGroup,
} from "@mui/material";
import {
  Box,
  Button,
  Chip,
  DataTableFilter,
  DatePicker,
  FormField,
  Radio,
  Typography,
} from "@maysoft/common-component-react";

import Constants from "@src/constants";
import Helpers from "@src/commons/helpers";
import PathName from "@src/constants/PathName";
import CompanyLayout from "@src/layout/companyLayout";
import BudgetService from "@src/services/sale/BudgetService";
import useDataBudgetPlan from "@src/hooks/useDataBudgetPlan.hook";
import CardListItemBudgetPlan from "@src/components/BudgetPlan/cardListItemBudgetPlan";

import { NextApplicationPage } from "../../_app";
import { IPagedList } from "@src/commons/interfaces";
import { titleStyles } from "@src/styles/commonStyles";
import { withSSRErrorHandling } from "@src/commons/withSSRErrorHandling";
import { NotifyTarget, RoleLevel, TimerangeBudget } from "@src/commons/enum";
import { getServerSideTranslationsProps } from "@src/commons/translationHelpers";
import {
  hideLoading,
  showLoading,
  showSnackbar,
} from "@src/store/slice/common.slice";

interface IDataRequestGetPaged {
  pageSize?: number;
  pageNumber?: number;
  searchName?: string;
  timerangeBudget?: number;
  to?: string | number;
  from?: string | number;
}

const BudgetPlanPage: NextApplicationPage = () => {
  const {
    t,
    i18n: { language },
  } = useTranslation(["common", "setting"]);

  const router = useRouter();
  const dispatch = useDispatch();

  const {
    listTimerangeBudget,
    getMapGroupByListID,
    getMapUserProfileByListID,
  } = useDataBudgetPlan();

  const userProfile = useSelector(
    (state: RootState) => state.userInfo.userProfile
  );

  const permissionAdmin = true;
  // useMemo(() => (
  //     userProfile?.roleLevel === RoleLevel.Owner ||
  //     userProfile?.roleLevel === RoleLevel.Admin ||
  //     userProfile?.roleLevel === RoleLevel.SuperAdmin ||
  //     userProfile?.roleLevel === RoleLevel.ServiceAdmin
  // ), [userProfile?.roleLevel]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openModalFilter, setOpenModalFilter] = useState<boolean>(false);
  const [dataMapUser, setDataMapUser] = useState<Map<string, any>>(new Map());
  const [dataMapGroup, setDataMapGroup] = useState<Map<string, any>>(new Map());

  const [model, setModel] = useState<{
    request?: IDataRequestGetPaged;
    requestTemp?: IDataRequestGetPaged;
  }>({});

  const [dataBudgetPlan, setDataBudgetPlan] = useState<IPagedList<any>>({
    totalPages: 0,
    totalCount: 0,
    currentPage: 1,
    hasNext: false,
    hasPrevious: false,
    pageSize: Constants.ROW_PER_PAGE,
    items: [],
  });

  useEffect(() => {
    const pageNumber = Number(router?.query?.pageNumber || 1);
    const pageSize = Number(router?.query?.pageSize || Constants.ROW_PER_PAGE);

    const searchName = router?.query?.name as string;
    const to = Helpers.isNullOrEmpty(router?.query?.to)
      ? undefined
      : Number(router?.query?.to);
    const from = Helpers.isNullOrEmpty(router?.query?.from)
      ? undefined
      : Number(router?.query?.from);
    const timerangeBudget = Helpers.isNullOrEmpty(
      router?.query?.timerangeBudget
    )
      ? undefined
      : Number(router?.query?.timerangeBudget);

    getPagedBudget({
      pageNumber,
      pageSize,
      searchName,
      to,
      from,
      timerangeBudget,
    });
  }, [userProfile.organizationId]);

  const getPagedBudget = async (data?: IDataRequestGetPaged) => {
    try {
      dispatch(showLoading());
      // setIsLoading(true);

      const pageSize = data?.pageSize || Constants.ROW_PER_PAGE;
      const pageNumber = Helpers.getPageNumber(
        data?.pageNumber || 1,
        pageSize,
        0
      );

      const result = await BudgetService.getPaged({
        pageSize,
        pageNumber,
        to: data?.to,
        from: data?.from,
        name: data?.searchName,
        timerangeBudget: data?.timerangeBudget,
        organizationId: userProfile.organizationId,
      });

      let listUserId: string[] = [];
      let listGroupId: string[] = [];

      for (const item of [...(result.items || [])]) {
        if (item.notifyTarget === NotifyTarget.Custom) {
          const ids = item.budgetNotifyTargets?.map((el) => el.targetId);
          listUserId = [...(listUserId || []), ...(ids || [])];
        }
        if (item.notifyTarget === NotifyTarget.GroupAdmin) {
          const ids = item.budgetNotifyTargets?.map((el) => el.targetId);
          listGroupId = [...(listGroupId || []), ...(ids || [])];
        }
      }

      const dataGroup = await getMapGroupByListID(
        listGroupId,
        userProfile?.organizationId
      );
      setDataMapGroup(dataGroup);

      const dataUser = await getMapUserProfileByListID(
        listUserId,
        userProfile?.organizationId
      );
      setDataMapUser(dataUser);

      setDataBudgetPlan(result);
      setModel({
        request: {
          ...data,
          pageSize: result.pageSize,
          pageNumber: result.currentPage,
        },
        requestTemp: {
          ...data,
          pageSize: result.pageSize,
          pageNumber: result.currentPage,
        },
      });

      router.push(
        {
          query: Helpers.handleFormatParams({
            to: data?.to,
            from: data?.from,
            name: data?.searchName,
            timerangeBudget: data?.timerangeBudget,

            pageSize: result.pageSize,
            pageNumber: result.currentPage,
          }),
        },
        undefined,
        { shallow: true }
      );
    } catch (error) {
      Helpers.handleError(error);
    } finally {
      dispatch(hideLoading());
      // setIsLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    Helpers.showConfirmAlert(t("setting:budget.confirm_delete"), async () => {
      try {
        dispatch(showLoading());

        await BudgetService.delete(id);

        dispatch(
          showSnackbar({
            msg: t("setting:budget.delete_success"),
            type: "success",
          })
        );

        await getPagedBudget();
      } catch (error) {
        Helpers.handleError(error);
      } finally {
        dispatch(hideLoading());
      }
    });
  };

  //#region Filter
  const onFilter = () => {
    setOpenModalFilter(false);
    getPagedBudget(model.requestTemp);
  };

  const onClose = () => {
    setOpenModalFilter(false);
    setModel({
      ...model,
      requestTemp: { ...model.request },
    });
  };

  const onReset = () => {
    setOpenModalFilter(false);
    getPagedBudget({
      pageNumber: 1,
      pageSize: Constants.ROW_PER_PAGE,
    });
  };

  const FormFilter = () => (
    <Box mt={1}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormField
            maxLength={255}
            variant="outlined"
            defaultValue={model?.requestTemp?.searchName || ""}
            label={t("setting:budget.search_budget_plan")}
            placeholder={t("setting:budget.search_budget_plan")}
            onBlur={(value) => {
              setModel((prev) => ({
                ...prev,
                requestTemp: {
                  ...prev.requestTemp,
                  searchName: value,
                },
              }));
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Box>
            <Typography variant="button" fontWeight="bold">
              {t("setting:budget.phase")}
            </Typography>
          </Box>
          <FormControl
            sx={{
              ".MuiFormControlLabel-label": {
                fontWeight: "400 !important",
              },
            }}
          >
            <RadioGroup
              name="radio-buttons-group"
              aria-labelledby="radio-buttons-group-label"
              value={model?.requestTemp?.timerangeBudget}
              onChange={(event, value) => {
                setModel((prev) => ({
                  ...prev,
                  requestTemp: {
                    ...prev.requestTemp,
                    timerangeBudget: Number(value),
                  },
                }));
              }}
            >
              {listTimerangeBudget?.map((item) => (
                <FormControlLabel
                  key={item.code}
                  label={item.name}
                  value={item.code}
                  control={<Radio sx={{ p: 0 }} />}
                  sx={{ mb: 0, mt: 0, ml: 0, p: 0 }}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Grid>

        {model.requestTemp?.timerangeBudget === TimerangeBudget.CustomRange && (
          <Grid item xs={12}>
            <Box
              sx={{
                ".MuiOutlinedInput-input": {
                  padding: "12px 12px !important",
                  margin: "0px !important",
                },
                ".MuiInputLabel-root": {
                  top: "-8px !important",
                  left: "12px !important",
                },
              }}
            >
              <DatePicker
                variant="outlined"
                label={t("setting:budget.from")}
                value={
                  model?.requestTemp?.from
                    ? Number(model?.requestTemp?.from) * 1000
                    : undefined
                }
                onChangeValue={(value) => {
                  let end = model?.requestTemp?.to;

                  const newValue = !Helpers.isNullOrEmpty(value)
                    ? moment(value).unix()
                    : undefined;

                  if (
                    !Helpers.isNullOrEmpty(end) &&
                    !Helpers.isNullOrEmpty(newValue) &&
                    newValue > Number(end)
                  ) {
                    end = moment(value).startOf("month").unix();
                  }

                  setModel((prev) => ({
                    ...prev,
                    requestTemp: {
                      ...prev.requestTemp,
                      from: newValue,
                      to: end,
                    },
                  }));
                }}
              />
            </Box>
          </Grid>
        )}
        {model.requestTemp?.timerangeBudget === TimerangeBudget.CustomRange && (
          <Grid item xs={12}>
            <Box
              sx={{
                ".MuiOutlinedInput-input": {
                  padding: "12px 12px !important",
                  margin: "0px !important",
                },
                ".MuiInputLabel-root": {
                  top: "-8px !important",
                  left: "12px !important",
                },
              }}
            >
              <DatePicker
                variant="outlined"
                label={t("setting:budget.to")}
                value={
                  model?.requestTemp?.to
                    ? Number(model?.requestTemp?.to) * 1000
                    : undefined
                }
                onChangeValue={(value) => {
                  let start = model?.requestTemp?.from;

                  const newValue = !Helpers.isNullOrEmpty(value)
                    ? moment(value).unix()
                    : undefined;

                  if (
                    !Helpers.isNullOrEmpty(start) &&
                    !Helpers.isNullOrEmpty(newValue) &&
                    newValue < Number(start)
                  ) {
                    start = moment(value).startOf("month").unix();
                  }

                  setModel((prev) => ({
                    ...prev,
                    requestTemp: {
                      ...prev.requestTemp,
                      to: newValue,
                      from: start,
                    },
                  }));
                }}
              />
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );

  const ContainerSearchFilter = () => (
    <Box sx={{ gap: 1, display: "flex", alignItems: "center" }}>
      {/* Search */}
      <Box maxWidth={"15rem"}>
        <FormField
          fullWidth
          maxLength={255}
          variant="outlined"
          defaultValue={model.request?.searchName || ""}
          placeholder={t("setting:budget.search_budget_plan")}
          onBlur={(value) => {
            setModel((prev) => ({
              ...prev,
              request: {
                ...prev.request,
                searchName: value,
              },
            }));
          }}
          onKeyPress={(e: any) => {
            if (e.key === "Enter") {
              getPagedBudget({
                ...model.request,
                searchName: e.target.value,
              });
            }
          }}
          InputProps={{
            startAdornment: (
              <IconButton
                color="info"
                onClick={() => {
                  getPagedBudget({
                    ...model.request,
                    searchName: model.request?.searchName,
                  });
                }}
              >
                <Search />
              </IconButton>
            ),
            endAdornment: model.request?.searchName && (
              <IconButton
                color="secondary"
                onClick={() => {
                  getPagedBudget({
                    ...model.request,
                    searchName: "",
                  });
                }}
              >
                <Close />
              </IconButton>
            ),
          }}
        />
      </Box>
      {/* Filter */}
      <Box
        style={{
          marginLeft: "8px",
          marginRight: "16px",
          borderRadius: "50px",
          border: "1px solid #ccc",
        }}
      >
        <IconButton
          onClick={() => {
            setOpenModalFilter(true);
          }}
        >
          <FilterList />
        </IconButton>
      </Box>
      {openModalFilter && (
        <DataTableFilter
          variant="permanent"
          ownerState={{ openConfigurator: openModalFilter }}
        >
          <Box p={2} alignItems="center">
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="h6">{"Lọc"}</Typography>
              <IconButton style={{ padding: 0 }} onClick={onClose}>
                <Close />
              </IconButton>
            </Box>

            <FormFilter />

            <Box
              mt={2}
              display="flex"
              alignItems="center"
              justifyContent="center"
              style={{ position: "absolute", bottom: 10, right: 0, left: 0 }}
            >
              <Button color="secondary" onClick={onReset}>
                {"Đặt lại"}
              </Button>
              <Button style={{ marginLeft: "5px" }} onClick={onFilter}>
                {"Áp dụng"}
              </Button>
            </Box>
          </Box>
        </DataTableFilter>
      )}
    </Box>
  );

  //#endregion Filter

  return (
    <CompanyLayout>
      <Grid container spacing={3}>
        {/* Title */}
        <Grid item xs={12}>
          <Typography variant="h6" sx={titleStyles}>
            {t("setting:budget_title_menu")}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="button">
            {t("setting:budget.note_title_budget")}
          </Typography>
        </Grid>

        {/* Action */}
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 2,
            }}
          >
            {permissionAdmin && dataBudgetPlan?.items?.length > 0 && (
              <Button
                onClick={() => {
                  router.push({ pathname: PathName.BUDGET_CREATE });
                }}
              >
                {t("setting:budget_title_create_view")}
              </Button>
            )}
            <Box marginLeft="auto">
              <ContainerSearchFilter />
            </Box>
          </Box>
        </Grid>

        {/* Value Filter */}
        <Grid item xs={12}>
          {!Helpers.isNullOrEmpty(model?.request?.timerangeBudget) && (
            <Chip
              label={t("setting:budget.phase")}
              value={
                listTimerangeBudget.find(
                  (el) => el.code === model?.request?.timerangeBudget
                )?.name || ""
              }
              onDelete={() => {
                getPagedBudget({
                  ...model.request,
                  timerangeBudget: undefined,
                });
              }}
            />
          )}
          {!Helpers.isNullOrEmpty(model?.request?.from) && (
            <Chip
              label={t("setting:budget.from")}
              value={Helpers.formatDate(Number(model?.request?.from) * 1000)}
              onDelete={() => {
                getPagedBudget({ ...model.request, from: undefined });
              }}
            />
          )}
          {!Helpers.isNullOrEmpty(model?.request?.to) && (
            <Chip
              label={t("setting:budget.to")}
              value={Helpers.formatDate(Number(model?.request?.to) * 1000)}
              onDelete={() => {
                getPagedBudget({ ...model.request, to: undefined });
              }}
            />
          )}
        </Grid>

        {/* List Record Budget */}
        <Grid item xs={12}>
          <CardListItemBudgetPlan
            isLoading={isLoading}
            dataBudgetPlan={dataBudgetPlan}
            dataMapUser={dataMapUser}
            dataMapGroup={dataMapGroup}
            hidenActionDelete={!permissionAdmin}
            hidenActionUpdate={!permissionAdmin}
            onDelete={(idRow) => {
              handleDelete(idRow);
            }}
            onCreate={() => {
              router.push({ pathname: PathName.BUDGET_CREATE });
            }}
            onEdit={(idRow) => {
              router.push({
                pathname: PathName.BUDGET_DETAIL,
                query: { id: idRow },
              });
            }}
            onPageChange={(data) => {
              getPagedBudget({
                ...model.request,
                pageNumber: data.pageNumber,
              });
            }}
          />
        </Grid>
      </Grid>
    </CompanyLayout>
  );
};

BudgetPlanPage.requiredAuth = true;
export default withSSRErrorHandling(BudgetPlanPage);

const getStaticProps = getServerSideTranslationsProps(["setting", "common"]);
export { getStaticProps };
