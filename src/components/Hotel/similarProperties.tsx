import { Box, Typography } from "@maysoft/common-component-react";
import { Tooltip } from "@mui/material";
import { Theme } from "@mui/material/styles";
import { AttributeCodes } from "@src/commons/enum";
import Helpers from "@src/commons/helpers";
import { IDetailHotel } from "@src/commons/interfaces";
import Constants from "@src/constants";
import { ISearchHotelData } from "@src/hooks/searchHotel/useData";
import { titleStyles, typographyStyles } from "@src/styles/commonStyles";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { Chip } from "../Chip";
import { Stars } from "../Stars";
import { Image } from "../Image";
import { TextWithIcon } from "../TextWithIcon";
import { containerStyles, contentStyles, descriptionStyles, extraStyles, headerStyles, rowStyles } from "./styles";

interface IProps {
    data: IDetailHotel[];
    numberOfNights: number;
    searchData: ISearchHotelData;
}

const SimilarProperties: React.FC<IProps> = ({ data, numberOfNights, searchData }) => {
    const {
        t,
        i18n: { language },
    } = useTranslation(["detail"]);
    const dispatch = useDispatch();
    const router = useRouter();
    return (
        <>
            <Box display="flex" flexDirection="column" gap={2}>
                <Typography sx={titleStyles}>{t("similar_properties_with_availability")}</Typography>
            </Box>
            <Box
                sx={{
                    display: "grid",
                    width: "100%",
                    gap: 2,
                    gridTemplateColumns: {
                        xs: "repeat(2, 1fr)",
                        md: "repeat(3, 1fr)",
                        lg: "repeat(4, 1fr)",
                    },
                }}
            >
                {data.map((item, index) => (
                    <HotelCard
                        key={index}
                        item={item}
                        onClick={(value) => {
                            // dispatch(
                            //     addItemTravelersAlsoViewed({
                            //         name: item.name,
                            //         id: item.propertyId,
                            //         photoUrl: item.photos[0]?.photoUrl,
                            //         description: item.address?.cityName,
                            //     })
                            // );
                            router.push({
                                query: {
                                    id: item.propertyId,
                                    searchText: searchData?.searchText,
                                    startDate: searchData?.startDate,
                                    endDate: searchData?.endDate,
                                    occupancy: JSON.stringify(searchData?.occupancy),
                                },
                            });
                        }}
                        numberOfNights={numberOfNights}
                    />
                ))}
            </Box>
        </>
    );
};

const HotelCard = ({ item, onClick, numberOfNights }: { item: IDetailHotel; numberOfNights: number; onClick: (item: IDetailHotel) => void }) => {
    const {
        t,
        i18n: { language },
    } = useTranslation(["search", "common", "detail"]);

    const itemRoomDefault = useMemo(() => {
        return item.rooms?.find((el) => el.rates?.length > 0);
    }, [item.rooms]);

    const star = useMemo(() => Helpers.getAttributeValue(item.attributes, AttributeCodes.partner_booking_ratings_property_rating), [item.attributes]);

    const amentitiesProperty = useMemo(
        () => item.attributes.filter((el) => Constants.POPULAR_AMENTITY.includes(el.referenceId || "")),
        [item.attributes]
    );

    const itemPhoto = useMemo(() => {
        const images = item.photos || [];
        const images1000px = images.filter((image) => image.pixels === Constants.IMAGE_PIXELS_RANGE[2]);
        if (images1000px.length > 0) return images1000px;
        const images350px = images.filter((image) => image.pixels === Constants.IMAGE_PIXELS_RANGE[1]);
        if (images350px.length > 0) return images350px;
        const images70px = images.filter((image) => image.pixels === Constants.IMAGE_PIXELS_RANGE[0]);
        return images70px || [];
    }, [item.photos, item.photos.length]);

    const totalPrice = useMemo(() => {
        let totalInclusive: any;
        let totalExclusive: any;
        let totalStrikethrough: any;
        let totalExclusiveNight: any;
        let totalStrikethroughNight: any;
        let totalInclusiveStrikethrough: any;
        let percent = 0;

        itemRoomDefault?.rates?.[0]?.prices?.forEach((el) => {
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
    }, [itemRoomDefault, numberOfNights]);

    const PriceBox = () => (
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

    const address = useMemo(() => Helpers.getAddressInfo(item.address), [item.address]);
    return (
        <Box
            sx={(theme: Theme) => containerStyles(theme, {})}
            onClick={(e) => {
                e.stopPropagation();
                onClick(item);
            }}
        >
            <Box
                sx={(theme: Theme) =>
                    headerStyles(theme, {
                        backgroundImage: itemPhoto[0].photoUrl,
                    })
                }
            >
                <Box>
                    <Image key={itemPhoto[0].photoUrl} width={0} height={0} sizes="100vw" alt={item.name} src={itemPhoto[0].photoUrl} />
                </Box>
                {/* shadow */}
                <Box />
            </Box>
            <Box sx={contentStyles}>
                <Box sx={(theme: Theme) => rowStyles(theme, { gap: 1 })}>
                    <Tooltip arrow title={item.name || ""}>
                        <Typography sx={(theme) => titleStyles(theme, { numberOfLines: 1 })}>{item.name}</Typography>
                    </Tooltip>
                </Box>
                <Box>
                    <Stars value={Number(star) | 0} />

                    {address && (
                        <Typography component="span" sx={(theme) => descriptionStyles(theme, { numberOfLine: 1 })}>
                            {address}
                        </Typography>
                    )}
                </Box>
                {amentitiesProperty.length >= 1 && (
                    <Box display="flex" flexWrap="wrap" gap={1}>
                        {amentitiesProperty.map((item, key) => (
                            <TextWithIcon
                                iconName={Helpers.getIconByReferencyId(item?.referenceId || "")}
                                value={t("detail:" + Helpers.getTextByReferencyId(item?.referenceId || ""))}
                                key={key}
                            />
                        ))}
                    </Box>
                )}
            </Box>
            <Box sx={extraStyles}>
                {itemRoomDefault && <PriceBox />}
                {!itemRoomDefault && (
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
                )}
            </Box>
        </Box>
    );
};

export default SimilarProperties;
