import { Box } from "@maysoft/common-component-react";
import { Star } from "@mui/icons-material";
import { Chip } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import Helpers from "@src/commons/helpers";
import Constants from "@src/constants";
import ChipSelect from "./chipSelect";
import MultipleSelect from "./multipleSelect";
import PriceSelect from "./priceSelect";

import { ICodename } from "@src/commons/interfaces";
import AttributeService, { IAttributeValues } from "@src/services/sale/AttributeSerivce";
import { BaseBox } from "./fragment";

export interface IDataFilterBooking {
    price?: { min?: number; max?: number };
    amenities?: string[];
    starRating?: string[];
    paymentType?: string[];
    popularFilter?: string[];
}

const FilterBooking = ({
    dataFilter,
    onChangeDataFilter,
}: {
    dataFilter?: IDataFilterBooking;
    onChangeDataFilter: (data?: IDataFilterBooking) => void;
}) => {
    const {
        t,
        i18n: { language },
    } = useTranslation("search");

    const [popularFilter, setPopularFilter] = useState<ICodename[]>([]);
    const [paymentType, setPaymentType] = useState<ICodename[]>([]);
    const [starRating, setStarRating] = useState<ICodename[]>([]);
    const [amenities, setAmenities] = useState<ICodename[]>([]);

    const [newDataFilter, setNewDataFilter] = useState<IDataFilterBooking>({});

    const converAttributeToICodename = (data: IAttributeValues[], isNumber?: boolean) => {
        const newData: ICodename[] = [];

        (data || []).forEach((item) => {
            let value: string = "";
            if (item.valueType === 2) {
                value = item.value?.value?.[language];
            }
            if (item.valueType === 1) {
                if (isNumber) {
                    value = Number(item.value?.code || 0).toString();
                } else {
                    value = item.value?.code || "";
                }
            }

            newData.push({ code: item.id, name: value });
        });

        const temp = newData.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));

        return temp;
    };

    const handleOnChangeValue = (key: string, value: any) => {
        let newData: any = { ...newDataFilter };
        if ("price" === key) {
            newData[key] = {
                min: value.min,
                max: value.max,
            };
        } else {
            const temp = [...(newData[key] || [])];
            if (temp.findIndex((el) => el === value.code) === -1) {
                temp.push(value.code);
                newData[key] = temp;
            } else {
                newData[key] = temp.filter((el) => el !== value.code);
            }
        }

        setNewDataFilter(newData);

        onChangeDataFilter(newData);
    };

    useEffect(() => {
        const generationFilter = async () => {
            const resultAmenities = await AttributeService.getByCode({
                code: "partner_booking_amenities_property",
                referenceIds: ["2390", "369", "2821", "3861", "3863", "4647"],
                organizationId: Constants.ORGANIZATION_ID_DEFAULT,
            });
            setAmenities(converAttributeToICodename(resultAmenities.attributeValues));

            const resultPayment = await AttributeService.getByCode({
                code: "partner_booking_onsite_payment_type",
                organizationId: Constants.ORGANIZATION_ID_DEFAULT,
            });
            setPaymentType(converAttributeToICodename(resultPayment.attributeValues));

            const resultStar = await AttributeService.getByCode({
                code: "partner_booking_ratings_property_rating",
                organizationId: Constants.ORGANIZATION_ID_DEFAULT,
            });

            var startRating = (resultStar.attributeValues || [])?.filter(
                (value) =>
                    Number.isInteger(Number(value.referenceId.substring(value.referenceId.lastIndexOf("_") + 1))) &&
                    Number(value.referenceId.substring(value.referenceId.lastIndexOf("_") + 1)) > 0
            );
            setStarRating(converAttributeToICodename(startRating, true));
        };
        generationFilter();
    }, []);

    useEffect(() => {
        setNewDataFilter({
            price: dataFilter?.price || { min: 0, max: 1000 },
            amenities: dataFilter?.amenities,
            starRating: dataFilter?.starRating,
            paymentType: dataFilter?.paymentType,
            popularFilter: dataFilter?.popularFilter,
        });
    }, [dataFilter?.price, dataFilter?.amenities, dataFilter?.starRating, dataFilter?.paymentType, dataFilter?.popularFilter]);

    return (
        <Box display="grid" gap={1}>
            {/* <BaseBox title={t("search_by_property_name")}>
                <FormField
                    label=""
                    variant="outlined"
                    placeholder="e.g Marriott"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                />
            </BaseBox> */}

            <BaseBox title={t("filter_by")}>
                {(!Helpers.isNullOrEmpty(dataFilter?.price?.min) ||
                    !Helpers.isNullOrEmpty(dataFilter?.price?.max) ||
                    (dataFilter?.amenities || [])?.length > 0 ||
                    (dataFilter?.starRating || [])?.length > 0 ||
                    (dataFilter?.paymentType || [])?.length > 0 ||
                    (dataFilter?.popularFilter || [])?.length > 0) && (
                    <Chip
                        color="info"
                        variant="outlined"
                        label={t("delete_filter_all")}
                        onDelete={() => {
                            onChangeDataFilter();
                        }}
                    />
                )}

                {/* <MultipleSelect
                    idsSelected={newDataFilter.popularFilter || []}
                    title={t("popular_filters")}
                    data={popularFilter}
                    onSelect={(item) => {
                        handleOnChangeValue("popularFilter", item);
                    }}
                /> */}

                <PriceSelect
                    title={t("price_per_night")}
                    data={{ min: newDataFilter?.price?.min || 0, max: newDataFilter?.price?.max || 1000 }}
                    onChangeValue={(item) => {
                        handleOnChangeValue("price", item);
                    }}
                />

                <ChipSelect
                    idsSelected={newDataFilter.starRating || []}
                    title={t("star_rating")}
                    data={starRating}
                    Icon={Star}
                    onSelect={(item) => {
                        handleOnChangeValue("starRating", item);
                    }}
                />

                <MultipleSelect
                    idsSelected={newDataFilter.paymentType || []}
                    title={t("payment_type")}
                    data={paymentType}
                    onSelect={(item) => {
                        handleOnChangeValue("paymentType", item);
                    }}
                />

                <MultipleSelect
                    idsSelected={newDataFilter.amenities || []}
                    title={t("amenities")}
                    data={amenities}
                    onSelect={(item) => {
                        handleOnChangeValue("amenities", item);
                    }}
                />
            </BaseBox>
        </Box>
    );
};

export default FilterBooking;
