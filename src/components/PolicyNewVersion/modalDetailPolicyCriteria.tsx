import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Autocomplete, Box, FormField, Modal, Typography } from "@maysoft/common-component-react";

import Constants from "@src/constants";
import Helpers from "@src/commons/helpers";

import { BoxStar } from "../Policy/PolicyStay";
import { ICodename } from "@src/commons/interfaces";
import { IPolicyCriteriaDetail, VALUE_ALL } from "@src/hooks/useDataPolicy.hook";
import { BookingTypePolicy, CompareType, ItineraryType, Mode } from "@src/commons/enum";



const ModalDetailPolicyCriteria = ({
    mode,
    listAirport,
    listAddress,
    listAriLines,
    listCabinClass,
    listBookingType,

    dataDetail,
    settingCode,
    policyCriteriaType,

    onClose,
    onSubmit,

    openModal,
    setOpenModal,
}: {
    mode: Mode,
    settingCode: string;
    policyCriteriaType: ItineraryType;
    dataDetail?: IPolicyCriteriaDetail;

    listAddress: ICodename[];
    listAirport: ICodename[];
    listAriLines: ICodename[];
    listCabinClass: ICodename[];
    listBookingType: ICodename[];

    onClose?: () => void;
    onSubmit: (data: {
        id?: string;
        policyId?: string;
        settingCode: string;
        policyCriteriaType: ItineraryType;

        dataDetail?: IPolicyCriteriaDetail;
    }) => void;

    openModal: boolean;
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const {
        t,
        i18n: { language },
    } = useTranslation(["common", "setting"]);

    const [errorModal, setErrorModal] = useState<any>({});
    const [dataModal, setDataModal] = useState<{
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
    }>({});

    useEffect(() => {
        if (Helpers.isNullOrEmpty(dataDetail?.id)) {
            if (policyCriteriaType === ItineraryType.Hotel) {
                setDataModal({
                    sequence: 0,
                    from: [VALUE_ALL],
                    starRating: 0,
                    bookingBudget: 1000000,
                    currency: Constants.CURRENCY_DEFAULT,
                });
            }
            if (policyCriteriaType === ItineraryType.Flight) {
                setDataModal({
                    sequence: 0,
                    to: [VALUE_ALL],
                    from: [VALUE_ALL],
                    carrier: [VALUE_ALL],
                    flightTime: 1,
                    starRating: 0,
                    bookingBudget: 1000000,
                    currency: Constants.CURRENCY_DEFAULT,
                    bookingType: Number(listBookingType?.[0]?.code),
                    cabinClass: (listCabinClass?.[0]?.code as string),
                });
            }
        } else {
            if (policyCriteriaType === ItineraryType.Flight) {
                setDataModal({
                    id: dataDetail?.id,
                    sequence: dataDetail?.sequence,
                    to: dataDetail?.to ? dataDetail?.to?.split(",") : [VALUE_ALL],
                    from: dataDetail?.from ? dataDetail?.from?.split(",") : [VALUE_ALL],
                    carrier: dataDetail?.carrier ? dataDetail?.carrier?.split(",") : [VALUE_ALL],
                    starRating: dataDetail?.starRating,
                    flightTime: dataDetail?.compareNumber,
                    bookingBudget: dataDetail?.bookingBudget,
                    currency: dataDetail?.currency || Constants.CURRENCY_DEFAULT,
                    bookingType: dataDetail?.bookingType ?? Number(listBookingType?.[0]?.code),
                    cabinClass: dataDetail?.cabinClass || (listCabinClass?.[0]?.code as string),
                });
            }
            if (policyCriteriaType === ItineraryType.Hotel) {
                setDataModal({
                    id: dataDetail?.id,
                    sequence: dataDetail?.sequence,
                    starRating: dataDetail?.starRating,
                    bookingBudget: dataDetail?.bookingBudget,
                    currency: dataDetail?.currency || Constants.CURRENCY_DEFAULT,
                    from: dataDetail?.from ? dataDetail?.from?.split(",") : [VALUE_ALL],
                });
            }
        };

    }, [dataDetail?.id]);

    const handleClose = () => {
        setDataModal({});
        setOpenModal(false);
        onClose && onClose();
    };

    const handleValidate = () => {
        let checked = true;
        let newError = { ...errorModal };

        if (Helpers.isNullOrEmpty(dataModal?.bookingBudget)) {
            newError["bookingBudget"] = t("common:message.required_field");
            checked = false;
        }

        if (policyCriteriaType === ItineraryType.Flight) {
            if (Helpers.isNullOrEmpty(dataModal?.bookingType)) {
                newError["bookingType"] = t("common:message.required_field");
                checked = false;
            }

            if (Helpers.isNullOrEmpty(dataModal?.from)) {
                newError["from"] = t("common:message.required_field");
                checked = false;
            }

            if (Helpers.isNullOrEmpty(dataModal?.to)) {
                newError["to"] = t("common:message.required_field");
                checked = false;
            }

            if (Helpers.isNullOrEmpty(dataModal?.carrier)) {
                newError["carrier"] = t("common:message.required_field");
                checked = false;
            }

            if (Helpers.isNullOrEmpty(dataModal?.cabinClass)) {
                newError["cabinClass"] = t("common:message.required_field");
                checked = false;
            }

            if (Helpers.isNullOrEmpty(dataModal?.flightTime)) {
                newError["flightTime"] = t("common:message.required_field");
                checked = false;
            } else {
                if (Number(dataModal?.flightTime) <= 0) {
                    newError["flightTime"] = "Thời gian bay phải lớn hơn 0";
                    checked = false;
                }
            }
        }

        if (policyCriteriaType === ItineraryType.Hotel) {
            if (Helpers.isNullOrEmpty(dataModal?.from)) {
                newError["from"] = t("common:message.required_field");
                checked = false;
            }
        }

        if (!checked) {
            setErrorModal(newError)
        }

        return checked;
    }

    const handleSubmit = async () => {
        if (!handleValidate()) {
            return;
        } else {
            const newid = Helpers.isNullOrEmpty(dataDetail?.id) ? Date.now().toString() : dataModal?.id;

            onSubmit({
                settingCode: settingCode,
                policyCriteriaType: policyCriteriaType,

                dataDetail: {
                    id: newid,
                    sequence: dataModal?.sequence,
                    carrier: dataModal?.carrier?.join(","),
                    cabinClass: dataModal?.cabinClass,
                    bookingType: dataModal?.bookingType,
                    bookingClass: undefined,
                    bookingBudget: dataModal?.bookingBudget,
                    currency: dataModal?.currency,
                    compareType: CompareType.LessThan,
                    compareValue: undefined,
                    compareNumber: dataModal?.flightTime,
                    exception: undefined,
                    starRating: dataModal?.starRating,
                    to: dataModal?.to?.join(","),
                    from: dataModal?.from?.join(","),
                },
            });

            setDataModal({});
            setOpenModal(false);
        }
    };

    const onChangeValue = ({ key, value }: { key: string, value: any }) => {
        setDataModal(prev => ({
            ...prev,
            [key]: value,
        }));
        setErrorModal((prev: any) => ({
            ...prev,
            [key]: undefined,
        }));
    };

    const textMode = mode !== Mode.View ? (mode === Mode.Create ? t("common:add_new") : t("common:edit")) : t("common:detail");
    const textType = policyCriteriaType === ItineraryType.Flight ? t("setting:policy.flight") : (policyCriteriaType === ItineraryType.Hotel ? t("setting:policy.hotel") : "")
    const titleModal = `${textMode} ${t("setting:policy.policy").toLowerCase()} ${textType.toLowerCase()}`;

    return (
        <Modal
            fullWidth
            maxWidth="md"
            title={titleModal}
            visible={openModal}
            hasActionButton={mode !== Mode.View}

            onClose={() => { handleClose(); }}
            onAction={() => { handleSubmit(); }}
        >
            <Box padding={2}>
                {policyCriteriaType === ItineraryType.Flight &&
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={6} md={5}>
                                    <Typography variant="button">
                                        {t("setting:policy.flight_type")}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6} md={7}>
                                    <Autocomplete
                                        mode={mode}
                                        isSelectedBox
                                        variant={"outlined"}
                                        data={listBookingType || []}
                                        defaultValue={dataModal?.bookingType}
                                        errorMessage={errorModal?.bookingType}
                                        placeholder={t("setting:policy.select_type")}
                                        onChange={(value) => {
                                            onChangeValue({
                                                key: "bookingType",
                                                value: value ?? BookingTypePolicy.OneWay,
                                            });
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={6} md={5}>
                                    <Typography variant="button">
                                        {t("setting:policy.departure_airport")}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6} md={7}>
                                    <Autocomplete
                                        multiple
                                        mode={mode}
                                        variant={"outlined"}
                                        data={listAirport || []}
                                        defaultValue={dataModal?.from}
                                        errorMessage={errorModal?.from}
                                        placeholder={t("setting:policy.departure_airport")}
                                        onChange={(value) => {
                                            const item = [...value || []]?.[[...value || []].length - 1];

                                            if (item === VALUE_ALL) {
                                                onChangeValue({
                                                    key: "from",
                                                    value: [VALUE_ALL],
                                                });
                                            } else {
                                                const newValue = ([...value || []].length === 0)
                                                    ? [VALUE_ALL]
                                                    : ([...value || []].length === 1)
                                                        ? value
                                                        : value.filter((el: any) => el !== VALUE_ALL)

                                                onChangeValue({
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
                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={6} md={5}>
                                    <Typography variant="button">
                                        {t("setting:policy.arrival_airport")}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6} md={7}>
                                    <Autocomplete
                                        multiple
                                        mode={mode}
                                        variant={"outlined"}
                                        data={listAirport || []}
                                        defaultValue={dataModal?.to}
                                        errorMessage={errorModal?.to}
                                        placeholder={t("setting:policy.arrival_airport")}
                                        onChange={(value) => {
                                            const item = [...value || []]?.[[...value || []].length - 1];

                                            if (item === VALUE_ALL) {
                                                onChangeValue({
                                                    key: "to",
                                                    value: [VALUE_ALL],
                                                });
                                            } else {
                                                const newValue = ([...value || []].length === 0)
                                                    ? [VALUE_ALL]
                                                    : ([...value || []].length === 1)
                                                        ? value
                                                        : value.filter((el: any) => el !== VALUE_ALL)

                                                onChangeValue({
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
                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={6} md={5}>
                                    <Typography variant="button">
                                        {t("setting:policy.flight_time_below")}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6} md={7}>
                                    <FormField
                                        mode={mode}
                                        maxLength={100}
                                        type={"number"}
                                        variant={"outlined"}
                                        value={dataModal?.flightTime}
                                        unit={t("setting:policy.hourt")}
                                        errorMessage={errorModal?.flightTime}
                                        placeholder={t("setting:policy.enter_hourt")}
                                        onChangeValue={(value) => {
                                            const newValue = value ? ((Number(value) > 0) ? Number(value) : 0) : undefined;
                                            onChangeValue({
                                                key: "flightTime",
                                                value: newValue,
                                            });
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={6} md={5}>
                                    <Typography variant="button">
                                        {t("setting:policy.flight_class")}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6} md={7}>
                                    <Autocomplete
                                        multiple
                                        mode={mode}
                                        variant={"outlined"}
                                        data={listAriLines || []}
                                        defaultValue={dataModal?.carrier}
                                        errorMessage={errorModal?.carrier}
                                        placeholder={t("setting:policy.select_flight_class")}
                                        onChange={(value) => {
                                            const item = [...value || []]?.[[...value || []].length - 1];

                                            if (item === VALUE_ALL) {
                                                onChangeValue({
                                                    key: "carrier",
                                                    value: [VALUE_ALL],
                                                });
                                            } else {
                                                const newValue = ([...value || []].length === 0)
                                                    ? [VALUE_ALL]
                                                    : ([...value || []].length === 1)
                                                        ? value
                                                        : value.filter((el: any) => el !== VALUE_ALL)

                                                onChangeValue({
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
                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={6} md={5}>
                                    <Typography variant="button">
                                        {t("setting:policy.cabin_class")}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6} md={7}>
                                    <Autocomplete
                                        mode={mode}
                                        isSelectedBox
                                        variant={"outlined"}
                                        data={listCabinClass || []}
                                        defaultValue={dataModal?.cabinClass}
                                        errorMessage={errorModal?.cabinClass}
                                        placeholder={t("setting:policy.select_cabin_class")}
                                        onChange={(value) => {
                                            onChangeValue({
                                                key: "cabinClass",
                                                value: value ?? listCabinClass?.[0]?.code,
                                            });
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={6} md={5}>
                                    <Typography variant="button">
                                        {t("setting:budget.budget")}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6} md={7}>
                                    <FormField
                                        isMoney
                                        mode={mode}
                                        maxLength={100}
                                        type={"number"}
                                        variant={"outlined"}
                                        value={dataModal?.bookingBudget}
                                        errorMessage={errorModal?.bookingBudget}
                                        placeholder={t("setting:policy.enter_value")}
                                        unit={dataModal?.currency || Constants.CURRENCY_DEFAULT}
                                        error={!Helpers.isNullOrEmpty(errorModal?.bookingBudget)}
                                        onChangeValue={(value) => {
                                            const newValue = value ? ((Number(value) > 0) ? Number(value) : 0) : undefined;
                                            onChangeValue({
                                                key: "bookingBudget",
                                                value: newValue,
                                            });
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                }

                {policyCriteriaType === ItineraryType.Hotel &&
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={6} md={5}>
                                    <Typography variant="button">
                                        {t("setting:policy.point")}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6} md={7}>
                                    <Autocomplete
                                        multiple
                                        mode={mode}
                                        variant={"outlined"}
                                        data={listAddress || []}
                                        defaultValue={dataModal?.from}
                                        errorMessage={errorModal?.from}
                                        placeholder={t("setting:policy.select_point")}
                                        onChange={(value) => {
                                            const item = [...value || []]?.[[...value || []].length - 1];

                                            if (item === VALUE_ALL) {
                                                onChangeValue({
                                                    key: "from",
                                                    value: [VALUE_ALL],
                                                });
                                            } else {
                                                const newValue = ([...value || []].length === 0)
                                                    ? [VALUE_ALL]
                                                    : ([...value || []].length === 1)
                                                        ? value
                                                        : value.filter((el: any) => el !== VALUE_ALL)

                                                onChangeValue({
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
                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={6} md={5}>
                                    <Typography variant="button">
                                        {t("setting:budget.budget")}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6} md={7}>
                                    <FormField
                                        isMoney
                                        mode={mode}
                                        maxLength={100}
                                        type={"number"}
                                        variant={"outlined"}
                                        value={dataModal?.bookingBudget}
                                        errorMessage={errorModal?.bookingBudget}
                                        placeholder={t("setting:policy.enter_value")}
                                        unit={dataModal?.currency || Constants.CURRENCY_DEFAULT}
                                        error={!Helpers.isNullOrEmpty(errorModal?.bookingBudget)}
                                        onChangeValue={(value) => {
                                            const newValue = value ? ((Number(value) > 0) ? Number(value) : 0) : undefined;
                                            onChangeValue({
                                                key: "bookingBudget",
                                                value: newValue,
                                            });
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <Grid container spacing={1}>
                                <Grid item xs={12} sm={6} md={5}>
                                    <Typography variant="button">
                                        {t("setting:policy.maximum_star_rating")}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6} md={7}>
                                    <BoxStar
                                        number={dataModal?.starRating || 0}
                                        onChange={(value) => {
                                            const newValue = Helpers.isNullOrEmpty(value) ? Number(value) : ((Number(value) > 0) ? Number(value) : 0);
                                            onChangeValue({
                                                key: "starRating",
                                                value: newValue,
                                            });
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                }
            </Box>
        </Modal>
    );
};

export default ModalDetailPolicyCriteria;