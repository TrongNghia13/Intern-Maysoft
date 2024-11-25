import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import Constants from "@src/constants";
import Helpers from "@src/commons/helpers";
import TransportHubService from "@src/services/common/TransportHubService";
import BookingPolicyService from "@src/services/booking/BookingPolicyService";
import AdministrativeDivisionService from "@src/services/common/AdministrativeDivisionService";

import { RootState } from "@src/store";
import { CodenameService } from "@src/services/common";
import { ICodename, IMultiLanguageContent, IPagedList } from "@src/commons/interfaces";
import { hideLoading, showLoading, showSnackbar } from "@src/store/slice/common.slice";
import { BookingTypePolicy, CabinClass, CompareType, ItineraryType, PolicyCriteriaCode } from "@src/commons/enum";


export interface IGetByCondition {
    organizationId?: string
    serviceCode?: string
    tenantCode?: string
    targetId?: string
    policyTarget?: number
}

export interface IDataCreateUpdatePolicy {
    serviceCode?: string
    organizationId?: string
    id?: string
    code?: string
    default?: number
    name?: IMultiLanguageContent
    description?: IMultiLanguageContent
    target?: ITarget
    criteria?: ICriterum[]
}

export interface ITarget {
    policyId?: string
    targetType?: number
    targetIds?: string[]
}

export interface ICriterum {
    id?: string
    policyId?: string
    settingCode?: string
    policyCriteriaType?: number
    policyCriteriaDetail?: IPolicyCriteriaDetail[]
    updateTime?: string
}

export interface IPolicyCriteriaDetail {
    id?: string
    policyId?: string
    criteriaId?: string

    sequence?: number
    carrier?: string
    cabinClass?: string
    bookingType?: number
    bookingClass?: string
    bookingBudget?: number
    currency?: string
    compareType?: number
    compareValue?: string
    compareNumber?: number
    starRating?: number
    exception?: number
    to?: string
    from?: string

    status?: number
    createTime?: string
    createUser?: string
    updateTime?: string
    updateUser?: string
}

export interface IRequestGetpagedPolicy {
    orderby?: string
    pageSize?: number
    pageNumber?: number
    searchText?: string
    organizationId?: string
}

export interface IBasicPolicy {
    serviceCode?: string,
    organizationId?: string,

    id?: string;
    code?: string,
    name?: string,
    default?: number,
    description?: string,
};

export interface IRecordPolicy {
    policyTargets: IPolicyTarget[]
    policyCriterias: IPolicyCriteria[]
    tenantCode: string
    serviceCode: string
    organizationId: string
    code: string
    name: IMultiLanguageContent
    description: IMultiLanguageContent
    default: number
    id: string
    status: number
    createTime: string
    createUser: string
    updateTime: string
    updateUser: string
}

export interface IPolicyTarget {
    policyId: string
    targetType: number
    targetId: string
    targetCode: string
    startTime: string
    endTime: string
    id: string
    status: number
    createTime: string
    createUser: string
    updateTime: string
    updateUser: string
}

export interface IPolicyCriteria {
    type: number
    policyId: string
    settingCode: string
    policyCriteriaDetail: IPolicyCriteriaDetail[]

    id: string
    status: number
    createTime: string
    createUser: string
    updateTime: string
    updateUser: string
}

export const VALUE_ALL = "-1";

