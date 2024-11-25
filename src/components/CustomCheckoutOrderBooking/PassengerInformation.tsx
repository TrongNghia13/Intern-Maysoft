import { Box, Typography } from "@maysoft/common-component-react";

import Helpers from "@src/commons/helpers";

import { Gender } from "@src/commons/enum";
import { ICodename } from "@src/commons/interfaces";
import { bodyStyles, headerStyles } from "./styles";

export const PassengerInformation = ({ members }: { members: any[] }) => {
    const genderList: ICodename[] = [
        { code: Gender.Male, name: "Nam" },
        { code: Gender.Female, name: "Nữ" },
        // { code: Gender.Other, name: "Khác" },
    ];

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
                    {"Thông tin hành khách"}
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
                    gridTemplateColumns="auto 100px 100px 100px"
                    sx={{
                        borderBottom: "1px solid #9F9F9F",
                        pb: 1,
                    }}
                >
                    <Box>
                        <Typography sx={headerStyles}>Họ & Tên</Typography>
                    </Box>
                    <Box>
                        <Typography sx={headerStyles}>Ngày sinh</Typography>
                    </Box>
                    <Box>
                        <Typography sx={headerStyles}>Giới tính</Typography>
                    </Box>
                    <Box>
                        <Typography sx={headerStyles}>Quốc tịch</Typography>
                    </Box>
                </Box>
                {members?.map((item, index) => (
                    <Box
                        key={index}
                        display="grid"
                        gridTemplateColumns="auto 100px 100px 100px"
                        sx={{
                            ...(index !== members?.length - 1 && {
                                borderBottom: "1px solid #f3f3f3",
                            }),
                            alignItems: "center",
                            py: 0.5,
                        }}
                    >
                        <Box>
                            <Typography sx={bodyStyles}>{item?.fullName || ""} </Typography>
                        </Box>
                        <Box>
                            <Typography sx={bodyStyles}>{Helpers.formatDate(Number(item.dateOfBirth) * 1000)}</Typography>
                        </Box>
                        <Box>
                            <Typography sx={bodyStyles}>{genderList.find((el) => el.code === item?.gender)?.name || ""}</Typography>
                        </Box>
                        <Box>
                            <Typography sx={bodyStyles}>{item?.nationality}</Typography>
                        </Box>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default PassengerInformation;
