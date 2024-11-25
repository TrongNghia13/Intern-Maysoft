import { Grid } from "@mui/material";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { GetStaticPaths, GetStaticProps } from "next";
import {
  Box,
  Button,
  FormField,
  Typography,
  useCommonComponentContext,
} from "@maysoft/common-component-react";

import Constants from "@src/constants";
import Helpers from "@src/commons/helpers";
import PathName from "@src/constants/PathName";
import useDataPolicyNewVersion from "@src/hooks/useDataPolicyNewVersion.hook";
import BookingPolicyService from "@src/services/booking/BookingPolicyService";
import CardPolicyCondition from "@src/components/PolicyNewVersion/cardPolicyCondition";
import ModalDetailPolicyCriteria from "@src/components/PolicyNewVersion/modalDetailPolicyCriteria";

import { RootState } from "@src/store";
import { NextApplicationPage } from "../../_app";
import { titleStyles } from "@src/styles/commonStyles";
import { PolicyFlightIcon, PolicyHotelIcon } from "@src/assets/svg";
import { withSSRErrorHandling } from "@src/commons/withSSRErrorHandling";
import { ItineraryType, Mode, PolicyCriteriaCode } from "@src/commons/enum";
import { makeServerSideTranslations } from "@src/commons/translationHelpers";
import {
  hideLoading,
  showLoading,
  showSnackbar,
} from "@src/store/slice/common.slice";
import {
  IBasicPolicy,
  ICriterum,
  IPolicyCriteriaDetail,
  IPolicyTarget,
} from "@src/hooks/useDataPolicy.hook";
import CompanyLayout from "@src/layout/companyLayout";

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

