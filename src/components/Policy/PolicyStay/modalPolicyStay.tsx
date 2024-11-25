import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AddCircleOutline } from "@mui/icons-material";
import { Divider, Grid, IconButton, Tooltip } from "@mui/material";
import { Box, FormField, Modal, Typography, useCommonComponentContext } from "@maysoft/common-component-react";

import Constants from "@src/constants";
import Helpers from "@src/commons/helpers";
import CardItemCriteriaDetail from "./cardItemCriteriaDetail";

import { BoxStar } from ".";
import { ICodename } from "@src/commons/interfaces";
import { CompareType, PolicyCriteriaCode } from "@src/commons/enum";
import useDataPolicy, { IPolicyCriteria, VALUE_ALL } from "@src/hooks/useDataPolicy.hook";



const ModalPolicyStay = ({
    open,
    data,
    setOpen,
    onSubmit,
    setDataModalPolicyStay,

    hidenBookingTime,
    listStaySelected,
    listDomesticStayDefaule,
    listInternationalStayDefaule,
}: {
    open: boolean,
    data: Map<string, IPolicyCriteria>,
    hidenBookingTime?: boolean,
    listStaySelected: ICodename[],
    listDomesticStayDefaule?: ICodename[],
    listInternationalStayDefaule?: ICodename[],
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    onSubmit: (data: Map<string, IPolicyCriteria>) => void,
    setDataModalPolicyStay: React.Dispatch<React.SetStateAction<Map<string, IPolicyCriteria>>>
}) => {
    const {
        t,
        i18n: { language },
    } = useTranslation(["common", "setting"]);

    const { onError } = useCommonComponentContext();

    const { getValuePolicyCriteriaByCode } = useDataPolicy();

    const [errorDomestic, setErrorDomestic] = useState<{ [key: string]: string | undefined | null }[]>([]);
    const [errorInternational, setErrorInternational] = useState<{ [key: string]: string | undefined | null }[]>([]);

    const handleClose = () => {
        setOpen(false);

        setErrorDomestic([]);
        setErrorInternational([]);
        setDataModalPolicyStay(new Map());
    };

    const handleSubmit = () => {
        setOpen(false);

        setErrorDomestic([]);
        setErrorInternational([]);
        setDataModalPolicyStay(new Map());

        onSubmit(data);
    };

    const onChangeValueByCode = (props: {
        key: string,
        newValue: any,
        code: PolicyCriteriaCode,
    }) => {
        setDataModalPolicyStay(prev => {
            let newData = new Map(prev);

            const item: any = {
                ...getValuePolicyCriteriaByCode({ code: props.code, data: newData }),
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
            if (Helpers.isNullOrEmpty(item.bookingBudget)) {
                checked = false;
                newErr[index] = {
                    ...newErr[index],
                    bookingBudget: "Trường dữ liệu là bắt buộc",
                };
            }

            if (Helpers.isNullOrEmpty(item.from)) {
                checked = false;
                newErr[index] = {
                    ...newErr[index],
                    from: "Trường dữ liệu là bắt buộc",
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
        setDataModalPolicyStay(prev => {
            let newDataMap = new Map(prev);

            let newDataTemp = [...newDataMap?.get(props.code)?.policyCriteriaDetail || []];

            newDataTemp[props.index] = {
                ...newDataTemp[props.index],
                [props.key]: props.newValue,
            };

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

                return newData;
            });
        }
    };

    const onAddItemCriteriaDetail = (code: PolicyCriteriaCode) => {
        if (handleValidateCriteriaDetail(code)) {
            setDataModalPolicyStay(prev => {
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
                    to: undefined,
                    bookingType: undefined,
                    criteriaId: dataGetCode?.id || "",
                    policyId: dataGetCode?.policyId || "",
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
                        bookingBudget: undefined,
                    });

                    return newData;
                });
            }

        }
    };

    const onDeleteItemCriteriaDetail = ({ code, index }: { code: PolicyCriteriaCode, index: number }) => {
        setDataModalPolicyStay(prev => {
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
            maxWidth="md"
            hasActionButton

            onClose={() => { handleClose(); }}
            onAction={() => { handleSubmit(); }}

            visible={open}
            title={t("setting:policy.edit_hotel_policy")}
        >
            <Grid container spacing={3} p={2} pt={0}>
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
                            <Typography variant="button">{t("setting:policy.hotel_international")}</Typography>
                            <Tooltip title={t("common:add_new")}>
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
                                    listStaySelected={listStaySelected}
                                    listStayDefaule={listInternationalStayDefaule}

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

                    {/* Nội Địa */}
                    <Box marginTop={2} marginBottom={3}>
                        <Box sx={{
                            gap: 2,
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                        }} >
                            <Typography variant="button">{t("setting:policy.hotel_domestic")}</Typography>
                            <Tooltip title={t("common:add_new")}>
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
                                    key={"International" + index}

                                    countryCode="VN"
                                    hidenActionDelete={index === 0}
                                    listStaySelected={listStaySelected}
                                    listStayDefaule={listDomesticStayDefaule}

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

                <Grid item xs={12}>
                    {/* Thời hạn đặt */}
                    {!hidenBookingTime &&
                        <Box sx={{ display: "grid" }} >
                            <Typography variant="button" fontWeight="bold">{t("setting:policy.booking_time")}</Typography>
                            <Typography variant="button" sx={{ color: "#8AB9FF" }}> {t("setting:policy.note_booking_time")}</Typography>
                        </Box>
                    }
                    {!hidenBookingTime &&
                        <Box sx={{
                            gap: 2,
                            marginTop: 1,
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                        }} >
                            <Typography variant="button">{t("setting:policy.should_book_hotel_in_advance")}</Typography>
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
                    }
                    {/* Hạng khách sạn */}
                    <Box sx={{ display: "grid", marginTop: 1, }} >
                        <Typography variant="button">{t("setting:policy.maximum_star_rating")}</Typography>
                        <Typography variant="button" sx={{ color: "#8AB9FF" }}>{t("setting:policy.note_maximum_star_rating")}</Typography>
                        <BoxStar
                            number={getValuePolicyCriteriaByCode({ code: PolicyCriteriaCode.StarClass, data: data })?.compareNumber || 0}
                            onChange={(value) => {
                                const newValue = Helpers.isNullOrEmpty(value) ? Number(value) : ((Number(value) > 0) ? Number(value) : 0);
                                onChangeValueByCode({
                                    code: PolicyCriteriaCode.StarClass,
                                    key: "compareNumber",
                                    newValue: newValue,
                                });
                            }}
                        />
                    </Box>
                </Grid>
            </Grid >
        </Modal >
    );
};

export default ModalPolicyStay;