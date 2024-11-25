import { ConfirmStatus, ConfirmStatusBooking, ItineraryDetailFinalDisplayStatus, ItineraryType, OrderStatus, PaymentStatus, RequestType, Status, TripTabs } from "./enum";
import {
    IFlightExtraInformation,
    IFlightItineraryDetailBookingDetailExtraInfo,
    IHotelExtraInformation,
    IItinerary,
    IItineraryDetail,
    IItineraryMember,
    IOrder,
    IssueTicketInfo,
    IUser,
} from "./interfaces";
import { ITineraryGetListDetailResponse } from "@src/services/booking/ItineraryService";
import Helpers from "./helpers";
import moment from "moment";
import { IEmployee } from "@deeptech/flight-components";

export type IItineraryPrice =  { value: number; currency: string; serviceFee: number }
const itinerary = {
    isItineraryEditable: function (itinerary: IItinerary) {
        return true;
    },
    isItineraryRejected: function (itinerary: IItinerary) {
        return itinerary.confirmStatus === ConfirmStatus.Rejected;
    },
    isItineraryCanceled: function (itinerary: IItinerary) {
        return itinerary.confirmStatus === ConfirmStatus.Cancel;
    },
    isItineraryDeletable: function (rawItinerary: IItinerary) {
        if (rawItinerary.itineraryDetails?.length === 0) {
            return true;
        }
        if (rawItinerary.itineraryDetails?.every((detail) => this.isItineraryDetailDraft(detail))) {
            return true;
        }
        return false;
    },
    isItineraryHasSendAnyApprovalRequest: function (itinerary: IItinerary) {
        return itinerary.itineraryDetails?.some(
            (detail) => this.isItineraryDetailWaitForApprovalResponse(detail) || this.isItineraryDetailReadyForCheckout(detail)
        );
    },
    isItineraryHasAnyCompletedPayment: (itinerary: IItinerary) => {
        return itinerary.itineraryDetails?.some((detail) => detail.paymentStatus === PaymentStatus.Completed);
    },
    getProcessedTrips: function (itinerary: IItinerary[], tab: TripTabs) {
        let filterHandler: ((detail: IItineraryDetail) => boolean) | undefined = undefined;
        if (TripTabs.Draft === tab) {
            filterHandler = (detail) =>
                this.isItineraryDetailDraft(detail) ||
                this.isItineraryDetailWaitForApprovalResponse(detail) ||
                this.isItineraryDetailReadyForCheckout(detail);
        }
        if (TripTabs.Now === tab) {
            const startTime = moment().startOf("day").unix();
            filterHandler = (detail) => this.isItineraryDetailCompleted(detail) && moment(parseInt(detail.startTime.toString()) * 1000).startOf("day").unix() === startTime;
        }
        if (TripTabs.Future === tab) {
            const startTime = moment().add(1, "day").startOf("days").unix();
            filterHandler = (detail) => this.isItineraryDetailCompleted(detail) && parseInt(detail.startTime) > startTime;
        }
        if (TripTabs.Past === tab) {
            const endTime = moment().subtract(1, "day").endOf("days").unix();
            filterHandler = (detail) => this.isItineraryDetailCompleted(detail) && parseInt(detail.endTime) < endTime;
        }
        if (TripTabs.Rejected === tab) {
            filterHandler = (detail) => this.isItineraryDetailRejected(detail) || this.isItineraryDetailStatusCanceled(detail) || this.isItineraryDetailConfirmStatusCanceled(detail);
        }

        return itinerary.map((itinerary) => {
            let filteredSequencesSet = new Set<number>();
            if (itinerary.itineraryDetails && filterHandler) {
                itinerary.itineraryDetails.forEach(detail => {
                    if (filterHandler(detail)) {
                        filteredSequencesSet.add(detail.sequence);
                    }
                })

                itinerary.itineraryDetails = itinerary.itineraryDetails.filter(detail => filteredSequencesSet.has(detail.sequence));
                return itinerary;
            }
            return itinerary;
        });
    },
    getItineraryDetailPriceGroupBySequence: function (itineraryDetails: IItineraryDetail[]) {
        return itineraryDetails.reduce((acc, item) => {
            const key = item.sequence;
            const extraInfo = JSON.parse(item.extraInfo);

            const estimateAmount = item.estimateAmount;
            const estimateQuantity = item.estimateQuantity;
            // const amountBooking = Number(item.amountBooking || 0) || Number(item.estimateAmount || 0);
            const serviceFee = Number(item.serviceFee || 0);
            // const calculatedPrice = estimateAmount * estimateQuantity;
            const calculatedPrice = item.estimateAmount;

            if (item.type === ItineraryType.Hotel) {
                const newExtra: IHotelExtraInformation = Helpers.toCamelCaseObj(extraInfo);

                acc.set(key, {
                    value: calculatedPrice,
                    serviceFee: serviceFee,
                    currency: newExtra.currency,
                });

                acc.set("total", {
                    value: Number(acc.get("total")?.value || 0) + calculatedPrice,
                    serviceFee: Number(acc.get("total")?.serviceFee || 0) + Math.max(serviceFee, 0),
                    currency: newExtra.currency,
                });
            }

            if (item.type === ItineraryType.Flight) {
                const newExtra: IFlightExtraInformation = Helpers.toCamelCaseObj(extraInfo);

                acc.set(key, {
                    value: Number(acc.get(key)?.value || 0) + calculatedPrice,
                    serviceFee: Number(acc.get(key)?.serviceFee || 0) + serviceFee,
                    currency: newExtra.currency || "",
                });

                acc.set("total", {
                    value: Number(acc.get("total")?.value || 0) + calculatedPrice || 0,
                    serviceFee: Number(acc.get("total")?.serviceFee || 0) + Math.max(serviceFee, 0),
                    currency: acc.get("total")?.currency || "",
                });
            }

            return acc;
        }, new Map<number | "total", IItineraryPrice>());
    },
    getItineraryDetailPrice: function (item: IItineraryDetail): IItineraryPrice {
        const extraInfo = JSON.parse(item.extraInfo);

        const amountBooking = Number(item.amountBooking || 0) || Number(item.estimateAmount || 0);
        const serviceFee = Number(item.serviceFee || 0);
        // const calculatedPrice = estimateAmount * estimateQuantity;
        const calculatedPrice = amountBooking;

        if (item.type === ItineraryType.Hotel) {
            const newExtra: IHotelExtraInformation = Helpers.toCamelCaseObj(extraInfo);

            return {
                value: calculatedPrice,
                serviceFee: serviceFee,
                currency: newExtra.currency,
            };
        }

        if (item.type === ItineraryType.Flight) {
            const newExtra: IFlightExtraInformation = Helpers.toCamelCaseObj(extraInfo);

            return {
                value: calculatedPrice,
                serviceFee: serviceFee,
                currency: newExtra.currency || "",
            };
        }

        return {
            value: 0,
            serviceFee: 0,
            currency: "VND",
        };
    },
    getPriceText: (param?: { value: number | undefined; currency?: string }) => {
        const { value: price, currency } = param || {};
        let outArray = [];
        currency ? outArray.push(currency) : null;
        price ? outArray.push(Helpers.formatCurrency(price)) : 0;
        return outArray.join(" ");
    },

    isItineraryDetailDraft: (itineraryDetail: IItineraryDetail) => {
        if (itineraryDetail.paymentStatus === PaymentStatus.New) {
            if (BookingHelpers.isItineraryDetailNeedApprove(itineraryDetail)) {
                return itineraryDetail.confirmStatus === ConfirmStatus.Pending;
            }

            return itineraryDetail.confirmStatus === ConfirmStatus.Completed;
        }

        return false;
    },
    isItineraryDetailWaitForApprovalResponse: (itineraryDetail: IItineraryDetail) => {
        const isProcessingOrConfirmed = (data: { confirmStatus: ConfirmStatus }) =>
            data.confirmStatus === ConfirmStatus.Processing || data.confirmStatus === ConfirmStatus.Confirmed;
        // const isItinerraryDetailMembersWaitForApprovalResponse = (itineraryDetail: IItineraryDetail) => {
        //     return itineraryDetail.itineraryMembers.some(member => isProcessingOrConfirmed(member));
        // }
        return isProcessingOrConfirmed(itineraryDetail);
    },
    isAllItineraryMemberCompletelyApproved: (members: IItineraryMember[]) =>
        members.length >= 1 ? members?.every((member) => member.confirmStatus === ConfirmStatus.Completed) : true,
    isItineraryDetailReadyForCheckout: function (itineraryDetail: IItineraryDetail | ITineraryGetListDetailResponse) {
        const members = (itineraryDetail.itineraryMembers as ITineraryGetListDetailResponse["itineraryMembers"]) || [];
        return (
            itineraryDetail.confirmStatus === ConfirmStatus.Completed &&
            this.isAllItineraryMemberCompletelyApproved(members) &&
            itineraryDetail.paymentStatus === PaymentStatus.New
        );
    },
    isItineraryDetailRejected: function (itineraryDetail: IItineraryDetail) {
        return (
            itineraryDetail.confirmStatus === ConfirmStatus.Rejected ||
            itineraryDetail.itineraryMembers?.every((member) => member.confirmStatus === ConfirmStatus.Rejected)
        );
    },
    isItineraryDetailStatusCanceled: function (itineraryDetail: IItineraryDetail) {
        return itineraryDetail.status === Status.Cancel;
    },
    isItineraryDetailConfirmStatusCanceled: function (itineraryDetail: IItineraryDetail) {
        return (
            itineraryDetail.confirmStatus === ConfirmStatus.Cancel ||
            itineraryDetail.paymentStatus === PaymentStatus.Refunded ||
            itineraryDetail.paymentStatus === PaymentStatus.WaitingRefund ||
            itineraryDetail.itineraryMembers?.every((member) => member.confirmStatus === ConfirmStatus.Cancel)
        );
    },
    isItineraryDetailCompleted: function (itineraryDetail: IItineraryDetail, orders?: IOrder[]) {
        if (!orders)
            return (
                itineraryDetail.confirmStatus === ConfirmStatus.Completed &&
                this.isAllItineraryMemberCompletelyApproved((itineraryDetail.itineraryMembers ?? []) as any[]) &&
                // TODO: remove when no longer use paymentStatus 12
                // @ts-ignore
                (itineraryDetail.paymentStatus === PaymentStatus.Completed || itineraryDetail.paymentStatus === 12)
            );

        const orderId = itineraryDetail.orderId;
        return orderId ? orders.some((order) => order.id === orderId && order.orderStatus === OrderStatus.Completed) : false;
    },
    isItineraryDetailDeletable: function (itineraryDetail: IItineraryDetail) {
        switch (itineraryDetail.paymentStatus) {
            case PaymentStatus.Completed:
            case PaymentStatus.Issued:
            case PaymentStatus.WaitingRefund:
            case PaymentStatus.RefundProcessing:
            case PaymentStatus.RefundFailed:
            case PaymentStatus.Refunded:
                return false;
        }
        if (this.isItineraryDetailStatusCanceled(itineraryDetail) || this.isItineraryDetailRejected(itineraryDetail)) {
            return true;
        }

        if (this.isItineraryDetailNeedApprove(itineraryDetail)) {
            if (this.isItineraryDetailReadyForCheckout(itineraryDetail) || this.isItineraryDetailWaitForApprovalResponse(itineraryDetail)) {
                return false;
            }
        }

        if (itineraryDetail.type === ItineraryType.Flight) {
            if (flightItineraryDetail.getFlightBookingCode(itineraryDetail)) {
                return false;
            }
        }
        return true;
    },
    isItineraryDetailReselectable: function (itineraryDetail: IItineraryDetail) {
        switch (itineraryDetail.paymentStatus) {
            case PaymentStatus.Completed:
            case PaymentStatus.Issued:
            case PaymentStatus.WaitingRefund:
            case PaymentStatus.RefundProcessing:
            case PaymentStatus.RefundFailed:
            case PaymentStatus.Refunded:
                return false;
        }

        if (this.isItineraryDetailStatusCanceled(itineraryDetail) || this.isItineraryDetailRejected(itineraryDetail)) {
            return false;
        }

        if (this.isItineraryDetailNeedApprove(itineraryDetail)) {
            if (this.isItineraryDetailReadyForCheckout(itineraryDetail) || this.isItineraryDetailWaitForApprovalResponse(itineraryDetail)) {
                return false;
            }
        }

        if (itineraryDetail.type === ItineraryType.Flight) {
            if (flightItineraryDetail.getFlightBookingCode(itineraryDetail)) {
                return false;
            }
        }

        return true;
    },

    isItineraryDetailBookingExpired: function (itemBooking?: IItineraryDetail) {
        if (!itemBooking) {
            return false;
        }
        
        if (itemBooking.paymentStatus < PaymentStatus.Completed) {
            if (itemBooking.type === ItineraryType.Flight) {
                return flightItineraryDetail.isFlightBookingExpired(itemBooking);
            }
        }

        return false;
    },
    isItineraryDetailSelectable: function (itineraryDetail: IItineraryDetail) {
        let base = true;
        if (itineraryDetail.type === ItineraryType.Flight) {
            base = base && flightItineraryDetail.isFlightBookingSelectable(itineraryDetail);
        }

        if (this.isItineraryDetailCompleted(itineraryDetail) || this.isItineraryDetailWaitForApprovalResponse(itineraryDetail)) {
            return false;
        }
        return (this.isItineraryDetailDraft(itineraryDetail) || this.isItineraryDetailReadyForCheckout(itineraryDetail)) && base;
    },
    isItineraryDetailNeedApprove: function (itineraryDetail: IItineraryDetail) {
        return itineraryDetail.needApprove === RequestType.NeedApprove;
    },
    isItineraryDetailBookingTicketIssued: function (itineraryDetail: IItineraryDetail) {
        return itineraryDetail.confirmStatusBooking === ConfirmStatusBooking.Completed;
    },
    getNumberOfDistinctItineraryDetailSequence: function (details: IItineraryDetail[]) {
        const set = new Set<number>();
        details.forEach((d) => set.add(d.sequence));
        return set.size;
    },
    getItineraryDetailFinalDisplayStatus: function (itineraryDetail: IItineraryDetail): ItineraryDetailFinalDisplayStatus {
        let finalStatus = ItineraryDetailFinalDisplayStatus.DRAFT_NEED_APPROVAL;
        if (BookingHelpers.isItineraryDetailStatusCanceled(itineraryDetail)) {
            finalStatus = ItineraryDetailFinalDisplayStatus.CANCELED;
        } else {
            switch (itineraryDetail.paymentStatus) {
                case PaymentStatus.New:
                    if (BookingHelpers.isItineraryDetailBookingExpired(itineraryDetail)) {
                        finalStatus = ItineraryDetailFinalDisplayStatus.EXPIRED;
                        return finalStatus;
                    }

                    if (BookingHelpers.isItineraryDetailNeedApprove(itineraryDetail)) {
                        finalStatus = ItineraryDetailFinalDisplayStatus.DRAFT_NEED_APPROVAL;

                        if (BookingHelpers.isItineraryDetailReadyForCheckout(itineraryDetail)) {
                            finalStatus = ItineraryDetailFinalDisplayStatus.READY_TO_CHECKOUT;
                        }
                        if (BookingHelpers.isItineraryDetailStatusCanceled(itineraryDetail)) {
                            finalStatus = ItineraryDetailFinalDisplayStatus.CONFIRM_STATUS_CANCELED;
                        }
                        if (BookingHelpers.isItineraryDetailRejected(itineraryDetail)) {
                            finalStatus = ItineraryDetailFinalDisplayStatus.REJECTED;
                        }
                        if (BookingHelpers.isItineraryDetailWaitForApprovalResponse(itineraryDetail)) {
                            finalStatus = ItineraryDetailFinalDisplayStatus.WAIT_FOR_APPROVAL;
                        }
                    } else {
                        finalStatus = ItineraryDetailFinalDisplayStatus.DRAFT;
                    }
                    break;

                case PaymentStatus.Completed:
                case PaymentStatus.Issued:
                    finalStatus = ItineraryDetailFinalDisplayStatus.COMPLETED;
                    break;

            }
        }
    
        return finalStatus;
    },
    getItineraryDetailColorAndTextFinalDisplayStatus: function (itineraryDetail: IItineraryDetail) {
        const status = this.getItineraryDetailFinalDisplayStatus(itineraryDetail);
        if (status === ItineraryDetailFinalDisplayStatus.CANCELED || status === ItineraryDetailFinalDisplayStatus.CONFIRM_STATUS_CANCELED) {
            return {
                textColor: "#B71D18",
                backgroundColor: "#FFE5DF",
                text: "Đã hủy",
            };
        }
        if (status === ItineraryDetailFinalDisplayStatus.EXPIRED) {
            return {
                textColor: "#B71D18",
                backgroundColor: "#FFE5DF",
                text: "Đã hủy",
            };
        }
        if (status === ItineraryDetailFinalDisplayStatus.COMPLETED) {
            return {
                textColor: "#1E97DE",
                backgroundColor: "#E4EBF7",
                text: "Đã thanh toán",
            };
        }
        if (status === ItineraryDetailFinalDisplayStatus.REJECTED) {
            return {
                textColor: "#B71D18",
                backgroundColor: "#FFE5DF",
                text: "Từ chối",
                showTooltip: true,
            };
        }
        if (status === ItineraryDetailFinalDisplayStatus.DRAFT) {
            return {
                textColor: "#637381",
                backgroundColor: "#E9E9E9",
                text: "Nháp",
            };
        }

        if (status === ItineraryDetailFinalDisplayStatus.READY_TO_CHECKOUT) {
            return {
                textColor: "#0F8D57",
                backgroundColor: "#DAEFE0",
                text: "Đã duyệt",
                showTooltip: true,
            };
        }
        if (status === ItineraryDetailFinalDisplayStatus.WAIT_FOR_APPROVAL) {
            return {
                textColor: "#1C252E",
                backgroundColor: "#FFF7E5",
                text: "Chờ duyệt",
                showTooltip: true,
            };
        }

        return {
            textColor: "#637381",
            backgroundColor: "#E9E9E9",
            text: "Nháp",
        };
    },
};

