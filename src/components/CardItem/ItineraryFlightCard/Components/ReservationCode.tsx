import { Box, Typography } from "@maysoft/common-component-react";
import { useTimelineContext } from "@src/providers/timelineProvider";

export const ReservationCode = () => {
    const { reservationCode } = useTimelineContext();

    if (!reservationCode) return <></>;

    return (
        <Box
            sx={{
                borderRadius: 1,
                backgroundColor: "#E4EBF7",
                py: 0.75,
                px: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                width: "fit-content",
            }}
        >
            <Typography
                sx={{
                    fontSize: "0.875rem",
                    color: "#637381",
                    fontWeight: 400,
                }}
            >
                Mã đặt chỗ:
            </Typography>
            <Typography
                sx={{
                    fontSize: "0.875rem",
                    color: "#1C252E",
                    fontWeight: 600,
                }}
            >
                {reservationCode}
            </Typography>
        </Box>
    );
};

export default ReservationCode;
