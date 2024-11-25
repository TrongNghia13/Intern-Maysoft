import { Box, Typography } from "@maysoft/common-component-react";
import { CheckCircle, East, Info, RadioButtonUnchecked } from "@mui/icons-material";
import { ConfirmStatus, ItineraryType, PaymentStatus } from "@src/commons/enum";
import Helpers from "@src/commons/helpers";
import { IFlightExtraInformation, IItineraryDetail } from "@src/commons/interfaces";
import Constants from "@src/constants";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import ItineraryDetailStatus from "./ItineraryDetailStatus";

import { IconButton, Tooltip } from "@mui/material";
import { BookingHelpers, IItineraryPrice } from "@src/commons/bookingHelpers";
import useCheckIssueTicket from "@src/hooks/trips/helpersCheckIssueTicket";
import { useTimelineContext } from "@src/providers/timelineProvider";
import FlightService from "@src/services/booking/FlightService";
import ItineraryService from "@src/services/booking/ItineraryService";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";

export type IPaymentButton = {
    itineraryPrice?: IItineraryPrice;
    renderHeaderActions?: (item: IItineraryDetail) => React.ReactNode;
};

const Title = ({ value }: { value: string }) => (
    <Typography
        sx={{
            fontSize: "1rem",
            fontWeight: 600,
            color: "#1C252E",
        }}
    >
        {value}
    </Typography>
);

