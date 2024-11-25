import moment from "moment";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AddCircleOutline } from "@mui/icons-material";
import { FormControl, FormControlLabel, Grid, IconButton, RadioGroup } from "@mui/material";
import { Box, DataTable, DatePicker, FormField, Modal, Typography, Radio } from "@maysoft/common-component-react";

import Constants from "@src/constants";
import Helpers from "@src/commons/helpers";

import { ICodename } from "@src/commons/interfaces";
import { Mode, TimerangeBudget } from "@src/commons/enum";
import { ICreateUpdateBudget, ITimerangeCustom } from "@src/services/sale/BudgetService";


const RenderDetailPhase = ({
    mode,
    dataBudgetPlan,
    errorBudgetPlan,
    listTimerangeBudget,
    handleOnChangeValue,

}: {
    mode: number,
    errorBudgetPlan: any;
    dataBudgetPlan: ICreateUpdateBudget;
    listTimerangeBudget: ICodename[];
    handleOnChangeValue: (key: string, value: any) => void;
}) => {
    const {
        t,
        i18n: { language },
    } = useTranslation(["common", "setting"]);

    const [openModal, setOpenModal] = useState<boolean>(false);
    const [dataModal, setDataModal] = useState<ITimerangeCustom>({});

    return (
        <>
            <Box>
                <Box>
                    <Typography variant="button" fontWeight="bold">
                        {t("setting:budget.phase")}
                    </Typography>
                </Box>
                <FormControl
                    disabled={mode === Mode.View}
                    sx={{
                        ".MuiFormControlLabel-label": {
                            fontWeight: "400 !important",
                        }
                    }}
                >
                    <RadioGroup
                        name="radio-buttons-group"
                        aria-labelledby="radio-buttons-group-label"
                        value={
                            Helpers.isNullOrEmpty(dataBudgetPlan?.timerange)
                                ? listTimerangeBudget[0]?.code
                                : dataBudgetPlan?.timerange
                        }
                        onChange={(event, value) => {
                            handleOnChangeValue("timerange", Number(value));
                        }}
                    >
                        {listTimerangeBudget?.map((item) => (
                            <>
                                <FormControlLabel
                                    key={item.code}
                                    label={item.name}
                                    value={item.code}
                                    disabled={mode === Mode.View}
                                    control={<Radio sx={{ p: 0 }} />}
                                    sx={{ mb: 0, mt: 0, ml: 0, p: 0 }}
                                />
                                {!(Number(dataBudgetPlan?.timerange) === TimerangeBudget.CustomRange) &&
                                    (Number(dataBudgetPlan?.timerange) === Number(item.code)) &&
                                    <Box paddingLeft={"44px"}>
                                        <FormField
                                            isMoney
                                            required
                                            label={""}
                                            mode={mode}
                                            type="number"
                                            variant={"outlined"}
                                            value={dataBudgetPlan?.amount}
                                            errorMessage={errorBudgetPlan?.amount}
                                            placeholder={t("setting:budget.enter_money")}
                                            unit={dataBudgetPlan?.currency || Constants.CURRENCY_DEFAULT}
                                            onChangeValue={(value) => {
                                                const newValue = value ? ((Number(value) > 0) ? Number(value) : 0) : undefined;
                                                handleOnChangeValue("amount", newValue);
                                            }}
                                        />
                                    </Box>
                                }
                            </>
                        ))}
                    </RadioGroup>
                </FormControl>
            </Box>
            {
                (Number(dataBudgetPlan?.timerange) === TimerangeBudget.CustomRange) &&
                <Box mt={1}>
                    <Box paddingLeft={"44px"}>
                        <Box sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                        }}>
                            <Typography variant="button" fontWeight="bold">
                                {t("setting:budget.timerange_custom")}
                            </Typography>
                            <IconButton color="info" onClick={() => {
                                setOpenModal(true);
                                setDataModal({
                                    from: moment().startOf("months").unix().toString(),
                                    to: moment().endOf("months").unix().toString(),
                                })
                            }}>
                                <AddCircleOutline />
                            </IconButton>
                        </Box>
                        {!Helpers.isNullOrEmpty(errorBudgetPlan?.timerangeCustom) &&
                            <Typography color="error" variant="caption" >{errorBudgetPlan?.timerangeCustom}</Typography>
                        }
                        <ModalAddPhase
                            open={openModal}
                            setOpen={setOpenModal}

                            dataModal={dataModal}
                            setDataModal={setDataModal}

                            onAction={(row) => {
                                let newRows = [...dataBudgetPlan?.timerangeCustom || []];
                                if (Helpers.isNullOrEmpty(row.id)) {
                                    newRows.push({ ...row, id: Date.now().toString() });
                                } else {
                                    const index = newRows.findIndex(el => el.id === row.id);
                                    if (index !== -1) newRows[index] = { ...row };
                                }
                                handleOnChangeValue("timerangeCustom", newRows);
                            }}
                        />
                        {[...dataBudgetPlan?.timerangeCustom || []].length > 0 &&
                            <DataTable
                                isLocal
                                mode={mode}
                                pageNumber={1}
                                rowPerPage={1000}
                                showFooter={false}
                                totalCount={[...dataBudgetPlan?.timerangeCustom || []].length}
                                actionList={[
                                    {
                                        key: "edit",
                                        iconName: "edit",
                                        title: t("common:edit"),
                                        callback: (row) => {
                                            setOpenModal(true);
                                            setDataModal(row);
                                        },
                                    },
                                    {
                                        key: "delete",
                                        iconName: "delete",
                                        title: t("common:delete"),
                                        callback: (row) => {
                                            let newRows = [...dataBudgetPlan?.timerangeCustom || []];
                                            newRows = newRows.filter(el => el.id !== row.id);
                                            handleOnChangeValue("timerangeCustom", newRows);
                                        },
                                    },
                                ]}
                                table={{
                                    columns: [
                                        {
                                            Header: t("setting:budget.time"),
                                            accessor: "to",
                                            Cell: (row) => {
                                                const startDay = `${Helpers.formatDate(Number(row.row?.original?.from) * 1000, "DD")}`;
                                                const startMoth = `${Helpers.formatMothName(Number(row.row?.original?.from) * 1000, language)}`;

                                                const endDay = `${Helpers.formatDate(Number(row.row?.original?.to) * 1000, "DD")}`;
                                                const endMoth = `${Helpers.formatMothName(Number(row.row?.original?.to) * 1000, language)}`;
                                                return <>{`${startDay} ${startMoth} - ${endDay} ${endMoth}`}</>
                                            }
                                        },
                                        {
                                            Header: t("setting:budget.amount"),
                                            accessor: "amount",
                                            Cell: (row) => <>{`${Helpers.formatCurrency(row.value)} ${row.row?.original?.currency || Constants.CURRENCY_DEFAULT}`}</>
                                        }
                                    ],
                                    rows: dataBudgetPlan?.timerangeCustom || [],
                                }}
                            />
                        }
                    </Box>
                </Box>
            }
        </>
    )
};

