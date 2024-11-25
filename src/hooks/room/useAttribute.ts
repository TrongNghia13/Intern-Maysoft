import { AttributeCodes } from "@src/commons/enum";
import Helpers from "@src/commons/helpers";
import { IOptionalAttributes, IRoom } from "@src/commons/interfaces";
import { useTranslation } from "react-i18next";

export const useAttributes = () => {
    const { t } = useTranslation("detail");
    const getHighlightAttributesByRoom = ({
        item,
        language,
        optionalAttributes,
    }: {
        item: IRoom;
        language: string;
        optionalAttributes: IOptionalAttributes;
    }) => {
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
                value: t("sleeps", {
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
                value: t("reserve_now_pay_later"),
            });
        if (optionalAttributes?.wifi)
            result.splice(1, 0, {
                iconName: "wifi",
                value: t("free_wifi"),
            });
        if (optionalAttributes?.parking)
            result.splice(1, 0, {
                iconName: "local_parking",
                value: t("free_self_parking"),
            });
        if (Helpers.getAttributeValue(item.attributes, AttributeCodes.product_booking_room_views))
            result.splice(1, 0, {
                iconName: "location_city",
                value: Helpers.getAttributeValue(item.attributes, AttributeCodes.product_booking_room_views),
            });
        return result;
    };

    return {
        getHighlightAttributesByRoom,
    };
};
