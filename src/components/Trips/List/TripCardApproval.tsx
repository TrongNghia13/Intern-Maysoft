import { Box, Typography } from "@maysoft/common-component-react";
import { East, HotelOutlined } from "@mui/icons-material";
import { Divider, Grid } from "@mui/material";
import moment from "moment";
import { useTranslation } from "next-i18next";
import React, { useMemo, useState } from "react";

import Helpers from "@src/commons/helpers";
import Constants from "@src/constants";

import { ConfirmStatus, FlightType, ItineraryType } from "@src/commons/enum";
import { IFlightExtraInformation, IHotelExtraInformation, IItineraryDetail, IUser } from "@src/commons/interfaces";
import { UserList } from "@src/components";
import { IRecordRequestV2Service } from "@src/hooks/useDataRequestApproveReject.hook";
import { typographyStyles } from "@src/styles/commonStyles";
import { CarrierMarketing, FlightInfoDuration, FreeBaggage } from "../../CardItem/ItineraryFlightCard/Components";
import { DashedDivider } from "../../DashedDivider";
import { ItineraryDetailStatusChip } from "../../FlightInfoCard";

interface IProps {
    item?: IRecordRequestV2Service;
    users: IUser[];
    userLoading: boolean;
    onReject?: (item: IRecordRequestV2Service) => void;
    onApprove?: (item: IRecordRequestV2Service) => void;
}

