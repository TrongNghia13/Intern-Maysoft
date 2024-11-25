import { Box, Button, Typography } from "@maysoft/common-component-react";
import { Divider, Radio } from "@mui/material";
import moment from "moment";
import Image from "next/image";
import { Fragment } from "react";

import { East } from "@mui/icons-material";
import { OrderStatus, PaymentType } from "@src/commons/enum";
import Helpers from "@src/commons/helpers";
import { ICodename } from "@src/commons/interfaces";
import Constants from "@src/constants";
import { IOrderCheckout } from "@src/pages/checkout/useDataPaymentTrip.hook";
import Card from "../Card/Card";

const CardOrderSummary = ({
    lastTicketDate,
    paymentMethod,
    dataOrder,
    listPaymentMethod,
    handleSubmit,
    handlePricing,
}: {
    lastTicketDate: number;
    paymentMethod: PaymentType;
    dataOrder: IOrderCheckout[];
    listPaymentMethod: ICodename[];
    handleSubmit: () => void;
    handlePricing: (value: PaymentType) => void;
}) => {
    const order = dataOrder?.[0];

    const onChangePaymentMethod = (e: React.MouseEvent<HTMLDivElement>, value: PaymentType) => {
        e.stopPropagation();
        handlePricing(value);
    };

    return (
        <Card
            sx={{
                borderRadius: 2,
                display: "grid",
                gap: 3,
            }}
        >
            <Box display="grid" gap={1}>
                <Typography
                    variant="h6"
                    sx={{
                        fontSize: "1.125rem",
                        color: "#1C252E",
                        fontWeight: 600,
                    }}
                >
                    {"Phương thức thanh toán"}
                </Typography>
                <Box display="grid" gap={1}>
                    {listPaymentMethod?.map((item, index) => (
                        <PaymentMethodItem item={item} paymentMethod={paymentMethod} onClick={onChangePaymentMethod} key={"ABCD" + index} />
                    ))}
                </Box>
            </Box>

            <Box gap={1} display={"grid"} paddingBottom={2}>
                <Typography
                    variant="h6"
                    sx={{
                        fontSize: "1.125rem",
                        color: "#1C252E",
                        fontWeight: 600,
                    }}
                >
                    {"Chi tiết giá"}
                </Typography>

                {(dataOrder || []).map((order) => {
                    const newExtraInfo = Helpers.toCamelCaseObj(Helpers.converStringToJson(order?.orderDetails?.[0]?.extraInformation));
                    return (
                        <Fragment key={order.id}>
                            <SummaryItem
                                title={
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Title value={`Chuyến bay ${newExtraInfo?.departPlaceObj?.code}`} />
                                        <East sx={{ fontSize: Constants.FONT_SIZE.SMALL_TEXT, color: "#1C252E" }} />
                                        <Title value={newExtraInfo?.arrivalPlaceObj?.code} />
                                    </Box>
                                }
                                value={(order?.amount || 0) - (order?.paymentFee || 0)}
                                currency={order?.currency || "VND"}
                            />
                            <SummaryItem title={"Phí tiện ích"} value={order?.paymentFee || 0} currency={order?.currency || "VND"} />
                        </Fragment>
                    );
                })}
                <Divider />
                <SummaryItem title={"Tổng thanh toán"} value={order?.amount || 0} currency={order?.currency || "VND"} isTotal />
            </Box>

            {order?.orderStatus !== OrderStatus.Cancel &&
                order?.orderStatus !== OrderStatus.Completed &&
                order?.orderStatus !== OrderStatus.PaymentFailed && (
                    <Button fullWidth color="info" onClick={() => handleSubmit()}>
                        {"Thanh toán"}
                    </Button>
                )}
        </Card>
    );
};

const Title = ({ value }: { value: string }) => (
    <Typography
        sx={{
            fontSize: Constants.FONT_SIZE.SMALL_TEXT,
            fontWeight: 400,
            color: "#1C252E",
        }}
    >
        {value}
    </Typography>
);

const SummaryItem = ({ title, value, currency, isTotal }: { title: string | JSX.Element; value: number; currency: string; isTotal?: boolean }) => {
    return (
        <Box
            sx={{
                gap: 1,
                display: "flex",
                flexWrap: "wrap",
                alignItems: "end",
                justifyContent: "space-between",
            }}
        >
            {typeof title === "string" && (
                <Typography
                    sx={{
                        fontWeight: 400,
                        fontSize: Constants.FONT_SIZE.SMALL_TEXT,
                        color: "#1C252E",
                    }}
                >
                    {title}
                </Typography>
            )}
            {typeof title !== "string" && title}
            <Box display="flex" gap={0.5}>
                <Typography
                    sx={({ palette: { info } }) => ({
                        fontWeight: isTotal ? 600 : 400,
                        fontSize: isTotal ? "1.25rem" : Constants.FONT_SIZE.SMALL_TEXT,
                        color: isTotal ? info.main : "#1C252E",
                    })}
                >
                    {Helpers.formatCurrency(value || 0)}
                </Typography>
                <Typography
                    sx={({ palette: { info } }) => ({
                        fontWeight: isTotal ? 600 : 400,
                        fontSize: isTotal ? "1.25rem" : Constants.FONT_SIZE.SMALL_TEXT,
                        color: isTotal ? info.main : "#1C252E",
                        textDecoration: "underline",
                    })}
                >
                    {Helpers.getCurrency(currency)}
                </Typography>
            </Box>
        </Box>
    );
};

const PaymentMethodItem = ({
    item,
    paymentMethod,
    onClick,
}: {
    item: ICodename;
    paymentMethod: PaymentType;
    onClick: (e: React.MouseEvent<HTMLDivElement>, value: PaymentType) => void;
}) => {
    return (
        <Box
            sx={{
                gap: "6px",
                p: 1.5,
                width: "100%",
                display: "flex",
                minHeight: "66px",
                borderRadius: 3,
                alignItems: "center",
                backgroundColor: "#FFFFFF",
                border: `1px solid ${paymentMethod === Number(item.code) ? "#1E97DE" : "#d2d2d2"}`,
                // "&:hover": {
                //     cursor: "pointer",
                //     border: "1px solid #1E97DE",
                // },
            }}
            onClick={(e) => {
                if (paymentMethod !== item.code) {
                    onClick(e, Number(item.code));
                }
            }}
        >
            <Radio
                color="info"
                sx={{ padding: 0 }}
                key={paymentMethod}
                checked={paymentMethod === item.code}
                onChange={(e) => {
                    // e.stopPropagation();
                    // handlePricing(Number(item.code));
                }}
            />
            <Image
                width={44}
                height={32}
                quality={1}
                sizes="100vw"
                src={item?.detail?.logo}
                alt={item?.detail?.logo}
                style={{
                    borderRadius: "4px",
                    border: "1px #E4EBF7 solid",
                }}
            />
            <Typography variant="button">{item.name}</Typography>
        </Box>
    );
};

export default CardOrderSummary;
