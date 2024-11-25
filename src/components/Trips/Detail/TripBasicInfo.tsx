import { Box, Typography } from "@maysoft/common-component-react";
import { Edit } from "@mui/icons-material";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useState } from "react";

import Helpers from "@src/commons/helpers";

import { Mode } from "@src/commons/enum";
import { IItinerary, IUser } from "@src/commons/interfaces";
import { IItineraryError } from "@src/hooks/trips/useTrips";

import { IconButton } from "@mui/material";
import { ModalUpdateTrip, UserList, Card } from "@src/components";
import Constants from "@src/constants";
import { typographyStyles } from "@src/styles/commonStyles";

export const TripBasicInfo = ({
    data,
    error,
    users,
    loading,
    onChangeValue,
    onSubmit,

    onChangeUsers,
    onRemoveUser,
    onRefreshData,
}: {
    data: IItinerary;
    error: IItineraryError;
    users: IUser[];

    loading: boolean;
    onChangeValue: (value: string, key: keyof IItinerary) => void;
    onSubmit: () => void;

    onChangeUsers: (data: IUser[]) => void;
    onRemoveUser: (data: IUser) => void;
    onRefreshData: (data: IItinerary, users: IUser[]) => void;
}) => {
    const router = useRouter();

    const [collapse, setCollapse] = useState<boolean>(true);
    const [visibled, setVisibled] = useState<boolean>(false);

    const { t } = useTranslation(["common", "tripbooking"]);

    return (
        <Card>
            {/* <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Box display="flex" gap={1}>
                    <Button
                        color="secondary"
                        onClick={() => {
                            router.push(PathName.TRIPS);
                        }}
                    >
                        {t("common:go_back")}
                    </Button>
                    {BookingHelpers.isItineraryEditable(data) && (
                        <Button
                            onClick={() => {
                                setVisibled(true);
                            }}
                        >
                            <Edit /> &nbsp; {t("tripbooking:edit_trip")}
                        </Button>
                    )}
                </Box>
            </Box> */}

            <Box display="grid" gap={1}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography
                        sx={(theme) =>
                            typographyStyles(theme, {
                                fontSize: "1.125rem",
                                fontWeight: 600,
                            })
                        }
                    >
                        {data.name}
                    </Typography>
                    <IconButton
                        onClick={() => {
                            setVisibled(true);
                        }}
                    >
                        <Edit />
                    </IconButton>
                </Box>
                <Typography
                    sx={(theme) =>
                        typographyStyles(theme, {
                            fontWeight: 500,
                            color: "#637381",
                        })
                    }
                >
                    {data.description || "Chưa có thông tin mô tả"}
                </Typography>

                <Box sx={{ borderBottom: "1px solid #E4EBF7" }} />

                <Typography
                    sx={(theme) =>
                        typographyStyles(theme, {
                            fontSize: Constants.FONT_SIZE.SMALL_TEXT,
                            fontWeight: 500,
                        })
                    }
                >
                    Người tham gia chuyến đi
                </Typography>
                <UserList users={users} />
            </Box>

            <ModalUpdateTrip
                mode={Mode.Update}
                userData={users}
                itineraryData={data}
                visibled={visibled}
                setVisibled={setVisibled}
                onSubmit={(data, users) => {
                    if (Helpers.isNullOrEmpty(data?.id)) return;
                    onRefreshData(data, users);
                }}
            />
        </Card>
    );
};

export default TripBasicInfo;
