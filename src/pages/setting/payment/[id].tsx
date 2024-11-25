import moment from "moment";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Card, Grid } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "next-i18next";
import { GetStaticPaths, GetStaticProps } from "next";
import {
  Box,
  Button,
  DatePicker,
  FormField,
  ControlLabelCheckBox,
  Typography,
  Autocomplete,
} from "@maysoft/common-component-react";

import Helpers from "@src/commons/helpers";
import PathName from "@src/constants/PathName";
import CompanyLayout from "@src/layout/companyLayout";

import { RootState } from "@src/store";
import { NextApplicationPage } from "../../_app";
import { ICodename } from "@src/commons/interfaces";
import { CodenameService } from "@src/services/common";
import { titleStyles } from "@src/styles/commonStyles";
import { Mode, PaymentAccountType, RoleLevel } from "@src/commons/enum";
import { withSSRErrorHandling } from "@src/commons/withSSRErrorHandling";
import { makeServerSideTranslations } from "@src/commons/translationHelpers";
import useDataPayment, {
  IDataDetailPayment,
} from "@src/hooks/useDataPayment.hook";

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  let props = {
    ...(await makeServerSideTranslations(locale, ["common", "setting"])),
  };

  const id = params?.id?.toString() || "";

  try {
    return {
      revalidate: true,
      props: {
        id,
        ...props,
      },
    };
  } catch (error) {
    return {
      revalidate: true,
      props: {
        error,
        ...props,
      },
    };
  }
};

interface IProps {
  id: string;
}

