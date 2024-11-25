import moment from "moment";
import { useDispatch } from "react-redux";
import { CheckIssueTicketResponse, TicketResponse, TicketHandlingAction } from "@deeptech/flight-components";

import Helpers from "@src/commons/helpers";
import ItineraryDetailService from "@src/services/booking/ItineraryDetailService";

import { IItineraryDetail } from "@src/commons/interfaces";
import { hideLoading, showLoading } from "@src/store/slice/common.slice";
import { AcceptChange, ConfirmStatus, PaymentStatus } from "@src/commons/enum";
import FlightService, { IChangeTime, IReqIssueTicket, ISegment } from "@src/services/booking/FlightService";



// #sonle
const useCheckIssueTicket = () => {

    const dispatch = useDispatch();


    const helpersCheckIssueTicketResponse = ({
        response,
        onCancel,
        onCheckFlightInfo,
        onConfirmItineraryChange,
    }: {
        response: TicketResponse,

        onCancel?: () => void,
        onCheckFlightInfo?: () => void,
        onConfirmItineraryChange?: (newItineraryChangeTime?: any[]) => void,
    }) => {
        const newResponseError = CheckIssueTicketResponse({ ticketResponse: response });

        const btnClose = newResponseError.footerButtons?.find((el: any) => ((el.action === TicketHandlingAction.CLOSE)));
        const btnCancel = newResponseError.footerButtons?.find((el: any) => ((el.action === TicketHandlingAction.CANCEL)));
        const btnCheck = newResponseError.footerButtons?.find((el: any) => ((el.action === TicketHandlingAction.CHECK_FLIGHT_INFO)));
        const btnConfirm = newResponseError.footerButtons?.find((el: any) => ((el.action === TicketHandlingAction.CONFIRM_ITINERARY_CHANGE)));

        if (btnConfirm) {
            if (btnCheck || btnCancel || btnClose) {
                let html: string | undefined = undefined;
                if ([...newResponseError?.content?.flightChange || []].length > 0) {
                    html = `<div style="padding: 16px; display: flex; flex-direction: column; gap: 8px;">
                            <div style="padding-bottom: 8px; display: flex; justify-content: center; align-items: center; font-size: 1rem">
                                <span>${newResponseError.content?.message}</span>
                            </div>
                            <div style="text-align: start">
                                <span>${"Giờ bay mới là:"}</span>
                            </div>
                       `;

                    [...newResponseError?.content?.flightChange || []].forEach(el => {
                        html = html + `<div style="display: grid; padding: 8px; text-align: start; background-color: #cdcdcd75; border-radius: 4px; margin-bottom: 16px">
                        <span style="font-weight: bold;line-height: 24px;">${el.departPlace} &#8594; ${el.arrivalPlace} ${el.carrierMarketing}${el.flightNumber}</span>
                        <span>${el.departDate} &nbsp;-&nbsp; ${el.arrivalDate}</span>
                        </div>`
                    });

                    html = html + `</div>`;
                }

                Helpers.showConfirmAlert(
                    newResponseError.content?.message || "N",
                    () => {
                        if (btnConfirm) {
                            onConfirmItineraryChange &&
                                onConfirmItineraryChange(newResponseError?.content?.flightChange)
                        }
                    },
                    () => {
                        if (btnClose) {
                            return;
                        }
                        if (btnCancel) {
                            onCancel && onCancel()
                        }
                        if (btnCheck) {
                            onCheckFlightInfo &&
                                onCheckFlightInfo()
                        }
                    },
                    btnConfirm?.label,
                    btnCancel?.label || btnCheck?.label,
                    html,
                    newResponseError?.levelModal,
                );
            }
        } else {
            Helpers.showAlert(
                newResponseError.content?.message || "",
                newResponseError?.levelModal || "error",
                () => {
                    if (btnClose) {
                        return;
                    }
                    if (btnCancel) {
                        onCancel && onCancel()
                    }
                    if (btnCheck) {
                        onCheckFlightInfo && onCheckFlightInfo()
                    }
                },
            );
        }
    };

    const handleCheckIssueTicketByItineraryDetails = (props: {
        itineraryId: string,
        confirmStatus: ConfirmStatus,
        itineraryDetails: IItineraryDetail[],
        onCallBack: () => void,
    }) => {
        [...props.itineraryDetails || []].forEach(item => {
            if (
                ([...item?.detailExtraInfos || []].length > 0)
                && (item?.confirmStatus !== ConfirmStatus.Cancel)
                && (item?.paymentStatus === PaymentStatus.Completed)
                && !Helpers.isNullOrEmpty(item?.detailExtraInfos?.[0]?.extraInfo)
            ) {
                const newExtraInfo = Helpers.converStringToJson(item?.detailExtraInfos?.[0]?.extraInfo || "");

                if (Helpers.isNullOrEmpty(newExtraInfo?.IssueTicketInfo)) {
                    return;
                } else {
                    const newIssueTicketInfo = Helpers.converStringToJson(newExtraInfo?.IssueTicketInfo || "");

                    if (newIssueTicketInfo?.is_success === false) {
                        if (Helpers.isNullOrEmpty(newIssueTicketInfo?.booking)) {
                            Helpers.showAlert(
                                "Xuất vé thất bại, vui lòng chọn lại chuyến bay khác!",
                                "error",
                                async () => {
                                    try {
                                        dispatch(showLoading());

                                        await ItineraryDetailService.cancel(item?.id);

                                        await props.onCallBack();

                                    } catch (error) {
                                        Helpers.handleException(error, dispatch);
                                    } finally {
                                        dispatch(hideLoading());
                                    }
                                },
                            );
                            return;
                        } else {
                            helpersCheckIssueTicketResponse({
                                response: {
                                    is_success: newIssueTicketInfo.is_success,
                                    error_code: newIssueTicketInfo.error_code,
                                    booking: newIssueTicketInfo?.booking,
                                },

                                async onCancel() {
                                    try {
                                        dispatch(showLoading());

                                        await ItineraryDetailService.cancel(item?.id);

                                        await props.onCallBack();

                                    } catch (error) {
                                        Helpers.handleException(error, dispatch);
                                    } finally {
                                        dispatch(hideLoading());
                                    }
                                },

                                async onCheckFlightInfo() {
                                    try {
                                        dispatch(showLoading());

                                        if (!Helpers.isNullOrEmpty(item?.detailExtraInfos?.[0]?.bookingCode)) {
                                            await FlightService.retrieveBooking(item?.detailExtraInfos?.[0]?.bookingCode as string);
                                        }

                                        await props.onCallBack();

                                    } catch (error) {
                                        Helpers.handleException(error, dispatch);
                                    } finally {
                                        dispatch(hideLoading());
                                    }
                                },

                                async onConfirmItineraryChange(newItineraryChangeTime) {
                                    onConfirmItineraryChange({
                                        itineraryId: props.itineraryId,
                                        onCallBack() { props.onCallBack(); },
                                        newItineraryChangeTime: newItineraryChangeTime || [],
                                        bookingCode: item?.detailExtraInfos?.[0]?.bookingCode || "",
                                        itineraryDetailId: item?.detailExtraInfos?.[0]?.itineraryDetailId || "",
                                    })
                                },
                            });
                            return;
                        }
                    } else {
                        return;
                    }
                }
            } else {
                return;
            }
        });
    };

    const onConfirmItineraryChange = async (props: {
        itineraryId: string,
        bookingCode: string,
        itineraryDetailId: string,
        newItineraryChangeTime: any[],

        onCallBack: () => void;
    }) => {
        try {
            dispatch(showLoading());

            const newDataChangeTime: IChangeTime[] = [];

            [...props?.newItineraryChangeTime || []].forEach(item => {
                const segment = [...item.segment || []].map(el => ({
                    index: el.index,
                    departDT: el.depart_date,
                    departDate: `${moment(Helpers.convertDDMM_To_MMDD(el.depart_date)).tz(el.depart_place_detail?.timezone).unix() * 1000}`,
                    arrivalDT: el.arrival_date,
                    arrivalDate: `${moment(Helpers.convertDDMM_To_MMDD(el.arrival_date)).tz(el.arrival_place_detail?.timezone).unix() * 1000}`,
                } as ISegment));

                newDataChangeTime.push({
                    leg: item.leg,
                    departDT: item.departDate,
                    arrivalDT: item.arrivalDate,
                    departDate: moment(Helpers.convertDDMM_To_MMDD(item.departDate)).tz(item.depart_place_detail?.timezone).unix() * 1000,
                    arrivalDate: moment(Helpers.convertDDMM_To_MMDD(item.arrivalDate)).tz(item.arrival_place_detail?.timezone).unix() * 1000,
                    segment: segment,
                });
            });

            const newReq: IReqIssueTicket = {
                itineraryId: props?.itineraryId,
                bookingCode: props?.bookingCode,
                itineraryDetailId: props?.itineraryDetailId,
                acceptChange: AcceptChange.Accept,
                changeTimes: newDataChangeTime,
            };

            await FlightService.issue(newReq);

        } catch (error) {
            Helpers.handleException(error, dispatch);
        } finally {
            props.onCallBack();
            dispatch(hideLoading());
        }
    };

    return {
        onConfirmItineraryChange,
        helpersCheckIssueTicketResponse,
        handleCheckIssueTicketByItineraryDetails,
    };
};
// #sonle

export default useCheckIssueTicket;