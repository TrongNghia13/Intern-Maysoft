import { Box, Typography } from "@maysoft/common-component-react";

import { IDetailBooking } from "@src/commons/interfaces";
import { bodyStyles, headerStyles } from "./styles";

export const ContactInformation = ({ bookingData }: { bookingData: IDetailBooking }) => {
    return (
        <Box display="grid" gap={1}>
            <Box>
                <Typography
                    variant="h6"
                    sx={{
                        fontSize: "1rem",
                        fontWeight: 600,
                        color: "#1C252E",
                    }}
                >
                    {"Thông tin liên hệ"}
                </Typography>
            </Box>
            <Box
                sx={{
                    padding: 2,
                    borderRadius: "12px",
                    border: "1px #E4EBF7 solid",
                }}
            >
                <Box
                    display="grid"
                    gridTemplateColumns="repeat(3, 1fr)"
                    sx={{
                        borderBottom: "1px solid #9F9F9F",
                        pb: 1,
                    }}
                >
                    <Box>
                        <Typography sx={headerStyles}>Họ & Tên</Typography>
                    </Box>
                    <Box>
                        <Typography sx={headerStyles}>Email</Typography>
                    </Box>
                    <Box>
                        <Typography sx={headerStyles}>Số điện thoại</Typography>
                    </Box>
                </Box>
                <Box
                    display="grid"
                    gridTemplateColumns="repeat(3, 1fr)"
                    sx={{
                        py: 0.5,
                        alignItems: "center",
                        borderBottom: "1px solid #f3f3f3",
                    }}
                >
                    <Box>
                        <Typography sx={bodyStyles}>{bookingData?.name}</Typography>
                    </Box>
                    <Box>
                        <Typography sx={bodyStyles}>{bookingData?.email}</Typography>
                    </Box>
                    <Box>
                        <Typography sx={bodyStyles}>+{bookingData?.phoneNumber}</Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default ContactInformation;
