import { Box, Typography } from "@maysoft/common-component-react";
import React from "react";
import { useTranslation } from "react-i18next";

import Helpers from "@src/commons/helpers";

import { Palette, Theme } from "@mui/material/styles";
import { IUser } from "@src/commons/interfaces";
import { useTripContext } from "@src/providers/tripProvider";

interface IProps {
    users: IUser[];
    isInternational?: boolean;
}

export const OrganizationUserTable: React.FC<IProps> = ({ users, isInternational }) => {
    const {
        t,
        i18n: { language },
    } = useTranslation(["common", "tripbooking"]);

    const { hasTable, genderList, listCountry, disabled, onEditUser } = useTripContext();

    if (!hasTable) return null;

    return (
        <>
            <Box
                display="grid"
                gridTemplateColumns="repeat(4, 1fr) 100px"
                sx={{
                    borderBottom: "1px solid #9F9F9F",
                    pb: 1,
                }}
            >
                {/* <Box /> */}
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
                <Box />
            </Box>
            {users.map((user, index) => (
                <Box
                    key={index}
                    display="grid"
                    gridTemplateColumns="repeat(4, 1fr) 100px"
                    sx={{
                        ...(index !== users.length - 1 && {
                            borderBottom: "1px solid #f3f3f3",
                        }),
                        alignItems: "center",
                        py: 0.5,
                    }}
                >
                    {/* <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "1px solid #f3f3f3",
                            backgroundColor: "#f3f3f3",
                            borderRadius: "50%",
                            p: 1,
                            width: "25px",
                            height: "25px",
                            textAlign: "center",
                        }}
                    >
                        <Typography variant="caption" fontWeight="bold">
                            {index + 1}
                        </Typography>
                    </Box> */}
                    <Box>
                        <Typography sx={bodyStyles}>
                            {[user.organizationUserProfile.lastName, user.organizationUserProfile.firstName].filter((el) => el).join(" ")}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography sx={bodyStyles}>{Helpers.formatDate(Number(user.organizationUserProfile.dateOfBirth) * 1000)}</Typography>
                    </Box>
                    <Box>
                        <Typography sx={bodyStyles}>
                            {Helpers.getValueOfCodeName(Number(user.organizationUserProfile?.gender), genderList)}
                        </Typography>
                    </Box>

                    <Box>
                        <Typography sx={bodyStyles}>{Helpers.getValueOfCodeName(user.organizationUserProfile?.nationality, listCountry)}</Typography>
                    </Box>
                    <Box>
                        <Box
                            // disabled={disabled}
                            onClick={(e) => {
                                if (disabled) return;
                                e.stopPropagation();
                                onEditUser(user, isInternational);
                            }}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                ...(!disabled && {
                                    "&:hover": {
                                        cursor: "pointer",
                                    },
                                }),
                                ...(disabled && {
                                    filter: "grayscale(1)",
                                }),
                            }}
                        >
                            {/* <CustomIcon iconName="edit" /> */}
                            <Edit />
                            <Typography sx={(theme) => bodyStyles(theme, "info")}>Thay đổi</Typography>
                        </Box>
                    </Box>
                </Box>
            ))}
        </>
    );
};

const Edit = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M2.66667 14C2.47778 14 2.31956 13.936 2.192 13.808C2.06444 13.68 2.00044 13.5218 2 13.3333V11.7167C2 11.5389 2.03333 11.3693 2.1 11.208C2.16667 11.0467 2.26111 10.9051 2.38333 10.7833L10.8 2.38333C10.9333 2.26111 11.0807 2.16667 11.242 2.1C11.4033 2.03333 11.5727 2 11.75 2C11.9273 2 12.0996 2.03333 12.2667 2.1C12.4338 2.16667 12.5782 2.26667 12.7 2.4L13.6167 3.33333C13.75 3.45556 13.8471 3.6 13.908 3.76667C13.9689 3.93333 13.9996 4.1 14 4.26667C14 4.44444 13.9693 4.614 13.908 4.77533C13.8467 4.93667 13.7496 5.08378 13.6167 5.21667L5.21667 13.6167C5.09444 13.7389 4.95267 13.8333 4.79133 13.9C4.63 13.9667 4.46067 14 4.28333 14H2.66667ZM11.7333 5.2L12.6667 4.26667L11.7333 3.33333L10.8 4.26667L11.7333 5.2Z"
            fill="#1E97DE"
        />
    </svg>
);

const headerStyles = (theme: Theme) => {
    return {
        color: "#637381",
        fontWeight: 500,
        fontSize: "0.875rem",
    };
};

const bodyStyles = (theme: Theme, color?: keyof Palette) => {
    return {
        color: color ? theme.palette[color].main : "#1C252E",
        fontWeight: 500,
        fontSize: "0.875rem",
    };
};

export default OrganizationUserTable;