export const TripCardApproval: React.FC<IProps> = ({ item, onApprove, onReject, users, userLoading }: IProps) => {
    const {
        t,
        i18n: { language },
    } = useTranslation(["common", "tripbooking"]);

    const getNewExtraInfo: any = (dataDetail: any) => {
        if (dataDetail?.detailType === ItineraryType.Hotel) {
            const newData: IHotelExtraInformation = Helpers.toCamelCaseObj(JSON.parse(dataDetail?.detailExtraInformation));
            return newData;
        }
        if (dataDetail?.detailType === ItineraryType.Flight) {
            const newData: IFlightExtraInformation = Helpers.toCamelCaseObj(JSON.parse(dataDetail?.detailExtraInformation));
            return newData;
        }
        return null;
    };

    const dataStartTimeEndTime = useMemo(() => {
        return [...(item?.details || [])].reduce(
            (acc, cur) => {
                const startTime =
                    cur?.detailType === ItineraryType.Hotel ? Number(cur.detailStartTime || 0) : Number(getNewExtraInfo(cur)?.departDate || 0);

                const endTime =
                    cur?.detailType === ItineraryType.Hotel ? Number(cur.detailEndTime || 0) : Number(getNewExtraInfo(cur)?.arrivalDate || 0);

                if (acc.startTime === 0) {
                    acc.startTime = startTime;
                }
                if (startTime < acc.startTime) {
                    acc.startTime = startTime;
                }
                if (endTime > acc.endTime) {
                    acc.endTime = endTime;
                }

                return acc;
            },
            {
                startTime: 0,
                endTime: 0,
            }
        );
    }, [item?.details]);

    const userIds = useMemo(() => (item?.members || []).map((el) => el.userId), [item?.members]);

    const getTextAndDate = ({ text, startTime, endTime }: { text: any; startTime: number | string; endTime: number | string }) => {
        const start = Helpers.isNumber(startTime) ? Helpers.formatDate(startTime, Constants.DateFormat.DDMMYYYY_HHMM) : startTime;

        const end = Helpers.isNumber(endTime) ? Helpers.formatDate(endTime, Constants.DateFormat.DDMMYYYY_HHMM) : endTime;

        return [text, `(${[start, end].join(" - ")})`].join(" ");
    };

    if (!item) return null;

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                borderRadius: "8px",
                border: "1px #c3c3c3 solid",
                width: "100%",
                backgroundColor: "#ffffff",
            }}
        >
            <Box p={2.5} pb={1}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={8}>
                        <Box
                            sx={{
                                display: "grid",
                                "&:hover": { cursor: "pointer" },
                            }}
                        >
                            <Typography variant="h6" sx={{ fontSize: 20 }}>
                                {item.name}
                            </Typography>
                            {dataStartTimeEndTime.startTime !== 0 && dataStartTimeEndTime.endTime !== 0 && (
                                <Typography
                                    variant="button"
                                    sx={({ palette: { secondary } }) => ({
                                        fontSize: Constants.FONT_SIZE.SMALL_TEXT,
                                        fontWeight: 400,
                                        color: secondary.main,
                                    })}
                                >
                                    {[
                                        Helpers.getDateNameFormat(dataStartTimeEndTime.startTime * 1000, language),
                                        Helpers.getDateNameFormat(dataStartTimeEndTime.endTime * 1000, language),
                                    ].join(" - ")}
                                </Typography>
                            )}
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1, justifyContent: "flex-end" }}>
                            <Box display="flex" flexDirection="row" gap={2}>
                                <Box display="flex" flexDirection="column" justifyContent="right" textAlign="right">
                                    <Typography
                                        variant="caption"
                                        sx={(theme) =>
                                            typographyStyles(theme, {
                                                color: "#637381",
                                                fontSize: Constants.FONT_SIZE.SMALL_TEXT,
                                            })
                                        }
                                    >
                                        Tổng tiền
                                    </Typography>
                                    <Box display="flex" gap={0.5}>
                                        <Typography
                                            sx={(theme) =>
                                                typographyStyles(theme, {
                                                    fontSize: "1.25rem",
                                                    fontWeight: 600,
                                                })
                                            }
                                        >
                                            {Helpers.formatCurrency(item.estimateAmount ?? 0)}
                                        </Typography>
                                        <Typography
                                            sx={(theme) =>
                                                typographyStyles(theme, {
                                                    fontSize: Constants.FONT_SIZE.SMALL_TEXT,
                                                    fontWeight: 600,
                                                })
                                            }
                                        >
                                            {Helpers.getCurrency("VND")}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <CustomButton
                                        mode="approve"
                                        onClick={() => {
                                            if (Helpers.isFunction(onApprove) && !Helpers.isNullOrEmpty(item)) {
                                                onApprove(item);
                                            }
                                        }}
                                    />

                                    <CustomButton
                                        mode="reject"
                                        onClick={() => {
                                            if (Helpers.isFunction(onReject) && !Helpers.isNullOrEmpty(item)) {
                                                onReject(item);
                                            }
                                        }}
                                    />
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            <DashedDivider />

            <Box display="flex" flexDirection="column" gap={1} px={2.5} py={1}>
                {item.details.map((trip, index) => {
                    // sequenceCount.set(trip.sequence, Number(sequenceCount.get(trip.sequence) || 0) + 1);

                    if (trip.detailType === ItineraryType.Hotel) {
                        const extraInfo = JSON.parse(trip.detailExtraInformation);
                        if (Helpers.isNullOrEmpty(extraInfo)) return <></>;
                        const newExtraInfo: IHotelExtraInformation = Helpers.toCamelCaseObj(extraInfo);
                        const numberOfNights = Number(
                            moment(Number(trip.detailStartTime || 0) * 1000).diff(Number(trip.detailEndTime || 0) * 1000, "days") || 1
                        );
                        return (
                            <Box sx={{ gap: 1, display: "flex", flexWrap: "wrap", alignItems: "center" }} key={index}>
                                <HotelOutlined />
                                <Typography variant="button">
                                    {getTextAndDate({
                                        text: t("number_of_night_in_hotel", { night: numberOfNights, name: newExtraInfo?.roomName }),
                                        startTime: Number(trip.detailStartTime || 0) * 1000,
                                        endTime: Number(trip.detailEndTime || 0) * 1000,
                                    })}
                                </Typography>
                            </Box>
                        );
                    }
                    if (trip.detailType === ItineraryType.Flight) {
                        const extraInfo = JSON.parse(trip.detailExtraInformation);
                        if (Helpers.isNullOrEmpty(extraInfo)) return <></>;
                        const newExtraInfo: IFlightExtraInformation = Helpers.toCamelCaseObj(extraInfo);
                        return (
                            <>
                                <FlightInfoCard {...{ data: newExtraInfo, key: index, hiddenHeader: index !== 0 }} />
                                {/* {index !== item.details.length - 1 && <DashedDivider />} */}
                            </>
                        );
                    }
                })}
            </Box>

            <DashedDivider />
            <Box p={2.5} pt={0}>
                <UserList users={users.filter((el) => userIds.includes(el.id))} loading={userLoading} />
            </Box>
        </Box>
    );
};

