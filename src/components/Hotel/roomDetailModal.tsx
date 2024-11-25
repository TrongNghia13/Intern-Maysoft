import { Box, Modal, Typography } from "@maysoft/common-component-react";
import { AutoAwesome } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";

import { IOptionalAttributes, IPhoto, IRate, IRoom } from "@src/commons/interfaces";
import Constants from "@src/constants";
import { titleStyles, typographyStyles } from "@src/styles/commonStyles";
import PriceBox from "../CardItem/RoomCard/PriceBox";
import Helpers from "@src/commons/helpers";
import { useMemo } from "react";
import { useAttributes } from "@src/hooks/room/useAttribute";
import SummaryPrice from "../CardItem/RoomCard/SummaryPrice";
import { TextWithIcon } from "../TextWithIcon";
import { Image } from "../Image";

const RoomDetailModal = ({
    visibled,
    data,
    setVisibled,
    onSelectOption,
    optionalAttributes,
    numberOfNights = 1,
    onViewPriceDetails,
    onReserve,
}: {
    visibled: boolean;
    data: IRoom;
    numberOfNights: number;
    optionalAttributes: IOptionalAttributes;
    setVisibled: React.Dispatch<React.SetStateAction<boolean>>;
    onSelectOption?: (option: IRate) => void;
    onViewPriceDetails: (item: IRoom) => void;
    onReserve: (item: IRoom) => void;
}) => {
    const {
        t,
        i18n: { language },
    } = useTranslation("detail");
    const handleSubmit = () => {
        setVisibled(false);
    };

    const { getHighlightAttributesByRoom } = useAttributes();
    const highlights = useMemo(() => Helpers.getHighlightAttributes(data.attributes), [data.attributes]);
    const popularAmenities = useMemo(
        () =>
            getHighlightAttributesByRoom({
                item: data,
                language,
                optionalAttributes,
            }),
        [language, optionalAttributes, data, t]
    );

    const newImages = useMemo(() => {
        const images1000px = (data.photos || []).filter((image) => image.pixels === Constants.IMAGE_PIXELS_RANGE[2]);
        if (images1000px.length > 0) return images1000px;
        const images350px = (data.photos || []).filter((image) => image.pixels === Constants.IMAGE_PIXELS_RANGE[1]);
        if (images350px.length > 0) return images350px;
        const images70px = (data.photos || []).filter((image) => image.pixels === Constants.IMAGE_PIXELS_RANGE[0]);
        return images70px || [];
    }, [data.photos]);

    return (
        <Modal
            fullWidth
            maxWidth={"md"}
            // hasActionButton
            visible={visibled}
            title={"Room information"}
            onAction={handleSubmit}
            onClose={() => setVisibled(false)}
        >
            <Box
                sx={{
                    overflow: "auto",
                    height: "min(600px, 70vh)",
                    pb: 2,
                }}
            >
                <ImageSlides images={newImages} />
                <Box display="grid" gap={1}>
                    <Typography sx={titleStyles}>{data.name}</Typography>
                    {/* <Typography sx={typographyStyles}>{data.description}</Typography> */}

                    <Box
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            backgroundColor: "#f3f3f3",
                            display: "grid",
                            gap: 1,
                        }}
                    >
                        <Box display="flex" alignItems="center" gap={1}>
                            <AutoAwesome />
                            <Typography sx={(theme) => typographyStyles(theme, { fontWeight: 600 })}>{t("highlights")}</Typography>
                        </Box>
                        <Box display="flex" flexWrap="wrap" gap={1.5}>
                            {highlights.map((highlight, index) => (
                                <Typography key={index} sx={(theme) => typographyStyles(theme, { fontSize: Constants.FONT_SIZE.SMALL_TEXT })}>
                                    {t(Helpers.getTextByReferencyId(highlight?.referenceId || ""))}
                                </Typography>
                            ))}
                        </Box>
                    </Box>

                    <Box>
                        {(popularAmenities || []).length >= 1 &&
                            popularAmenities?.map((att, index) => <TextWithIcon value={att.value} iconName={att.iconName} key={index} />)}
                    </Box>

                    {/* <Box>
                        {(data.attributes || []).map((att, index) => (
                            <TextWithIcon
                                key={index}
                                Icon={att.Icon}
                                iconName={att.iconName}
                                value={Helpers.getDefaultValueMultiLanguage(att.value, language)}
                            />
                        ))}
                    </Box>
                    <RefundableBox item={data} /> */}
                    {/* <PriceBox item={data} />
                    <SelectRoomBox item={data} onSelectRooms={onSelectRooms} /> */}
                    <PriceBox
                        item={data}
                        numberOfNights={numberOfNights}
                        selectedOptionId={data.selectedRate}
                        onViewPriceDetails={() => onViewPriceDetails(data)}
                        onSelectOption={(value) => onSelectOption && onSelectOption(value)}
                        onReserve={onReserve}
                    />
                    <SummaryPrice
                        item={data}
                        numberOfNights={numberOfNights}
                        onViewPriceDetails={onViewPriceDetails}
                        onReserve={(value) => onReserve && onReserve(value)}
                    />
                </Box>
            </Box>
        </Modal>
    );
};

const ImageSlides = ({ images }: { images: IPhoto[] }) => (
    <Box
        sx={(theme) => {
            const {
                palette: { white, primary },
                functions: { rgba },
            } = theme;
            return {
                "& .swiper": {
                    py: 2,
                },
                "& .swiper-button-next, .swiper-button-prev": {
                    backgroundColor: `${rgba(white.main, 0.7)} !important`,
                    color: `${rgba(primary.main, 0.7)} !important`,
                },
                "& .swiper-button-next:hover, .swiper-button-prev:hover": {
                    color: `${primary.main} !important`,
                    backgroundColor: `${white.main} !important`,
                },
            };
        }}
    >
        <Swiper {...swiperProps}>
            {images.map((item, index) => (
                <SwiperSlide key={index}>
                    <Box
                        sx={{
                            width: "100%",
                            height: 300,
                            borderRadius: 2,
                            overflow: "hidden",
                            "& img": {
                                width: "100%",
                                height: "100%",
                                borderRadius: 2,
                            },
                        }}
                    >
                        <Image src={item.photoUrl} alt={`image-${index}`} width={0} height={0} sizes="100vw" />
                    </Box>
                </SwiperSlide>
            ))}
        </Swiper>
    </Box>
);

const swiperProps = {
    navigation: true,
    spaceBetween: 20,
    breakpoints: {
        1400: {
            slidesPerView: 1,
        },
        1200: {
            slidesPerView: 1,
        },
        992: {
            slidesPerView: 1,
        },
        768: {
            slidesPerView: 1,
        },
    },
};

export default RoomDetailModal;
