import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AddCircleOutline } from "@mui/icons-material";
import { Divider, Grid, IconButton, Tooltip } from "@mui/material";
import { Autocomplete, Box, FormField, Modal, Typography, useCommonComponentContext } from "@maysoft/common-component-react";

import Constants from "@src/constants";
import Helpers from "@src/commons/helpers";
import CardItemCriteriaDetail from "./cardItemCriteriaDetail";

import { ICodename } from "@src/commons/interfaces";
import useDataPolicy, { IPolicyCriteria, VALUE_ALL } from "@src/hooks/useDataPolicy.hook";
import { BookingTypePolicy, CompareType, PolicyCriteriaCode } from "@src/commons/enum";



const ModalPolicyFlight = ({
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

    const [errorDomestic, setErrorDomestic] = useState<{ [key: string]: string | undefined | null }[]>([]);
    const [errorInternational, setErrorInternational] = useState<{ [key: string]: string | undefined | null }[]>([]);

    const {
        listCabinClass,
        listBookingType,
        getValuePolicyCriteriaByCode,
    } = useDataPolicy();

    const handleClose = () => {
        setOpen(false);

        setErrorDomestic([]);
        setErrorInternational([]);
        setDataModalPolicyFlight(new Map());
    };

    const handleSubmit = () => {
        setOpen(false);

        setErrorDomestic([]);
        setErrorInternational([]);
        setDataModalPolicyFlight(new Map());

        onSubmit(data);
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
    const handleValidateCriteriaDetail = (code: PolicyCriteriaCode) => {
        let checked = true;
        let newErr: any[] = [];

        [...data?.get(code)?.policyCriteriaDetail || []].map((item, index) => {
            if (Helpers.isNullOrEmpty(item.bookingType)) {
                checked = false;
                newErr[index] = {
                    ...newErr[index],
                    bookingType: "Trường dữ liệu là bắt buộc",
                };
            }

            if (Helpers.isNullOrEmpty(item.from)) {
                checked = false;
                newErr[index] = {
                    ...newErr[index],
                    from: "Trường dữ liệu là bắt buộc",
                };
            }

            if (Helpers.isNullOrEmpty(item.to)) {
                checked = false;
                newErr[index] = {
                    ...newErr[index],
                    to: "Trường dữ liệu là bắt buộc",
                };
            }

            if (Helpers.isNullOrEmpty(item.bookingBudget)) {
                checked = false;
                newErr[index] = {
                    ...newErr[index],
                    bookingBudget: "Trường dữ liệu là bắt buộc",
                };
            }
        });

        if (!checked) {
            if (code === PolicyCriteriaCode.Domestic) {
                setErrorDomestic(newErr);
            }
            if (code === PolicyCriteriaCode.International) {
                setErrorInternational(newErr);
            }

            onError && onError("Vui lòng điền đầy đủ thông tin");
        }

        return checked;
    };

    const onChangeValueCriteriaDetail = (props: {
        key: string,
        newValue: any,
        index: number,
        code: PolicyCriteriaCode,
    }) => {
        setDataModalPolicyFlight(prev => {
            let newDataMap = new Map(prev);

            let newDataTemp = [...newDataMap?.get(props.code)?.policyCriteriaDetail || []];

            newDataTemp[props.index] = {
                ...newDataTemp[props.index],
                [props.key]: props.newValue,
            };

            if (props.key === "bookingType") {
                newDataTemp[props.index] = {
                    ...newDataTemp[props.index],
                    ["to"]: VALUE_ALL,
                    ["from"]: VALUE_ALL,
                };
            }

            newDataMap.set(props.code,
                {
                    ...newDataMap.get(props.code),
                    policyCriteriaDetail: newDataTemp,
                } as any
            );
            return newDataMap;
        });

        if (props.code === PolicyCriteriaCode.Domestic) {
            setErrorDomestic(prev => {
                let newData = [...prev || []];

                newData[props.index] = {
                    ...newData[props.index],
                    [props.key]: undefined,
                }

                if (props.key === "bookingType") {
                    newData[props.index] = {
                        ...newData[props.index],
                        ["to"]: undefined,
                        ["from"]: undefined,
                    };
                }

                return newData;
            });
        }
        if (props.code === PolicyCriteriaCode.International) {
            setErrorInternational(prev => {
                let newData = [...prev || []];

                newData[props.index] = {
                    ...newData[props.index],
                    [props.key]: undefined,
                }

                if (props.key === "bookingType") {
                    newData[props.index] = {
                        ...newData[props.index],
                        ["to"]: undefined,
                        ["from"]: undefined,
                    };
                }

                return newData;
            });
        }

    };

    const onAddItemCriteriaDetail = (code: PolicyCriteriaCode) => {
        if (handleValidateCriteriaDetail(code)) {
            setDataModalPolicyFlight(prev => {
                let newDataMap = new Map(prev);

                const dataGetCode = newDataMap?.get(code);

                let newDataTemp = [...dataGetCode?.policyCriteriaDetail || []];
                const sequence = newDataTemp.length;

                newDataTemp.push({
                    bookingBudget: 0,
                    bookingClass: undefined,
                    currency: Constants.CURRENCY_DEFAULT,
                    compareType: CompareType.Equal,
                    compareNumber: 0,
                    exception: undefined,
                    compareValue: undefined,
                    from: VALUE_ALL,
                    to: VALUE_ALL,
                    bookingType: BookingTypePolicy.OneWay,
                    criteriaId: dataGetCode?.id || "",
                    policyId: dataGetCode?.policyId || "",
                    carrier: VALUE_ALL,
                    cabinClass: VALUE_ALL,
                    sequence: sequence,
                });

                newDataMap.set(code,
                    {
                        ...newDataMap.get(code),
                        policyCriteriaDetail: newDataTemp,
                    } as any
                );

                return newDataMap;
            });

            if (code === PolicyCriteriaCode.Domestic) {
                setErrorDomestic(prev => {
                    let newData = [...prev || []];

                    newData.push({
                        to: undefined,
                        from: undefined,
                        bookingType: undefined,
                        bookingBudget: undefined,
                    });

                    return newData;
                });
            }
            if (code === PolicyCriteriaCode.International) {
                setErrorInternational(prev => {
                    let newData = [...prev || []];

                    newData.push({
                        to: undefined,
                        from: undefined,
                        bookingType: undefined,
                        bookingBudget: undefined,
                    });

                    return newData;
                });
            }

        }
    };

    const onDeleteItemCriteriaDetail = ({ code, index }: { code: PolicyCriteriaCode, index: number }) => {
        setDataModalPolicyFlight(prev => {
            let newDataMap = new Map(prev);

            let newDataTemp = [...newDataMap?.get(code)?.policyCriteriaDetail || []];

            newDataTemp.splice(index, 1);

            newDataMap.set(code,
                {
                    ...newDataMap.get(code),
                    policyCriteriaDetail: newDataTemp,
                } as any
            );

            return newDataMap;
        });

        if (code === PolicyCriteriaCode.Domestic) {
            setErrorDomestic(prev => {
                let newData = [...prev || []];

                newData.splice(index, 1);

                return newData;
            });
        }
        if (code === PolicyCriteriaCode.International) {
            setErrorInternational(prev => {
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
            maxWidth="lg"
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

                    {/* Quốc tế */}
                    <Box marginTop={1}>
                        <Box sx={{
                            gap: 2,
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                        }} >
                            <Typography variant="button">{t("setting:policy.flight_international")}</Typography>
                            <Tooltip title={t("setting:policy.add_new_flight")}>
                                <IconButton color="info" onClick={() => {
                                    onAddItemCriteriaDetail(PolicyCriteriaCode.International);
                                }} >
                                    <AddCircleOutline />
                                </IconButton>
                            </Tooltip>
                        </Box>
                        {
                            [...data?.get(PolicyCriteriaCode.International)?.policyCriteriaDetail || []].map((item, index) => (
                                <CardItemCriteriaDetail
                                    key={"International" + index}

                                    hidenActionDelete={index === 0}
                                    listBookingType={listBookingType}
                                    listFlightSelected={listFlightSelected}
                                    listFlightDefaule={listInternationalFlightDefaule}

                                    item={item}
                                    errorPolicyCriteriaDetail={errorInternational?.[index]}

                                    onChangeValue={(newProp) => {
                                        onChangeValueCriteriaDetail({
                                            index: index,
                                            key: newProp.key,
                                            newValue: newProp.value,
                                            code: PolicyCriteriaCode.International,
                                        });
                                    }}
                                    onDelete={() => {
                                        onDeleteItemCriteriaDetail({
                                            index,
                                            code: PolicyCriteriaCode.International,
                                        });
                                    }}
                                />
                            ))
                        }
                    </Box>

                    {/* Nội địa */}
                    <Box marginTop={2} marginBottom={3}>
                        <Box sx={{ gap: 2, display: "flex", alignItems: "center", flexWrap: "wrap" }} >
                            <Typography variant="button">{t("setting:policy.flight_domestic")}</Typography>
                            <Tooltip title={t("setting:policy.add_new_flight")}>
                                <IconButton color="info" onClick={() => {
                                    onAddItemCriteriaDetail(PolicyCriteriaCode.Domestic);
                                }} >
                                    <AddCircleOutline />
                                </IconButton>
                            </Tooltip>
                        </Box>
                        {
                            [...data?.get(PolicyCriteriaCode.Domestic)?.policyCriteriaDetail || []].map((item, index) => (
                                <CardItemCriteriaDetail
                                    key={"Domestic" + index}

                                    countryCode="VN"
                                    hidenActionDelete={index === 0}
                                    listBookingType={listBookingType}
                                    listFlightSelected={listFlightSelected}
                                    listFlightDefaule={listDomesticFlightDefaule}

                                    item={item}
                                    errorPolicyCriteriaDetail={errorDomestic?.[index]}

                                    onChangeValue={(newProp) => {
                                        onChangeValueCriteriaDetail({
                                            index: index,
                                            key: newProp.key,
                                            newValue: newProp.value,
                                            code: PolicyCriteriaCode.Domestic,
                                        });
                                    }}
                                    onDelete={() => {
                                        onDeleteItemCriteriaDetail({
                                            index,
                                            code: PolicyCriteriaCode.Domestic,
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
                                    value={getValuePolicyCriteriaByCode({ code: PolicyCriteriaCode.BookingTime, data: data })?.compareNumber}
                                    unit={t(`setting:policy.${getValuePolicyCriteriaByCode({ code: PolicyCriteriaCode.BookingTime, data: data })?.currency || "day"}`)}
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
                        <Divider />
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
                                value={getValuePolicyCriteriaByCode({ code: PolicyCriteriaCode.FlightTime, data: data })?.compareNumber}
                                unit={t(`setting:policy.${getValuePolicyCriteriaByCode({ code: PolicyCriteriaCode.FlightTime, data: data })?.currency || "hourt"}`)}
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

                {/* Hãng bay */}
                <Grid item xs={12}>
                    <Autocomplete
                        variant={"outlined"}
                        data={listAriLines || []}
                        label={t("setting:policy.flight_class")}
                        placeholder={t("setting:policy.flight_class")}
                        defaultValue={getValuePolicyCriteriaByCode({ code: PolicyCriteriaCode.FlightClass, data: data })?.carrier}
                        onChange={(value) => {
                            onChangeValueByCode({
                                code: PolicyCriteriaCode.FlightClass,
                                key: "carrier",
                                newValue: value || VALUE_ALL,
                            });
                        }}
                    />
                </Grid>

                {/* Hạng khoang */}
                <Grid item xs={12}>
                    <Autocomplete
                        variant={"outlined"}
                        data={listCabinClass || []}
                        label={t("setting:policy.cabin_class")}
                        placeholder={t("setting:policy.select_cabin_class")}
                        defaultValue={getValuePolicyCriteriaByCode({ code: PolicyCriteriaCode.CabinClass, data: data })?.cabinClass}
                        onChange={(value) => {
                            onChangeValueByCode({
                                code: PolicyCriteriaCode.CabinClass,
                                key: "cabinClass",
                                newValue: value || VALUE_ALL,
                            });
                        }}
                    />
                </Grid>
            </Grid>
        </Modal>
    );
};

export default ModalPolicyFlight;