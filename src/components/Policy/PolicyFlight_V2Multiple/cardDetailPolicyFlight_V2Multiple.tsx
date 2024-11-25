import { useState } from "react";
import { Divider, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Box, Button, Modal, Typography } from "@maysoft/common-component-react";

import Constants from "@src/constants";
import Helpers from "@src/commons/helpers";
import { ICodename } from "@src/commons/interfaces";
import { BookingTypePolicy, PolicyCriteriaCode } from "@src/commons/enum";
import useDataPolicy, { IPolicyCriteria, VALUE_ALL } from "@src/hooks/useDataPolicy.hook";


const CardDetailPolicyFlight_V2Multiple = ({
    data,

    hidenUpdate,
    hidenFlightTime,
    hidenBookingTime,

    listAriLines,
    listFlightSelected,
    onEditPolicyFlight,
}: {
    hidenUpdate?: boolean;
    hidenFlightTime?: boolean;
    hidenBookingTime?: boolean;

    listAriLines: ICodename[];
    listFlightSelected: ICodename[];

    data: Map<string, IPolicyCriteria>;
    onEditPolicyFlight?: (data: Map<string, IPolicyCriteria>) => void;
}) => {
    const {
        t,
        i18n: { language },
    } = useTranslation(["common", "setting"]);

    const {
        listCabinClass,
        getValuePolicyCriteriaByCode,
    } = useDataPolicy();

    const [openSeeMore, setOpenSeeMore] = useState<string | undefined>(undefined);

    const getValueByCode = (code: PolicyCriteriaCode) => {
        return getValuePolicyCriteriaByCode({ data: data, code: code });
    };

    return (
        <Box>
            {!Helpers.isNullOrEmpty(openSeeMore) &&
                <Modal
                    fullWidth
                    maxWidth="md"
                    visible={!Helpers.isNullOrEmpty(openSeeMore)}
                    onClose={() => { setOpenSeeMore(undefined); }}
                    onClickCloseIcon={() => { setOpenSeeMore(undefined); }}
                >
                    <>
                        {openSeeMore === PolicyCriteriaCode.International &&
                            <ItemCriteriaDetailByPolicyFlight_V2Multiple
                                label={t("setting:policy.flight_international")}
                                listFlightSelected={listFlightSelected}
                                policyCriteriaDetail={[...data?.get(PolicyCriteriaCode.International)?.policyCriteriaDetail || []]}
                            />
                        }
                        {openSeeMore === PolicyCriteriaCode.Domestic &&
                            <ItemCriteriaDetailByPolicyFlight_V2Multiple
                                label={t("setting:policy.flight_domestic")}
                                listFlightSelected={listFlightSelected}
                                policyCriteriaDetail={[...data?.get(PolicyCriteriaCode.Domestic)?.policyCriteriaDetail || []]}
                            />
                        }
                    </>
                </Modal>
            }
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="h6">
                        {t("setting:policy.flight_policy")}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <ItemCriteriaDetailByPolicyFlight_V2Multiple
                        label={t("setting:policy.flight_international")}
                        listFlightSelected={listFlightSelected}
                        policyCriteriaDetail={[...data?.get(PolicyCriteriaCode.International)?.policyCriteriaDetail || []]}
                        onSeeMore={() => { setOpenSeeMore(PolicyCriteriaCode.International) }}
                    />
                    <Divider />
                </Grid>
                <Grid item xs={12}>
                    <ItemCriteriaDetailByPolicyFlight_V2Multiple
                        label={t("setting:policy.flight_domestic")}
                        listFlightSelected={listFlightSelected}
                        policyCriteriaDetail={[...data?.get(PolicyCriteriaCode.Domestic)?.policyCriteriaDetail || []]}
                        onSeeMore={() => { setOpenSeeMore(PolicyCriteriaCode.Domestic) }}
                    />
                    <Divider />
                </Grid>

                {!hidenBookingTime &&
                    <Grid item xs={12}>
                        <Box sx={{ display: "grid" }} >
                            <Typography variant="button" sx={{ color: "#8AB9FF" }}>
                                {t("setting:policy.booking_time")}
                            </Typography>
                            <Typography variant="button">
                                {t("setting:policy.description_booking_time_flight", { bookingTime: getValueByCode(PolicyCriteriaCode.BookingTime)?.compareNumber || 0 })}
                            </Typography>
                        </Box>
                    </Grid>
                }

                {!hidenFlightTime &&
                    <Grid item xs={12}>
                        <Box sx={{ display: "grid" }} >
                            <Typography variant="button" sx={{ color: "#8AB9FF" }}>
                                {t("setting:policy.flight_time")}
                            </Typography>
                            <Typography variant="button">
                                {getValueByCode(PolicyCriteriaCode.FlightTime)?.compareNumber || 0}
                                &nbsp;
                                {t(`setting:policy.${getValueByCode(PolicyCriteriaCode.FlightTime)?.currency}`)}
                            </Typography>
                        </Box>
                    </Grid>
                }
                <Grid item xs={12}>
                    <Box sx={{ display: "grid" }} >
                        <Typography variant="button" sx={{ color: "#8AB9FF" }}>
                            {t("setting:policy.flight_class")}
                        </Typography>
                        <Typography variant="button">
                            {listAriLines?.find(el => el.code === (getValueByCode(PolicyCriteriaCode.FlightClass)?.carrier || VALUE_ALL))?.name || "-/-"}
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Box sx={{ display: "grid" }} >
                        <Typography variant="button" sx={{ color: "#8AB9FF" }}>
                            {t("setting:policy.cabin_class")}
                        </Typography>
                        <Typography variant="button">
                            {listCabinClass.find(el => el.code === (getValueByCode(PolicyCriteriaCode.CabinClass)?.cabinClass))?.name || "-/-"}
                        </Typography>
                    </Box>
                </Grid>
                {
                    !hidenUpdate &&
                    Helpers.isFunction(onEditPolicyFlight) &&
                    <Grid item xs={12}>
                        <Button onClick={() => { onEditPolicyFlight(data) }}>
                            {t("common:edit")}
                        </Button>
                    </Grid>
                }
            </Grid>
        </Box>
    );
}

