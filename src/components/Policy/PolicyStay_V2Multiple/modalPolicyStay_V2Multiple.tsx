import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AddCircleOutline } from "@mui/icons-material";
import { Divider, Grid, IconButton, Tooltip } from "@mui/material";
import { Box, Button, FormField, Modal, Typography, useCommonComponentContext } from "@maysoft/common-component-react";

import Constants from "@src/constants";
import Helpers from "@src/commons/helpers";
import CardItemCriteriaDetail_V2Multiple, { IItemCriteriaDetail_V2Multiple } from "./cardItemCriteriaDetail_V2Multiple";

import { BoxStar } from ".";
import { ICodename } from "@src/commons/interfaces";
import { CompareType, PolicyCriteriaCode } from "@src/commons/enum";
import useDataPolicy, { IPolicyCriteria, IPolicyCriteriaDetail, VALUE_ALL } from "@src/hooks/useDataPolicy.hook";



const sequenceDomestic = "2";
const sequenceInternational = "1";

const ModalPolicyStay_V2Multiple = ({
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

            const listStarClass = [...data?.get(PolicyCriteriaCode.StarClass)?.policyCriteriaDetail || []];

            const valueStarClass = listStarClass?.find(el => (
                (el.sequence === item.sequence) ||
                (`${el.sequence}`.charAt(0) === sequenceInternational) &&
                (`${el.sequence}`.substring(1, `${el.sequence}`.length) === `${item.sequence}`)
            ))?.compareNumber;

            err_International.push({});
            listDetail_International.push({
                sequence: item.sequence,

                currency: item.currency,
                bookingBudget: item.bookingBudget,
                from: item.from ? item.from : VALUE_ALL,

                startClass: valueStarClass,
            });
        };

        const objectTempDomestic = [...data?.get(PolicyCriteriaCode.Domestic)?.policyCriteriaDetail || []];

        for (const item of objectTempDomestic) {

            const listStarClass = [...data?.get(PolicyCriteriaCode.StarClass)?.policyCriteriaDetail || []];

            const valueStarClass = listStarClass?.find(el => (
                (el.sequence === item.sequence) ||
                (`${el.sequence}`.charAt(0) === sequenceDomestic) &&
                (`${el.sequence}`.substring(1, `${el.sequence}`.length) === `${item.sequence}`)
            ))?.compareNumber;

            err_Domestic.push({});
            listDetail_Domestic.push({
                sequence: item.sequence,

                currency: item.currency,
                bookingBudget: item.bookingBudget,
                from: item.from ? item.from : VALUE_ALL,

                startClass: valueStarClass,
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

        setDataModalPolicyStay(new Map());
    };

    const handleSubmit = () => {
        const listDetail_Domestic = [...dataCriteriaDetail_Domestic || []];
        const listDetail_International = [...dataCriteriaDetail_International || []];

        let newListCriteriaDetail_Domestic: IPolicyCriteriaDetail[] = [];
        let newListCriteriaDetail_StarClass: IPolicyCriteriaDetail[] = [];
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
                from: item.from,
                bookingBudget: item.bookingBudget,
                currency: Constants.CURRENCY_DEFAULT,
            });

            newListCriteriaDetail_StarClass.push({
                ...itemTemp,
                compareNumber: item.startClass,
                sequence: Number(`${sequenceDomestic}${index}`),
            });
        });

        listDetail_International.forEach((item, index) => {
            newListCriteriaDetail_International.push({
                ...itemTemp,
                sequence: index,
                from: item.from,
                bookingBudget: item.bookingBudget,
                currency: Constants.CURRENCY_DEFAULT,
            });

            newListCriteriaDetail_StarClass.push({
                ...itemTemp,
                compareNumber: item.startClass,
                sequence: Number(`${sequenceInternational}${index}`),
            });
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

        const itemCriteriaDetail_StarClass = data?.get(PolicyCriteriaCode.StarClass);
        itemCriteriaDetail_StarClass &&
            newDataCriteriaDetail.set(
                PolicyCriteriaCode.CabinClass,
                {
                    ...itemCriteriaDetail_StarClass,
                    policyCriteriaDetail: newListCriteriaDetail_StarClass,
                }
            );

        const itemCriteriaDetail_BookingTime = data?.get(PolicyCriteriaCode.BookingTime);
        itemCriteriaDetail_BookingTime &&
            newDataCriteriaDetail.set(
                PolicyCriteriaCode.BookingTime,
                itemCriteriaDetail_BookingTime
            );

        setOpen(false);

        setErrorDomestic([]);
        setErrorInternational([]);
        setDataCriteriaDetail_Domestic([]);
        setDataCriteriaDetail_International([]);

        setDataModalPolicyStay(new Map());

        onSubmit(newDataCriteriaDetail);
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
            if (Helpers.isNullOrEmpty(item.bookingBudget)) {
                checked = false;
                newErr[index] = {
                    ...newErr[index],
                    bookingBudget: "Vui lòng nhập ngân sách khách sạn",
                };
            }

            if (Helpers.isNullOrEmpty(item.from)) {
                checked = false;
                newErr[index] = {
                    ...newErr[index],
                    from: "Vui lòng chọn điểm đến",
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
                    from: undefined,
                    currency: undefined,
                    startClass: undefined,
                    bookingBudget: undefined,
                });

                newDataDetail.push({
                    sequence: Helpers.isNullOrEmpty(sequence) ? 0 : (sequence + 1),

                    from: VALUE_ALL,
                    startClass: 0,
                    bookingBudget: 0,
                    currency: Constants.CURRENCY_DEFAULT,
                });

                setErrorInternational(newErr);
                setDataCriteriaDetail_International(newDataDetail);
            } else {
                let newErr = [...errorDomestic || []];

                let newDataDetail = [...dataCriteriaDetail_Domestic || []];

                const sequence = newDataDetail[newDataDetail?.length - 1]?.sequence;

                newErr.push({
                    from: undefined,
                    currency: undefined,
                    startClass: undefined,
                    bookingBudget: undefined,
                });

                newDataDetail.push({
                    sequence: Helpers.isNullOrEmpty(sequence) ? 0 : (sequence + 1),

                    from: VALUE_ALL,
                    startClass: 0,
                    bookingBudget: 0,
                    currency: Constants.CURRENCY_DEFAULT,
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
            title={t("setting:policy.edit_hotel_policy")}
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
                            marginBottom: 1,
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }} >
                            <Typography variant="button">
                                {t("setting:policy.hotel_international")}
                            </Typography>
                            <Button onClick={() => {
                                onAddItemCriteriaDetail(true);
                            }} >
                                {t("common:add_new")}
                            </Button>
                        </Box>
                        {
                            dataCriteriaDetail_International?.map((item, index) => (
                                <CardItemCriteriaDetail_V2Multiple
                                    key={"International" + index}

                                    hidenActionDelete={index === 0}
                                    listStaySelected={listStaySelected}
                                    listStayDefaule={listInternationalStayDefaule}

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
                                            index,
                                            isInternational: true,
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
                            marginBottom: 1,
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }} >
                            <Typography variant="button">
                                {t("setting:policy.hotel_domestic")}
                            </Typography>
                            <Button onClick={() => {
                                onAddItemCriteriaDetail(false);
                            }} >
                                {t("common:add_new")}
                            </Button>
                        </Box>
                        {
                            dataCriteriaDetail_Domestic?.map((item, index) => (
                                <CardItemCriteriaDetail_V2Multiple
                                    key={"Domestic" + index}

                                    countryCode="VN"
                                    hidenActionDelete={index === 0}
                                    listStaySelected={listStaySelected}
                                    listStayDefaule={listDomesticStayDefaule}

                                    dataItem={item}
                                    errorItem={errorDomestic?.[index]}

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
                                            index,
                                            isInternational: false,
                                        });
                                    }}
                                />
                            ))
                        }
                    </Box>

                    <Divider />
                </Grid>

                {/* Thời hạn đặt */}
                {!hidenBookingTime &&
                    <Grid item xs={12}>
                        <Box sx={{ display: "grid" }} >
                            <Typography variant="button" fontWeight="bold">{t("setting:policy.booking_time")}</Typography>
                            <Typography variant="button" sx={{ color: "#8AB9FF" }}> {t("setting:policy.note_booking_time")}</Typography>
                        </Box>

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
                    </Grid>
                }
            </Grid>
        </Modal>
    );
};

export default ModalPolicyStay_V2Multiple;