const ModalAddPhase = (props: {
    dataModal: ITimerangeCustom;
    setDataModal: React.Dispatch<React.SetStateAction<ITimerangeCustom>>;

    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onAction: (data: ITimerangeCustom) => void;
}) => {
    const {
        t,
        i18n: { language },
    } = useTranslation(["common", "setting"]);

    const [errorModal, setErrorModal] = useState<{ [key in keyof ITimerangeCustom]?: string }>({});

    const handelOnClose = () => {
        props.setOpen(false);

        setErrorModal({});
        props.setDataModal({});
    }

    const handleOnChangeValue = (key: string, value: any) => {
        props.setDataModal(prev => {
            let newData: any = { ...prev };

            newData[key] = value;

            if (key === "from") {
                let end = newData?.to;
                if (!Helpers.isNullOrEmpty(end) && !Helpers.isNullOrEmpty(value) && value > Number(end)) {
                    newData["to"] = moment(value * 1000).endOf("month").unix();;
                }
            }
            if (key === "to") {
                let start = newData?.from;
                if (!Helpers.isNullOrEmpty(start) && !Helpers.isNullOrEmpty(value) && value < Number(start)) {
                    newData["from"] = moment(value * 1000).startOf("month").unix();
                }
            }

            return newData
        });

        setErrorModal(prev => ({
            ...prev,
            [key]: undefined,
        }));
    };

    const handleValidateValue = () => {
        let checked = true;
        let newError: any = { ...props.dataModal };

        if (Helpers.isNullOrEmpty(props.dataModal?.amount)) {
            checked = false;
            newError["amount"] = t("setting:budget.required_amount");
        }
        if (Helpers.isNullOrEmpty(props.dataModal?.to)) {
            checked = false;
            newError["to"] = t("setting:budget.required_required_time");
        }
        if (Helpers.isNullOrEmpty(props.dataModal?.from)) {
            checked = false;
            newError["from"] = t("setting:budget.required_required_time");
        }

        if (!checked) {
            setErrorModal(newError);
        }
        return checked;
    };

    return (
        <Modal
            fullWidth
            maxWidth="md"
            hasActionButton
            visible={props.open}
            title={t("setting:budget.timerange_custom")}
            onClose={() => { handelOnClose() }}
            onAction={() => {
                if (handleValidateValue()) {
                    props.onAction({ ...props.dataModal });
                    handelOnClose();
                }
            }}
        >
            <Grid container spacing={3} mt={1}>
                <Grid item xs={12} md={6}>
                    <Box sx={{
                        ".MuiOutlinedInput-input": {
                            padding: "12px 12px !important",
                            margin: "0px !important",
                        },
                        ".MuiInputLabel-root": {
                            top: "-8px !important",
                            left: "12px !important",
                        },
                    }}>
                        <DatePicker
                            required
                            variant="outlined"
                            errorMessage={errorModal?.from}
                            label={t("setting:budget.from")}
                            placeholder={t("setting:budget.enter_time")}
                            value={props.dataModal?.from ? Number(props.dataModal?.from) * 1000 : undefined}
                            onChangeValue={(value) => {
                                const newValue = !Helpers.isNullOrEmpty(value) ? moment(value).unix() : undefined
                                handleOnChangeValue("from", newValue);
                            }}
                        />
                    </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box sx={{
                        ".MuiOutlinedInput-input": {
                            padding: "12px 12px !important",
                            margin: "0px !important",
                        },
                        ".MuiInputLabel-root": {
                            top: "-8px !important",
                            left: "12px !important",
                        },
                    }}>
                        <DatePicker
                            required
                            variant="outlined"
                            errorMessage={errorModal?.to}
                            label={t("setting:budget.to")}
                            placeholder={t("setting:budget.enter_time")}
                            value={props.dataModal?.to ? Number(props.dataModal?.to) * 1000 : undefined}
                            onChangeValue={(value) => {
                                const newValue = !Helpers.isNullOrEmpty(value) ? moment(value).unix() : undefined
                                handleOnChangeValue("to", newValue);
                            }}
                        />
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <FormField
                        isMoney
                        required
                        type="number"
                        variant={"outlined"}
                        value={props.dataModal?.amount}
                        errorMessage={errorModal?.amount}
                        label={t("setting:budget.amount")}
                        placeholder={t("setting:budget.enter_amount")}
                        unit={props.dataModal?.currency || Constants.CURRENCY_DEFAULT}
                        onChangeValue={(value) => {
                            const newValue = value ? ((Number(value) > 0) ? Number(value) : 0) : undefined;
                            handleOnChangeValue("amount", newValue);
                        }}
                    />
                </Grid>
            </Grid>
        </Modal>
    )
}

export default RenderDetailPhase;