const flightItineraryDetail = {
    isFlightBookingExpired: function (itemBooking?: IItineraryDetail) {
        if (!itemBooking) {
            return false;
        }

        const detailExtraInfos = itemBooking.detailExtraInfos;
        // chưa có booking
        if (!detailExtraInfos || !detailExtraInfos[0]) {
            return false;
        }

        let extraInfoData: IFlightItineraryDetailBookingDetailExtraInfo | undefined;
        try {
            if (detailExtraInfos[0].extraInfo) {
                extraInfoData = JSON.parse(detailExtraInfos[0].extraInfo);
            }
        } catch (error) {}
        if (extraInfoData === undefined) {
            return false;
        }

        const lastTicketDate = extraInfoData.LastTicketDate; // utc time with format DD/MM/YYYY HH:mm
        if (!lastTicketDate) {
            return false;
        }

        const lastTicketDateMoment = moment.utc(lastTicketDate, "DD/MM/YYYY HH:mm");
        const now = moment.utc();
        return lastTicketDateMoment.isBefore(now);
    },
    isFlightBookingSelectable: function (itemBooking?: IItineraryDetail) {
        return itemBooking ? !this.isFlightBookingExpired(itemBooking) : true;
    },
    getFlightBookingExtraInfoParsed: function (itineraryDetail: IItineraryDetail): IFlightItineraryDetailBookingDetailExtraInfo | null {
        const extraInfo = itineraryDetail.detailExtraInfos?.[0].extraInfo;
        if (extraInfo) {
            return Helpers.converStringToJson(extraInfo);
        } else {
            return null;
        }
    },

    getFlightBookingIssueTicketInfoInExtraInfoParsed: function (bookingExtraInfoParsed: IFlightItineraryDetailBookingDetailExtraInfo): IssueTicketInfo | null {
        const issueTicketInfo = bookingExtraInfoParsed?.IssueTicketInfo;
        if (issueTicketInfo) {
            return Helpers.converStringToJson(issueTicketInfo);
        } else {
            return null;
        }
    },
    getFlightBookingCode: function (itineraryDetail: IItineraryDetail) {
        const detailExtraInfo = itineraryDetail.detailExtraInfos?.[0];
        return detailExtraInfo?.bookingCode ?? undefined;
    },
    getFlightReservationCode: function (itineraryDetail: IItineraryDetail) {
        const extraInfo = this.getFlightBookingExtraInfoParsed(itineraryDetail);
        if (
            extraInfo &&
            itineraryDetail?.confirmStatus === ConfirmStatus.Completed &&
            itineraryDetail?.paymentStatus >= PaymentStatus.Completed &&
            itineraryDetail?.paymentStatus < PaymentStatus.WaitingRefund
        ) {
            const issueTicketInfo = this.getFlightBookingIssueTicketInfoInExtraInfoParsed(extraInfo);
            const newReservationCode = issueTicketInfo?.Booking?.Itineraries?.[0]?.reservation_code;
            return newReservationCode;
        }
        return undefined;
    },
    getFlightLastTicketDateUnix: function (itineraryDetail: IItineraryDetail): number | undefined {
        const extraInfo = this.getFlightBookingExtraInfoParsed(itineraryDetail);
        const lastTicketDate = extraInfo?.LastTicketDate;
        if (lastTicketDate) {
            const valueConver = Helpers.convertDDMM_To_MMDD(lastTicketDate);
            const newValue = moment.utc(valueConver).unix() * 1000;
            return newValue;
        }
        return undefined;
    },

    convertItineraryMembersToIEmployees: function (members: IItineraryMember[], users: IUser[]) {
        return members.map((member) => {
            const userId = member.userId;
            const user = users.find((user) => user.id === userId);
            return {
                id: userId,
                name: user ? [user?.organizationUserProfile?.lastName || "", user?.organizationUserProfile?.firstName || ""].join(" ").trim() : member.fullname,
                avatarUrl: "",
            };
        }) as IEmployee[];
    },
    convertUsersToIEmployees: function (users?: IUser[]) {
        if (!users) {
            return [];
        }
        return users?.map((user) => {
            return {
                id: user.id,
                name: [user?.organizationUserProfile?.lastName || "", user?.organizationUserProfile?.firstName || ""].join(" ").trim(),
                avatarUrl: "",
            };
        }) as IEmployee[];
    }
};