const useDataPolicy = (id?: string) => {
    const dispatch = useDispatch();

    const {
        t,
        i18n: { language },
    } = useTranslation(["common", "setting"]);

    const all_airports = t("setting:policy.all_airports");
    const all_destinations = t("setting:policy.all_destinations");

    const userProfile = useSelector((state: RootState) => state.userInfo?.userProfile);

    const settingCodeFlight = [
        PolicyCriteriaCode.Domestic,
        PolicyCriteriaCode.International,
        PolicyCriteriaCode.BookingTime,
        PolicyCriteriaCode.FlightTime,
        PolicyCriteriaCode.FlightClass,
        PolicyCriteriaCode.CabinClass,
    ];

    const settingCodeStay = [
        PolicyCriteriaCode.Domestic,
        PolicyCriteriaCode.International,
        PolicyCriteriaCode.BookingTime,
        PolicyCriteriaCode.StarClass,
    ];

    const [listAriLines, setListAriLines] = useState<ICodename[]>([
        { code: VALUE_ALL, name: t("setting:policy.all_airline") }
    ]);

    const [listFlightSelected, setListFlightSelected] = useState<ICodename[]>([
        { code: VALUE_ALL, name: all_airports }
    ]);

    const [listInternationalFlightDefaule, setListInternationalFlightDefaule] = useState<ICodename[]>([
        { code: VALUE_ALL, name: all_airports }
    ]);

    const [listDomesticFlightDefaule, setListDomesticFlightDefaule] = useState<ICodename[]>([
        { code: VALUE_ALL, name: all_airports }
    ]);

    const [listStaySelected, setListStaySelected] = useState<ICodename[]>([
        { code: VALUE_ALL, name: all_destinations }
    ]);

    const [listInternationalStayDefaule, setListInternationalStayDefaule] = useState<ICodename[]>([
        { code: VALUE_ALL, name: all_destinations }
    ]);

    const [listDomesticStayDefaule, setListDomesticStayDefaule] = useState<ICodename[]>([
        { code: VALUE_ALL, name: all_destinations }
    ]);

    const listCabinClass = [
        // { code: VALUE_ALL, name: t("setting:policy.all_cabin") },
        { code: CabinClass.EconomyClass, name: t("setting:policy.economy_class") },
        // { code: CabinClass.PremiumEconomyClass, name: t("setting:policy.premium_economy_class") },
        { code: CabinClass.BusinessClass, name: t("setting:policy.business_class") },
        // { code: CabinClass.FirstClass, name: t("setting:policy.first_class") },
    ];

    const listBookingType = [
        { code: BookingTypePolicy.OneWay, name: t("setting:policy.one_way") },
        { code: BookingTypePolicy.RoundTrip, name: t("setting:policy.round_trip") },
        { code: BookingTypePolicy.MultiCity, name: t("setting:policy.multi_city") },
    ];

    const [dataPolicy, setDataPolicy] = useState<IPagedList<IRecordPolicy>>({
        totalPages: 1,
        totalCount: 0,
        currentPage: 1,
        hasNext: false,
        hasPrevious: false,
        pageSize: Constants.ROW_PER_PAGE_20,
        items: [],
    });

    const getDataCriteriasByCreate = ({
        settingCode,
        criteriaType,
        hidenFlightTime,
        hidenBookingTime,
    }: {
        settingCode: any[],
        criteriaType: ItineraryType,
        hidenFlightTime?: boolean,
        hidenBookingTime?: boolean,
    }) => {
        const criteria: ICriterum[] = [];

        let policyCriteriaDetail: IPolicyCriteriaDetail = {
            id: undefined,
            sequence: undefined,
            currency: undefined,
            exception: undefined,
            bookingType: undefined,
            bookingClass: undefined,
            bookingBudget: undefined,
            compareValue: undefined,
            compareNumber: undefined,
            compareType: CompareType.Equal,
            to: undefined,
            from: undefined,
            carrier: undefined,
            cabinClass: undefined,
        } as IPolicyCriteriaDetail;

        for (const valueCode of settingCode) {

            if ([PolicyCriteriaCode.Domestic, PolicyCriteriaCode.International].includes(valueCode)) {
                const valueBookingType = (criteriaType === ItineraryType.Flight) ? BookingTypePolicy.OneWay : undefined;
                policyCriteriaDetail = {
                    sequence: 0,
                    bookingBudget: 0,
                    bookingType: valueBookingType,
                    compareType: CompareType.Equal,
                    currency: Constants.CURRENCY_DEFAULT,
                }
            }

            if (!hidenBookingTime && (PolicyCriteriaCode.BookingTime === valueCode)) {
                policyCriteriaDetail = {
                    currency: "day",
                    compareNumber: 0,
                    compareType: CompareType.GreaterThanEqual,
                }
            }

            if (!hidenFlightTime && (PolicyCriteriaCode.FlightTime === valueCode)) {
                policyCriteriaDetail = {
                    compareNumber: 0,
                    currency: "hourt",
                    compareType: CompareType.GreaterThanEqual,
                }
            }

            if (PolicyCriteriaCode.StarClass === valueCode) {
                policyCriteriaDetail = {
                    sequence: 0,
                    compareNumber: 0,
                    compareType: CompareType.Equal,
                }
            }

            if (PolicyCriteriaCode.CabinClass === valueCode) {
                policyCriteriaDetail = {
                    sequence: 0,
                    cabinClass: undefined,
                    compareType: CompareType.Equal,
                }
            }

            if (PolicyCriteriaCode.FlightClass === valueCode) {
                policyCriteriaDetail = {
                    sequence: 0,
                    carrier: undefined,
                    compareType: CompareType.Equal,
                }
            }

            criteria.push({
                settingCode: valueCode,
                policyCriteriaType: criteriaType,
                policyCriteriaDetail: [policyCriteriaDetail],
            });
        };

        return criteria;
    };

    const converDataCriterias = (dataCriteria: IPolicyCriteria[], isID: boolean) => {
        const criteria: ICriterum[] = [];

        for (const item of dataCriteria) {

            const policyCriteriaDetail = item.policyCriteriaDetail?.map(el => ({
                policyId: isID ? el.policyId : undefined,
                criteriaId: isID ? el.criteriaId : undefined,
                bookingBudget: el.bookingBudget,
                currency: el.currency,
                bookingClass: el.bookingClass,
                compareType: (
                    ([PolicyCriteriaCode.BookingTime, PolicyCriteriaCode.FlightTime].includes(item?.settingCode as any))
                        ? CompareType.GreaterThanEqual
                        : el.compareType
                ),
                compareNumber: el.compareNumber,
                compareValue: el.compareValue,
                exception: el.exception,
                from: (el.from === VALUE_ALL) ? undefined : el.from,
                to: (el.to === VALUE_ALL) ? undefined : el.to,
                bookingType: el.bookingType,
                sequence: el.sequence,
                carrier: (el.carrier === VALUE_ALL) ? undefined : el.carrier,
                cabinClass: (el.cabinClass === VALUE_ALL) ? undefined : el.cabinClass,
            }));

            criteria.push({
                settingCode: item.settingCode,
                policyCriteriaType: item.type,
                policyId: isID ? item.policyId : undefined,
                policyCriteriaDetail: policyCriteriaDetail,
            });
        };

        return criteria;
    };

    const getPagedPolicy = async ({ pageNumber }: { pageNumber?: number }) => {
        try {
            dispatch(showLoading());

            const pageSize = Constants.ROW_PER_PAGE;
            const page = Helpers.getPageNumber(pageNumber || 1, pageSize, dataPolicy?.totalCount || 0);

            const resultGetpaged = await BookingPolicyService.getPaged({
                pageSize,
                pageNumber: page,
                organizationId: userProfile?.organizationId || "0",
            });

            setDataPolicy(resultGetpaged);

            let selectedCodeAirport: string[] = [];
            let selectedCodeAddress: string[] = [];

            for (const item of [...resultGetpaged.items || []]) {
                for (const criteria of [...item.policyCriterias || []]) {
                    if (criteria.settingCode === PolicyCriteriaCode.Domestic ||
                        criteria.settingCode === PolicyCriteriaCode.International) {
                        for (const el of [...criteria.policyCriteriaDetail || []]) {
                            if (criteria.type === ItineraryType.Flight) {
                                if (!Helpers.isNullOrEmpty(el.from) && (el.from !== VALUE_ALL)) {
                                    selectedCodeAirport.push(el.from);
                                }
                                if (!Helpers.isNullOrEmpty(el.to) && (el.to !== VALUE_ALL)) {
                                    selectedCodeAirport.push(el.to);
                                }
                            }
                            if (criteria.type === ItineraryType.Hotel) {
                                if (!Helpers.isNullOrEmpty(el.from) && (el.from !== VALUE_ALL)) {
                                    selectedCodeAddress.push(el.from);
                                }
                                if (!Helpers.isNullOrEmpty(el.to) && (el.to !== VALUE_ALL)) {
                                    selectedCodeAddress.push(el.to);
                                }
                            }
                        }
                    }
                }
            };

            selectedCodeAddress.length > 0 && getDataAddressBySelectCodes({ selectCodes: selectedCodeAddress });

            selectedCodeAirport.length > 0 && getDataAirpostBySelectCodes({ selectCodes: selectedCodeAirport });

            getDataCodeNameAirline();

        } catch (error) {
            Helpers.handleError(error);
        } finally {
            dispatch(hideLoading());
        }
    };

    const handleCreatePolicy = async ({
        data,
        onCallBack,
        hidenFlightTime,
        hidenBookingTime,
    }: {
        data: IBasicPolicy,
        hidenFlightTime?: boolean,
        hidenBookingTime?: boolean,
        onCallBack: (data: IBasicPolicy) => void,
    }) => {
        try {
            dispatch(showLoading());

            const newDataCriteriaHotel = getDataCriteriasByCreate({
                settingCode: settingCodeStay,
                criteriaType: ItineraryType.Hotel,
                hidenFlightTime: hidenFlightTime,
                hidenBookingTime: hidenBookingTime,
            });

            const newDataCriteriaFlight = getDataCriteriasByCreate({
                settingCode: settingCodeFlight,
                criteriaType: ItineraryType.Flight,
                hidenFlightTime: hidenFlightTime,
                hidenBookingTime: hidenBookingTime,
            });

            const criteria: ICriterum[] = [
                ...newDataCriteriaHotel || [],
                ...newDataCriteriaFlight || [],
            ];

            const result = await BookingPolicyService.create({
                serviceCode: Constants.SERVICE_CODE,
                organizationId: data?.organizationId || "0",
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
                criteria: criteria,
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
        data, onCallBack,
    }: {
        data: IRecordPolicy,
        onCallBack: (data: IBasicPolicy) => void,
    }) => {
        try {
            dispatch(showLoading());

            const targetIds = data?.policyTargets?.map(el => el.targetId);

            await BookingPolicyService.update({
                serviceCode: data?.serviceCode || Constants.SERVICE_CODE,
                organizationId: data?.organizationId || (userProfile?.organizationId || "0"),

                id: data?.id,
                code: data?.code,
                default: data?.default,
                criteria: converDataCriterias(data?.policyCriterias, true),
                target: {
                    policyId: data?.policyTargets?.[0]?.policyId,
                    targetType: data?.policyTargets?.[0]?.targetType,
                    targetIds: targetIds,
                },
                name: data?.name,
                description: data?.description,
            });

            onCallBack({
                id: data?.id,
                name: data?.name?.value?.["vi"],
                description: data?.description?.value?.["vi"],
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

    const getPolicyCriteriaByType = ({ data, type }: { data: IPolicyCriteria[], type: ItineraryType }) => {
        const listItem = data.filter(el => el.type === type) || [];

        const newData: Map<string, IPolicyCriteria> = new Map(); // key = settingCode; value: IPolicyCriteria

        for (const item of listItem) {
            newData.set(item.settingCode, item);
        };

        return newData;
    };

    const handleUpdateDataDetailPolicy = async (data: Map<string, IPolicyCriteria>) => {
        try {
            dispatch(showLoading());

            const newData = Array.from(data.values());

            const itemPolicy = dataPolicy.items?.find(el => el.id === newData[0]?.policyId);

            const listpolicyCriterias = itemPolicy?.policyCriterias.filter(el => el.type !== newData[0]?.type) || [];

            if (itemPolicy) {
                const targetIds = itemPolicy?.policyTargets?.map(el => el.targetId);

                await BookingPolicyService.update({
                    serviceCode: itemPolicy?.serviceCode || Constants.SERVICE_CODE,
                    organizationId: itemPolicy?.organizationId || (userProfile?.organizationId || "0"),

                    id: itemPolicy?.id,
                    code: itemPolicy?.code,
                    name: itemPolicy?.name,
                    default: itemPolicy?.default,
                    description: itemPolicy?.description,
                    criteria: converDataCriterias([...newData, ...listpolicyCriterias], true),
                    target: {
                        policyId: itemPolicy?.policyTargets?.[0]?.policyId,
                        targetType: itemPolicy?.policyTargets?.[0]?.targetType,
                        targetIds: targetIds,
                    },
                });
            }

            dispatch(showSnackbar({ msg: t("setting:policy.update_success"), type: "success" }));
        } catch (error) {
            Helpers.handleError(error);
        } finally {
            dispatch(hideLoading());
        }
    };

    const getValuePolicyCriteriaByCode = ({ data, code }: {
        data: Map<string, IPolicyCriteria>,
        code: PolicyCriteriaCode,
    }) => {
        return data?.get(code)?.policyCriteriaDetail?.[0];
    };

    const getDataAirpostBySelectCodes = async ({ selectCodes, isDefault, countryCode }:
        {
            isDefault?: boolean,
            countryCode?: string,
            selectCodes?: string[],
        }) => {
        try {
            const items: ICodename[] = [{ code: VALUE_ALL, name: all_airports }];

            const result = await TransportHubService.getPaged({
                type: 1,
                countryCode: countryCode,
                selectedCodes: selectCodes,
                pageNumber: 1,
                pageSize: isDefault ? 20 : [...selectCodes || []].length,
            });

            [...result?.items || []]?.forEach((item: any) => {
                items.push({
                    code: item.code,
                    name: item.name,
                    detail: item,
                });
            });

            if (isDefault) {
                if (Helpers.isNullOrEmpty(countryCode)) {
                    setListInternationalFlightDefaule(items);
                } else {
                    setListDomesticFlightDefaule(items);
                }
            } else {
                setListFlightSelected(items);
            }
        } catch (error) { }
    };

    const getDataAddressBySelectCodes = async ({
        type,
        isDefault,
        selectCodes,
        countryCode,
    }:
        {
            type?: number,
            isDefault?: boolean,
            countryCode?: string,
            selectCodes?: string[],
        }) => {
        try {
            const items: ICodename[] = [{ code: VALUE_ALL, name: all_destinations }];

            const result = await AdministrativeDivisionService.getPaged({
                type: ([...selectCodes || []].length > 0) ? undefined : type,
                countryCode: countryCode,
                selectedCodes: selectCodes,
                pageNumber: 1,
                pageSize: isDefault ? 20 : [...selectCodes || []].length,
            });

            [...result?.items || []].forEach((item: any) => {
                items.push({
                    code: item.code,
                    name: item.name,
                    detail: item,
                });
            });

            if (isDefault) {
                if (Helpers.isNullOrEmpty(countryCode)) {
                    setListInternationalStayDefaule(items);
                } else {
                    setListDomesticStayDefaule(items);
                }
            } else {
                setListStaySelected(items);
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

    return {
        dataPolicy, setDataPolicy,

        getPagedPolicy,
        handleCreatePolicy,
        handleUpdatePolicy,
        handleDeletePolicy,
        handleCreateCopyPolicy,
        handleUpdateDataDetailPolicy,

        getPolicyCriteriaByType,
        getValuePolicyCriteriaByCode,
        getDataAirpostBySelectCodes,
        getDataAddressBySelectCodes,
        getDataCodeNameAirline,

        listAriLines,
        listCabinClass,
        listBookingType,

        listStaySelected,
        listDomesticStayDefaule,
        listInternationalStayDefaule,

        listFlightSelected,
        listDomesticFlightDefaule,
        listInternationalFlightDefaule,
    };
};

export default useDataPolicy;
