import { useEffect, useState } from "react";
import { Divider, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Box, Button, FormField, Modal, Typography, useCommonComponentContext } from "@maysoft/common-component-react";

import Constants from "@src/constants";
import Helpers from "@src/commons/helpers";
import CardItemCriteriaDetail_V2Multiple, { IItemCriteriaDetail_V2Multiple } from "./cardItemCriteriaDetail_V2Multiple";

import { ICodename } from "@src/commons/interfaces";
import { BookingTypePolicy, CompareType, PolicyCriteriaCode } from "@src/commons/enum";
import useDataPolicy, { IPolicyCriteria, IPolicyCriteriaDetail, VALUE_ALL } from "@src/hooks/useDataPolicy.hook";



const sequenceDomestic = "2";
const sequenceInternational = "1";

const ModalPolicyFlight_V2Multiple = ({
    open,
    data,
    setOpen,
    onSubmit,
    setDataModalPolicyFlight,
    listAriLines,
    listFlightSelected,
    listDomesticFlightDefaule,
    listInternationalFlightDefaule,

    hidenFlightTime,
    hidenBookingTime,
}: {
    open: boolean,
    data: Map<string, IPolicyCriteria>,

    listAriLines: ICodename[],
    listFlightSelected: ICodename[],
    listDomesticFlightDefaule?: ICodename[],
    listInternationalFlightDefaule?: ICodename[],

    hidenFlightTime?: boolean,
    hidenBookingTime?: boolean,

    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    onSubmit: (data: Map<string, IPolicyCriteria>) => void,
    setDataModalPolicyFlight: React.Dispatch<React.SetStateAction<Map<string, IPolicyCriteria>>>,
}) => {
    const {
        t,
        i18n: { language },
    } = useTranslation(["common", "setting"]);

    const { onError } = useCommonComponentContext();

    const {
        listCabinClass,
        listBookingType,
        getValuePolicyCriteriaByCode,
    } = useDataPolicy();

    const [errorDomestic, setErrorDomestic] = useState<{ [key in keyof IItemCriteriaDetail_V2Multiple]?: string }[]>([]);
    const [errorInternational, setErrorInternational] = useState<{ [key in keyof IItemCriteriaDetail_V2Multiple]?: string }[]>([]);
    const [dataCriteriaDetail_Domestic, setDataCriteriaDetail_Domestic] = useState<IItemCriteriaDetail_V2Multiple[]>([]);
    const [dataCriteriaDetail_International, setDataCriteriaDetail_International] = useState<IItemCriteriaDetail_V2Multiple[]>([]);

    useEffect(() => {
        const err_Domestic: any[] = [];
        const err_International: any[] = [];
        const listDetail_Domestic: IItemCriteriaDetail_V2Multiple[] = [];
        const listDetail_International: IItemCriteriaDetail_V2Multiple[] = [];

        const objectTempInternational = [...data?.get(PolicyCriteriaCode.International)?.policyCriteriaDetail || []];
        for (const item of objectTempInternational) {

            const listCabinClass = [...data?.get(PolicyCriteriaCode.CabinClass)?.policyCriteriaDetail || []];
            const listFlightClass = [...data?.get(PolicyCriteriaCode.FlightClass)?.policyCriteriaDetail || []];

            const valueCarrier = listFlightClass?.filter(el => (
                // (el.sequence === item.sequence) ||
                (`${el.sequence}`.charAt(0) === sequenceInternational) &&
                (`${el.sequence}`.substring(1, `${el.sequence}`.length) === `${item.sequence}`)
            ))?.map(e => (Helpers.isNullOrEmpty(e.carrier) ? VALUE_ALL : e.carrier));

            const valueCabinClass = listCabinClass?.filter(el => (
                // (el.sequence === item.sequence) ||
                !Helpers.isNullOrEmpty(el.cabinClass) &&
                (`${el.sequence}`.charAt(0) === sequenceInternational) &&
                (`${el.sequence}`.substring(1, `${el.sequence}`.length) === `${item.sequence}`)
            ))?.map(e => (Helpers.isNullOrEmpty(e.cabinClass) ? VALUE_ALL : e.cabinClass));

            err_International.push({});
            listDetail_International.push({
                sequence: item.sequence,

                currency: item.currency,
                bookingType: item.bookingType,
                bookingBudget: item.bookingBudget,
                to: item.to ? item.to : VALUE_ALL,
                from: item.from ? item.from : VALUE_ALL,

                carrier: valueCarrier,
                cabinClass: valueCabinClass,
            });
        };

        const objectTempDomestic = [...data?.get(PolicyCriteriaCode.Domestic)?.policyCriteriaDetail || []];

        for (const item of objectTempDomestic) {

            const listCabinClass = [...data?.get(PolicyCriteriaCode.CabinClass)?.policyCriteriaDetail || []];
            const listFlightClass = [...data?.get(PolicyCriteriaCode.FlightClass)?.policyCriteriaDetail || []];

            const valueCarrier = listFlightClass?.filter(el => (
                // (el.sequence === item.sequence) ||
                (`${el.sequence}`.charAt(0) === sequenceDomestic) &&
                (`${el.sequence}`.substring(1, `${el.sequence}`.length) === `${item.sequence}`)
            ))?.map(e => (Helpers.isNullOrEmpty(e.carrier) ? VALUE_ALL : e.carrier));

            const valueCabinClass = listCabinClass?.filter(el => (
                // (el.sequence === item.sequence) ||
                !Helpers.isNullOrEmpty(el.cabinClass) &&
                (`${el.sequence}`.charAt(0) === sequenceDomestic) &&
                (`${el.sequence}`.substring(1, `${el.sequence}`.length) === `${item.sequence}`)
            ))?.map(e => (Helpers.isNullOrEmpty(e.cabinClass) ? VALUE_ALL : e.cabinClass));

            err_Domestic.push({});
            listDetail_Domestic.push({
                sequence: item.sequence,

                currency: item.currency,
                bookingType: item.bookingType,
                bookingBudget: item.bookingBudget,
                to: item.to ? item.to : VALUE_ALL,
                from: item.from ? item.from : VALUE_ALL,

                carrier: valueCarrier,
                cabinClass: valueCabinClass,
            });
        };

        setErrorDomestic(err_Domestic);
        setErrorInternational(err_International);
        setDataCriteriaDetail_Domestic(listDetail_Domestic);
        setDataCriteriaDetail_International(listDetail_International)
    }, [data]);

    const handleClose = () => {
        setOpen(false);

        setErrorDomestic([]);
        setErrorInternational([]);
        setDataCriteriaDetail_Domestic([]);
        setDataCriteriaDetail_International([]);

        setDataModalPolicyFlight(new Map());
    };

    const handleSubmit = () => {
        const listDetail_Domestic = [...dataCriteriaDetail_Domestic || []];
        const listDetail_International = [...dataCriteriaDetail_International || []];

        let newListCriteriaDetail_Domestic: IPolicyCriteriaDetail[] = [];
        let newListCriteriaDetail_CabinClass: IPolicyCriteriaDetail[] = [];
        let newListCriteriaDetail_FlightClass: IPolicyCriteriaDetail[] = [];
        let newListCriteriaDetail_International: IPolicyCriteriaDetail[] = [];

        const itemTemp = {
            currency: undefined,
            id: undefined,
            to: undefined,
            from: undefined,
            carrier: undefined,
            sequence: undefined,
            cabinClass: undefined,
            exception: undefined,
            bookingType: undefined,
            bookingClass: undefined,
            bookingBudget: undefined,
            compareValue: undefined,
            compareNumber: undefined,
            compareType: CompareType.Equal,
        };

        listDetail_Domestic.forEach((item, index) => {
            newListCriteriaDetail_Domestic.push({
                ...itemTemp,
                sequence: index,
                to: item.to,
                from: item.from,
                bookingType: item.bookingType,
                bookingBudget: item.bookingBudget,
                currency: Constants.CURRENCY_DEFAULT,
            });

            for (const el of [...item.carrier || []]) {
                newListCriteriaDetail_FlightClass.push({
                    ...itemTemp,
                    carrier: el,
                    sequence: Number(`${sequenceDomestic}${index}`),
                });
            }

            for (const el of [...item.cabinClass || []]) {
                newListCriteriaDetail_CabinClass.push({
                    ...itemTemp,
                    cabinClass: el,
                    sequence: Number(`${sequenceDomestic}${index}`),
                });
            }
        });

        listDetail_International.forEach((item, index) => {
            newListCriteriaDetail_International.push({
                ...itemTemp,
                sequence: index,
                to: item.to,
                from: item.from,
                bookingType: item.bookingType,
                bookingBudget: item.bookingBudget,
                currency: Constants.CURRENCY_DEFAULT,
            });

            for (const el of [...item.cabinClass || []]) {
                newListCriteriaDetail_CabinClass.push({
                    ...itemTemp,
                    cabinClass: el,
                    sequence: Number(`${sequenceInternational}${index}`),
                });
            }

            for (const el of [...item.carrier || []]) {
                newListCriteriaDetail_FlightClass.push({
                    ...itemTemp,
                    carrier: el,
                    sequence: Number(`${sequenceInternational}${index}`),
                });
            }
        });

        let newDataCriteriaDetail: Map<string, IPolicyCriteria> = new Map();

        const itemCriteriaDetail_International = data?.get(PolicyCriteriaCode.International);
        itemCriteriaDetail_International &&
            newDataCriteriaDetail.set(
                PolicyCriteriaCode.International,
                {
                    ...itemCriteriaDetail_International,
                    policyCriteriaDetail: newListCriteriaDetail_International,
                }
            );

        const itemCriteriaDetail_Domestic = data?.get(PolicyCriteriaCode.Domestic);
        itemCriteriaDetail_Domestic &&
            newDataCriteriaDetail.set(
                PolicyCriteriaCode.Domestic,
                {
                    ...itemCriteriaDetail_Domestic,
                    policyCriteriaDetail: newListCriteriaDetail_Domestic,
                }
            );

        const itemCriteriaDetail_CabinClass = data?.get(PolicyCriteriaCode.CabinClass);
        itemCriteriaDetail_CabinClass &&
            newDataCriteriaDetail.set(
                PolicyCriteriaCode.CabinClass,
                {
                    ...itemCriteriaDetail_CabinClass,
                    policyCriteriaDetail: newListCriteriaDetail_CabinClass,
                }
            );

        const itemCriteriaDetail_FlightClass = data?.get(PolicyCriteriaCode.FlightClass);
        itemCriteriaDetail_FlightClass &&
            newDataCriteriaDetail.set(
                PolicyCriteriaCode.FlightClass,
                {
                    ...itemCriteriaDetail_FlightClass,
                    policyCriteriaDetail: newListCriteriaDetail_FlightClass,
                }
            );

        if (!hidenFlightTime) {
            const itemCriteriaDetail_FlightTime = data?.get(PolicyCriteriaCode.FlightTime);
            itemCriteriaDetail_FlightTime &&
                newDataCriteriaDetail.set(
                    PolicyCriteriaCode.FlightTime,
                    itemCriteriaDetail_FlightTime
                );
        }

        if (!hidenBookingTime) {
            const itemCriteriaDetail_BookingTime = data?.get(PolicyCriteriaCode.BookingTime);
            itemCriteriaDetail_BookingTime &&
                newDataCriteriaDetail.set(
                    PolicyCriteriaCode.BookingTime,
                    itemCriteriaDetail_BookingTime
                );
        }

        setOpen(false);

        setErrorDomestic([]);
        setErrorInternational([]);
        setDataCriteriaDetail_Domestic([]);
        setDataCriteriaDetail_International([]);

        setDataModalPolicyFlight(new Map());

        onSubmit(newDataCriteriaDetail);
    };

    const onChangeValueByCode = (props: {
        key: string,
        newValue: any,
        code: PolicyCriteriaCode,
    }) => {
        setDataModalPolicyFlight(prev => {
            let newData = new Map(prev);

            const item: any = {
                ...getValuePolicyCriteriaByCode({ data: newData, code: props.code }),
                [props.key]: props.newValue,
            };

            newData.set(props.code,
                {
                    ...newData.get(props.code),
                    policyCriteriaDetail: [item],
                } as any
            );
            return newData;
        });
    };

    //#region Criteria Detail

    const handleValidateCriteriaDetail = (isInternational: boolean) => {
        let checked = true;
        let newErr: any[] = [];
        let newDataValidate: any[] = [];

        if (isInternational) {
            newErr = [...errorInternational || []];
            newDataValidate = [...dataCriteriaDetail_International || []];
        } else {
            newErr = [...errorDomestic || []];
            newDataValidate = [...dataCriteriaDetail_Domestic || []];
        }

        newDataValidate.map((item, index) => {
            if (Helpers.isNullOrEmpty(item.bookingType)) {
                checked = false;
                newErr[index] = {
                    ...newErr[index],
                    bookingType: "Vui lòng chọn loại chuyến bay",
                };
            }

            if (Helpers.isNullOrEmpty(item.from)) {
                checked = false;
                newErr[index] = {
                    ...newErr[index],
                    from: "Vui lòng chọn sân bay đi",
                };
            }

            if (Helpers.isNullOrEmpty(item.to)) {
                checked = false;
                newErr[index] = {
                    ...newErr[index],
                    to: "Vui lòng chọn sân bay đến",
                };
            }

            if (Helpers.isNullOrEmpty(item.bookingBudget)) {
                checked = false;
                newErr[index] = {
                    ...newErr[index],
                    bookingBudget: "Vui lòng nhập ngân sách chuyến bay",
                };
            }
        });

        if (!checked) {
            if (isInternational) {
                setErrorInternational(newErr);
            } else {
                setErrorDomestic(newErr);
            }
            onError && onError("Vui lòng điền đầy đủ thông tin");
        }

        return checked;
    };

    const onChangeValueCriteriaDetail = (props: {
        key: string,
        index: number,
        newValue: any,
        isInternational: boolean,
    }) => {
        let newErr: any[] = [];
        let newDataDetail: any[] = [];

        if (props.isInternational) {
            newErr = [...errorInternational || []];
            newDataDetail = [...dataCriteriaDetail_International || []];
        } else {
            newErr = [...errorDomestic || []];
            newDataDetail = [...dataCriteriaDetail_Domestic || []];
        }

        newDataDetail[props.index] = {
            ...newDataDetail[props.index],
            [props.key]: props.newValue,
        };

        newErr[props.index] = {
            ...newErr[props.index],
            [props.key]: undefined,
        };

        // if (props.key === "bookingType") {
        //     newDataDetail[props.index] = {
        //         ...newDataDetail[props.index],
        //         ["to"]: VALUE_ALL,
        //         ["from"]: VALUE_ALL,
        //     };

        //     newErr[props.index] = {
        //         ...newErr[props.index],
        //         ["to"]: undefined,
        //         ["from"]: undefined,
        //     };
        // }

        if (props.isInternational) {
            setErrorInternational(newErr);
            setDataCriteriaDetail_International(newDataDetail);
        } else {
            setErrorDomestic(newErr);
            setDataCriteriaDetail_Domestic(newDataDetail);
        }

    };

    const onAddItemCriteriaDetail = (isInternational: boolean) => {
        if (handleValidateCriteriaDetail(isInternational)) {
            if (isInternational) {
                let newErr = [...errorInternational || []];

                let newDataDetail = [...dataCriteriaDetail_International || []];

                const sequence = newDataDetail[newDataDetail?.length - 1]?.sequence;

                newErr.push({
                    to: undefined,
                    from: undefined,
                    currency: undefined,
                    bookingType: undefined,
                    bookingBudget: undefined,
                    carrier: undefined,
                    cabinClass: undefined,
                });

                newDataDetail.push({
                    sequence: Helpers.isNullOrEmpty(sequence) ? 0 : (sequence + 1),

                    to: VALUE_ALL,
                    from: VALUE_ALL,
                    bookingBudget: 0,
                    currency: Constants.CURRENCY_DEFAULT,
                    bookingType: BookingTypePolicy.OneWay,

                    carrier: [VALUE_ALL],
                    cabinClass: [VALUE_ALL],
                });

                setErrorInternational(newErr);
                setDataCriteriaDetail_International(newDataDetail);
            } else {
                let newErr = [...errorDomestic || []];

                let newDataDetail = [...dataCriteriaDetail_Domestic || []];

                const sequence = newDataDetail[newDataDetail?.length - 1]?.sequence;

                newErr.push({
                    to: undefined,
                    from: undefined,
                    currency: undefined,
                    bookingType: undefined,
                    bookingBudget: undefined,
                    carrier: undefined,
                    cabinClass: undefined,
                });

                newDataDetail.push({
                    sequence: Helpers.isNullOrEmpty(sequence) ? 0 : (sequence + 1),

                    to: VALUE_ALL,
                    from: VALUE_ALL,
                    bookingBudget: 0,
                    currency: Constants.CURRENCY_DEFAULT,
                    bookingType: BookingTypePolicy.OneWay,

                    carrier: [VALUE_ALL],
                    cabinClass: [VALUE_ALL],
                });

                setErrorDomestic(newErr);
                setDataCriteriaDetail_Domestic(newDataDetail)
            }
        }
    };

    const onDeleteItemCriteriaDetail = ({ isInternational, index }: {
        index: number,
        isInternational: boolean,
    }) => {
        if (isInternational) {
            setDataCriteriaDetail_International(prev => {
                let newDataDetail = [...prev || []];

                newDataDetail.splice(index, 1);

                return newDataDetail;
            });

            setErrorInternational(prev => {
                let newData = [...prev || []];

                newData.splice(index, 1);

                return newData;
            });
        } else {
            setDataCriteriaDetail_Domestic(prev => {
                let newDataDetail = [...prev || []];

                newDataDetail.splice(index, 1);

                return newDataDetail;
            });

            setErrorDomestic(prev => {
                let newData = [...prev || []];

                newData.splice(index, 1);

                return newData;
            });
        }
    };

    //#endregion Criteria Detail

    return (
        <Modal
            fullWidth
            fullScreen
            hasActionButton

            onClose={() => { handleClose(); }}
            onAction={() => { handleSubmit(); }}

            visible={open}
            title={t("setting:policy.edit_flight_policy")}
        >
            <Grid container spacing={3} p={2}>
                <Grid item xs={12}>
                    <Box sx={{ display: "grid" }} >
                        <Typography variant="button" fontWeight="bold">{t("setting:policy.budget_for_trip")}</Typography>
                        <Typography variant="button" sx={{ color: "#8AB9FF" }}>{t("setting:policy.note_budget_for_trip")}</Typography>
                    </Box>

                    {/* Chuyến bay quốc tế */}
                    <Box marginTop={1}>
                        <Box sx={{
                            gap: 2,
                            marginBottom: 1,
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }} >
                            <Typography variant="button">
                                {t("setting:policy.flight_international")}
                            </Typography>
                            <Button onClick={() => {
                                onAddItemCriteriaDetail(true);
                            }} >
                                {t("setting:policy.add_new_flight")}
                            </Button>
                        </Box>
                        {
                            dataCriteriaDetail_International.map((item, index) => {
                                return (
                                    <CardItemCriteriaDetail_V2Multiple
                                        key={"International" + index}

                                        hidenActionDelete={index === 0}

                                        listAriLines={listAriLines}
                                        listCabinClass={listCabinClass}
                                        listBookingType={listBookingType}
                                        listFlightSelected={listFlightSelected}
                                        listFlightDefaule={listInternationalFlightDefaule}

                                        dataItem={item}
                                        errorItem={errorInternational?.[index]}

                                        onChangeValue={(newProp) => {
                                            onChangeValueCriteriaDetail({
                                                index: index,
                                                key: newProp.key,
                                                isInternational: true,
                                                newValue: newProp.value,
                                            });
                                        }}
                                        onDelete={() => {
                                            onDeleteItemCriteriaDetail({
                                                index: index,
                                                isInternational: true,
                                            });
                                        }}
                                    />
                                )
                            })
                        }
                    </Box>

                    {/* Chuyến bay nội địa */}
                    <Box marginTop={2} marginBottom={3}>
                        <Box sx={{
                            gap: 1,
                            marginBottom: 1,
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }} >
                            <Typography variant="button">
                                {t("setting:policy.flight_domestic")}
                            </Typography>
                            <Button onClick={() => {
                                onAddItemCriteriaDetail(false);
                            }} >
                                {t("setting:policy.add_new_flight")}
                            </Button>
                        </Box>
                        {
                            dataCriteriaDetail_Domestic.map((item, index) => (
                                <CardItemCriteriaDetail_V2Multiple
                                    key={"Domestic" + index}

                                    countryCode="VN"
                                    hidenActionDelete={index === 0}

                                    dataItem={item}
                                    errorItem={errorDomestic?.[index]}

                                    listAriLines={listAriLines}
                                    listCabinClass={listCabinClass}
                                    listBookingType={listBookingType}
                                    listFlightSelected={listFlightSelected}
                                    listFlightDefaule={listDomesticFlightDefaule}

                                    onChangeValue={(newProp) => {
                                        onChangeValueCriteriaDetail({
                                            index: index,
                                            key: newProp.key,
                                            isInternational: false,
                                            newValue: newProp.value,
                                        });
                                    }}
                                    onDelete={() => {
                                        onDeleteItemCriteriaDetail({
                                            index: index,
                                            isInternational: false,
                                        });
                                    }}
                                />
                            ))
                        }
                    </Box>
                    <Divider />
                </Grid>

                {/* Thời hạn đặt chỗ */}
                {!hidenBookingTime &&
                    <Grid item xs={12}>
                        <Box sx={{ display: "grid" }} >
                            <Typography variant="button" fontWeight="bold">{t("setting:policy.booking_time")}</Typography>
                            <Typography variant="button" sx={{ color: "#8AB9FF" }}>{t("setting:policy.note_booking_time")}</Typography>
                        </Box>
                        <Box sx={{
                            gap: 2,
                            marginTop: 1,
                            marginBottom: 3,
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                        }} >
                            <Typography variant="button">
                                {t("setting:policy.should_book_flight_in_advance")}
                            </Typography>
                            <Box sx={{ width: "250px" }}>
                                <FormField
                                    maxLength={100}
                                    type={"number"}
                                    variant={"outlined"}
                                    placeholder={t("setting:policy.enter_day")}
                                    value={getValuePolicyCriteriaByCode({ data: data, code: PolicyCriteriaCode.BookingTime })?.compareNumber}
                                    unit={t(`setting:policy.${getValuePolicyCriteriaByCode({ data: data, code: PolicyCriteriaCode.BookingTime })?.currency || "day"}`)}
                                    onChangeValue={(value) => {
                                        const newValue = value ? ((Number(value) > 0) ? Number(value) : 0) : undefined;
                                        onChangeValueByCode({
                                            code: PolicyCriteriaCode.BookingTime,
                                            key: "compareNumber",
                                            newValue: newValue,
                                        });
                                    }}
                                />
                            </Box>
                        </Box>
                        {!hidenFlightTime && <Divider />}
                    </Grid>
                }

                {/* Thời gian bay */}
                {!hidenFlightTime &&
                    <Grid item xs={12} md={6} lg={3}>
                        <Typography variant="button" fontWeight="bold">
                            {t("setting:policy.flight_time")}
                        </Typography>
                        <Box sx={{ gap: 2, display: "flex", alignItems: "center", flexWrap: "wrap" }} >
                            <FormField
                                maxLength={100}
                                type={"number"}
                                variant={"outlined"}
                                placeholder={t("setting:policy.enter_hourt")}
                                value={getValuePolicyCriteriaByCode({ data: data, code: PolicyCriteriaCode.FlightTime })?.compareNumber}
                                unit={t(`setting:policy.${getValuePolicyCriteriaByCode({ data: data, code: PolicyCriteriaCode.FlightTime })?.currency || "hourt"}`)}
                                onChangeValue={(value) => {
                                    const newValue = value ? ((Number(value) > 0) ? Number(value) : 0) : undefined;
                                    onChangeValueByCode({
                                        code: PolicyCriteriaCode.FlightTime,
                                        key: "compareNumber",
                                        newValue: newValue,
                                    });
                                }}
                            />
                        </Box>
                    </Grid>
                }
            </Grid>
        </Modal>
    );
};

export default ModalPolicyFlight_V2Multiple;