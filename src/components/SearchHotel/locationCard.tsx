import { FormField } from "@maysoft/common-component-react";
import { Search } from "@mui/icons-material";
import { InputAdornment } from "@mui/material";
import React from "react";

import { useTranslation } from "react-i18next";
import { IBasicData } from "../../hooks/searchHotel/useData";
import { CardBase } from "./fragment";

const LocationCard = ({
    locationPopupVisibled,
    setLocationPopupVisibled,
    data,
    onChangeValue,
    onClick,
}: {
    locationPopupVisibled: boolean;
    setLocationPopupVisibled: React.Dispatch<React.SetStateAction<boolean>>;
    data: IBasicData;
    onChangeValue: (value: string | number, key: keyof IBasicData) => void;
    onClick: () => void;
}) => {
    const {
        t,
        i18n: { language },
    } = useTranslation("search_hotel");
    return (
        <CardBase expanded={locationPopupVisibled} title={t("stays")} value={data?.searchText || ""} header={t("where_to")} onClick={onClick}>
            <FormField
                variant="outlined"
                value={data.searchText}
                onChangeValue={(value) => onChangeValue(value, "searchText")}
                placeholder={t("search")}
                onFocus={() => !locationPopupVisibled && setLocationPopupVisibled(true)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="end">
                            <Search />
                        </InputAdornment>
                    ),
                }}
            />
        </CardBase>
    );
};

export default LocationCard;
