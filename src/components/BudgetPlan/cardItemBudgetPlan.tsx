import moment from "moment";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { AccountCircle, EventNote, MonetizationOnOutlined, WarningAmberOutlined } from "@mui/icons-material";
import { Card, Grid, IconButton, Tooltip } from "@mui/material";
import { Box, CustomIcon, Typography } from "@maysoft/common-component-react";

import Helpers from "@src/commons/helpers";
import Resources from "@src/constants/Resources";
import useDataBudgetPlan from "@src/hooks/useDataBudgetPlan.hook";

import { IRecordBudget } from "@src/services/sale/BudgetService";
import { NotifyTarget, TimerangeBudget } from "@src/commons/enum";
import { useMemo } from "react";



const CardItemBudgetPlan = ({
    item,
    onEdit,
    onDelete,
    dataMapUser,
    dataMapGroup,
    hidenActionDelete,
    hidenActionUpdate,
}: {
    item: IRecordBudget,
    hidenActionDelete?: boolean;
    hidenActionUpdate?: boolean;
    dataMapUser?: Map<string, any>,
    dataMapGroup?: Map<string, any>,

    onEdit: () => void;
    onDelete: () => void;
}) => {
    const {
        t,
        i18n: { language },
    } = useTranslation(["common", "setting"]);

    const { listTimerangeBudget } = useDataBudgetPlan();

    const getNameNotifyTarget = (value: number, dataTarget: any[]) => {
        if (value === NotifyTarget.Owner) {
            return t("setting:budget.owner")
        }

        if (value === NotifyTarget.GroupAdmin) {
            const newNameGroup: string[] = [];
            for (const item of dataTarget) {
                dataMapGroup?.has(item.targetId)
                    && newNameGroup.push(dataMapGroup?.get(item.targetId)?.name)
            };

            return (newNameGroup.length > 0) ? `${t("setting:budget.group_admin")} (${newNameGroup.join(", ")})` : "";
        }

        if (value === NotifyTarget.Custom) {
            const newNameUser: string[] = [];

            for (const item of dataTarget) {
                dataMapUser?.has(item.targetId) &&
                    newNameUser.push(dataMapUser?.get(item.targetId)?.fullName)
            };

            return (newNameUser.length > 0) ? newNameUser.join(", ") : "";
        }
    };

    const getDateFormat = (time: number) => {
        const day = `${Helpers.formatDate(time, "DD")}`;
        const month = `${Helpers.formatMothName(time, language)}`;
        return `${day} ${month}`;
    };

    const getNamebudgetTimeranges = (item: IRecordBudget) => {
        if (item.timerange === TimerangeBudget.CustomRange) {
            const length = item.budgetTimeranges?.length;

            if (length > 0) {
                let itemTimerangeCurrent: any = item.budgetTimeranges?.[0];

                if (item.timerange === TimerangeBudget.CustomRange) {
                    itemTimerangeCurrent = [...item.budgetTimeranges || []]?.find(el => (
                        Number(el.from) <= moment().unix() &&
                        Number(el.to) >= moment().unix()
                    ));
                }

                const startTime = getDateFormat(Number(itemTimerangeCurrent?.from) * 1000);
                const endTime = getDateFormat(Number(itemTimerangeCurrent?.to) * 1000)

                return `${startTime} - ${endTime}`; // , ${moment().format("YYYY")}
            } else {
                return ""
            }
        }

        if (item.timerange === TimerangeBudget.Monthly) {
            const startTime = getDateFormat(moment().startOf("months").unix() * 1000);
            const endTime = getDateFormat(moment().endOf("month").unix() * 1000)

            return `${startTime} - ${endTime}`;
        }

        if (item.timerange === TimerangeBudget.Quarterly) {
            return `${t("setting:budget.quarter")} ${item.quarter}, ${moment().format("YYYY")}`;
        }

        if (item.timerange === TimerangeBudget.Yearly) {
            const startTime = getDateFormat(moment().startOf("year").unix() * 1000);
            const endTime = getDateFormat(moment().endOf("year").unix() * 1000)

            return `${startTime} - ${endTime}`;
        }
    };

    const dataAmount = useMemo(() => {
        if (item.timerange !== TimerangeBudget.CustomRange) {
            return { amount: item.amount, actualAmount: item.actualAmount }
        } else {
            const itemTimerangeCurrent = [...item.budgetTimeranges || []]?.find(el => (
                Number(el.from) <= moment().unix() &&
                Number(el.to) >= moment().unix()
            ));

            return { amount: itemTimerangeCurrent?.amount || 0, actualAmount: item.actualAmount }
        }
    }, [item.amount, item.actualAmount, item.timerange, item.budgetTimeranges]);

    return (
        <Card>
            <Box sx={{
                padding: 3,
                width: "100%",
                borderRadius: "8px",
                border: "0.5px #D4D9DF solid",
            }}>
                <Grid container spacing={2} alignItems={"center"}>
                    <Grid item xs={12}>
                        <Box sx={{
                            gap: 1,
                            paddingBottom: 1,
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                            justifyContent: "space-between",
                            borderBottom: "0.5px #D4D9DF solid",
                        }} >
                            <Box sx={{
                                gap: 1,
                                display: "flex",
                                flexWrap: "wrap",
                                alignItems: "center",
                            }}>
                                <Typography variant="h6" fontWeight="bold">
                                    {item.name}
                                </Typography>

                                &ensp;&nbsp;
                                <Box sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    fontStyle: "italic",
                                    alignItems: "center",

                                    padding: "0px 8px",
                                    borderRadius: "25px",
                                    border: `0.5px ${(dataAmount.amount > dataAmount.actualAmount) ? "#4CAF50" : "#F44335"} solid`,
                                }}>
                                    {(dataAmount.amount > dataAmount.actualAmount)
                                        ? <MonetizationOnOutlined color="success" sx={{ width: "18px", height: "18px" }} />
                                        : <WarningAmberOutlined color="error" sx={{ width: "18px", height: "18px" }} />
                                    }
                                    &nbsp;
                                    <Typography
                                        variant="caption"
                                        fontWeight="bold"
                                        color={(dataAmount.amount > dataAmount.actualAmount) ? "success" : "error"}
                                    >
                                        {(dataAmount.amount > item.actualAmount) ? "Trong ngân sách" : "Ngoài ngân sách"}
                                    </Typography>
                                </Box>
                            </Box>
                            {/* Button Action */}
                            <Box sx={{
                                gap: 1,
                                display: "flex",
                                flexWrap: "wrap",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}>
                                <Typography variant="button">
                                    {`ID: ${item.id}`}
                                </Typography>
                                <Box flexWrap="inherit" display="inherit" gap="inherit" marginLeft="auto">
                                    {!hidenActionUpdate &&
                                        <Tooltip title={t("common:edit")}>
                                            <IconButton color="info" onClick={() => { onEdit() }} >
                                                <CustomIcon iconName={"edit"} />
                                            </IconButton>
                                        </Tooltip>
                                    }
                                    {!hidenActionDelete &&
                                        <Tooltip title={t("common:delete")}>
                                            <IconButton color="error" onClick={() => { onDelete() }} >
                                                <CustomIcon iconName={"delete"} />
                                            </IconButton>
                                        </Tooltip>
                                    }
                                </Box>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        <Box sx={{ gap: 1, display: "flex", flexWrap: "wrap", alignItems: "center" }}>
                            <AccountCircle width={21} height={21} />
                            <Typography variant="button">
                                {t("setting:budget.manager")}:
                                &ensp;
                                <Typography variant="button" fontWeight="bold">
                                    {getNameNotifyTarget(item.notifyTarget, item.budgetNotifyTargets)}
                                </Typography>
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        <Box sx={{
                            gap: 1,
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}>
                            <Box sx={{ display: "grid" }} >
                                <Box sx={{ gap: 1, display: "flex", flexWrap: "wrap", alignItems: "center" }}>
                                    <Image alt="job" src={Resources.Icon.COST} width={21} height={21} />
                                    <Typography variant="button">
                                        {t("setting:budget.budget")}:
                                        &ensp;&nbsp;
                                        <Typography variant="button" fontWeight="bold">
                                            {`${Helpers.formatCurrency(dataAmount.amount)} ${item.currency}`}
                                        </Typography>
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="button" sx={{ marginLeft: "29px" }}>
                                        {t("setting:budget.used_in_budget")}:
                                        &ensp;
                                        <Typography variant="button" fontWeight="bold" color="error">
                                            {`${Helpers.formatCurrency(dataAmount.actualAmount)} ${item.currency}`}
                                        </Typography>
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="button" sx={{ marginLeft: "29px" }}>
                                        {t("setting:budget.remaining")}:
                                        &emsp;&emsp;&nbsp;&nbsp;
                                        <Typography variant="button" fontWeight="bold" color="success">
                                            {`${Helpers.formatCurrency(dataAmount.amount - dataAmount.actualAmount)} ${item.currency}`}
                                        </Typography>
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: "grid" }} >
                                <Box sx={{ gap: 1, display: "flex", flexWrap: "wrap", alignItems: "center" }}>
                                    <EventNote width={21} height={21} />
                                    <Typography variant="button">
                                        {t("setting:budget.phase")}:
                                        &ensp;
                                        <Typography variant="button" fontWeight="bold">
                                            {listTimerangeBudget.find(el => el.code === item.timerange)?.name || ""}
                                        </Typography>
                                    </Typography>
                                </Box>
                                <Box sx={{ mt: 2, gap: 1, display: "flex", flexWrap: "wrap", alignItems: "center" }}>
                                    <Typography variant="h6" color="success">
                                        {getNamebudgetTimeranges(item)}
                                    </Typography>
                                    <Typography variant="button">
                                        {`${t("setting:budget.remaining")} ${item.remainDay} ${t("setting:policy.day")}`}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Card >
    );
};

export default CardItemBudgetPlan;