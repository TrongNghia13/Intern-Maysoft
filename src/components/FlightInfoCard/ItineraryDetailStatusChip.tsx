import { Typography } from "@maysoft/common-component-react";
import { BookingHelpers } from "@src/commons/bookingHelpers";
import { IItineraryDetail } from "@src/commons/interfaces";

export const ItineraryDetailStatusChip = ({ item }: { item: IItineraryDetail }) => {
    const { textColor, backgroundColor, text } = getColorAndText(item);

    return (
        <Typography
            variant="caption"
            sx={{
                px: 1.5,
                py: 0.75,
                fontSize: "0.75rem",
                fontWeight: 600,
                color: textColor,
                textAlign: "center",
                backgroundColor: backgroundColor,
                borderRadius: 1,
            }}
        >
            {text}
        </Typography>
    );
};

const getColorAndText = (item: IItineraryDetail) => {
    if (BookingHelpers.isItineraryDetailStatusCanceled(item)) {
        return {
            textColor: "#B71D18",
            backgroundColor: "#FFE5DF",
            text: "Đã hủy",
        };
    }
    if (BookingHelpers.isItineraryDetailCompleted(item)) {
        return {
            textColor: "#1E97DE",
            backgroundColor: "#E4EBF7",
            text: "Đã thanh toán",
        };
    }
    if (BookingHelpers.isItineraryDetailRejected(item)) {
        return {
            textColor: "#B71D18",
            backgroundColor: "#FFE5DF",
            text: "Từ chối",
        };
    }
    if (!BookingHelpers.isItineraryDetailNeedApprove(item)) {
        return {
            textColor: "#637381",
            backgroundColor: "#E9E9E9",
            text: "Nháp",
        };
    }

    if (BookingHelpers.isItineraryDetailReadyForCheckout(item)) {
        return {
            textColor: "#0F8D57",
            backgroundColor: "#DAEFE0",
            text: "Đã duyệt",
        };
    }
    if (BookingHelpers.isItineraryDetailWaitForApprovalResponse(item)) {
        return {
            textColor: "#1C252E",
            backgroundColor: "#FFF7E5",
            text: "Chờ duyệt",
        };
    }

    return {
        textColor: "#637381",
        backgroundColor: "#E9E9E9",
        text: "Nháp",
    };
};

export default ItineraryDetailStatusChip;
