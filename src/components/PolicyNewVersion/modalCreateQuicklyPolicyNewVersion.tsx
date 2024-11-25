import { Grid } from "@mui/material";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import {
  Autocomplete,
  Box,
  FormField,
  Modal,
  Typography,
} from "@maysoft/common-component-react";

import Constants from "@src/constants";
import Helpers from "@src/commons/helpers";
import CardPolicyCondition from "./cardPolicyCon\dition";
import useDataPolicyNewVersion from "@src/hooks/useDataPolicyNewVersion.hook";

import { LoadingModal } from "../Loading";
import { BoxStar } from "../Policy/PolicyStay";
import { showSnackbar } from "@src/store/slice/common.slice";
import { PolicyFlightIcon, PolicyHotelIcon } from "@src/assets/svg";
import {
  IBasicPolicy,
  ICriterum,
  VALUE_ALL,
} from "@src/hooks/useDataPolicy.hook";
import {
  BookingTypePolicy,
  CompareType,
  ItineraryType,
  Mode,
  PolicyCriteriaCode,
} from "@src/commons/enum";

const ModalCreateQuicklyPolicyNewVersion = ({
  openCreate,
  setOpenCreate,

  serviceCode,
  organizationId,

  onCallBack,
}: {
  openCreate: boolean;
  setOpenCreate: Dispatch<SetStateAction<boolean>>;

  serviceCode?: string;
  organizationId?: string;
  onCallBack: (data: IBasicPolicy) => void;
}) => {
  const dispatch = useDispatch();
  const {
    t,
    i18n: { language },
  } = useTranslation(["common", "setting"]);

  const {
    listAriLines,
    listCabinClass,
    listBookingType,

    getListSelectedByType,
    getDataCodeNameAirline,
    getDataAddressBySelectCodes,
    getDataAirpostBySelectCodes,

    handleCreatePolicy,
  } = useDataPolicyNewVersion({
    organizationId: organizationId || "0",
    serviceCode: serviceCode || Constants.SERVICE_CODE,
  });

  const [loadingModal, setLoadingModal] = useState<boolean>(false);
  const [modeModal, setModeModal] = useState<"Policy" | "PolicyDetail">(
    "Policy"
  );

  const [errorModal, setErrorModal] = useState<any>({});
  const [dataModal, setDataModal] = useState<{
    mode: Mode;
    settingCode: string;
    policyCriteriaType: ItineraryType;

    detail?: {
      id?: string;
      sequence?: number;

      to?: string[];
      from?: string[];
      currency?: string;
      flightTime?: number;
      starRating?: number;
      bookingType?: number;
      bookingBudget?: number;

      carrier?: string[];
      cabinClass?: string;
    };
  }>({
    mode: Mode.View,
    detail: undefined,
    settingCode: PolicyCriteriaCode.Domestic,
    policyCriteriaType: ItineraryType.Flight,
  });

  const [tabType, setTabType] = useState<ItineraryType>(ItineraryType.Flight);
  const [dataPolicy, setDataPolicy] = useState<IBasicPolicy>(
    {} as IBasicPolicy
  );
  const [errorPolicy, setErrorPolicy] = useState<IBasicPolicy>(
    {} as IBasicPolicy
  );

  const [policyCriterias, setPolicyCriterias] = useState<ICriterum[]>([]);

  const listSelectedByType = useMemo(
    () =>
      getListSelectedByType({
        settingCode: dataModal?.settingCode,
        type: dataModal?.policyCriteriaType,
      }) || [],
    [
      getListSelectedByType,
      dataModal?.settingCode,
      dataModal?.policyCriteriaType,
    ]
  );

  useEffect(() => {
    setModeModal("Policy");

    (async () => {
      try {
        setLoadingModal(true);

        setPolicyCriterias([
          {
            id: "criteriaId_1",
            policyCriteriaDetail: [],
            policyCriteriaType: ItineraryType.Flight,
            settingCode: PolicyCriteriaCode.Domestic,
          },
          {
            id: "criteriaId_2",
            policyCriteriaDetail: [],
            policyCriteriaType: ItineraryType.Flight,
            settingCode: PolicyCriteriaCode.International,
          },
          {
            id: "criteriaId_3",
            policyCriteriaDetail: [],
            policyCriteriaType: ItineraryType.Hotel,
            settingCode: PolicyCriteriaCode.Domestic,
          },
          {
            id: "criteriaId_4",
            policyCriteriaDetail: [],
            policyCriteriaType: ItineraryType.Hotel,
            settingCode: PolicyCriteriaCode.International,
          },
        ]);

        await getDataCodeNameAirline();
        await getDataAddressBySelectCodes({ countryCode: undefined });
        await getDataAirpostBySelectCodes({ countryCode: undefined });
        await getDataAddressBySelectCodes({ countryCode: "vn" });
        await getDataAirpostBySelectCodes({ countryCode: "vn" });
      } catch (error) {
        Helpers.handleError(error);
      } finally {
        setLoadingModal(false);
      }
    })();
  }, []);

  const onChangeValuePolicy = (key: string, newValue: any) => {
    setDataPolicy((prev: any) => ({
      ...prev,
      [key]: newValue,
    }));

    setErrorPolicy((prev: any) => ({
      ...prev,
      [key]: undefined,
    }));
  };

  const handleClose = () => {
    setDataPolicy({});
    setErrorPolicy({});

    setOpenCreate(false);
  };

  const converPolicyCriteriaDetailToDataModalDetail = (
    type: number,
    dataDetail?: any
  ) => {
    if (Helpers.isNullOrEmpty(dataDetail?.id)) {
      if (type === ItineraryType.Hotel) {
        return {
          sequence: 0,
          from: [VALUE_ALL],
          starRating: 0,
          bookingBudget: 1000000,
          currency: Constants.CURRENCY_DEFAULT,
        };
      }
      if (type === ItineraryType.Flight) {
        return {
          sequence: 0,
          to: [VALUE_ALL],
          from: [VALUE_ALL],
          carrier: [VALUE_ALL],
          flightTime: 1,
          starRating: 0,
          bookingBudget: 1000000,
          currency: Constants.CURRENCY_DEFAULT,
          bookingType: Number(listBookingType?.[0]?.code),
          cabinClass: listCabinClass?.[0]?.code as string,
        };
      }
    } else {
      if (type === ItineraryType.Flight) {
        return {
          id: dataDetail?.id,
          sequence: dataDetail?.sequence,
          to: dataDetail?.to ? dataDetail?.to?.split(",") : [VALUE_ALL],
          from: dataDetail?.from ? dataDetail?.from?.split(",") : [VALUE_ALL],
          carrier: dataDetail?.carrier
            ? dataDetail?.carrier?.split(",")
            : [VALUE_ALL],
          starRating: dataDetail?.starRating,
          flightTime: dataDetail?.compareNumber,
          bookingBudget: dataDetail?.bookingBudget,
          currency: dataDetail?.currency || Constants.CURRENCY_DEFAULT,
          bookingType:
            dataDetail?.bookingType ?? Number(listBookingType?.[0]?.code),
          cabinClass:
            dataDetail?.cabinClass || (listCabinClass?.[0]?.code as string),
        };
      }
      if (type === ItineraryType.Hotel) {
        return {
          id: dataDetail?.id,
          sequence: dataDetail?.sequence,
          starRating: dataDetail?.starRating,
          bookingBudget: dataDetail?.bookingBudget,
          currency: dataDetail?.currency || Constants.CURRENCY_DEFAULT,
          from: dataDetail?.from ? dataDetail?.from?.split(",") : [VALUE_ALL],
        };
      }
    }
  };

  const handleEditItemCriteriaDetail = ({
    mode,
    idCriteria,
    idCriteriaDetail,
  }: {
    mode: Mode;
    idCriteria: string;
    idCriteriaDetail: string;
  }) => {
    setLoadingModal(true);
    setTimeout(async (text?: string) => {
      try {
        let newItemCriteria = [...(policyCriterias || [])].find(
          (el) => el.id === idCriteria
        );

        if (newItemCriteria) {
          let newItemCriteriaDetail =
            newItemCriteria?.policyCriteriaDetail?.find(
              (e) => e.id === idCriteriaDetail
            );
          const typeTemp =
            newItemCriteria.policyCriteriaType || ItineraryType.Flight;
          const newDataDetail = converPolicyCriteriaDetailToDataModalDetail(
            typeTemp,
            newItemCriteriaDetail
          );

          if (newItemCriteriaDetail) {
            setDataModal({
              mode: mode,
              detail: newDataDetail,
              policyCriteriaType: typeTemp,
              settingCode: newItemCriteria.settingCode || "",
            });

            setModeModal("PolicyDetail");

            setLoadingModal(false);
          }
        }
      } catch (error) {
      } finally {
      }
    }, 500);
  };

  const handleDeleteItemCriteriaDetail = ({
    idCriteria,
    idCriteriaDetail,
  }: {
    idCriteria: string;
    idCriteriaDetail: string;
  }) => {
    setPolicyCriterias((prev) => {
      let newPrev = [...(prev || [])];

      const index = newPrev.findIndex((el) => el.id === idCriteria);

      if (index === -1) {
      } else {
        let newDetailTemp = [...(newPrev[index]?.policyCriteriaDetail || [])];

        newDetailTemp = newDetailTemp.filter((e) => e.id !== idCriteriaDetail);

        newPrev[index] = {
          ...newPrev[index],
          policyCriteriaDetail: newDetailTemp,
        };
      }

      return newPrev;
    });
  };

  const handleSubmitModalCriteriaDetail = (newData: any) => {
    setPolicyCriterias((prev) => {
      let newPrev = [...(prev || [])];

      const index = newPrev.findIndex(
        (el) =>
          el.settingCode === dataModal?.settingCode &&
          el.policyCriteriaType === dataModal?.policyCriteriaType
      );

      if (index === -1) {
      } else {
        let newDetailTemp = [...(newPrev[index]?.policyCriteriaDetail || [])];

        const indexDetail = newDetailTemp.findIndex(
          (e) => e.id === newData?.dataDetail?.id
        );

        if (indexDetail === -1) {
          newData?.dataDetail &&
            newDetailTemp.push({
              ...newData?.dataDetail,
              criteriaId: newPrev[index]?.id,
              policyId: newPrev[index]?.policyId,
            });
        } else {
          newDetailTemp[indexDetail] = {
            ...newDetailTemp[indexDetail],
            ...newData?.dataDetail,
            criteriaId: newPrev[index]?.id,
            policyId: newPrev[index]?.policyId,
          };
        }

        newPrev[index] = {
          ...newPrev[index],
          policyCriteriaDetail: newDetailTemp,
        };
      }

      return newPrev;
    });

    setDataModal({
      mode: Mode.View,
      detail: undefined,
      settingCode: PolicyCriteriaCode.Domestic,
      policyCriteriaType: ItineraryType.Flight,
    });
  };

  const handleValidateCriteriaDetail = () => {
    let checked = true;
    let newError = { ...errorModal };

    if (Helpers.isNullOrEmpty(dataModal?.detail?.bookingBudget)) {
      newError["bookingBudget"] = t("common:message.required_field");
      checked = false;
    }

    if (dataModal?.policyCriteriaType === ItineraryType.Flight) {
      if (Helpers.isNullOrEmpty(dataModal?.detail?.bookingType)) {
        newError["bookingType"] = t("common:message.required_field");
        checked = false;
      }

      if (Helpers.isNullOrEmpty(dataModal?.detail?.from)) {
        newError["from"] = t("common:message.required_field");
        checked = false;
      }

      if (Helpers.isNullOrEmpty(dataModal?.detail?.to)) {
        newError["to"] = t("common:message.required_field");
        checked = false;
      }

      if (Helpers.isNullOrEmpty(dataModal?.detail?.carrier)) {
        newError["carrier"] = t("common:message.required_field");
        checked = false;
      }

      if (Helpers.isNullOrEmpty(dataModal?.detail?.cabinClass)) {
        newError["cabinClass"] = t("common:message.required_field");
        checked = false;
      }

      if (Helpers.isNullOrEmpty(dataModal?.detail?.flightTime)) {
        newError["flightTime"] = t("common:message.required_field");
        checked = false;
      } else {
        if (Number(dataModal?.detail?.flightTime) <= 0) {
          newError["flightTime"] = "Thời gian bay phải lớn hơn 0";
          checked = false;
        }
      }
    }

    if (dataModal?.policyCriteriaType === ItineraryType.Hotel) {
      if (Helpers.isNullOrEmpty(dataModal?.detail?.from)) {
        newError["from"] = t("common:message.required_field");
        checked = false;
      }
    }

    if (!checked) {
      setErrorModal(newError);
    }

    return checked;
  };

  const handleSubmitCriteriaDetail = async () => {
    if (!handleValidateCriteriaDetail()) {
      return;
    } else {
      const newid = Helpers.isNullOrEmpty(dataModal?.detail?.id)
        ? Date.now().toString()
        : dataModal?.detail?.id;

      handleSubmitModalCriteriaDetail({
        settingCode: dataModal?.settingCode,
        policyCriteriaType: dataModal?.policyCriteriaType,

        dataDetail: {
          id: newid,
          sequence: dataModal?.detail?.sequence,
          carrier: dataModal?.detail?.carrier?.join(","),
          cabinClass: dataModal?.detail?.cabinClass,
          bookingType: dataModal?.detail?.bookingType,
          bookingClass: undefined,
          bookingBudget: dataModal?.detail?.bookingBudget,
          currency: dataModal?.detail?.currency,
          compareType: CompareType.LessThan,
          compareValue: undefined,
          compareNumber: dataModal?.detail?.flightTime,
          exception: undefined,
          starRating: dataModal?.detail?.starRating,
          to: dataModal?.detail?.to?.join(","),
          from: dataModal?.detail?.from?.join(","),
        },
      });

      setErrorModal({});
      setModeModal("Policy");
    }
  };

  const onChangeValueDataCriteriaDetail = ({
    key,
    value,
  }: {
    key: string;
    value: any;
  }) => {
    setDataModal((prev) => {
      let newDataDetail: any = { ...prev?.detail };

      newDataDetail[key] = value;

      return { ...prev, detail: newDataDetail };
    });
    setErrorModal((prev: any) => ({
      ...prev,
      [key]: undefined,
    }));
  };

  const handleSubmit = () => {
    let listDomestic: any[] = [];
    let listInternational: any[] = [];

    policyCriterias?.forEach((item) => {
      if (
        item.settingCode === PolicyCriteriaCode.Domestic &&
        item.policyCriteriaType === tabType
      ) {
        listDomestic = [
          ...(listDomestic || []),
          ...(item.policyCriteriaDetail || []),
        ];
      }

      if (
        item.settingCode === PolicyCriteriaCode.International &&
        item.policyCriteriaType === tabType
      ) {
        listInternational = [
          ...(listInternational || []),
          ...(item.policyCriteriaDetail || []),
        ];
      }
    });

    if (Helpers.isNullOrEmpty(dataPolicy?.name)) {
      setErrorPolicy((prev) => ({
        ...prev,
        name: t("common:message.required_field"),
      }));
    } else if (listDomestic.length === 0 || listInternational.length === 0) {
      let message = t("setting:policy.no_conditions_policy");

      if (listDomestic.length === 0 && listInternational.length === 0) {
        message = t("setting:policy.no_conditions_policy");
      } else {
        let text =
          tabType === ItineraryType.Flight
            ? t("setting:policy.flight")
            : t("setting:policy.hotel");

        if (listInternational.length === 0) {
          message = `${t("setting:policy.no_conditions")} ${text.toLowerCase()} ${t("setting:policy.international").toLowerCase()}`;
        }
        if (listDomestic.length === 0) {
          message = `${t("setting:policy.no_conditions")} ${text.toLowerCase()} ${t("setting:policy.domestic").toLowerCase()}`;
        }
      }

      dispatch(showSnackbar({ msg: message, type: "error" }));
    } else {
      handleCreatePolicy({
        data: dataPolicy,
        policyCriterias: policyCriterias,
        onCallBack: onCallBack,
      });
      setOpenCreate(false);
    }
  };

  const RenderContent = (props: {
    mode: Mode;
    type: ItineraryType;
    isDomestic: boolean;
  }) => (
    <CardPolicyCondition
      mode={props.mode}
      type={props.type}
      isDomestic={props.isDomestic}
      policyCriterias={policyCriterias}
      listAriLines={listAriLines || []}
      listCabinClass={listCabinClass || []}
      listBookingType={listBookingType || []}
      listAirport={listSelectedByType}
      listAddress={listSelectedByType}
      onCreate={(data) => {
        setLoadingModal(true);

        const newDataDetail = converPolicyCriteriaDetailToDataModalDetail(
          data.type,
          undefined
        );

        setDataModal({
          mode: Mode.Create,
          detail: newDataDetail,
          settingCode: data.settingCode,
          policyCriteriaType: data.type,
        });

        setTimeout(async (text?: string) => {
          try {
            setModeModal("PolicyDetail");

            setLoadingModal(false);
          } catch (error) {
          } finally {
          }
        }, 500);
      }}
      onDelete={(data) => {
        handleDeleteItemCriteriaDetail({
          idCriteria: data.idCriteria || "",
          idCriteriaDetail: data.idCriteriaDetail || "",
        });
      }}
      onDetail={(data) => {
        handleEditItemCriteriaDetail({
          mode: data.mode,
          idCriteria: data.idCriteria || "",
          idCriteriaDetail: data.idCriteriaDetail || "",
        });
      }}
    />
  );

  return (
    <Modal
      fullWidth
      maxWidth="lg"
      hasActionButton
      onClose={() => {
        if (modeModal === "Policy") {
          handleClose();
        }
        if (modeModal === "PolicyDetail") {
          setDataModal({
            mode: Mode.View,
            detail: undefined,
            settingCode: PolicyCriteriaCode.Domestic,
            policyCriteriaType: ItineraryType.Flight,
          });
          setErrorModal({});
          setModeModal("Policy");
        }
      }}
      onAction={() => {
        if (modeModal === "Policy") {
          handleSubmit();
        }
        if (modeModal === "PolicyDetail") {
          handleSubmitCriteriaDetail();
        }
      }}
      visible={openCreate}
      title={
        modeModal === "Policy"
          ? t("setting:policy_title_create_view")
          : `${dataModal?.mode === Mode.Create ? t("common:add_new") : t("common:edit")} ${t("setting:policy.policy").toLowerCase()}`
      }
    >
      <Box sx={{ height: "60vh" }}>
        {/*  */}
        {loadingModal && <LoadingModal height="60vh" />}

        {!loadingModal && (
          <>
            {modeModal === "Policy" && (
              <Grid container spacing={3} pt={2}>
                <Grid item xs={12}>
                  <FormField
                    required
                    maxLength={255}
                    variant="outlined"
                    mode={Mode.Create}
                    value={dataPolicy.name}
                    errorMessage={errorPolicy.name}
                    label={t("setting:policy.name_policy")}
                    placeholder={t("setting:policy.enter_name_policy")}
                    onChangeValue={(value) => {
                      onChangeValuePolicy("name", value);
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box>
                    {/* Action */}
                    <Box
                      sx={{
                        gap: "24px",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        borderBottom: 1,
                        borderColor: "#E4EBF7",
                      }}
                    >
                      <Box
                        onClick={() => {
                          setTabType(ItineraryType.Flight);
                        }}
                        sx={{
                          gap: "12px",
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          padding: "12px 16px",
                          borderBottom:
                            ItineraryType.Flight === tabType ? 2 : 0,
                          borderColor:
                            ItineraryType.Flight === tabType
                              ? "#1E97DE"
                              : "#637381",
                          ":hover": {
                            cursor: "pointer",
                          },
                        }}
                      >
                        <PolicyFlightIcon
                          htmlColor={
                            ItineraryType.Flight === tabType
                              ? "#1E97DE"
                              : "#637381"
                          }
                        />
                        <Typography
                          variant="button"
                          fontWeight="medium"
                          sx={{
                            color:
                              ItineraryType.Flight === tabType
                                ? "#1E97DE"
                                : "#637381",
                          }}
                        >
                          {t("setting:policy.flight")}
                        </Typography>
                      </Box>
                      <Box
                        onClick={() => {
                          setTabType(ItineraryType.Hotel);
                        }}
                        sx={{
                          gap: "12px",
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          padding: "12px 16px",
                          borderBottom: ItineraryType.Hotel === tabType ? 2 : 0,
                          borderColor:
                            ItineraryType.Hotel === tabType
                              ? "#1E97DE"
                              : "#637381",
                          ":hover": {
                            cursor: "pointer",
                          },
                        }}
                      >
                        <PolicyHotelIcon
                          htmlColor={
                            ItineraryType.Hotel === tabType
                              ? "#1E97DE"
                              : "#637381"
                          }
                        />
                        <Typography
                          variant="button"
                          fontWeight="medium"
                          sx={{
                            color:
                              ItineraryType.Hotel === tabType
                                ? "#1E97DE"
                                : "#637381",
                          }}
                        >
                          {t("setting:policy.hotel")}
                        </Typography>
                      </Box>
                    </Box>

                    <Box paddingTop={"8px"} paddingBottom={3}>
                      <Typography variant="caption" color="secondary">
                        {t("setting:policy.note_conditions_policy")}
                      </Typography>
                    </Box>

                    {/* Content */}
                    {tabType === ItineraryType.Flight && (
                      <>
                        {
                          <RenderContent
                            mode={Mode.Create}
                            isDomestic={false}
                            type={ItineraryType.Flight}
                            key={"Flight_International"}
                          />
                        }
                        <Box paddingBottom={3}></Box>
                        {
                          <RenderContent
                            mode={Mode.Create}
                            isDomestic={true}
                            type={ItineraryType.Flight}
                            key={"Flight_Domestic"}
                          />
                        }
                      </>
                    )}
                    {tabType === ItineraryType.Hotel && (
                      <>
                        {
                          <RenderContent
                            mode={Mode.Create}
                            isDomestic={false}
                            type={ItineraryType.Hotel}
                            key={"Hotel_International"}
                          />
                        }
                        <Box paddingBottom={3}></Box>
                        {
                          <RenderContent
                            mode={Mode.Create}
                            isDomestic={true}
                            type={ItineraryType.Hotel}
                            key={"Hotel_Domestic"}
                          />
                        }
                      </>
                    )}
                  </Box>
                </Grid>
              </Grid>
            )}

            {modeModal === "PolicyDetail" && (
              <Box padding={2}>
                {dataModal?.policyCriteriaType === ItineraryType.Flight && (
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Grid container spacing={0}>
                        <Grid item xs={12} sm={6} md={5}>
                          <Typography variant="button">
                            {t("setting:policy.flight_type")}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={7}>
                          <Autocomplete
                            isSelectedBox
                            variant={"outlined"}
                            mode={dataModal?.mode}
                            data={listBookingType || []}
                            errorMessage={errorModal?.bookingType}
                            loading={listBookingType?.length <= 0}
                            defaultValue={dataModal?.detail?.bookingType}
                            placeholder={t("setting:policy.select_type")}
                            onChange={(value) => {
                              onChangeValueDataCriteriaDetail({
                                key: "bookingType",
                                value: value ?? BookingTypePolicy.OneWay,
                              });
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={12}>
                      <Grid container spacing={0}>
                        <Grid item xs={12} sm={6} md={5}>
                          <Typography variant="button">
                            {t("setting:policy.departure_airport")}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={7}>
                          <Autocomplete
                            multiple
                            variant={"outlined"}
                            mode={dataModal?.mode}
                            data={listSelectedByType}
                            errorMessage={errorModal?.from}
                            defaultValue={dataModal?.detail?.from}
                            loading={listSelectedByType.length <= 1}
                            placeholder={t("setting:policy.departure_airport")}
                            onChange={(value) => {
                              const item = [...(value || [])]?.[
                                [...(value || [])].length - 1
                              ];

                              if (item === VALUE_ALL) {
                                onChangeValueDataCriteriaDetail({
                                  key: "from",
                                  value: [VALUE_ALL],
                                });
                              } else {
                                const newValue =
                                  [...(value || [])].length === 0
                                    ? [VALUE_ALL]
                                    : [...(value || [])].length === 1
                                      ? value
                                      : value.filter(
                                          (el: any) => el !== VALUE_ALL
                                        );

                                onChangeValueDataCriteriaDetail({
                                  key: "from",
                                  value: newValue,
                                });
                              }
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={12}>
                      <Grid container spacing={0}>
                        <Grid item xs={12} sm={6} md={5}>
                          <Typography variant="button">
                            {t("setting:policy.arrival_airport")}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={7}>
                          <Autocomplete
                            multiple
                            variant={"outlined"}
                            mode={dataModal?.mode}
                            data={listSelectedByType}
                            errorMessage={errorModal?.to}
                            defaultValue={dataModal?.detail?.to}
                            loading={listSelectedByType.length <= 1}
                            placeholder={t("setting:policy.arrival_airport")}
                            onChange={(value) => {
                              const item = [...(value || [])]?.[
                                [...(value || [])].length - 1
                              ];

                              if (item === VALUE_ALL) {
                                onChangeValueDataCriteriaDetail({
                                  key: "to",
                                  value: [VALUE_ALL],
                                });
                              } else {
                                const newValue =
                                  [...(value || [])].length === 0
                                    ? [VALUE_ALL]
                                    : [...(value || [])].length === 1
                                      ? value
                                      : value.filter(
                                          (el: any) => el !== VALUE_ALL
                                        );

                                onChangeValueDataCriteriaDetail({
                                  key: "to",
                                  value: newValue,
                                });
                              }
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={12}>
                      <Grid container spacing={0}>
                        <Grid item xs={12} sm={6} md={5}>
                          <Typography variant="button">
                            {t("setting:policy.flight_time_below")}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={7}>
                          <FormField
                            maxLength={100}
                            type={"number"}
                            variant={"outlined"}
                            mode={dataModal?.mode}
                            unit={t("setting:policy.hourt")}
                            errorMessage={errorModal?.flightTime}
                            value={dataModal?.detail?.flightTime}
                            placeholder={t(
                              "setting:policy.enter_flight_time_below"
                            )}
                            onChangeValue={(value) => {
                              const newValue = value
                                ? Number(value) > 0
                                  ? Number(value)
                                  : 0
                                : undefined;
                              onChangeValueDataCriteriaDetail({
                                key: "flightTime",
                                value: newValue,
                              });
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={12}>
                      <Grid container spacing={0}>
                        <Grid item xs={12} sm={6} md={5}>
                          <Typography variant="button">
                            {t("setting:policy.flight_class")}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={7}>
                          <Autocomplete
                            multiple
                            variant={"outlined"}
                            mode={dataModal?.mode}
                            data={listAriLines || []}
                            errorMessage={errorModal?.carrier}
                            loading={listAriLines?.length <= 1}
                            defaultValue={dataModal?.detail?.carrier}
                            placeholder={t(
                              "setting:policy.select_flight_class"
                            )}
                            onChange={(value) => {
                              const item = [...(value || [])]?.[
                                [...(value || [])].length - 1
                              ];

                              if (item === VALUE_ALL) {
                                onChangeValueDataCriteriaDetail({
                                  key: "carrier",
                                  value: [VALUE_ALL],
                                });
                              } else {
                                const newValue =
                                  [...(value || [])].length === 0
                                    ? [VALUE_ALL]
                                    : [...(value || [])].length === 1
                                      ? value
                                      : value.filter(
                                          (el: any) => el !== VALUE_ALL
                                        );

                                onChangeValueDataCriteriaDetail({
                                  key: "carrier",
                                  value: newValue,
                                });
                              }
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={12}>
                      <Grid container spacing={0}>
                        <Grid item xs={12} sm={6} md={5}>
                          <Typography variant="button">
                            {t("setting:policy.cabin_class")}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={7}>
                          <Autocomplete
                            isSelectedBox
                            variant={"outlined"}
                            mode={dataModal?.mode}
                            data={listCabinClass || []}
                            errorMessage={errorModal?.cabinClass}
                            loading={listCabinClass?.length <= 0}
                            defaultValue={dataModal?.detail?.cabinClass}
                            placeholder={t("setting:policy.select_cabin_class")}
                            onChange={(value) => {
                              onChangeValueDataCriteriaDetail({
                                key: "cabinClass",
                                value: value ?? listCabinClass?.[0]?.code,
                              });
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={12}>
                      <Grid container spacing={0}>
                        <Grid item xs={12} sm={6} md={5}>
                          <Typography variant="button">
                            {t("setting:budget.budget")}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={7}>
                          <FormField
                            isMoney
                            maxLength={100}
                            type={"number"}
                            variant={"outlined"}
                            mode={dataModal?.mode}
                            errorMessage={errorModal?.bookingBudget}
                            value={dataModal?.detail?.bookingBudget}
                            placeholder={t("setting:policy.enter_value")}
                            error={
                              !Helpers.isNullOrEmpty(errorModal?.bookingBudget)
                            }
                            unit={
                              dataModal?.detail?.currency ||
                              Constants.CURRENCY_DEFAULT
                            }
                            onChangeValue={(value) => {
                              const newValue = value
                                ? Number(value) > 0
                                  ? Number(value)
                                  : 0
                                : undefined;
                              onChangeValueDataCriteriaDetail({
                                key: "bookingBudget",
                                value: newValue,
                              });
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                )}

                {dataModal?.policyCriteriaType === ItineraryType.Hotel && (
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Grid container spacing={0}>
                        <Grid item xs={12} sm={6} md={5}>
                          <Typography variant="button">
                            {t("setting:policy.point")}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={7}>
                          <Autocomplete
                            multiple
                            variant={"outlined"}
                            mode={dataModal?.mode}
                            data={listSelectedByType}
                            errorMessage={errorModal?.from}
                            defaultValue={dataModal?.detail?.from}
                            loading={listSelectedByType.length <= 1}
                            placeholder={t("setting:policy.select_point")}
                            onChange={(value) => {
                              const item = [...(value || [])]?.[
                                [...(value || [])].length - 1
                              ];

                              if (item === VALUE_ALL) {
                                onChangeValueDataCriteriaDetail({
                                  key: "from",
                                  value: [VALUE_ALL],
                                });
                              } else {
                                const newValue =
                                  [...(value || [])].length === 0
                                    ? [VALUE_ALL]
                                    : [...(value || [])].length === 1
                                      ? value
                                      : value.filter(
                                          (el: any) => el !== VALUE_ALL
                                        );

                                onChangeValueDataCriteriaDetail({
                                  key: "from",
                                  value: newValue,
                                });
                              }
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={12}>
                      <Grid container spacing={0}>
                        <Grid item xs={12} sm={6} md={5}>
                          <Typography variant="button">
                            {t("setting:budget.budget")}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={7}>
                          <FormField
                            isMoney
                            maxLength={100}
                            type={"number"}
                            variant={"outlined"}
                            mode={dataModal?.mode}
                            value={dataModal?.detail?.bookingBudget}
                            errorMessage={errorModal?.bookingBudget}
                            placeholder={t("setting:policy.enter_value")}
                            error={
                              !Helpers.isNullOrEmpty(errorModal?.bookingBudget)
                            }
                            unit={
                              dataModal?.detail?.currency ||
                              Constants.CURRENCY_DEFAULT
                            }
                            onChangeValue={(value) => {
                              const newValue = value
                                ? Number(value) > 0
                                  ? Number(value)
                                  : 0
                                : undefined;
                              onChangeValueDataCriteriaDetail({
                                key: "bookingBudget",
                                value: newValue,
                              });
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={12}>
                      <Grid container spacing={0}>
                        <Grid item xs={12} sm={6} md={5}>
                          <Typography variant="button">
                            {t("setting:policy.maximum_star_rating")}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={7}>
                          <BoxStar
                            number={dataModal?.detail?.starRating || 0}
                            onChange={(value) => {
                              const newValue = Helpers.isNullOrEmpty(value)
                                ? Number(value)
                                : Number(value) > 0
                                  ? Number(value)
                                  : 0;
                              onChangeValueDataCriteriaDetail({
                                key: "starRating",
                                value: newValue,
                              });
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                )}
              </Box>
            )}
          </>
        )}
      </Box>
    </Modal>
  );
};

export default ModalCreateQuicklyPolicyNewVersion;
