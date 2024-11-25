import { useState } from "react";
import { Divider, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Box, Button, Modal, Typography } from "@maysoft/common-component-react";

import Constants from "@src/constants";
import Helpers from "@src/commons/helpers";

import { BoxStar } from ".";
import { ICodename } from "@src/commons/interfaces";
import { PolicyCriteriaCode } from "@src/commons/enum";
import { IPolicyCriteria } from "@src/hooks/useDataPolicy.hook";



const CardDetailPolicyStay_V2Multiple = ({
    data,
    hidenUpdate,
    onEditPolicyStay,
    listStaySelected,
    hidenBookingTime,
}: {
    hidenUpdate?: boolean,
    hidenBookingTime?: boolean,
    data: Map<string, IPolicyCriteria>,
    listStaySelected: ICodename[],
    onEditPolicyStay?: (data: Map<string, IPolicyCriteria>) => void;
}) => {
    const {
        t,
        i18n: { language },
    } = useTranslation(["common", "setting"]);

    const [openSeeMore, setOpenSeeMore] = useState<string | undefined>(undefined);

    const getValueByCode = (code: PolicyCriteriaCode) => {
        return data?.get(code)?.policyCriteriaDetail?.[0];
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
                            <ItemCriteriaDetailByPolicyStay_V2Multiple
                                listStaySelected={listStaySelected}
                                label={t("setting:policy.hotel_international")}
                                policyCriteriaDetail={[...data?.get(PolicyCriteriaCode.International)?.policyCriteriaDetail || []]}
                            />
                        }
                        {openSeeMore === PolicyCriteriaCode.Domestic &&
                            <ItemCriteriaDetailByPolicyStay_V2Multiple
                                label={t("setting:policy.hotel_domestic")}
                                listStaySelected={listStaySelected}
                                policyCriteriaDetail={[...data?.get(PolicyCriteriaCode.Domestic)?.policyCriteriaDetail || []]}
                            />
                        }
                    </>
                </Modal>
            }
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="h6">{t("setting:policy.hotel_policy")}</Typography>
                </Grid>

                <Grid item xs={12}>
                    <ItemCriteriaDetailByPolicyStay_V2Multiple
                        listStaySelected={listStaySelected}
                        label={t("setting:policy.hotel_international")}
                        policyCriteriaDetail={[...data?.get(PolicyCriteriaCode.International)?.policyCriteriaDetail || []]}
                        onSeeMore={() => { setOpenSeeMore(PolicyCriteriaCode.International) }}
                    />
                    <Divider />
                </Grid>

                <Grid item xs={12}>
                    <ItemCriteriaDetailByPolicyStay_V2Multiple
                        label={t("setting:policy.hotel_domestic")}
                        listStaySelected={listStaySelected}
                        policyCriteriaDetail={[...data?.get(PolicyCriteriaCode.Domestic)?.policyCriteriaDetail || []]}
                        onSeeMore={() => { setOpenSeeMore(PolicyCriteriaCode.Domestic) }}
                    />
                    <Divider />
                </Grid>

                {!hidenBookingTime &&
                    <Grid item xs={12}>
                        <Box sx={{ display: "grid" }} >
                            <Typography variant="button" sx={{ color: "#8AB9FF" }}>{t("setting:policy.booking_time")}</Typography>
                            <Typography variant="button">
                                {t("setting:policy.description_booking_time_hotel", { bookingTime: getValueByCode(PolicyCriteriaCode.BookingTime)?.compareNumber || 0 })}
                            </Typography>
                        </Box>
                    </Grid>
                }

                <Grid item xs={12}>
                    <Box sx={{ display: "grid" }} >
                        <Typography variant="button" sx={{ color: "#8AB9FF" }}>
                            {t("setting:policy.maximum_star_rating")}
                        </Typography>
                        <BoxStar number={getValueByCode(PolicyCriteriaCode.StarClass)?.compareNumber || 0} />
                    </Box>
                </Grid>

                {
                    !hidenUpdate &&
                    Helpers.isFunction(onEditPolicyStay) &&
                    <Grid item xs={12}>
                        <Button onClick={() => { onEditPolicyStay(data) }}>
                            {t("common:edit")}
                        </Button>
                    </Grid>
                }
            </Grid>
        </Box>
    );
};

export default CardDetailPolicyStay_V2Multiple;

const ItemCriteriaDetailByPolicyStay_V2Multiple = ({
    label,
    policyCriteriaDetail,
    listStaySelected,
    onSeeMore,
}: {
    label: string;
    policyCriteriaDetail: any[];
    listStaySelected: ICodename[];
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
                    <Box sx={{ marginBottom: 2 }} key={index}>
                        <Box sx={{
                            gap: 1,
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}>
                            {
                                Helpers.isNullOrEmpty(item?.from)
                                    ? <Typography variant="button">{t("setting:policy.all_destinations")}</Typography>
                                    : (
                                        <Typography variant="button">
                                            {listStaySelected.find(el => el.code === item?.from)?.name || ""}
                                        </Typography>
                                    )
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