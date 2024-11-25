import { Box, Button, Typography } from "@maysoft/common-component-react";
import { SxProps } from "@mui/material";
import { Theme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { NavigateNext } from "@mui/icons-material";
import Helpers from "@src/commons/helpers";
import { IRoom } from "@src/commons/interfaces";
import Constants from "@src/constants";
import { typographyStyles } from "@src/styles/commonStyles";
import { useMemo } from "react";
import { priceStyles } from "./styles";
import { TextWithIcon, Chip } from "@src/components";

const SummaryPrice = ({
    item,
    numberOfNights,
    onViewPriceDetails,
    onReserve,
}: {
    item: IRoom;
    numberOfNights: number;
    onViewPriceDetails?: (item: IRoom) => void;
    onReserve: (item: IRoom) => void;
}) => {
    const { t } = useTranslation(["common", "detail", "search"]);

    const rate = useMemo(() => item.rates.find((el) => el.referenceId === item.selectedRate), [item?.rates, item?.selectedRate]);

    if (Helpers.isNullOrEmpty(rate))
        return (
            <Typography
                sx={(theme) =>
                    typographyStyles(theme, {
                        fontWeight: 600,
                        fontSize: Constants.FONT_SIZE.SMALL_TEXT,
                        color: "error",
                        textAlign: "right",
                    })
                }
            >
                {t("search:we_are_sold_out")}
            </Typography>
        );

    const exclusive = useMemo(() => Helpers.getTotalByKey(rate.prices[0], "exclusive"), [rate]);
    const inclusive = useMemo(() => Helpers.getTotalByKey(rate.prices[0], "inclusive"), [rate]);
    const inclusiveStrikethrough = useMemo(() => Helpers.getTotalByKey(rate.prices[0], "inclusiveStrikethrough"), [rate]);
    const strikethrough = useMemo(() => Helpers.getTotalByKey(rate.prices[0], "strikethrough"), [rate]);

    const percent = useMemo(() => 100 - (exclusive.value / strikethrough.value) * 100, [exclusive.value, strikethrough.value]);
    const exclusivePerNight = useMemo(() => Math.round(exclusive.value / numberOfNights), [exclusive.value, numberOfNights]);
    const strikethroughPerNight = useMemo(() => Math.round(strikethrough.value / numberOfNights), [strikethrough.value, numberOfNights]);

    return (
        <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
            <Box>
                {percent > 0 && <Chip value={`${Math.round(percent)}% off`} color="success" />}
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    {!Helpers.isNullOrEmpty(exclusive) && (
                        <PriceItem sx={(theme) => priceStyles(theme, {})} value={exclusivePerNight} currency={exclusive.currency} />
                    )}
                </Box>

                {!Helpers.isNullOrEmpty(inclusive) && (
                    <>
                        <PriceItem
                            sx={(theme) => priceStyles(theme, { fontWeight: 400, fontSize: Constants.FONT_SIZE.SMALL_TEXT })}
                            value={inclusive.value}
                            currency={inclusive.currency}
                        />
                        <Typography sx={(theme) => priceStyles(theme, { fontWeight: 400, fontSize: Constants.FONT_SIZE.SMALL_TEXT })}>
                            {t("includes_taxes_and_fees")}
                        </Typography>
                        <Box
                            onClick={(e) => {
                                e.stopPropagation();
                                onViewPriceDetails && onViewPriceDetails(item);
                            }}
                        >
                            <TextWithIcon value={t("detail:price_details")} Icon={NavigateNext} color="primary" iconPosition="right" isLink />
                        </Box>
                    </>
                )}
            </Box>
            <Box display="flex" flexDirection="column" alignItems="end" justifyContent="space-between">
                {!Helpers.isNullOrEmpty(strikethrough) && strikethrough.value !== 0 && (
                    <PriceItem
                        sx={(theme) =>
                            priceStyles(theme, { fontWeight: 400, fontSize: Constants.FONT_SIZE.SMALL_TEXT, textDecoration: "line-through" })
                        }
                        value={strikethroughPerNight}
                        currency={strikethrough.currency}
                    />
                )}
                <Typography sx={(theme) => typographyStyles(theme, { fontSize: Constants.FONT_SIZE.SMALL_TEXT, color: "error" })}>
                    {t("we_have_quantity_left", { quantity: rate?.available })}
                </Typography>
                <Button
                    variant="outlined"
                    onClick={(e) => {
                        e.stopPropagation();
                        onReserve(item);
                    }}
                >
                    {t("reserve")}
                </Button>
            </Box>
        </Box>
    );
};

const PriceItem = ({ sx, currency, value }: { sx: SxProps<Theme> | undefined; currency: string; value: number }) => {
    return (
        <Typography sx={sx}>
            {currency} {Helpers.formatCurrency(value)}
        </Typography>
    );
};

export default SummaryPrice;
