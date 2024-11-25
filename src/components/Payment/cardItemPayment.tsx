import moment from "moment";
import { useTranslation } from "react-i18next";
import { Card, Grid, IconButton, Tooltip } from "@mui/material";
import { AccountBalance, CreditCardOutlined, Event, Person } from "@mui/icons-material";
import { Box, CustomIcon, TitleValue, Typography } from "@maysoft/common-component-react";

import Constants from "@src/constants";
import Helpers from "@src/commons/helpers";
import { PaymentAccountType } from "@src/commons/enum";
import { IRecordPayment } from "@src/services/sale/PaymentAccountService";


const CardItemPayment = ({
    item,
    onEdit,
    onDelete,
    hidenDelete,
    hidenUpdate,
}: {
    hidenUpdate?: boolean,
    hidenDelete?: boolean,
    item: IRecordPayment;
    onEdit: () => void;
    onDelete: () => void;
}) => {
    const {
        t,
        i18n: { language },
    } = useTranslation(["common", "setting"]);

    return (
        <Card>
            <Box sx={{
                padding: 3,
                width: "100%",
                borderRadius: "8px",
                border: "1px #D4D9DF solid",
            }}>
                {PaymentAccountType.Debit !== item.type &&
                    <Grid container spacing={3} alignItems={"center"}>
                        <Grid item xs={12} md={7} lg={9}>
                            {/*  */}
                            <Box sx={{ display: "grid", width: "100%" }} >
                                <Typography variant="h6">
                                    {(!Helpers.isNullOrEmpty(item.groupId) && (item.groupId !== "0"))
                                        ? `[${item.groupName?.value?.[language]}] - ${item.name}`
                                        : `${item.name}`
                                    }
                                </Typography>

                                <Box sx={{ mt: 2, gap: 1, display: "flex", flexWrap: "wrap", alignItems: "center" }}>
                                    <CreditCardOutlined />
                                    <Typography variant="button">
                                        {`XXXX XXXX XXXX ` + `${item.accountId || ""}`.substring(12, `${item.accountId || ""}`.length)}
                                    </Typography>
                                </Box>

                                <Box sx={{
                                    mt: 1,
                                    gap: 1,
                                    display: "flex",
                                    flexWrap: "wrap",
                                    alignItems: "center",
                                    justifyContent: "space-between"
                                }} >
                                    <Box sx={{ gap: 1, display: "flex", flexWrap: "wrap", alignItems: "center" }}>
                                        <Person />
                                        <Typography variant="button">
                                            {item.accountName}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ gap: 1, display: "flex", flexWrap: "wrap", alignItems: "center" }}>
                                        <Event />
                                        <Typography variant="button">
                                            {moment(Number(item.expiredDate) * 1000).format("MM/YY")}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={5} lg={3}>
                            <Box sx={{ gap: 3, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "end" }} >
                                {
                                    (item.default === 1) &&
                                    <Box sx={{
                                        padding: "4px 8px",
                                        borderRadius: "4px",
                                        backgroundColor: "#FFD9C0",
                                    }} >
                                        <Typography variant="button" sx={{ color: "#E8782E" }}>{t("setting:payment.default_payment")}</Typography>
                                    </Box>
                                }

                                {/* Button Action */}
                                <Box sx={{ gap: 0.5, display: "flex", flexWrap: "wrap", alignItems: "center" }}>
                                    {!hidenUpdate &&
                                        <Tooltip title={t("common:delete")}>
                                            <IconButton color="info" onClick={() => onEdit()} >
                                                <CustomIcon iconName={"edit"} />
                                            </IconButton>
                                        </Tooltip>
                                    }
                                    {!hidenDelete &&
                                        <Tooltip title={t("common:delete")}>
                                            <IconButton color="error" onClick={() => onDelete()} >
                                                <CustomIcon iconName={"delete"} />
                                            </IconButton>
                                        </Tooltip>
                                    }
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                }

                {PaymentAccountType.Debit === item.type &&
                    <Grid container spacing={2} alignItems={"center"}>
                        <Grid item xs={12} sm={6}>
                            <TitleValue
                                title={t("setting:organization")}
                                value={`${item.partnerCode} - ${item.partnerName}`}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TitleValue
                                title={t("setting:payment.current_balance")}
                                value={`${Helpers.formatCurrency(item.currentBalance || 0)} ${Constants.CURRENCY_DEFAULT}`}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TitleValue
                                title={t("setting:payment.credit_limit")}
                                value={`${Helpers.formatCurrency(item.creditLimit || 0)} ${Constants.CURRENCY_DEFAULT}`}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TitleValue
                                title={t("setting:payment.available_balance")}
                                value={`${Helpers.formatCurrency((item.creditLimit || 0) - (item.currentBalance || 0))} ${Constants.CURRENCY_DEFAULT}`}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TitleValue
                                value={`${item.billingCycle} ngày`}
                                title={t("setting:payment.billing_cycle")}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TitleValue
                                title={t("setting:payment.effective_date")}
                                value={`${moment(Helpers.getDateValue(item.currentCycle)).format("DD/MM/YYYY")}`}
                            />
                        </Grid>
                    </Grid>
                }
            </Box>
        </Card>
    );
};

export default CardItemPayment;