const message = {
    getMessageErrorByMesCode: (mesCode: string) => {
        switch (mesCode) {
            case "INVALID_PASSPORT":
                return "Passport không hợp lệ";
            case "FLIGHT_SOLD_OUT":
                return "Rất tiếc, vé chuyến bay bạn chọn đã bán hết";
            case "INVALID_DATE_OF_BIRTH":
                return "Hành khách có ngày sinh không hợp lệ, vui lòng kiểm tra lại thông tin";
            case "INVALID_DATE_FORMAT":
                return "Ngày không hợp lệ, vui lòng kiểm tra lại thông tin";
            default:
                return "Đã có phát sinh lỗi trong quá trình xử lý, vui lòng thử lại sau. Xin lỗi vì đã gây bất tiện.";
        }
    },
};
const time = {
    getFormatTimeWeekDay: function (time: number){
        return Helpers.formatDateName(time, "vi").concat(", ", moment(time).format("DD/MM/YYYY"));
    },
    getFormatTimeShortenWeekDay: function (time: number){
        return moment(time).format("ddd, DD/MM/YYYY").toUpperCase();
    },
    getFormatTimeHHmmDDMMYYYY: function (time: number){
        return moment(time).format("HH:mm DD/MM/YYYY");
    },
}

export const BookingHelpers = {
    ...itinerary,
    ...flightItineraryDetail,

    ...message,
    ...time,
};