export const TimelineHeader = ({
    detail,
    onSelect,
    onReselect,
    onDelete,
    onShare,
    onBooking,
    onAddMembers,
    onCallBack,
    isSelected,
    itineraryPrice = {
        currency: "VND",
        serviceFee: 0,
        value: 0,
    },
    renderHeaderActions,
}: {
    isSelected: boolean;
    detail: IItineraryDetail;
    onSelect?: () => void;
    onReselect?: () => void;
    onDelete?: () => void;
    onShare?: () => void;
    onBooking?: () => void;
    onAddMembers?: () => void;
    onCallBack: () => void;
} & IPaymentButton) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const extraInfo = Helpers.converStringToJson(detail?.extraInfo);

    const { itineraryDetails, reservationCode, setReservationCode } = useTimelineContext();

    const { handleCheckIssueTicketByItineraryDetails } = useCheckIssueTicket();

    const data: IFlightExtraInformation = Helpers.toCamelCaseObj(extraInfo);

    const isHotelBookingItem = detail?.type === ItineraryType.Hotel;

    // const [reservationCode, setReservationCode] = useState("");

    const bookingCode = useMemo(() => BookingHelpers.getFlightBookingCode(detail), [detail]);

    const extraInfos = useMemo(() => BookingHelpers.getFlightBookingExtraInfoParsed(detail), [detail]);

    const lastTicketDateText = useMemo(() => {
        const lastTicketDate = BookingHelpers.getFlightLastTicketDateUnix(detail);
        if (lastTicketDate) {
            const deeptechFormat = BookingHelpers.getFormatTimeHHmmDDMMYYYY(lastTicketDate);
            return lastTicketDate <= moment().unix() * 1000 ? "Hết hạn thanh toán" : `Cần thanh toán trước: ${deeptechFormat || ""}`;
        }
        return null;
    }, [detail]);

    useEffect(() => {
        if (detail) {
            setReservationCode(BookingHelpers.getFlightReservationCode(detail));
        }
    }, [detail]);

    const [count, setCount] = useState<number>(3);

    useEffect(() => {
        if (
            !Helpers.isNullOrEmpty(bookingCode) &&
            detail?.confirmStatus === ConfirmStatus.Completed &&
            detail?.paymentStatus >= PaymentStatus.Completed &&
            detail?.paymentStatus < PaymentStatus.WaitingRefund &&
            (Helpers.isNullOrEmpty(extraInfos?.IssueTicketInfo) ||
                Helpers.converStringToJson(extraInfos?.IssueTicketInfo)?.error_code === "PENDING_TICKET")
        ) {
            setCount(3);
        } else {
            setCount(0);
        }
    }, [bookingCode, extraInfos?.IssueTicketInfo, detail?.paymentStatus, detail?.confirmStatus]);

    useEffect(() => {
        if (count > 0) {
            let newRetryInterval = setInterval(() => {
                retryGetReservationCode();
            }, 60 * 1000);
            return () => clearInterval(newRetryInterval);
        }
    }, [count]);

    const retryGetReservationCode = async () => {
        try {
            const newResult = await getReservationCode(bookingCode || "");

            if (Helpers.isNullOrEmpty(newResult)) {
                setCount((prev) => Number(prev) - 1);
            } else {
                if (newResult?.status === "cancelled") {
                    setCount(0);
                    Helpers.showAlert("Xuất vé thất bại, vui lòng chọn lại chuyến bay khác!", "error", () => {
                        onCallBack && onCallBack();
                    });
                } else if (newResult?.status === "in-progress") {
                    setCount(0);

                    !Helpers.isNullOrEmpty(newResult?.reservationCode) && setReservationCode(newResult?.reservationCode);

                    const resultGetDetail = await ItineraryService.detail(detail?.itineraryId);

                    if (!Helpers.isNullOrEmpty(resultGetDetail?.id) && [...(resultGetDetail?.itineraryDetails || [])].length > 0) {
                        await handleCheckIssueTicketByItineraryDetails({
                            itineraryId: resultGetDetail?.id,
                            confirmStatus: resultGetDetail?.confirmStatus,
                            itineraryDetails: [...(resultGetDetail?.itineraryDetails || [])],
                            onCallBack: () => onCallBack && onCallBack(),
                        });
                    }
                } else {
                    setCount(0);
                    !Helpers.isNullOrEmpty(newResult?.reservationCode) && setReservationCode(newResult?.reservationCode);
                }
            }
        } catch (error) {
            setCount((prev) => Number(prev) - 1);
        }
    };

    const getReservationCode = async (
        codeBooking: string
    ): Promise<
        | {
              reservationCode?: string;
              status?: "in-progress" | "cancelled" | "completed";
          }
        | undefined
    > => {
        try {
            const result = await FlightService.retrieveBooking(codeBooking);

            if (result?.booking?.status === "in-progress" && !Helpers.isNullOrEmpty(result?.booking?.itineraries?.[0]?.reservation_code)) {
                return {
                    status: "in-progress",
                    reservationCode: result?.booking?.itineraries?.[0]?.reservation_code,
                };
            } else if (["failed", "expired", "cancelled"].includes(result?.booking?.status)) {
                return {
                    status: "cancelled",
                    reservationCode: "",
                };
            } else {
                return {
                    status: "completed",
                    reservationCode: result?.booking?.itineraries?.[0]?.reservation_code,
                };
            }
        } catch (error) {
            return undefined;
        }
    };

    if (Helpers.isNullOrEmpty(extraInfo)) return null;

    return (
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
            <Box display="grid" gap={1} width="100%">
                <Box
                    sx={{
                        gap: 1,
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Box
                        sx={{
                            gap: 1,
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                        }}
                    >
                        <Title value={data?.departPlaceObj?.name} />
                        <East />
                        <Title value={data?.arrivalPlaceObj?.name} />
                        <ItineraryDetailStatus
                            item={detail}
                            itineraryDetails={itineraryDetails.filter((el) => el.sequence === detail?.sequence) || []}
                        />
                    </Box>
                </Box>

                {!Helpers.isNullOrEmpty(detail?.detailExtraInfos) && (
                    <Box
                        sx={{
                            gap: 1,
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        {bookingCode && (
                            <Box gap={1} display={"flex"} alignItems={"center"}>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <Typography
                                        sx={{
                                            fontWeight: 400,
                                            fontSize: Constants.FONT_SIZE.SMALL_TEXT,
                                            color: "#637381",
                                        }}
                                    >
                                        Booking Code:
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontWeight: 400,
                                            fontSize: Constants.FONT_SIZE.SMALL_TEXT,
                                            color: "#637381",
                                        }}
                                    >
                                        {bookingCode}
                                    </Typography>
                                </Box>
                                {lastTicketDateText && detail?.paymentStatus < PaymentStatus.Completed && (
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Info sx={({ palette: { error } }) => ({ color: error.main })} />
                                        <Typography
                                            sx={({ palette: { error } }) => ({
                                                fontWeight: 400,
                                                fontSize: Constants.FONT_SIZE.SMALL_TEXT,
                                                color: error.main,
                                            })}
                                        >
                                            {lastTicketDateText}
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        )}

                        {/* {detail?.confirmStatus === ConfirmStatus.Completed &&
                        detail?.paymentStatus >= PaymentStatus.Completed &&
                        detail?.paymentStatus < PaymentStatus.WaitingRefund && (
                            <Typography variant="button" fontWeight="bold">
                                {!Helpers.isNullOrEmpty(reservationCode) && `Mã đặt chỗ: ${reservationCode || ""}`}
                                {Helpers.isNullOrEmpty(reservationCode) && <Typography variant="button">{"Chưa xác định"}</Typography>}
                            </Typography>
                        )} */}
                    </Box>
                )}
            </Box>
            <Box display="flex" gap={1} alignItems="center">
                {onDelete && (
                    <Tooltip title="Xóa">
                        <IconButton color="error" onClick={onDelete}>
                            <Delete />
                        </IconButton>
                    </Tooltip>
                )}
                {/* {onAddMembers && Helpers.isNullOrEmpty(itemBooking.orderId) && (
                        <Tooltip title="Thêm thành viên">
                            <IconButton color="success" onClick={onAddMembers}>
                                <PersonAdd />
                            </IconButton>
                        </Tooltip>
                    )} */}

                {onReselect && (
                    <Tooltip title="Chọn lại">
                        <IconButton color="secondary" onClick={onReselect}>
                            <Edit />
                        </IconButton>
                    </Tooltip>
                )}

                {onSelect && (
                    <Tooltip title={isSelected ? "Bỏ chọn" : "Chọn"}>
                        <IconButton onClick={onSelect}>{isSelected ? <CheckCircle color="info" /> : <RadioButtonUnchecked />}</IconButton>
                    </Tooltip>
                )}

                {renderHeaderActions && (
                    <>
                        <Box display="flex" flexDirection="column" justifyContent="right" textAlign="right">
                            <Typography
                                variant="caption"
                                sx={{
                                    color: "#637381",
                                    fontSize: Constants.FONT_SIZE.SMALL_TEXT,
                                }}
                            >
                                Tổng tiền
                            </Typography>
                            <Box display="flex" gap={0.5} textAlign="right">
                                <Typography
                                    sx={{
                                        fontSize: "1rem",
                                        fontWeight: 600,
                                    }}
                                >
                                    {Helpers.formatCurrency(itineraryPrice?.value + itineraryPrice?.serviceFee)}
                                </Typography>
                                <Typography
                                    fontWeight="bold"
                                    sx={{
                                        fontSize: "1rem",
                                        textDecoration: "underline",
                                        transform: "scale(0.75)",
                                    }}
                                >
                                    {Helpers.getCurrency(itineraryPrice.currency)}
                                </Typography>
                            </Box>
                        </Box>
                        <Box>{renderHeaderActions(detail)}</Box>
                    </>
                )}
            </Box>
        </Box>
    );
};

const Delete = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M7 21C6.45 21 5.97934 20.8043 5.588 20.413C5.19667 20.0217 5.00067 19.5507 5 19V6C4.71667 6 4.47934 5.904 4.288 5.712C4.09667 5.52 4.00067 5.28267 4 5C3.99934 4.71733 4.09534 4.48 4.288 4.288C4.48067 4.096 4.718 4 5 4H9C9 3.71667 9.096 3.47933 9.288 3.288C9.48 3.09667 9.71734 3.00067 10 3H14C14.2833 3 14.521 3.096 14.713 3.288C14.905 3.48 15.0007 3.71733 15 4H19C19.2833 4 19.521 4.096 19.713 4.288C19.905 4.48 20.0007 4.71733 20 5C19.9993 5.28267 19.9033 5.52033 19.712 5.713C19.5207 5.90567 19.2833 6.00133 19 6V19C19 19.55 18.8043 20.021 18.413 20.413C18.0217 20.805 17.5507 21.0007 17 21H7ZM10 17C10.2833 17 10.521 16.904 10.713 16.712C10.905 16.52 11.0007 16.2827 11 16V9C11 8.71667 10.904 8.47933 10.712 8.288C10.52 8.09667 10.2827 8.00067 10 8C9.71734 7.99933 9.48 8.09533 9.288 8.288C9.096 8.48067 9 8.718 9 9V16C9 16.2833 9.096 16.521 9.288 16.713C9.48 16.905 9.71734 17.0007 10 17ZM14 17C14.2833 17 14.521 16.904 14.713 16.712C14.905 16.52 15.0007 16.2827 15 16V9C15 8.71667 14.904 8.47933 14.712 8.288C14.52 8.09667 14.2827 8.00067 14 8C13.7173 7.99933 13.48 8.09533 13.288 8.288C13.096 8.48067 13 8.718 13 9V16C13 16.2833 13.096 16.521 13.288 16.713C13.48 16.905 13.7173 17.0007 14 17Z"
            fill="#9F9F9F"
        />
    </svg>
);

const Edit = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M4 21C3.71667 21 3.47933 20.904 3.288 20.712C3.09667 20.52 3.00067 20.2827 3 20V17.575C3 17.3083 3.05 17.054 3.15 16.812C3.25 16.57 3.39167 16.3577 3.575 16.175L16.2 3.575C16.4 3.39167 16.621 3.25 16.863 3.15C17.105 3.05 17.359 3 17.625 3C17.891 3 18.1493 3.05 18.4 3.15C18.6507 3.25 18.8673 3.4 19.05 3.6L20.425 5C20.625 5.18333 20.7707 5.4 20.862 5.65C20.9533 5.9 20.9993 6.15 21 6.4C21 6.66667 20.954 6.921 20.862 7.163C20.77 7.405 20.6243 7.62567 20.425 7.825L7.825 20.425C7.64167 20.6083 7.429 20.75 7.187 20.85C6.945 20.95 6.691 21 6.425 21H4ZM17.6 7.8L19 6.4L17.6 5L16.2 6.4L17.6 7.8Z"
            fill="#9F9F9F"
        />
    </svg>
);

export default TimelineHeader;
