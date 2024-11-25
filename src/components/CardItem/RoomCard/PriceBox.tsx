import { Box, Button, Radio, Typography } from "@maysoft/common-component-react";
import { Divider, SxProps } from "@mui/material";
import { Theme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

import { NavigateNext } from "@mui/icons-material";
import Helpers from "@src/commons/helpers";
import { IRate, IRoom } from "@src/commons/interfaces";
import Constants from "@src/constants";
import { typographyStyles } from "@src/styles/commonStyles";
import { useEffect, useMemo, useState } from "react";
import { priceStyles } from "./styles";
import { TextWithIcon, Chip } from "@src/components";

const PriceBox = ({
    item,
    selectedOptionId,
    numberOfNights,
    onSelectOption,
    onViewPriceDetails,
    onReserve,
}: {
    item: IRoom;
    selectedOptionId: string;
    numberOfNights: number;
    onViewPriceDetails?: () => void;
    onSelectOption?: (option: IRate) => void;
    onReserve: (item: IRoom) => void;
}) => {
    const { t } = useTranslation(["common", "search"]);

    const currentRate = item.rates.find((el) => el.referenceId === item.selectedRate);
    const [selectedCancellation, setSelectedCancellation] = useState<IRate>(currentRate as IRate);

    useEffect(() => {
        setSelectedCancellation(currentRate as IRate);
    }, [currentRate, currentRate?.refunable]);

    const { firstRefundableIndex, firstNonRefundableIndex, cancellationPolicy } = useMemo<{
        cancellationPolicy: IRate[];
        firstRefundableIndex: number;
        firstNonRefundableIndex: number;
    }>(() => {
        let fullyRefundable = false;
        let nonRefundable = false;
        let firstRefundableIndex = -1;
        let firstNonRefundableIndex = -1;

        item.rates.forEach((rate, index) => {
            if (rate?.refunable === true) {
                fullyRefundable = true;
                if (firstRefundableIndex == -1) firstRefundableIndex = index;
            }
            if (rate?.refunable === false) {
                nonRefundable = true;
                if (firstNonRefundableIndex == -1) firstNonRefundableIndex = index;
            }
        });

        const result = [];

        if (nonRefundable)
            result.push({
                ...item.rates[0],
                name: "non_refundable",
                cancelPenalties: item.rates[0]?.cancelPenalties,
                refunable: false,
                prices: [],
            });

        if (fullyRefundable)
            result.push({
                ...item.rates[0],
                name: "fully_refundable",
                cancelPenalties: item.rates[0]?.cancelPenalties,
                refunable: true,
                prices: [],
            });

        return {
            cancellationPolicy: result,
            firstRefundableIndex,
            firstNonRefundableIndex,
        };
    }, [item]);

    const onChangeCancellation = (value: IRate) => {
        if (value.refunable === selectedCancellation.refunable) return;
        setSelectedCancellation(value);
        if (value.refunable === true) {
            onSelectOption && onSelectOption(item.rates[firstRefundableIndex]);
        }
        if (value.refunable === false) {
            onSelectOption && onSelectOption(item.rates[firstNonRefundableIndex]);
        }
    };
    return (
        <>
            {/* {!Helpers.isNullOrEmpty(item.price) && <Divider />} */}
            <Divider />
            <Box>
                {cancellationPolicy.length === 2 && (
                    <>
                        <Typography sx={(theme) => typographyStyles(theme, { fontWeight: 600 })}>{t("detail:cancellation_policy")}</Typography>

                        {cancellationPolicy.map((rate, key) => (
                            <CancellationItem
                                {...{ rate, key, selectedCancellation, onSelectOption: (value: IRate) => onChangeCancellation(value) }}
                            />
                        ))}
                    </>
                )}
                {!Helpers.isNullOrEmpty(currentRate) && item.rates.length > 1 && (
                    <>
                        <Typography sx={(theme) => typographyStyles(theme, { fontWeight: 600 })}>{t("detail:options")}</Typography>
                        {item.rates.map((rate, key) => (
                            <Price {...{ rate, key, onSelectOption, selectedCancellation, numberOfNights, selectedOptionId }} />
                        ))}
                    </>
                )}
            </Box>
            {/* <Box display="flex" justifyContent="end">
                    {!Helpers.isNullOrEmpty(currentRate) && (
                        <SummaryPrice
                            rate={currentRate}
                            numberOfNights={numberOfNights}
                            onViewPriceDetails={onViewPriceDetails}
                            onReserve={() => onReserve(item)}
                        />
                    )}
                </Box> */}
        </>
    );
};

const CancellationItem = ({
    rate,
    selectedCancellation,
    onSelectOption,
}: {
    rate: IRate;
    selectedCancellation: IRate;
    onSelectOption: (option: IRate) => void;
}) => {
    const { t } = useTranslation("detail");
    const exclusive = useMemo(() => Helpers.getTotalByKey(rate.prices[0], "exclusive"), [rate]);
    return (
        <Box
            onClick={(e) => {
                e.stopPropagation();
                onSelectOption(rate);
            }}
            sx={{
                "&:hover": {
                    cursor: "pointer",
                },
            }}
        >
            <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box width="70%">
                    <Box display="flex" alignItems="center" gap={1}>
                        <Radio
                            checked={rate?.refunable === selectedCancellation?.refunable}
                            onClick={(e) => {
                                e.stopPropagation();
                                onSelectOption(rate);
                            }}
                        />
                        <Box>
                            <Typography sx={typographyStyles}>{t(rate.name)}</Typography>
                        </Box>
                    </Box>
                </Box>

                <Box width="30%">
                    <PriceItem
                        value={0}
                        currency={exclusive.currency}
                        sx={(theme) =>
                            priceStyles(theme, {
                                fontWeight: 400,
                                textAlign: "right",
                                fontSize: Constants.FONT_SIZE.SMALL_TEXT,
                            })
                        }
                    />
                </Box>
            </Box>
        </Box>
    );
};

const Price = ({
    rate,
    selectedOptionId,
    selectedCancellation,
    numberOfNights,
    onSelectOption,
}: {
    rate: IRate;
    selectedOptionId: string;
    selectedCancellation: IRate;
    numberOfNights: number;
    onSelectOption?: (option: IRate) => void;
}) => {
    // const available = rate.available;
    const exclusive = useMemo(() => Helpers.getTotalByKey(rate.prices[0], "exclusive"), [rate]);
    // const inclusive = useMemo(() => Helpers.getTotalByKey(rate.prices[0], "inclusive"), [rate]);
    // const inclusiveStrikethrough = useMemo(() => Helpers.getTotalByKey(rate.prices[0], "inclusiveStrikethrough"), [rate]);
    // const strikethrough = useMemo(() => Helpers.getTotalByKey(rate.prices[0], "strikethrough"), [rate]);
    const disabled = useMemo(() => rate?.refunable !== selectedCancellation?.refunable, [rate, selectedCancellation?.refunable]);

    return (
        <Box
            onClick={(e) => {
                if (disabled) return;
                e.stopPropagation();
                onSelectOption && onSelectOption(rate);
            }}
            sx={{
                "&:hover": {
                    cursor: "pointer",
                },
            }}
        >
            <Box display="flex" alignItems="center" justifyContent="space-between" gap={2.5}>
                <Box
                    sx={{
                        width: {
                            xxl: "65%",
                            xl: "55%",
                            lg: "55%",
                        },
                    }}
                >
                    <Box display="flex" alignItems="center" gap={1}>
                        <Radio
                            disabled={disabled}
                            checked={rate.referenceId === selectedOptionId}
                            onClick={(e) => {
                                e.stopPropagation();
                                onSelectOption && onSelectOption(rate);
                            }}
                        />
                        <Box>
                            <Typography
                                sx={(theme) =>
                                    typographyStyles(theme, { fontSize: Constants.FONT_SIZE.SMALL_TEXT, color: disabled ? "#cecece" : undefined })
                                }
                            >
                                {rate.name}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                <PriceItem
                    sx={(theme) =>
                        priceStyles(theme, {
                            fontWeight: 400,
                            textAlign: "right",
                            fontSize: Constants.FONT_SIZE.SMALL_TEXT,
                            color: disabled ? "#cecece" : undefined,
                        })
                    }
                    value={exclusive.value / numberOfNights}
                    currency={exclusive.currency}
                />
            </Box>
        </Box>
    );
};

const SummaryPrice = ({
    rate,
    numberOfNights,
    onViewPriceDetails,
    onReserve,
}: {
    rate: IRate;
    numberOfNights: number;
    onViewPriceDetails?: () => void;
    onReserve: () => void;
}) => {
    const { t } = useTranslation(["common", "detail"]);

    const exclusive = useMemo(() => Helpers.getTotalByKey(rate.prices[0], "exclusive"), [rate]);
    const inclusive = useMemo(() => Helpers.getTotalByKey(rate.prices[0], "inclusive"), [rate]);
    // const inclusiveStrikethrough = useMemo(() => Helpers.getTotalByKey(rate.prices[0], "inclusiveStrikethrough"), [rate]);
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
                                onViewPriceDetails && onViewPriceDetails();
                            }}
                        >
                            <TextWithIcon value={t("detail:price_details")} Icon={NavigateNext} color="primary" iconPosition="right" isLink />
                        </Box>
                    </>
                )}
            </Box>
            <Box display="flex" flexDirection="column" alignItems="end" justifyContent="space-between">
                {!Helpers.isNullOrEmpty(strikethrough) && (
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
                        onReserve();
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

export default PriceBox;