const CustomButton = ({ mode, onClick }: { mode: "approve" | "reject"; onClick: () => void }) => {
    const { backgroundColor, color, text, Icon } = useMemo(() => {
        if (mode === "reject")
            return {
                backgroundColor: "#FFE5DF",
                color: "#B71D18",
                text: "Từ chối",
                Icon: () => <CancelIcon />,
            };
        return {
            backgroundColor: "#0C68E9",
            color: "#FFFFFF",
            text: "Đồng ý",
            Icon: () => <CheckIcon />,
        };
    }, [mode]);

    return (
        <Box
            sx={{
                display: "flex",
                gap: 1,
                alignItems: "center",
                justifyContent: "center",
                px: 3,
                py: 1.25,
                backgroundColor,
                borderRadius: 2,
                border: "1px solid transparent",
                transition: "border-color .3s ease-out",
                width: 133,
                "&:hover": {
                    cursor: "pointer",
                    borderColor: color,
                },
            }}
            onClick={onClick}
        >
            <Icon />
            <Typography
                sx={{
                    fontSize: "1rem",
                    color,
                    fontWeight: 600,
                }}
            >
                {text}
            </Typography>
        </Box>
    );
};

const TwistArrowIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M5.82484 15.9998L7.69984 17.8748C7.88318 18.0581 7.97484 18.2875 7.97484 18.5628C7.97484 18.8381 7.88318 19.0755 7.69984 19.2748C7.49984 19.4748 7.26251 19.5748 6.98784 19.5748C6.71318 19.5748 6.47551 19.4748 6.27484 19.2748L2.69984 15.6998C2.59984 15.5998 2.52884 15.4915 2.48684 15.3748C2.44484 15.2581 2.42451 15.1331 2.42584 14.9998C2.42718 14.8665 2.44818 14.7415 2.48884 14.6248C2.52951 14.5081 2.60018 14.3998 2.70084 14.2998L6.30084 10.6998C6.50084 10.4998 6.73418 10.4041 7.00084 10.4128C7.26751 10.4215 7.50084 10.5255 7.70084 10.7248C7.88418 10.9248 7.98018 11.1581 7.98884 11.4248C7.99751 11.6915 7.90151 11.9248 7.70084 12.1248L5.82484 13.9998H11.9998C12.2832 13.9998 12.5208 14.0958 12.7128 14.2878C12.9048 14.4798 13.0005 14.7171 12.9998 14.9998C12.9992 15.2825 12.9032 15.5201 12.7118 15.7128C12.5205 15.9055 12.2832 16.0011 11.9998 15.9998H5.82484ZM18.1748 9.9998H11.9998C11.7165 9.9998 11.4792 9.9038 11.2878 9.7118C11.0965 9.5198 11.0005 9.28247 10.9998 8.9998C10.9992 8.71714 11.0952 8.4798 11.2878 8.2878C11.4805 8.0958 11.7178 7.9998 11.9998 7.9998H18.1748L16.2998 6.1248C16.1165 5.94147 16.0248 5.71247 16.0248 5.4378C16.0248 5.16314 16.1165 4.92547 16.2998 4.7248C16.4998 4.5248 16.7375 4.4248 17.0128 4.4248C17.2882 4.4248 17.5255 4.5248 17.7248 4.7248L21.2998 8.2998C21.3998 8.3998 21.4705 8.50814 21.5118 8.6248C21.5532 8.74147 21.5742 8.86647 21.5748 8.9998C21.5755 9.13314 21.5545 9.25814 21.5118 9.3748C21.4692 9.49147 21.3985 9.5998 21.2998 9.6998L17.6998 13.2998C17.4998 13.4998 17.2665 13.5958 16.9998 13.5878C16.7332 13.5798 16.4998 13.4755 16.2998 13.2748C16.1165 13.0748 16.0205 12.8415 16.0118 12.5748C16.0032 12.3081 16.0992 12.0748 16.2998 11.8748L18.1748 9.9998Z"
            fill="#637381"
        />
    </svg>
);

