import { Box, Button, FormField, Typography } from "@maysoft/common-component-react";
import { Close, Forward10Outlined, HotelOutlined, KeyboardArrowDownOutlined, KeyboardArrowUpOutlined, RoomOutlined } from "@mui/icons-material";
import { Divider, Grid, IconButton } from "@mui/material";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { IMAGES } from "@src/assets/data";
import Helpers from "@src/commons/helpers";
import { Avatar, CustomDrawer } from "@src/components";
import { ModalPolicy } from "../Modal";
import { Stars } from "../Stars";

interface IProps {
    openModal: boolean;
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;

    itemSelected?: any;
    dataDetailHotel: any;
    isAddToTrip?: boolean;
    itemRoomSelected?: any;

    endTime?: string | number;
    startTime?: string | number;

    onClickAddToTrip?: () => void;
    onClickAddToTripAddPayment?: () => void;
}

const PopupDetailHotel: React.FC<IProps> = (props: IProps) => {
    const {
        t,
        i18n: { language },
    } = useTranslation(["common", "tripbooking"]);

    const [valueNote, setValueNote] = useState("");
    const [hidenInstructions, setHidenInstructions] = useState(true);

    const timeString = useMemo(() => {
        let str = "";

        str = str + Helpers.formatMothName(Number(props.startTime) * 1000, language);
        str = str + " " + Helpers.formatDate(Number(props.startTime) * 1000, "DD");
        str = str + " - " + Helpers.formatMothName(Number(props.endTime) * 1000, language);
        str = str + " " + Helpers.formatDate(Number(props.endTime) * 1000, "DD");

        return str;
    }, [props.startTime, props.endTime, language]);

    const RenderCardConent = () => (
        <Grid container spacing={0}>
            <Grid item xs={12}>
                <Box
                    sx={(theme) => ({
                        display: "flex",
                        flexWrap: "wrap",
                        paddingBottom: 3,
                        flexDirection: "row",
                        [theme.breakpoints.between(0, 800)]: {
                            flexDirection: "column",
                        },
                    })}
                >
                    <Box
                        sx={(theme) => ({
                            width: "186px",
                            height: "116px",
                            display: "flex",
                            flexWrap: "wrap",
                            flexDirection: "column",
                        })}
                    >
                        <Avatar
                            src={Helpers.getRandomElemementInArray(IMAGES)}
                            sx={(theme) => ({
                                width: "100%",
                                height: "100%",
                                borderRadius: "8px",
                            })}
                        />
                    </Box>
                    <Box
                        sx={(theme) => ({
                            display: "flex",
                            paddingTop: "8px",
                            paddingLeft: "16px",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            [theme.breakpoints.between(0, 800)]: {
                                paddingLeft: "0px",
                            },
                        })}
                    >
                        <Box sx={{ display: "grid" }}>
                            {props.dataDetailHotel?.star && <Stars {...{ value: props.dataDetailHotel?.star, fontSize: "14px" }} />}
                            <Typography variant="h6">{props.dataDetailHotel?.name}</Typography>
                            <Box
                                sx={{
                                    gap: 1,
                                    display: "flex",
                                    flexWrap: "wrap",
                                    alignItems: "center",
                                }}
                            >
                                <RoomOutlined />
                                <Typography variant="caption">{props.dataDetailHotel?.addressName}</Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
                <Divider />
            </Grid>

            <Grid item xs={12}>
                <Box my={3}>
                    <Typography sx={{ paddingBottom: 2, fontSize: "1.25rem" }} variant="button" fontWeight="light">
                        {t("tripbooking:overview")}
                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            paddingBottom: 2,
                            justifyContent: "space-between",
                        }}
                    >
                        <Box display="grid">
                            <Box
                                sx={{
                                    gap: 1,
                                    display: "flex",
                                    flexWrap: "wrap",
                                    alignItems: "center",
                                }}
                            >
                                <HotelOutlined />
                                <Typography variant="button">{`2 night stay (${timeString})`}</Typography>
                            </Box>
                            <Typography sx={{ pl: "27px" }} variant="button" color="secondary">
                                {props.itemRoomSelected?.note}
                            </Typography>
                        </Box>

                        <Typography variant="button">${props.itemSelected?.price}</Typography>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "space-between",
                        }}
                    >
                        <Typography variant="button" fontWeight="medium">
                            {t("tripbooking:total")}
                        </Typography>
                        <Typography variant="button" fontWeight="medium">
                            ${props.itemSelected?.price}
                        </Typography>
                    </Box>
                </Box>
                <Divider />
            </Grid>

            <Grid item xs={12}>
                <Box my={3}>
                    <Typography sx={{ paddingBottom: 2, fontSize: "1.25rem" }} variant="button" fontWeight="light">
                        {t("tripbooking:checkin_details")}
                    </Typography>
                    <Box display="grid">
                        <Box
                            sx={{
                                gap: 1,
                                display: "flex",
                                flexWrap: "wrap",
                                alignItems: "center",
                            }}
                        >
                            <HotelOutlined />
                            <Typography variant="button">{t("tripbooking:checkin_is_open_from")}</Typography>
                        </Box>
                        <Box
                            sx={{
                                gap: 1,
                                display: "flex",
                                flexWrap: "wrap",
                                alignItems: "center",
                            }}
                        >
                            <Forward10Outlined />
                            <Typography variant="button">{t("tripbooking:24_hour_front_desk")}</Typography>
                        </Box>
                        <Box
                            onClick={() => {
                                setHidenInstructions((prev) => !prev);
                            }}
                            sx={{
                                gap: 1,
                                display: "flex",
                                flexWrap: "wrap",
                                alignItems: "center",
                                ":hover": { cursor: "pointer" },
                            }}
                        >
                            <Typography color="info" variant="button" fontWeight="bold">
                                {t("tripbooking:show_full_checkin_details")}
                            </Typography>
                            {hidenInstructions ? <KeyboardArrowDownOutlined color="info" /> : <KeyboardArrowUpOutlined color="info" />}
                        </Box>

                        {!hidenInstructions && (
                            <Box display="grid">
                                <Typography variant="button" fontWeight="bold">
                                    {title}
                                </Typography>
                                <ul>
                                    {options.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                                <Typography variant="button">{note}</Typography>
                            </Box>
                        )}
                    </Box>
                </Box>
                <Divider />
            </Grid>

            {props.isAddToTrip ? (
                <Grid item xs={12}>
                    <Box my={3} display={"grid"}>
                        <Typography sx={{ paddingBottom: 2, fontSize: "1.25rem" }} variant="button" fontWeight="light">
                            {`${t("tripbooking:add_note_for")} ${props.dataDetailHotel?.name}`}
                        </Typography>
                        <Typography variant="button">
                            {`We'll forward your message to ${props.dataDetailHotel?.name}. Requests aren't guaranteed so check directly with the property for confirmation. Any extra costs must be paid on arrival.`}
                        </Typography>
                        <FormField
                            multiline
                            minRows={3}
                            variant="outlined"
                            defaultValue={valueNote}
                            onBlur={(value) => {
                                setValueNote(value);
                            }}
                        />
                    </Box>
                </Grid>
            ) : (
                <Grid item xs={12}>
                    <Box my={3} display={"grid"}>
                        <Typography sx={{ paddingBottom: 2, fontSize: "1.25rem" }} variant="button" fontWeight="light">
                            {`${t("tripbooking:note_for")} ${props.dataDetailHotel?.name}`}
                        </Typography>
                        <Typography variant="button">{""}</Typography>
                    </Box>
                </Grid>
            )}
        </Grid>
    );

    return (
        <>
            <CustomDrawer variant="permanent" ownerState={{ openConfigurator: props.openModal }}>
                <Box>
                    <Box
                        style={{
                            top: 0,
                            left: 0,
                            right: 0,
                            zIndex: 111,
                            position: "sticky",
                            backgroundColor: "#fff",
                        }}
                    >
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Typography variant="h6">{t("tripbooking:review_otel_details")}</Typography>
                            <IconButton
                                onClick={() => {
                                    props.setOpenModal(false);
                                }}
                            >
                                <Close />
                            </IconButton>
                        </Box>
                    </Box>

                    <Box p={2} sx={{ overflowY: "auto" }}>
                        <RenderCardConent />
                    </Box>

                    <Box
                        style={{
                            position: "sticky",
                            backgroundColor: "#fff",
                            bottom: 0,
                            right: 0,
                            left: 0,
                        }}
                    >
                        <Divider />
                        <Box
                            sx={{
                                p: 1,
                                display: "flex",
                                flexWrap: "wrap",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <Box>
                                {/* Policy */}
                                <ModalPolicy />
                                {/*  */}
                                <Typography variant="h6">${props.itemSelected?.price}</Typography>
                                <Typography variant="button">
                                    {`1 ${t("tripbooking:adult").toLocaleUpperCase()} / 2 ${t("tripbooking:night").toLocaleUpperCase()}`}
                                </Typography>
                            </Box>
                            {props.isAddToTrip && (
                                <Box sx={{ gap: 1, display: "flex", alignItems: "center" }}>
                                    <Button
                                        onClick={() => {
                                            props.setOpenModal(false);
                                            props.onClickAddToTrip && props.onClickAddToTrip();
                                        }}
                                    >
                                        {t("tripbooking:add_to_trip")}
                                    </Button>
                                    <Button
                                        color={"info"}
                                        onClick={() => {
                                            props.setOpenModal(false);
                                            props.onClickAddToTripAddPayment && props.onClickAddToTripAddPayment();
                                        }}
                                    >
                                        {t("tripbooking:add_to_trip_and_payment")}
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    </Box>
                </Box>
            </CustomDrawer>
        </>
    );
};

export default PopupDetailHotel;

const title = `Check-in instructions:`;
const options = [
    `Extra-person charges may apply and vary depending on property policy`,
    `Government-issued photo identification and a credit card, debit card, or cash deposit may be required at check-in for incidental charges`,
    `Special requests are subject to availability upon check-in and may incur additional charges; special requests cannot be guaranteed`,
    `Guests must contact this property in advance to reserve cribs/infant beds and rollaway/extra beds`,
    `This property accepts credit cards and cash`,
    `Safety features at this property include a fire extinguisher, a smoke detector, a security system, and window guards`,
    `Please note that cultural norms and guest policies may differ by country and by property; the policies listed are provided by the property`,
    `Additional fees apply to children 6 - 9 years old for breakfast using the existing bedding.`,
];
const note = `This property offers transfers from the airport (surcharges may apply). Guests must contact the property with arrival details before travel, using the contact information on the booking confirmation. Front desk staff will greet guests on arrival. At check-in, guests must provide either a negative COVID-19 test result or a record of full COVID-19 vaccination. The negative COVID-19 test result requirement applies to all guests aged 18 and up, and test must have been administered no more than 48 hours prior to check-in. COVID-19 vaccination record requirement applies to all guests aged 18 and up; guests must have received complete vaccination at least 2 days prior to check-in. For more details, please contact the property using the information on the booking confirmation.`;
