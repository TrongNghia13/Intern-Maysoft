import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import Constants from "@src/constants";
import Helpers from "@src/commons/helpers";
import TransportHubService from "@src/services/common/TransportHubService";
import BookingPolicyService from "@src/services/booking/BookingPolicyService";
import AdministrativeDivisionService from "@src/services/common/AdministrativeDivisionService";

import { RootState } from "@src/store";
import { ICodename } from "@src/commons/interfaces";
import { CodenameService } from "@src/services/common";
import { hideLoading, showLoading, showSnackbar } from "@src/store/slice/common.slice";
import { BookingTypePolicy, CabinClass, ItineraryType, PolicyCriteriaCode } from "@src/commons/enum";
import { IBasicPolicy, ICriterum, IPolicyTarget, IRecordPolicy, VALUE_ALL } from "./useDataPolicy.hook";



const useDataPolicyNewVersion = ({organizationId, serviceCode} : {serviceCode: string, organizationId: string }) => {
    const dispatch = useDispatch();

    const {
        t,
        i18n: { language },
    } = useTranslation(["common", "setting"]);

    const all_airline = t("setting:policy.all_airline");
    const all_airports = t("setting:policy.all_airports");
    const all_destinations = t("setting:policy.all_destinations");

    const userProfile = useSelector((state: RootState) => state.userInfo?.userProfile);

    const [listAriLines, setListAriLines] = useState<ICodename[]>([
        { code: VALUE_ALL, name: all_airline }
    ]);

    const [listInternationalFlightSelected, setListInternationalFlightSelected] = useState<ICodename[]>([
        { code: VALUE_ALL, name: all_airports }
    ]);

    const [listDomesticFlightSelected, setListDomesticFlightSelected] = useState<ICodename[]>([
        { code: VALUE_ALL, name: all_airports }
    ]);

    const [listInternationalStaySelected, setListInternationalStaySelected] = useState<ICodename[]>([
        { code: VALUE_ALL, name: all_destinations }
    ]);

    const [listDomesticStaySelected, setListDomesticStaySelected] = useState<ICodename[]>([
        { code: VALUE_ALL, name: all_destinations }
    ]);

    const listCabinClass = [
        { code: CabinClass.EconomyClass, name: t("setting:policy.economy_class") },
        { code: CabinClass.BusinessClass, name: t("setting:policy.business_class") },
    ];

    const listBookingType = [
        { code: BookingTypePolicy.OneWay, name: t("setting:policy.one_way") },
        { code: BookingTypePolicy.RoundTrip, name: t("setting:policy.round_trip") },
    ];


    const getDataAirpostBySelectCodes = async ({ countryCode }: { countryCode?: string }) => {
        try {
            const items: ICodename[] = [{ code: VALUE_ALL, name: all_airports }];

            const result = await TransportHubService.getPaged({
                type: 1,
                pageNumber: 1,
                pageSize: 9999,
                countryCode: countryCode,
            });

            [...result?.items || []]?.forEach((item: any) => {
                items.push({
                    code: item.code,
                    name: item.name,
                    detail: item,
                });
            });

            if (Helpers.isNullOrEmpty(countryCode)) {
                setListInternationalFlightSelected(items);
            } else {
                setListDomesticFlightSelected(items);
            }
        } catch (error) { }
    };

    const getDataAddressBySelectCodes = async ({
        type,
        countryCode,
    }:
        {
            type?: number,
            countryCode?: string,
        }) => {
        try {
            const items: ICodename[] = [{ code: VALUE_ALL, name: all_destinations }];

            const result = await AdministrativeDivisionService.getPaged({
                type: type,
                pageNumber: 1,
                pageSize: 9999,
                countryCode: countryCode,
            });

            [...result?.items || []].forEach((item: any) => {
                items.push({
                    code: item.code,
                    name: item.name,
                    detail: item,
                });
            });

            if (Helpers.isNullOrEmpty(countryCode)) {
                setListInternationalStaySelected(items);
            } else {
                setListDomesticStaySelected(items);
            }
        } catch (error) { }
    };

    const getDataCodeNameAirline = async () => {
        try {
            const items: ICodename[] = [{ code: VALUE_ALL, name: t("setting:policy.all_airline") }];

            const result = await CodenameService.getByGroup("AIRLINE");

            result?.["AIRLINE"]?.forEach((item: any) => {
                items.push({
                    code: item.code,
                    name: item.name,
                });
            });

            setListAriLines(items);
        } catch (error) { }
    };

    const converDataCriterias = (dataCriteria: ICriterum[], isID: boolean) => {
        const criteria: ICriterum[] = [];

        for (const item of dataCriteria) {

            const policyCriteriaDetail = [...item.policyCriteriaDetail || []].map((el, index) => ({
                policyId: isID ? el.policyId : undefined,
                criteriaId: isID ? el.criteriaId : undefined,

                currency: el.currency,
                exception: el.exception,
                compareType: el.compareType,
                compareValue: el.compareValue,
                compareNumber: el.compareNumber,

                sequence: el.sequence || index,

                bookingType: el.bookingType,
                bookingClass: el.bookingClass,
                bookingBudget: el.bookingBudget,
                to: (el.to === VALUE_ALL) ? undefined : el.to,
                from: (el.from === VALUE_ALL) ? undefined : el.from,
                carrier: (el.carrier === VALUE_ALL) ? undefined : el.carrier,
                cabinClass: (el.cabinClass === VALUE_ALL) ? undefined : el.cabinClass,
            }));

            criteria.push({
                settingCode: item.settingCode,
                policyId: isID ? item.policyId : undefined,
                policyCriteriaType: item.policyCriteriaType,
                policyCriteriaDetail: policyCriteriaDetail || [],
            });
        };

        return criteria;
    };

    const handleCreatePolicy = async ({
        data,
        onCallBack,
        policyCriterias,
    }: {
        data: IBasicPolicy,
        policyCriterias: ICriterum[],
        onCallBack: (data: IBasicPolicy) => void,
    }) => {
        try {
            dispatch(showLoading());

            const result = await BookingPolicyService.create({
                serviceCode: Constants.SERVICE_CODE,
                organizationId: userProfile?.organizationId || "0",

                name: {
                    value: {
                        "vi": data.name || "",
                        "en": data.name || "",
                    },
                },
                description: {
                    value: {
                        "vi": data.description || "",
                        "en": data.description || "",
                    },
                },
                criteria: converDataCriterias(policyCriterias, false),
            });

            onCallBack({ ...data, id: result?.id });

            dispatch(showSnackbar({ msg: t("setting:policy.create_success"), type: "success" }));
        } catch (error) {
            Helpers.handleError(error);
        } finally {
            dispatch(hideLoading());
        }
    };

    const handleUpdatePolicy = async ({
        data,
        onCallBack,
        policyTargets,
        policyCriterias,
    }: {
        data: IBasicPolicy,
        policyCriterias: ICriterum[],
        policyTargets?: IPolicyTarget[],
        onCallBack: (data: IBasicPolicy) => void,
    }) => {
        try {
            dispatch(showLoading());

            const targetIds = policyTargets?.map(el => el.targetId);

            await BookingPolicyService.update({
                serviceCode: data?.serviceCode || Constants.SERVICE_CODE,
                organizationId: data?.organizationId || (userProfile?.organizationId || "0"),

                id: data?.id,
                code: data?.code,
                default: data?.default,

                name: {
                    value: {
                        "vi": data.name || "",
                        "en": data.name || "",
                    },
                },
                description: {
                    value: {
                        "vi": data.description || "",
                        "en": data.description || "",
                    },
                },
                criteria: converDataCriterias(policyCriterias, true),

                target: {
                    policyId: policyTargets?.[0]?.policyId,
                    targetType: policyTargets?.[0]?.targetType,
                    targetIds: targetIds,
                },
            });

            onCallBack({
                id: data?.id,
                name: data?.name,
                description: data?.description,
            });

            dispatch(showSnackbar({ msg: t("setting:policy.update_success"), type: "success" }));

        } catch (error) {
            Helpers.handleError(error);
        } finally {
            dispatch(hideLoading());
        }
    };

    const handleDeletePolicy = async (id: string) => {
        try {
            dispatch(showLoading());

            await BookingPolicyService.delete(id);

            dispatch(showSnackbar({ msg: t("setting:policy.delete_success"), type: "success" }));
        } catch (error) {
            Helpers.handleError(error);
        } finally {
            dispatch(hideLoading());
        }
    };

    const handleCreateCopyPolicy = async (data: IRecordPolicy) => {
        try {
            dispatch(showLoading());

            await BookingPolicyService.create({
                serviceCode: data.serviceCode || Constants.SERVICE_CODE,
                organizationId: data.organizationId || (userProfile?.organizationId || "0"),

                name: data.name,
                description: data.description,
                criteria: converDataCriterias(data.policyCriterias, false),
            });

            dispatch(showSnackbar({ msg: t("setting:policy.create_copy_success"), type: "success" }));
        } catch (error) {
            Helpers.handleError(error);
        } finally {
            dispatch(hideLoading());
        }
    };

    const getListSelectedByType = ({ type, settingCode }: {
        type: number;
        settingCode: string;
    }) => {
        if (type === ItineraryType.Flight) {
            if (settingCode === PolicyCriteriaCode.Domestic) {
                return listDomesticFlightSelected
            }
            if (settingCode === PolicyCriteriaCode.International) {
                return listInternationalFlightSelected
            }
            return [];
        };

        if (type === ItineraryType.Hotel) {
            if (settingCode === PolicyCriteriaCode.Domestic) {
                return listDomesticStaySelected
            }
            if (settingCode === PolicyCriteriaCode.International) {
                return listInternationalStaySelected
            }
            return [];
        };

        return [];
    };

    return {
        listAriLines,
        listCabinClass,
        listBookingType,
        listDomesticStaySelected,
        listDomesticFlightSelected,
        listInternationalStaySelected,
        listInternationalFlightSelected,

        getListSelectedByType,
        getDataCodeNameAirline,
        getDataAddressBySelectCodes,
        getDataAirpostBySelectCodes,

        handleUpdatePolicy,
        handleCreatePolicy,
        handleDeletePolicy,
        handleCreateCopyPolicy,

    };
};

export default useDataPolicyNewVersion;