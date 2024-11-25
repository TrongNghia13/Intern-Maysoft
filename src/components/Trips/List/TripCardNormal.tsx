import { Box, Typography } from "@maysoft/common-component-react";
import { East, HotelOutlined } from "@mui/icons-material";
import { Grid } from "@mui/material";
import { BookingHelpers } from "@src/commons/bookingHelpers";
import { ItineraryType } from "@src/commons/enum";
import Helpers from "@src/commons/helpers";
import { IHotelExtraInformation, IItinerary, IItineraryDetail, IUser } from "@src/commons/interfaces";
import { Button } from "@src/components/Button";
import Constants from "@src/constants";
import moment from "moment";
import { useTranslation } from "next-i18next";
import React, { Fragment, useMemo } from "react";
import { FlightInfoCard, DashedDivider } from "@src/components";
import { UserList } from "@src/components";
import { typographyStyles } from "@src/styles/commonStyles";
import ConfirmStatusText from "./ConfirmStatusText";

interface IProps {
    item: IItinerary;
    users: IUser[];
    hidenStatus?: boolean;
    userLoading?: boolean;
    onClick?: (item: IItinerary) => void;
}

export const TripCardNormal: React.FC<IProps> = ({ item, onClick, users, hidenStatus, userLoading }: IProps) => {
    const {
        t,
        i18n: { language },
    } = useTranslation(["common", "tripbooking"]);

    const { startTime, endTime } = useMemo(() => {
        if (Helpers.isNullOrEmpty(item.itineraryDetails))
            return {
                startTime: 0,
                endTime: 0,
            };
        return Helpers.getStartAndEndTimeOfTrip(item.itineraryDetails || []);
    }, [item.itineraryDetails, item.itineraryDetails?.length]);

    const tripDetails = useMemo(() => {
        if (Helpers.isNullOrEmpty(item.itineraryDetails)) return [];
        if (item.itineraryDetails?.length === 0) return [];
        return [...(item.itineraryDetails || [])].sort((a, b) => Number(a.startTime || 0) - Number(b.startTime || 0));
    }, [item.itineraryDetails]);
    const priceDictionary = useMemo(() => BookingHelpers.getItineraryDetailPriceGroupBySequence(item.itineraryDetails || []), [item]);
    const totalPrice = priceDictionary.get("total");

    const itineraryDetailSorter = (a: IItineraryDetail, b: IItineraryDetail) => {
        return a.sequence - b.sequence;
    };

    const userIds = useMemo(() => (item?.itineraryMembers || []).map((el) => el.userId), [item]);

    const sequenceCount: Map<number, number> = new Map();

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
                            onClick={() => onClick && onClick(item)}
                            sx={{
                                display: "grid",
                                "&:hover": { cursor: "pointer" },
                            }}
                        >
                            <Typography variant="h6" sx={{ fontSize: 20 }}>
                                {item.name}
                            </Typography>
                            {startTime !== 0 && endTime !== 0 && (
                                <Typography
                                    variant="button"
                                    sx={({ palette: { secondary } }) => ({
                                        fontSize: Constants.FONT_SIZE.SMALL_TEXT,
                                        fontWeight: 400,
                                        color: secondary.main,
                                    })}
                                >
                                    {[
                                        Helpers.getDateNameFormat(startTime * 1000, language),
                                        Helpers.getDateNameFormat(endTime * 1000, language),
                                    ].join(" - ")}
                                </Typography>
                            )}
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1, justifyContent: "flex-end" }}>
                            {!hidenStatus && <Typography variant="button">{"ID: " + item.id}</Typography>}
                            {!hidenStatus && <ConfirmStatusText status={item.confirmStatus} />}
                            {/* {totalPrice && !hidePrice && ( */}
                            {totalPrice && (
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
                                                        fontWeight: 600,
                                                        fontSize: "1.25rem",
                                                    })
                                                }
                                            >
                                                {Helpers.formatCurrency((totalPrice.value ?? 0) + (totalPrice.serviceFee ?? 0))}
                                            </Typography>
                                            <Typography
                                                sx={(theme) =>
                                                    typographyStyles(theme, {
                                                        fontWeight: 600,
                                                        textDecoration: "underline",
                                                        fontSize: Constants.FONT_SIZE.SMALL_TEXT,
                                                    })
                                                }
                                            >
                                                {Helpers.getCurrency(totalPrice.currency)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Box>
                                        {onClick && (
                                            <Button variant="contained" color="info" onClick={() => onClick(item)}>
                                                Chi tiết &nbsp; <East />
                                            </Button>
                                        )}
                                    </Box>
                                </Box>
                            )}
                            {/* // )} */}

                            {/* <DropdownAction
                            item={item}
                            disabled={hidenAction}
                            refreshData={refreshData}
                            onEdit={() => (onClick ? onClick(item) : undefined)}
                        /> */}
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            <DashedDivider />

            <Box display="flex" flexDirection="column" gap={1} px={2.5} py={1}>
                {tripDetails.sort(itineraryDetailSorter).map((trip, index) => {
                    sequenceCount.set(trip.sequence, Number(sequenceCount.get(trip.sequence) || 0) + 1);
                    if (trip.type === ItineraryType.Hotel) {
                        const extraInfo = JSON.parse(trip.extraInfo);
                        if (Helpers.isNullOrEmpty(extraInfo)) return <></>;
                        const newExtraInfo: IHotelExtraInformation = Helpers.toCamelCaseObj(extraInfo);
                        const numberOfNights = Number(moment(Number(trip.endTime || 0) * 1000).diff(Number(trip.startTime || 0) * 1000, "days") || 1);
                        return (
                            <Box sx={{ gap: 1, display: "flex", flexWrap: "wrap", alignItems: "center" }} key={index}>
                                <HotelOutlined />
                                <Typography variant="button">
                                    {getTextAndDate({
                                        text: t("number_of_night_in_hotel", { night: numberOfNights, name: newExtraInfo?.roomName }),
                                        startTime: Number(trip.startTime || 0) * 1000,
                                        endTime: Number(trip.endTime || 0) * 1000,
                                    })}
                                </Typography>
                            </Box>
                        );
                    }
                    if (trip.type === ItineraryType.Flight) {
                        // const extraInfo = JSON.parse(trip.extraInfo);
                        // if (Helpers.isNullOrEmpty(extraInfo)) return <></>;
                        // const newExtraInfo: IFlightExtraInformation = Helpers.toCamelCaseObj(extraInfo);
                        return (
                            <Fragment key={index}>
                                <FlightInfoCard {...{ detail: trip, key: index, hiddenHeader: (sequenceCount.get(trip.sequence) || 0) > 1 }} />
                                {index !== tripDetails.length - 1 && <DashedDivider />}
                            </Fragment>
                        );
                    }
                })}
            </Box>

            <DashedDivider />

            <Box p={2.5} pt={0}>
                <UserList
                    users={users?.filter((el) => userIds.includes(el.id)) || []}
                    loading={userLoading !== undefined ? userLoading : undefined}
                />
            </Box>
        </Box>
    );
};

const getTextAndDate = ({ text, startTime, endTime }: { text: any; startTime: number | string; endTime: number | string }) => {
    const satrt = Helpers.isNumber(startTime) ? Helpers.formatDate(startTime, Constants.DateFormat.DDMMYYYY_HHMM) : startTime;

    const end = Helpers.isNumber(endTime) ? Helpers.formatDate(endTime, Constants.DateFormat.DDMMYYYY_HHMM) : endTime;

    return [text, `(${[satrt, end].join(" - ")})`].join(" ");
};

export default TripCardNormal;
