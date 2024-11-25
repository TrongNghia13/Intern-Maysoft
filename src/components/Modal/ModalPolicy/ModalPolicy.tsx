import { useState } from "react";
import { Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Box, Modal, Typography } from "@maysoft/common-component-react";
import { CalendarTodayOutlined, InfoOutlined, TrendingUpOutlined } from "@mui/icons-material";

export const ModalPolicy: React.FC = () => {
    const {
        t,
        i18n: { language },
    } = useTranslation(["common", "tripbooking"]);

    const [openPopupPolicy, setOpenPopupPolicy] = useState(false);

    return (
        <>
            <Box
                onClick={() => {
                    setOpenPopupPolicy(true);
                }}
                sx={{
                    gap: 1,
                    display: "flex",
                    alignItems: "center",
                    ":hover": { cursor: "pointer" },
                }}
            >
                <Typography variant="button" color="error">
                    {t("tripbooking:out_of_policy")}
                </Typography>
                <InfoOutlined color="error" />
            </Box>

            <Modal
                fullWidth
                key={"policy"}
                hasActionButton={false}
                visible={openPopupPolicy}
                onClose={() => {
                    setOpenPopupPolicy(false);
                }}
            >
                <>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="h6">{t("tripbooking:why_is_this_option_out_of_policy")}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Box display="grid">
                                <Box
                                    sx={{
                                        gap: 1,
                                        display: "flex",
                                        flexWrap: "wrap",
                                        alignItems: "center",
                                    }}
                                >
                                    <CalendarTodayOutlined color="error" />
                                    <Typography variant="button" color="error">
                                        {t("tripbooking:the_hotel_is_too_expensive")}
                                    </Typography>
                                </Box>
                                <Typography sx={{ paddingLeft: "27px" }} variant="button">
                                    {t("tripbooking:the_maximum_budget_is_usd_50_per_person_per_night")}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box display="grid">
                                <Box
                                    sx={{
                                        gap: 1,
                                        display: "flex",
                                        flexWrap: "wrap",
                                        alignItems: "center",
                                    }}
                                >
                                    <TrendingUpOutlined color="error" />
                                    <Typography variant="button" color="error">
                                        {t("tripbooking:the_checkin_date_is_too_soon")}
                                    </Typography>
                                </Box>
                                <Typography sx={{ paddingLeft: "27px" }} variant="button">
                                    {t("tripbooking:hotels_should_be_booked_at_least_14_days_in_advance")}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box onClick={() => {}} sx={{ ":hover": { cursor: "pointer", color: "#1A73E8" } }}>
                                <Typography variant="button">{t("tripbooking:the_full_travel_policy_is_available_here")}</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </>
            </Modal>
        </>
    );
};

export default ModalPolicy;