const PolicyDetailPage: NextApplicationPage<IProps> = ({ id }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { getResourcePermissions } = useCommonComponentContext();

  const {
    t,
    i18n: { language },
  } = useTranslation(["common", "setting"]);

  const resourcePermissions = getResourcePermissions(
    Constants.ResourceURI.POLICY
  );
  const userProfile = useSelector(
    (state: RootState) => state.userInfo.userProfile
  );

  const {
    listAriLines,
    listCabinClass,
    listBookingType,

    getListSelectedByType,
    getDataCodeNameAirline,
    getDataAddressBySelectCodes,
    getDataAirpostBySelectCodes,

    handleUpdatePolicy,
    handleCreatePolicy,
  } = useDataPolicyNewVersion({
    serviceCode: Constants.SERVICE_CODE,
    organizationId: userProfile?.organizationId || "0",
  });

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [dataModal, setDataModal] = useState<{
    mode: Mode;
    settingCode: string;
    policyCriteriaType: ItineraryType;

    policyCriteriaDetail?: IPolicyCriteriaDetail;
  }>({
    mode: Mode.View,
    policyCriteriaDetail: undefined,
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

  const [policyTargets, setPolicyTargets] = useState<IPolicyTarget[]>([]);
  const [policyCriterias, setPolicyCriterias] = useState<ICriterum[]>([]);

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
      { title: t("setting:policy_title_detail_view"), route: PathName.POLICY },
      { title: t("common:detail"), route: "" },
    ],
  });

  useEffect(() => {
    (async () => {
      try {
        dispatch(showLoading());

        if (id === "create") {
          handleOnChangeMode(Mode.Create);
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
        } else {
          let mode = resourcePermissions.canUpdate
            ? pramsMode || Mode.View
            : Mode.View;
          handleOnChangeMode(mode);

          const result = await BookingPolicyService.getDetail(id);

          setDataPolicy({
            id: id,
            code: result?.code,
            default: result?.default,
            serviceCode: result?.serviceCode,
            organizationId: result?.organizationId,
            name: result?.name?.value?.[language],
            description: result?.description?.value?.[language],
          });

          setPolicyTargets([...(result?.policyTargets || [])]);

          const newPolicyCriterias: ICriterum[] = [
            ...(result?.policyCriterias || []),
          ].map((item) => ({
            id: item.id,
            policyId: item.policyId,
            settingCode: item.settingCode,
            policyCriteriaType: item.type,
            policyCriteriaDetail: item.policyCriteriaDetail || [],
            updateTime: item.updateTime,
          }));

          setPolicyCriterias(newPolicyCriterias);
        }

        await getDataCodeNameAirline();
        await getDataAddressBySelectCodes({ countryCode: undefined });
        await getDataAirpostBySelectCodes({ countryCode: undefined });
        await getDataAddressBySelectCodes({ countryCode: "vn" });
        await getDataAirpostBySelectCodes({ countryCode: "vn" });
      } catch (error) {
        Helpers.handleError(error);
      } finally {
        dispatch(hideLoading());
      }
    })();
  }, [id]);

  const handleGoBack = () => {
    router.push({ pathname: PathName.POLICY });
  };

  const handleOnChangeMode = (value: number) => {
    if (value === Mode.Create) {
      setModel({
        mode: value,
        title: t("setting:policy_title_create_view"),
        route: [
          { title: t("setting:policy_title_menu"), route: PathName.POLICY },
          { title: t("common:add_new"), route: "" },
        ],
      });
    }
    if (value === Mode.Update) {
      setModel({
        mode: value,
        title: t("setting:policy_title_update_view"),
        route: [
          { title: t("setting:policy_title_menu"), route: PathName.POLICY },
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
        title: t("setting:policy_title_detail_view"),
        route: [
          { title: t("setting:policy_title_menu"), route: PathName.POLICY },
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

  const handleSubmit = () => {
    if (model.mode === Mode.View) {
      handleOnChangeMode(Mode.Update);
    } else {
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
        if (id === "create") {
          handleCreatePolicy({
            data: dataPolicy,
            policyCriterias: policyCriterias,
            onCallBack(data) {
              handleGoBack();
            },
          });
        } else {
          handleUpdatePolicy({
            data: dataPolicy,
            policyTargets: policyTargets,
            policyCriterias: policyCriterias,
            onCallBack(data) {
              handleGoBack();
            },
          });
        }
      }
    }
  };

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

  const handleEditItemCriteriaDetail = ({
    mode,
    idCriteria,
    idCriteriaDetail,
  }: {
    mode: Mode;
    idCriteria: string;
    idCriteriaDetail: string;
  }) => {
    let newItemCriteria = [...(policyCriterias || [])].find(
      (el) => el.id === idCriteria
    );

    if (newItemCriteria) {
      let newItemCriteriaDetail = newItemCriteria?.policyCriteriaDetail?.find(
        (e) => e.id === idCriteriaDetail
      );

      if (newItemCriteriaDetail) {
        setDataModal({
          mode: mode,
          policyCriteriaDetail: newItemCriteriaDetail,
          settingCode: newItemCriteria.settingCode || "",
          policyCriteriaType:
            newItemCriteria.policyCriteriaType || ItineraryType.Flight,
        });
        setOpenModal(true);
      }
    }
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
        // newPrev.push({
        //     id: dataModal?.criteriaId,
        //     policyId: dataModal?.policyId,
        //     settingCode: dataModal?.settingCode,
        //     policyCriteriaType: dataModal?.policyCriteriaType,
        //     policyCriteriaDetail: [{ ...newData?.dataDetail }],
        // });
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
      policyCriteriaDetail: undefined,
      settingCode: PolicyCriteriaCode.Domestic,
      policyCriteriaType: ItineraryType.Flight,
    });
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
      listAirport={getListSelectedByType({
        settingCode: dataModal?.settingCode,
        type: dataModal?.policyCriteriaType,
      })}
      listAddress={getListSelectedByType({
        settingCode: dataModal?.settingCode,
        type: dataModal?.policyCriteriaType,
      })}
      onCreate={(data) => {
        setOpenModal(true);

        setDataModal({
          mode: Mode.Create,
          settingCode: data.settingCode,
          policyCriteriaType: data.type,
          policyCriteriaDetail: undefined,
        });
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
    <CompanyLayout>
      <Grid container spacing={3}>
        {/* title */}
        <Grid item xs={12}>
          <Box
            sx={{
              gap: 1,
              paddingBottom: 2,
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h6" sx={titleStyles}>
              {model.title}
            </Typography>
            <Box
              sx={{
                gap: 1,
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <Button color="secondary" onClick={handleGoBack}>
                {t("common:go_back")}
              </Button>
              {(resourcePermissions.canCreate ||
                resourcePermissions.canUpdate) && (
                <Button color="info" onClick={handleSubmit}>
                  {model.mode === Mode.View
                    ? t("common:edit")
                    : t("common:save")}
                </Button>
              )}
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <FormField
            required
            maxLength={255}
            mode={model.mode}
            variant={"outlined"}
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
          <FormField
            multiline
            minRows={3}
            maxLength={500}
            mode={model.mode}
            variant={"outlined"}
            value={dataPolicy.description}
            errorMessage={errorPolicy.description}
            label={t("setting:policy.description_policy")}
            placeholder={t("setting:policy.enter_description_policy")}
            onChangeValue={(value) => {
              onChangeValuePolicy("description", value);
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Box padding={2}>
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
                  borderBottom: ItineraryType.Flight === tabType ? 2 : 0,
                  borderColor:
                    ItineraryType.Flight === tabType ? "#1E97DE" : "#637381",
                  ":hover": {
                    cursor: "pointer",
                  },
                }}
              >
                <PolicyFlightIcon
                  htmlColor={
                    ItineraryType.Flight === tabType ? "#1E97DE" : "#637381"
                  }
                />
                <Typography
                  variant="button"
                  fontWeight="medium"
                  sx={{
                    color:
                      ItineraryType.Flight === tabType ? "#1E97DE" : "#637381",
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
                    ItineraryType.Hotel === tabType ? "#1E97DE" : "#637381",
                  ":hover": {
                    cursor: "pointer",
                  },
                }}
              >
                <PolicyHotelIcon
                  htmlColor={
                    ItineraryType.Hotel === tabType ? "#1E97DE" : "#637381"
                  }
                />
                <Typography
                  variant="button"
                  fontWeight="medium"
                  sx={{
                    color:
                      ItineraryType.Hotel === tabType ? "#1E97DE" : "#637381",
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
            {tabType === ItineraryType.Flight && (
              <>
                {
                  <RenderContent
                    mode={model.mode}
                    isDomestic={false}
                    type={ItineraryType.Flight}
                    key={"Flight_International"}
                  />
                }
                <Box paddingBottom={3}></Box>
                {
                  <RenderContent
                    mode={model.mode}
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
                    mode={model.mode}
                    isDomestic={false}
                    type={ItineraryType.Hotel}
                    key={"Hotel_International"}
                  />
                }
                <Box paddingBottom={3}></Box>
                {
                  <RenderContent
                    mode={model.mode}
                    isDomestic={true}
                    type={ItineraryType.Hotel}
                    key={"Hotel_Domestic"}
                  />
                }
              </>
            )}
          </Box>
        </Grid>

        {openModal && (
          <ModalDetailPolicyCriteria
            openModal={openModal}
            mode={dataModal?.mode}
            setOpenModal={setOpenModal}
            listAriLines={listAriLines || []}
            listCabinClass={listCabinClass || []}
            listBookingType={listBookingType || []}
            listAirport={getListSelectedByType({
              settingCode: dataModal?.settingCode,
              type: dataModal?.policyCriteriaType,
            })}
            listAddress={getListSelectedByType({
              settingCode: dataModal?.settingCode,
              type: dataModal?.policyCriteriaType,
            })}
            settingCode={dataModal?.settingCode}
            dataDetail={dataModal?.policyCriteriaDetail}
            policyCriteriaType={dataModal?.policyCriteriaType}
            onClose={() => {
              setDataModal({
                mode: Mode.View,
                policyCriteriaDetail: undefined,
                settingCode: PolicyCriteriaCode.Domestic,
                policyCriteriaType: ItineraryType.Flight,
              });
            }}
            onSubmit={handleSubmitModalCriteriaDetail}
          />
        )}
      </Grid>
    </CompanyLayout>
  );
};

PolicyDetailPage.requiredAuth = true;
PolicyDetailPage.requiredSettinglayout = true;

export default withSSRErrorHandling(PolicyDetailPage);
