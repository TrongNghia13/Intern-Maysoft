import { Box, Typography } from "@maysoft/common-component-react";

import Helpers from "@src/commons/helpers";

import { IUser } from "@src/commons/interfaces";

const getFullName = (lastName: string, firstName: string) => {
    if (Helpers.isNullOrEmpty(lastName) && Helpers.isNullOrEmpty(firstName)) return "Chưa có tên";
    return [lastName, firstName]
        .filter((el) => !Helpers.isNullOrEmpty(el))
        .join(" ")
        .trim();
};

export const UserItem = ({ user, isOutPolicy }: { user: IUser; isOutPolicy?: boolean }) => {
    const fullName = getFullName(user?.organizationUserProfile?.lastName, user?.organizationUserProfile?.firstName);
    return (
        <Box
            sx={{
                backgroundColor: "#FFF7E5",
                px: 1.5,
                py: 0.75,
                borderRadius: "20px",
                border: "1px solid #FFDD92",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Typography
                variant="caption"
                sx={{
                    fontSize: "1rem",
                    fontWeight: 400,
                    color: "#1C252E",
                    ...(isOutPolicy && {
                        borderColor: "transparent",
                        borderImageSource: "linear-gradient(92.49deg, #FFA149 0.05%, #F47A34 100.05%)",
                        background: "linear-gradient(92.49deg, #FFA149 0.05%, #F47A34 100.05%)",
                        "-webkit-background-clip": "text",
                        "-webkit-text-fill-color": "transparent",
                    }),
                }}
            >
                {fullName}
            </Typography>
        </Box>
    );
};

export default UserItem;
