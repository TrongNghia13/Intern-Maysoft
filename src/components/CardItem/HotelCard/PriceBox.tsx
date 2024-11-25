import { Box, Typography } from "@maysoft/common-component-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import Helpers from "@src/commons/helpers";
import Constants from "@src/constants";

import { IRoom } from "@src/commons/interfaces";
import { typographyStyles } from "@src/styles/commonStyles";
import { Chip } from "@src/components";

const PriceBox = ({ roomDefault, numberOfNights }: { roomDefault: IRoom | undefined; numberOfNights: number }) => {
    const {
        t,
        i18n: { language },
    } = useTranslation(["search", "common", "detail"]);

    if (!roomDefault)
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

    const totalPrice = useMemo(() => {
        let totalInclusive: any;
        let totalExclusive: any;
        let totalStrikethrough: any;
        let totalExclusiveNight: any;
        let totalStrikethroughNight: any;
        let totalInclusiveStrikethrough: any;
        let percent = 0;

        roomDefault?.rates?.[0]?.prices?.forEach((el) => {
            const exclusive = Helpers.getTotalByKey(el, "exclusive");
            const inclusive = Helpers.getTotalByKey(el, "inclusive");
            const strikethrough = Helpers.getTotalByKey(el, "strikethrough");
            const inclusiveStrikethrough = Helpers.getTotalByKey(el, "inclusiveStrikethrough");

            totalExclusive = {
                currency: exclusive.currency,
                value: (totalExclusive?.value || 0) + exclusive.value,
            };
            totalExclusiveNight = {
                currency: exclusive.currency,
                value: (totalExclusiveNight?.value || 0) + exclusive.value / numberOfNights,
            };
            totalInclusive = {
                currency: inclusive.currency,
                value: (totalInclusive?.value || 0) + inclusive.value,
            };
            totalStrikethrough = {
                currency: strikethrough.currency,
                value: (totalStrikethrough?.value || 0) + strikethrough.value,
            };
            totalStrikethroughNight = {
                currency: strikethrough.currency,
                value: (totalStrikethroughNight?.value || 0) + strikethrough.value / numberOfNights,
            };
            totalInclusiveStrikethrough = {
                currency: inclusiveStrikethrough.currency,
                value: (totalInclusiveStrikethrough?.value || 0) + inclusiveStrikethrough.value,
            };
        });

        if (
            !Helpers.isNullOrEmpty(totalExclusive?.value) &&
            !Helpers.isNullOrEmpty(totalStrikethrough?.value) &&
            totalExclusive?.value > 0 &&
            totalStrikethrough?.value > 0
        ) {
            percent = +100 - (totalExclusive?.value / totalStrikethrough?.value) * 100;
        }

        return {
            percent: percent,
            inclusive: totalInclusive,
            exclusive: totalExclusiveNight,
            strikethrough: totalStrikethroughNight,
            inclusiveStrikethrough: totalInclusiveStrikethrough,
        };
    }, [roomDefault, numberOfNights]);

    return (
        <Box
            sx={(theme) => ({
                display: "flex",
                flexWrap: "wrap",
                alignItems: "end",
                justifyContent: "right",
                flexDirection: "column",
            })}
        >
            {totalPrice?.percent > 0 && <Chip value={`${totalPrice?.percent.toFixed(0)}% off`} color="success" />}

            <Box
                sx={{
                    gap: 1,
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                {!Helpers.isNullOrEmpty(totalPrice?.strikethrough?.value) && totalPrice?.strikethrough?.value > 0 && (
                    <Typography
                        sx={(theme) =>
                            typographyStyles(theme, {
                                fontWeight: 400,
                                textDecoration: "line-through",
                                fontSize: Constants.FONT_SIZE.SMALL_TEXT,
                            })
                        }
                    >
                        {totalPrice?.strikethrough?.currency} {Helpers.formatCurrency(totalPrice?.strikethrough?.value)}
                    </Typography>
                )}

                {!Helpers.isNullOrEmpty(totalPrice?.exclusive?.value) && totalPrice?.exclusive?.value > 0 && (
                    <Typography sx={(theme) => typographyStyles(theme, { fontWeight: 600 })}>
                        {totalPrice?.exclusive?.currency} {Helpers.formatCurrency(totalPrice?.exclusive?.value)}
                    </Typography>
                )}
            </Box>

            {!Helpers.isNullOrEmpty(totalPrice?.inclusive?.value) && totalPrice?.inclusive?.value > 0 && (
                <>
                    <Typography color="secondary" sx={(theme) => typographyStyles(theme, { fontSize: Constants.FONT_SIZE.SMALL_TEXT })}>
                        {totalPrice?.inclusive?.currency} {Helpers.formatCurrency(totalPrice?.inclusive?.value)}
                    </Typography>
                    <Typography color="secondary" sx={(theme) => typographyStyles(theme, { fontSize: Constants.FONT_SIZE.SMALL_TEXT })}>
                        {t("common:includes_taxes_and_fees")}
                    </Typography>
                </>
            )}
        </Box>
    );
};

export default PriceBox;