const PaymentDetailPage: NextApplicationPage<IProps> = ({ id }) => {
  const {
    t,
    i18n: { language },
  } = useTranslation(["common", "setting"]);

  const router = useRouter();

  const queryGroupId = router?.query?.groupId as string;
  const typePayment = Number(
    router?.query?.type || PaymentAccountType.Organization
  );

  const userProfile = useSelector(
    (state: RootState) => state.userInfo.userProfile
  );

  const permissionAdmin = useMemo(
    () =>
      userProfile?.roleLevel === RoleLevel.Owner ||
      userProfile?.roleLevel === RoleLevel.Admin ||
      userProfile?.roleLevel === RoleLevel.SuperAdmin ||
      userProfile?.roleLevel === RoleLevel.ServiceAdmin,
    [userProfile?.roleLevel]
  );

  const {
    getDetailById,
    getAllDataGroup,
    handleCreatePayment,
    handleUpdateRowPayment,
  } = useDataPayment();

  const [groupList, setGroupList] = useState<ICodename[]>([]);
  const [listBankCode, setListBankCode] = useState<ICodename[]>([]);
  const [dataPayment, setDataPayment] = useState<IDataDetailPayment>({
    expiredDate: moment().startOf("month").unix().toString(),
    organizationId: userProfile?.organizationId,
  });
  const [errorPayment, setErrorPayment] = useState<{
    [key in keyof IDataDetailPayment]?: string;
  }>({});

  const pramsMode = !Helpers.isNullOrEmpty(router?.query?.mode)
    ? Number(router?.query?.mode)
    : undefined;

  const [model, setModel] = useState<{
    mode: number;
    title: string;
    route: any[];
  }>({
    mode: Mode.View,
    title: t("setting:payment_title_detail_view"),
    route: [
      { title: t("setting:payment_title_menu"), route: PathName.PAYMENT },
      { title: t("common:detail"), route: "" },
    ],
  });

  useEffect(() => {
    (async () => {
      const listBankCodeTemp: ICodename[] = [];
      const resultCodeName = await CodenameService.getByGroup("BANK");
      [...(resultCodeName?.["BANK"] || [])].forEach((el) => {
        listBankCodeTemp.push({
          code: el.code,
          name: `${el.shortName} - ${el.name}`,
        });
      });
      setListBankCode(listBankCodeTemp);

      if (id === "create") {
        handleOnChangeMode(Mode.Create);

        if (typePayment === PaymentAccountType.Group) {
          let listGroupTemp: ICodename[] = await getAllDataGroup(
            userProfile?.organizationId
          );
          setGroupList(listGroupTemp);
          setDataPayment((prev) => ({
            ...prev,
            type: typePayment,
            groupId: queryGroupId,
            expiredDate: moment().unix().toString(),
            organizationId: userProfile?.organizationId,
          }));
        } else {
          setDataPayment((prev) => ({
            ...prev,
            groupId: queryGroupId,
            expiredDate: moment().unix().toString(),
            organizationId: userProfile?.organizationId,
            type: typePayment || PaymentAccountType.Organization,
          }));
        }
      } else {
        let mode = permissionAdmin ? pramsMode || Mode.View : Mode.View;
        handleOnChangeMode(mode);

        const newData = await getDetailById(id);

        if (newData?.type === PaymentAccountType.Group) {
          let listGroupTemp: ICodename[] = await getAllDataGroup(
            userProfile?.organizationId
          );
          setGroupList(listGroupTemp);
        }

        setErrorPayment({});
        setDataPayment(newData);

        router.push(
          {
            query: {
              ...router.query,
              type: newData?.type,
            },
          },
          undefined,
          { shallow: true }
        );
      }
    })();
  }, [id, permissionAdmin]);

  const handleOnChangeMode = (value: number) => {
    if (value === Mode.Create) {
      setModel({
        mode: value,
        title: t("setting:payment_title_create_view"),
        route: [
          { title: t("setting:payment_title_menu"), route: PathName.PAYMENT },
          { title: t("common:add_new"), route: "" },
        ],
      });
    }
    if (value === Mode.Update) {
      setModel({
        mode: value,
        title: t("setting:payment_title_update_view"),
        route: [
          { title: t("setting:payment_title_menu"), route: PathName.PAYMENT },
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
        title: t("setting:payment_title_detail_view"),
        route: [
          { title: t("setting:payment_title_menu"), route: PathName.PAYMENT },
          { title: t("common:detail"), route: "" },
        ],
      });
    }

    if (id !== "create") {
      router.push(
        {
          query: {
            ...router.query,
            mode: value,
          },
        },
        undefined,
        { shallow: true }
      );
    }
  };

  const handleOnChangeValue = (key: string, value: any) => {
    setDataPayment((prev) => ({
      ...prev,
      [key]: value,
    }));

    setErrorPayment((prev) => ({
      ...prev,
      [key]: undefined,
    }));
  };

  const handleValidateValue = () => {
    let checked = true;
    let newErr: any = { ...errorPayment };

    if (dataPayment?.type === PaymentAccountType.Group) {
      if (Helpers.isNullOrEmpty(dataPayment?.groupId)) {
        checked = false;
        newErr["groupId"] = t("setting:payment.required_group");
      }
    }

    if (Helpers.isNullOrEmpty(dataPayment?.name)) {
      checked = false;
      newErr["name"] = t("setting:payment.required_payment_name");
    }

    if (Helpers.isNullOrEmpty(dataPayment?.bankCode)) {
      checked = false;
      newErr["bankCode"] = t("setting:payment.required_bank_name");
    }

    if (Helpers.isNullOrEmpty(dataPayment?.accountName)) {
      checked = false;
      newErr["accountName"] = t("setting:payment.required_card_name");
    }

    if (Helpers.isNullOrEmpty(dataPayment?.accountId)) {
      checked = false;
      newErr["accountId"] = t("setting:payment.required_card_number");
    } else {
      if (dataPayment?.accountId?.length !== 16) {
        checked = false;
        newErr["accountId"] = t("setting:payment.wrong_fromat_card_number");
      }
    }

    if (Helpers.isNullOrEmpty(dataPayment?.cvc)) {
      checked = false;
      newErr["cvc"] = t("setting:payment.required_cvc");
    } else {
      if (`${dataPayment?.cvc || ""}`?.length !== 3) {
        checked = false;
        newErr["numberCVC"] = t("setting:payment.wrong_fromat_cvc");
      }
    }

    if (Helpers.isNullOrEmpty(dataPayment?.expiredDate)) {
      checked = false;
      newErr["expiredDate"] = t("setting:payment.required_expiration_date");
    }

    if (!checked) {
      setErrorPayment(newErr);
    }

    return checked;
  };

  const handleSubmit = () => {
    if (!handleValidateValue()) {
      return;
    } else {
      if (dataPayment?.id) {
        handleUpdateRowPayment(dataPayment, () => {
          handleOnChangeMode(Mode.View);
        });
      } else {
        handleCreatePayment(
          {
            ...dataPayment,
            id: Date.now().toString(),
          },
          () => {
            handleGoBack();
          }
        );
      }
    }
  };

  const handleGoBack = () => {
    router.push({
      pathname: PathName.PAYMENT,
      query: { type: typePayment || PaymentAccountType.Organization },
    });
  };

  return (
    <CompanyLayout>
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
              {model.title}
            </Typography>
            <Box
              sx={{
                gap: 1,
                display: "flex",
                alignItems: "center",
                marginLeft: "auto",
              }}
            >
              <Button
                color="secondary"
                onClick={() => {
                  handleGoBack();
                }}
              >
                {t("common:go_back")}
              </Button>
              {permissionAdmin && (
                <>
                  {model.mode === Mode.View ? (
                    <Button
                      onClick={() => {
                        handleOnChangeMode(Mode.Update);
                      }}
                    >
                      {t("common:edit")}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        handleSubmit();
                      }}
                    >
                      {t("common:save")}
                    </Button>
                  )}
                </>
              )}
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <Grid container spacing={3} padding={3}>
              {dataPayment?.type === PaymentAccountType.Group && (
                <Grid item xs={12}>
                  <Autocomplete
                    required
                    mode={model.mode}
                    variant="outlined"
                    data={groupList || []}
                    defaultValue={dataPayment?.groupId}
                    errorMessage={errorPayment?.groupId}
                    label={t("setting:invitation.group")}
                    placeholder={t("setting:invitation.select_group")}
                    disabled={!Helpers.isNullOrEmpty(dataPayment?.id)}
                    onChange={(value) => {
                      handleOnChangeValue("groupId", value);
                    }}
                  />
                </Grid>
              )}
              <Grid item xs={12}>
                <FormField
                  required
                  maxLength={64}
                  mode={model.mode}
                  variant="outlined"
                  value={dataPayment?.name}
                  errorMessage={errorPayment?.name}
                  label={t("setting:payment.payment_name")}
                  placeholder={t("setting:payment.enter_payment_name")}
                  onChangeValue={(value) => {
                    handleOnChangeValue("name", value);
                  }}
                />
              </Grid>
              <Grid item xs={12} md={model.mode === Mode.View ? 6 : 12}>
                <FormField
                  required
                  maxLength={64}
                  mode={model.mode}
                  variant="outlined"
                  value={dataPayment?.accountName}
                  errorMessage={errorPayment?.accountName}
                  label={t("setting:payment.card_name")}
                  placeholder={t("setting:payment.enter_card_name")}
                  onChangeValue={(value) => {
                    handleOnChangeValue("accountName", value);
                  }}
                />
              </Grid>
              <Grid item xs={12} md={model.mode === Mode.View ? 6 : 12}>
                <FormField
                  required
                  type="number"
                  maxLength={16}
                  variant="outlined"
                  mode={model.mode}
                  value={dataPayment?.accountId}
                  errorMessage={errorPayment?.accountId}
                  label={t("setting:payment.card_number")}
                  placeholder={t("setting:payment.enter_card_number")}
                  onChangeValue={(value) => {
                    handleOnChangeValue("accountId", value);
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
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
                    ".css-1myvokp-MuiPickersMonth-monthButton": {
                      fontSize: "1.25rem !important",
                    },
                    ".MuiPickersMonth-monthButton": {
                      fontSize: "1.25rem !important",
                    },
                  }}
                >
                  <DatePicker
                    required
                    mode={model.mode}
                    variant="outlined"
                    views={["month", "year"]}
                    errorMessage={errorPayment?.expiredDate}
                    label={t("setting:payment.expiration_date")}
                    placeholder={t("setting:payment.enter_expiration_date")}
                    value={
                      dataPayment?.expiredDate
                        ? Number(dataPayment?.expiredDate) * 1000
                        : undefined
                    }
                    onChangeValue={(value) => {
                      const newValue = !Helpers.isNullOrEmpty(value)
                        ? moment(value).unix()
                        : undefined;
                      handleOnChangeValue("expiredDate", newValue);
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormField
                  required
                  type="number"
                  maxLength={3}
                  variant="outlined"
                  mode={model.mode}
                  value={dataPayment?.cvc}
                  errorMessage={errorPayment?.cvc}
                  label={t("setting:payment.cvc")}
                  placeholder={t("setting:payment.enter_cvc")}
                  onChangeValue={(value) => {
                    handleOnChangeValue("cvc", value);
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  required
                  mode={model.mode}
                  variant="outlined"
                  data={listBankCode || []}
                  defaultValue={dataPayment?.bankCode}
                  errorMessage={errorPayment?.bankCode}
                  label={t("setting:payment.bank_name")}
                  placeholder={t("setting:payment.enter_bank_name")}
                  onChange={(value) => {
                    handleOnChangeValue("bankCode", value);
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <ControlLabelCheckBox
                  mode={model.mode}
                  value={dataPayment.default === 1}
                  label={t("setting:payment.default_payment_card")}
                  onChangeValue={(value) => {
                    handleOnChangeValue("default", value ? 1 : 0);
                  }}
                />
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </CompanyLayout>
  );
};

PaymentDetailPage.requiredAuth = true;

export default withSSRErrorHandling(PaymentDetailPage);
