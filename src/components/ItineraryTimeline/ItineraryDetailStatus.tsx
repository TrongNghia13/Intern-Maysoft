import { Typography } from "@maysoft/common-component-react";
import { BookingHelpers } from "@src/commons/bookingHelpers";
import { IItineraryDetail } from "@src/commons/interfaces";
import { useState } from "react";
import ApprovalInfoTooltip from "./ApprovalInfoTooltip";

export const ItineraryDetailStatus = ({ item, itineraryDetails }: { item: IItineraryDetail; itineraryDetails: IItineraryDetail[] }) => {
    const { textColor, backgroundColor, text, showTooltip = false } = getColorAndText(item);

    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (showTooltip === false) return;
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        if (showTooltip === false) return;
        setAnchorEl(null);
    };

    return (
        <>
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
                    ...(showTooltip && {
                        "&:hover": {
                            cursor: "pointer",
                        },
                    }),
                }}
                onClick={handleClick}
                onMouseOver={handleClick}
                onMouseLeave={handleClose}
            >
                {text}
            </Typography>
            <ApprovalInfoTooltip itineraryDetail={itineraryDetails} anchorEl={anchorEl} />
        </>
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
            showTooltip: true,
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
            showTooltip: true,
        };
    }
    if (BookingHelpers.isItineraryDetailWaitForApprovalResponse(item)) {
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
};

export default ItineraryDetailStatus;
