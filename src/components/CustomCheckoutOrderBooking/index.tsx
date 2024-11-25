import { Box, Typography } from "@maysoft/common-component-react";
import { Grid } from "@mui/material";
import moment from "moment";

import Helpers from "@src/commons/helpers";
import CardBookingDetailFlightByCheckout from "./CardBookingDetailFlight";
import CardOrderSummary from "./CardOrderSummary";

import { PaymentStatus, PaymentType } from "@src/commons/enum";
import { ICodename, IDetailBooking } from "@src/commons/interfaces";
import { IOrderCheckout } from "@src/pages/checkout/useDataPaymentTrip.hook";
import CountDown from "./CountDown";
import { typographyStyles } from "@src/styles/commonStyles";

const CustomCheckoutOrderBooking = ({
    dataMember,
    lastTicketDate,
    paymentMethod,
    dataOrder,
    dataBooking,
    listPaymentMethod,
    handleSubmit,
    handlePricing,
}: {
    dataMember: any[];
    lastTicketDate: number;
    paymentMethod: PaymentType;
    dataOrder: IOrderCheckout[];
    dataBooking?: IDetailBooking;
    listPaymentMethod: ICodename[];
    handleSubmit: () => void;
    handlePricing: (value: PaymentType) => void;
}) => {
    return (
        <Grid container spacing={3} mt={0}>
            <Grid item xs={12} sm={6} md={8} lg={8}>
                <Box
                    sx={{
                        width: "100%",
                        borderRadius: 3,
                        backgroundColor: "#FFFFFF",
                        boxShadow: "0px 2px 4px 0px #0000000D",
                        overflow: "hidden",
                    }}
                >
                    <Box
                        sx={{
                            background: "#E4EBF7",
                            p: 2,
                        }}
                    >
                        <Box
                            sx={{
                                gap: 1,
                                display: "flex",
                                flexWrap: "wrap",
                                alignItems: "end",
                                justifyContent: "space-between",
                            }}
                        >
                            <Box sx={{ display: "grid" }}>
                                <Typography sx={(theme) => typographyStyles(theme, { fontSize: "0.875rem" })}>{"Mã đơn hàng"}</Typography>
                                <Typography sx={(theme) => typographyStyles(theme, { fontSize: "0.875rem", fontWeight: 500 })}>
                                    {dataBooking?.bookingCode}
                                </Typography>
                            </Box>
                            {dataOrder?.[0]?.paymentStatus >= 0 && dataOrder?.[0]?.paymentStatus < PaymentStatus.Completed && (
                                <Box sx={{ display: "grid", textAlign: "right" }}>
                                    <Typography sx={(theme) => typographyStyles(theme, { fontSize: "0.875rem" })}>{"Hạn thanh toán"}</Typography>
                                    {!checkIsNullLastTicketDate(lastTicketDate) && <CountDown time={lastTicketDate} />}
                                </Box>
                            )}
                        </Box>
                    </Box>

                    <CardBookingDetailFlightByCheckout dataMember={dataMember} dataBooking={dataBooking} />
                </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4}>
                <CardOrderSummary
                    dataOrder={dataOrder}
                    paymentMethod={paymentMethod}
                    lastTicketDate={lastTicketDate}
                    listPaymentMethod={listPaymentMethod}
                    handleSubmit={handleSubmit}
                    handlePricing={handlePricing}
                />
            </Grid>
        </Grid>
    );
};

export default CustomCheckoutOrderBooking;

const checkIsNullLastTicketDate = (value: any) => {
    if (Helpers.isNullOrEmpty(value)) return true;
    if (value === "0" || value === 0 || value === "null" || value === "undefined") return true;
    return false;
};
