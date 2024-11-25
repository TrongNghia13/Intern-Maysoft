import { Box, Typography } from "@maysoft/common-component-react";
import { NavigateNext } from "@mui/icons-material";
import { SvgIconTypeMap, Tooltip } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { Theme } from "@mui/material/styles";
import { useTranslation } from "next-i18next";
import React, { useMemo } from "react";

import { AttributeCodes } from "@src/commons/enum";
import Helpers from "@src/commons/helpers";
import { IMultiLanguageContent, IOptionalAttributes, IRate, IRoom } from "@src/commons/interfaces";
import Categories from "./Categories";
import PriceBox from "./PriceBox";
import RefundableBox from "./RefundableBox";
import SummaryPrice from "./SummaryPrice";
import { containerStyles, contentStyles, descriptionStyles, extraStyles, headerStyles, rowStyles, titleStyles } from "./styles";
import { TextWithIcon, Image } from "@src/components";

export type IAttribute = { Icon: OverridableComponent<SvgIconTypeMap>; value: IMultiLanguageContent; iconName: string };

interface IProps {
    item: IRoom;
    numberOfNights?: number;
    fromDate?: number;
    toDate?: number;

    optionalAttributes?: IOptionalAttributes;
    viewMoreClick?: () => void;
    onViewPriceDetails?: () => void;
    onSelectOption?: (option: IRate, id: string) => void;
    onReserve?: (item: IRoom) => void;
}

export const RoomCard: React.FC<IProps> = ({
    item,
    optionalAttributes,
    fromDate,
    toDate,
    viewMoreClick,
    onViewPriceDetails,
    onSelectOption,
    onReserve,
    numberOfNights = 1,
}: IProps) => {
    const {
        t,
        i18n: { language },
    } = useTranslation(["commom", "detail"]);

    const attributes = useMemo(() => {
        const result = [
            {
                iconName: "aspect_ratio",
                value:
                    language === "vi"
                        ? `${Helpers.getAttributeValue(item.attributes, AttributeCodes.product_booking_area_square_meters)} mét vuông`
                        : `${Helpers.getAttributeValue(item.attributes, AttributeCodes.product_booking_area_square_feet)} sq ft`,
            },
            {
                iconName: "people",
                value: t("detail:sleeps", {
                    number: Helpers.getAttributeValue(item.attributes, AttributeCodes.product_booking_occupancy_max_allowed_total),
                }),
            },
            {
                iconName: "hotel",
                value: Helpers.getAttributeValue(item.attributes, AttributeCodes.product_booking_bed_groups),
            },
        ];
        if (optionalAttributes?.reserve)
            result.splice(0, 0, {
                iconName: "check",
                value: t("detail:reserve_now_pay_later"),
            });
        if (optionalAttributes?.wifi)
            result.splice(1, 0, {
                iconName: "wifi",
                value: t("detail:free_wifi"),
            });
        if (optionalAttributes?.parking)
            result.splice(1, 0, {
                iconName: "local_parking",
                value: t("detail:free_self_parking"),
            });
        if (Helpers.getAttributeValue(item.attributes, AttributeCodes.product_booking_room_views))
            result.splice(1, 0, {
                iconName: "location_city",
                value: Helpers.getAttributeValue(item.attributes, AttributeCodes.product_booking_room_views),
            });
        return result;
    }, [item, language, optionalAttributes, t]);

    return (
        // <Link href={href} onClick={onClick}>
        // </Link>

        <Box sx={(theme: Theme) => containerStyles(theme, {})}>
            <Box
                sx={(theme: Theme) =>
                    headerStyles(theme, {
                        backgroundImage: item.photos[0]?.photoUrl,
                    })
                }
            >
                <Box>
                    <Image src={item.photos[0]?.photoUrl} width={0} height={0} sizes="100vw" alt="banner image" loading="lazy" />
                </Box>
                {/* shadow */}
                <Box />
                {/* <TagBox item={item} /> */}
            </Box>
            <Box sx={contentStyles}>
                <Categories data={[]} />
                <Box sx={(theme: Theme) => rowStyles(theme, { gap: 1 })}>
                    <Tooltip arrow title={item.name || ""}>
                        <Typography sx={(theme) => titleStyles(theme, { fullWidth: true })}>{item.name}</Typography>
                    </Tooltip>
                </Box>
                <Box>
                    {!Helpers.isNullOrEmpty(toDate) && !Helpers.isNullOrEmpty(fromDate) && (
                        <Typography component="span" sx={(theme) => descriptionStyles(theme, { numberOfLine: 1 })}>
                            {[Helpers.formatDate(Number(fromDate) * 1000), Helpers.formatDate(Number(toDate) * 1000)].join(" - ")}
                        </Typography>
                    )}
                </Box>
                {(attributes || []).length >= 1 && (
                    <Box>{attributes?.map((att, index) => <TextWithIcon value={att.value} iconName={att.iconName} key={index} />)}</Box>
                )}

                <RefundableBox item={item} />

                {viewMoreClick && (
                    <Box
                        onClick={(e) => {
                            e.stopPropagation();
                            viewMoreClick();
                        }}
                    >
                        <TextWithIcon value={t("detail:more_details")} Icon={NavigateNext} color="primary" iconPosition="right" isLink />
                    </Box>
                )}
                <PriceBox
                    item={item}
                    numberOfNights={numberOfNights}
                    selectedOptionId={item.selectedRate}
                    onViewPriceDetails={onViewPriceDetails}
                    onSelectOption={(value) => onSelectOption && onSelectOption(value, item.referenceId)}
                    onReserve={(value) => onReserve && onReserve(value)}
                />
            </Box>
            <Box sx={extraStyles}>
                <SummaryPrice
                    item={item}
                    numberOfNights={numberOfNights}
                    onViewPriceDetails={onViewPriceDetails}
                    onReserve={(value) => onReserve && onReserve(value)}
                />
            </Box>
        </Box>
    );
};

export default RoomCard;
