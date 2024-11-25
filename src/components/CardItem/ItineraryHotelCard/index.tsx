import { Box, Typography } from "@maysoft/common-component-react";
import { FitnessCenterOutlined, FreeBreakfastOutlined, RoomOutlined, SpaOutlined, WifiOutlined } from "@mui/icons-material";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import Helpers from "@src/commons/helpers";

import { Divider } from "@mui/material";
import { AttributeCodes } from "@src/commons/enum";
import { IAttribute, IDetailHotel, IPriceWithCurrency, IUser } from "@src/commons/interfaces";
import { Image, OrganizationUserTable, Stars, UserList } from "@src/components";
import Constants from "@src/constants";
import { useTripContext } from "@src/providers/tripProvider";
import { PolicyComplianceText } from "../ItineraryFlightCard/Components";
import { cardContainer } from "./styles";

interface IProps {
    isSelected: boolean;
    onClick?: () => void;
    data: IDetailHotel;
    startTime: number;
    endTime: number;
    inclusive: IPriceWithCurrency;
    users: IUser[];
    userIds: string[];
    disabled?: boolean;
    hiddenUserList?: boolean;
    isInPolicy?: boolean;
}

export const ItineraryHotelCard: React.FC<IProps> = ({
    data,
    startTime,
    endTime,
    inclusive,
    userIds,
    users,
    isSelected,
    onClick,
    disabled = false,
    hiddenUserList,
    isInPolicy,
}) => {
    const {
        t,
        i18n: { language },
    } = useTranslation(["common", "tripbooking"]);

    const { genderList, listCountry, onEditUser } = useTripContext();

    const newImages = useMemo(() => {
        const images1000px = data?.photos.filter((image) => image.pixels === Constants.IMAGE_PIXELS_RANGE[2]);
        if (images1000px.length > 0) return images1000px;
        const images350px = data?.photos.filter((image) => image.pixels === Constants.IMAGE_PIXELS_RANGE[1]);
        if (images350px.length > 0) return images350px;
        const images70px = data?.photos.filter((image) => image.pixels === Constants.IMAGE_PIXELS_RANGE[0]);
        return images70px || [];
    }, [data?.photos]);

    const usersList = users.filter((user) => userIds.includes(user.id));

    return (
        <Box onClick={disabled ? undefined : onClick} sx={(theme) => cardContainer(theme, { isSelected, disabled })}>
            <Box
                sx={(theme) => ({
                    display: "flex",
                    flexWrap: "wrap",
                    flexDirection: "row",
                    borderRadius: 2,
                    overflow: "hidden",
                })}
            >
                <Box
                    sx={(theme) => ({
                        width: "40%",
                        gap: 1,
                        overflow: "hidden",
                        borderRadius: 2,
                        "& img": {
                            width: "100%",
                            height: "100%",
                            maxHeight: "300px",
                            transform: "scale(1.5)",
                            filter: "brightness(1)",
                            transitionDuration: ".3s",
                            transitionTimingFunction: "ease-out",
                            transitionProperty: "transform, filter",
                        },
                        "&:hover": {
                            "& img": {
                                transform: "scale(1)",
                                filter: "brightness(0.5)",
                            },
                        },
                    })}
                >
                    <Image src={newImages?.[0]?.photoUrl} width={0} height={0} sizes="100vw" alt={"img"} />
                </Box>
                <Box
                    sx={(theme) => ({
                        width: "60%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                    })}
                >
                    <Box
                        sx={{
                            display: "grid",
                            gap: 1,
                            p: 2,
                        }}
                    >
                        <BasicInfo data={data} />
                        <Attributes />
                        <Price inclusive={inclusive} />
                        <CheckInOut attributes={data.attributes || []} startTime={startTime} endTime={endTime} />

                        {!hiddenUserList && users.length > 0 && (
                            <>
                                <Box width={"100%"}>
                                    <Divider />
                                </Box>
                                {isInPolicy !== undefined && (
                                    <div>
                                        <PolicyComplianceText isInPolicy={isInPolicy} />
                                    </div>
                                )}
                                <UserList users={usersList} />
                            </>
                        )}
                    </Box>
                </Box>
            </Box>
            <Box>
                <OrganizationUserTable users={usersList} />
            </Box>
        </Box>
    );
};
const BasicInfo = ({ data }: { data: IDetailHotel }) => {
    const star = useMemo(
        () => Number(Helpers.getAttributeValue(data.attributes, AttributeCodes.partner_booking_ratings_property_rating)),
        [data?.attributes]
    );

    return (
        <Box sx={{ display: "grid" }}>
            <Stars {...{ value: star || 0, fontSize: "14px" }} />
            <Typography variant="h6">{data?.name}</Typography>
            <Box
                sx={{
                    gap: 1,
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                }}
            >
                <RoomOutlined />
                <Typography variant="caption">{Helpers.getAddressInfo(data?.address)}</Typography>
            </Box>
        </Box>
    );
};

const Attributes = () => (
    <Box
        sx={{
            gap: 1,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
        }}
    >
        <FreeBreakfastOutlined sx={{ fontSize: "18px", color: "green" }} />
        <FitnessCenterOutlined sx={{ fontSize: "18px", color: "green" }} />
        <SpaOutlined sx={{ fontSize: "18px", color: "green" }} />
        <WifiOutlined sx={{ fontSize: "18px", color: "green" }} />
    </Box>
);

const Price = ({ inclusive }: { inclusive: IPriceWithCurrency }) => {
    return (
        <Box
            sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 1,
            }}
        >
            <Typography variant="button" fontWeight="bold">
                {`${inclusive.currency} ${Helpers.formatCurrency(inclusive.value)}`}
            </Typography>
        </Box>
    );
};

const CheckInOut = ({ startTime, endTime, attributes }: { startTime: number; endTime: number; attributes: IAttribute[] }) => {
    const {
        t,
        i18n: { language },
    } = useTranslation();

    const checkInBeginTime = useMemo(() => Helpers.getAttributeValue(attributes, AttributeCodes.partner_booking_checkin_begin_time), [attributes]);

    const checkoutTime = useMemo(() => Helpers.getAttributeValue(attributes, AttributeCodes.partner_booking_checkout_time), [attributes]);
    return (
        <Box
            sx={(theme) => ({
                pt: "8px",
                display: "flex",
                flexWrap: "wrap",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                [theme.breakpoints.between(0, 1212)]: {
                    display: "none",
                },
            })}
        >
            <Box display="grid">
                <Typography variant="button">{t("tripbooking:checkin")}</Typography>
                <Typography variant="button" fontWeight="bold">
                    {`${Helpers.formatDateName(Number(startTime) * 1000, language)}, ${Helpers.formatMothName(
                        Number(startTime) * 1000,
                        language
                    )} ${Helpers.formatDate(Number(startTime) * 1000, "DD")}`}
                </Typography>
                <Typography variant="caption">{checkInBeginTime}</Typography>
            </Box>
            <Box display="grid">
                <Typography variant="button">{t("tripbooking:checkout")}</Typography>
                <Typography variant="button" fontWeight="bold">
                    {`${Helpers.formatDateName(Number(endTime) * 1000, language)}, ${Helpers.formatMothName(
                        Number(endTime) * 1000,
                        language
                    )} ${Helpers.formatDate(Number(endTime) * 1000, "DD")}`}
                </Typography>
                <Typography variant="caption">{checkoutTime}</Typography>
            </Box>
        </Box>
    );
};

export default ItineraryHotelCard;