export default CardDetailPolicyFlight_V2Multiple;

const ItemCriteriaDetailByPolicyFlight_V2Multiple = ({
    label,
    policyCriteriaDetail,
    listFlightSelected,
    onSeeMore,
}: {
    label: string;
    policyCriteriaDetail: any[];
    listFlightSelected: ICodename[];
    onSeeMore?: () => void;
}) => {
    const {
        t,
        i18n: { language },
    } = useTranslation(["common", "setting"]);

    return (
        <Box sx={{ display: "grid" }} >
            <Typography variant="button" sx={{ color: "#8AB9FF", marginBottom: 1 }}>
                {label}
            </Typography>
            {
                (onSeeMore
                    ? [...policyCriteriaDetail || []].slice(0, 2)
                    : [...policyCriteriaDetail || []]
                ).map((item, index) => (
                    <Box sx={{ marginBottom: 1 }} key={index}>
                        <Box sx={{
                            gap: 1,
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}>
                            {
                                (Helpers.isNullOrEmpty(item?.from) && Helpers.isNullOrEmpty(item?.to))
                                    ? <Typography variant="button">{t("setting:policy.all_airports")}</Typography>
                                    : <Typography variant="button">
                                        {
                                            (item?.from === item?.to)
                                                ? (listFlightSelected.find(el => el.code === (item?.from || VALUE_ALL))?.name || "-/-")
                                                : (
                                                    [
                                                        `Từ: ${listFlightSelected.find(el => el.code === (item?.from || VALUE_ALL))?.name || "-/-"}`,
                                                        `đến: ${listFlightSelected.find(el => el.code === (item?.to || VALUE_ALL))?.name || "-/-"}`
                                                    ].join("  =>  ")
                                                )
                                        }
                                    </Typography>
                            }
                            <Typography variant="button">
                                {Helpers.formatCurrency(item?.bookingBudget || 0)}
                                &nbsp;
                                {`(${item?.currency || Constants.CURRENCY_DEFAULT})`}
                            </Typography>
                        </Box>
                    </Box>
                ))
            }
            {onSeeMore &&
                [...policyCriteriaDetail || []].length > 2 &&
                <Box onClick={onSeeMore} sx={{
                    textAlign: "center",
                    display: "inline-flex",
                    justifyContent: "center",
                    "&:hover": {
                        ".MuiTypography-root": {
                            color: "#1A73E8",
                            cursor: "pointer",
                            fontWeight: "bold",
                        }
                    },
                }}>
                    <Typography
                        color="info"
                        variant="button"
                    >
                        {"xem thêm"}
                    </Typography>
                </Box>
            }
        </Box>
    );
}