const CheckIcon = () => (
    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M9.55018 15.65L18.0252 7.175C18.2252 6.975 18.4585 6.875 18.7252 6.875C18.9918 6.875 19.2252 6.975 19.4252 7.175C19.6252 7.375 19.7252 7.61267 19.7252 7.888C19.7252 8.16333 19.6252 8.40067 19.4252 8.6L10.2502 17.8C10.0502 18 9.81685 18.1 9.55018 18.1C9.28351 18.1 9.05018 18 8.85018 17.8L4.55018 13.5C4.35018 13.3 4.25418 13.0627 4.26218 12.788C4.27018 12.5133 4.37451 12.2757 4.57518 12.075C4.77585 11.8743 5.01351 11.7743 5.28818 11.775C5.56285 11.7757 5.80018 11.8757 6.00018 12.075L9.55018 15.65Z"
            fill="white"
        />
    </svg>
);

const CancelIcon = () => (
    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M12 2.5C17.5 2.5 22 7 22 12.5C22 18 17.5 22.5 12 22.5C6.5 22.5 2 18 2 12.5C2 7 6.5 2.5 12 2.5ZM12 4.5C10.1 4.5 8.4 5.1 7.1 6.2L18.3 17.4C19.3 16 20 14.3 20 12.5C20 8.1 16.4 4.5 12 4.5ZM16.9 18.8L5.7 7.6C4.6 8.9 4 10.6 4 12.5C4 16.9 7.6 20.5 12 20.5C13.9 20.5 15.6 19.9 16.9 18.8Z"
            fill="#B71D18"
        />
    </svg>
);

const FlightInfoCard = ({ data, hiddenHeader }: { data: IFlightExtraInformation; hiddenHeader: boolean }) => {
    const {
        i18n: { language },
    } = useTranslation();

    const Title = ({ value }: { value: string }) => (
        <Typography
            sx={{
                fontSize: "1rem",
                fontWeight: 600,
                color: "#1C252E",
            }}
        >
            {value}
        </Typography>
    );

    return (
        <Box sx={{ gap: 1, display: "grid" }}>
            {!hiddenHeader && (
                <Box>
                    <Box
                        sx={{
                            gap: 1,
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                        }}
                    >
                        <Title value={data?.departPlaceObj?.name} />
                        {data.flightType === FlightType.OneWay && <East />}
                        {data.flightType === FlightType.RoundTrip && <TwistArrowIcon />}
                        {data.flightType === FlightType.MultiCity && <East />}
                        <Title value={data?.arrivalPlaceObj?.name} />
                        <ItineraryDetailStatusChip
                            item={
                                {
                                    confirmStatus: ConfirmStatus.Processing,
                                } as IItineraryDetail
                            }
                        />
                    </Box>
                    <Typography
                        variant="caption"
                        sx={({ palette: { secondary } }) => ({
                            fontSize: Constants.FONT_SIZE.SMALL_TEXT,
                            fontWeight: 400,
                            color: secondary.main,
                        })}
                    >
                        {Helpers.getVietnameseDateFormat(data.arrivalDate)}
                    </Typography>
                </Box>
            )}

            <Box sx={{ display: "grid", gap: 1, gridTemplateColumns: "40% 60%" }}>
                <Box>
                    <CarrierMarketing data={data} language={language} />
                </Box>
                <Box display="grid" alignContent="center">
                    <FlightInfoDuration {...{ language, data }} />
                </Box>
            </Box>

            <Divider />
            <FreeBaggage freeBaggage={data.freeBaggage || []} px={0} />
        </Box>
    );
};

// const getColorAndText = () => {
//     return {
//         textColor: "#1C252E",
//         backgroundColor: "#FFF7E5",
//         text: "Chờ duyệt",
//     };
// };

// const 123 = () => {
//     const { textColor, backgroundColor, text } = getColorAndText();

//     return (
//         <Typography
//             variant="caption"
//             sx={{
//                 px: 1.5,
//                 py: 0.75,
//                 fontSize: "0.75rem",
//                 fontWeight: 600,
//                 color: textColor,
//                 textAlign: "center",
//                 backgroundColor: backgroundColor,
//                 borderRadius: 1,
//             }}
//         >
//             {text}
//         </Typography>
//     );
// };

export default TripCardApproval;
