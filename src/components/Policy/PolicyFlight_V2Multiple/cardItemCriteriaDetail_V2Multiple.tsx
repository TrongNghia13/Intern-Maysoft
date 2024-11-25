import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid, IconButton } from "@mui/material";
import { Autocomplete, Box, CustomIcon, FormField, SearchInputAPI } from "@maysoft/common-component-react";

import Constants from "@src/constants";
import Card from "@src/components/Card/Card";
import Helpers from "@src/commons/helpers";
import TransportHubService from "@src/services/common/TransportHubService";

import { ICodename } from "@src/commons/interfaces";
import { BookingTypePolicy } from "@src/commons/enum";
import { VALUE_ALL } from "@src/hooks/useDataPolicy.hook";


export interface IItemCriteriaDetail_V2Multiple {
    sequence?: number;

    to?: string;
    from?: string;
    currency?: string;
    bookingType?: number;
    bookingBudget?: number;

    carrier?: string[];
    cabinClass?: string[];
}

const CardItemCriteriaDetail_V2Multiple = ({
    dataItem,
    errorItem,
    countryCode,
    hidenActionDelete,

    listAriLines,
    listCabinClass,
    listBookingType,
    listFlightDefaule,
    listFlightSelected,


    onChangeValue,
    onDelete,
}: {
    countryCode?: string;
    hidenActionDelete?: boolean;

    dataItem: IItemCriteriaDetail_V2Multiple;
    errorItem?: { [key in keyof IItemCriteriaDetail_V2Multiple]?: string };

    listAriLines: ICodename[];
    listCabinClass: ICodename[];
    listBookingType: ICodename[];
    listFlightSelected: ICodename[];
    listFlightDefaule?: ICodename[];

    onDelete: () => void;
    onChangeValue: (data: { key: keyof IItemCriteriaDetail_V2Multiple, value: any }) => void;
}) => {
    const {
        t,
        i18n: { language },
    } = useTranslation(["common", "setting"]);

    const [searchTo, setSearchTo] = useState("");
    const [searchFrom, setSearchFrom] = useState("");

    useEffect(() => {

        if (dataItem?.from) {
            const temp1 = listFlightSelected.find(el => el.code === dataItem?.from);
            temp1 && setSearchFrom(temp1?.name || "");
        }

        if (dataItem?.to) {
            const temp2 = listFlightSelected.find(el => el.code === dataItem?.to);
            temp2 && setSearchTo(temp2?.name || "");
        }

    }, [dataItem?.from, dataItem?.to, listFlightSelected]);

    const getDataApi = async (data: any) => {
        const result = await TransportHubService.getPaged(data);

        const items = [...result?.items || []]?.map((item: any) => ({
            code: item.code,
            name: item.name,
            detail: item,
        } as ICodename));

        return {
            currentPage: result?.currentPage || 0,
            hasNext: result?.hasNext || false,
            data: [
                { code: VALUE_ALL, name: t("setting:policy.all_airports") },
                ...items || [],
            ],
        };
    };

    return (
        <Box sx={{
            gap: 1,
            marginTop: 1,
            marginBottom: 2,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
        }}>
            <Box sx={{ width: "25px" }}>
                {!hidenActionDelete &&
                    <IconButton sx={{ padding: 0 }} onClick={onDelete}>
                        <CustomIcon iconName="delete" />
                    </IconButton>
                }
            </Box>
            <Box sx={{ width: `calc(100% - 40px)` }}>
                <Card sx={{ border: "0.5px solid #d4d4d4" }}>
                    <Grid container spacing={3} padding={3} alignItems={"end"}>
                        <Grid item xs={12} sm={6} md={6} lg={3}>
                            <Autocomplete
                                // variant={"outlined"}
                                data={listBookingType || []}
                                defaultValue={dataItem?.bookingType}
                                errorMessage={errorItem?.bookingType}
                                placeholder={t("setting:policy.select_type")}
                                label={dataItem?.bookingType ? t("setting:policy.select_type") : ""}
                                onChange={(value) => {
                                    onChangeValue({
                                        key: "bookingType",
                                        value: value ?? BookingTypePolicy.OneWay,
                                    });
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={6} lg={3}>
                            <FormField
                                // variant={"outlined"}
                                isMoney
                                maxLength={100}
                                type={"number"}
                                value={dataItem?.bookingBudget}
                                errorMessage={errorItem?.bookingBudget}
                                label={t("setting:policy.flight_budget")}
                                placeholder={t("setting:policy.enter_value")}
                                unit={dataItem?.currency || Constants.CURRENCY_DEFAULT}
                                error={!Helpers.isNullOrEmpty(errorItem?.bookingBudget)}
                                onChangeValue={(value) => {
                                    const newValue = value ? ((Number(value) > 0) ? Number(value) : 0) : undefined;
                                    onChangeValue({
                                        key: "bookingBudget",
                                        value: newValue,
                                    });
                                }}
                            />
                        </Grid>

                        {/* Sân bay đi */}
                        <Grid item xs={12} sm={6} md={6} lg={3}>
                            <SearchInputAPI
                                // variant={"outlined"}
                                maxLength={255}
                                isAutocompleteMode
                                value={searchFrom || ""}
                                errorMessage={errorItem?.from}
                                dataOptionInit={listFlightDefaule}
                                label={t("setting:policy.departure_airport")}
                                placeholder={t("setting:policy.departure_airport")}
                                requestGetApiDefault={{
                                    searchText: searchFrom,
                                    countryCode: countryCode,
                                    type: 1,
                                    pageNumber: 1,
                                }}
                                getApi={getDataApi}
                                onClick={(value) => {
                                    onChangeValue({
                                        key: "from",
                                        value: value.code,
                                    });
                                    setSearchFrom(value.name);
                                }}
                                onChangeValue={(value) => {
                                    setSearchFrom(value);
                                    onChangeValue({
                                        key: "from",
                                        value: undefined,
                                    });
                                }}
                            />
                        </Grid>

                        {/* Sân bay đến */}
                        <Grid item xs={12} sm={6} md={6} lg={3}>
                            <SearchInputAPI
                                // variant={"outlined"}
                                maxLength={255}
                                isAutocompleteMode
                                value={searchTo || ""}
                                errorMessage={errorItem?.to}
                                dataOptionInit={listFlightDefaule}
                                label={t("setting:policy.arrival_airport")}
                                placeholder={t("setting:policy.arrival_airport")}
                                requestGetApiDefault={{
                                    searchText: searchTo,
                                    countryCode: countryCode,
                                    type: 1,
                                    pageNumber: 1,
                                }}
                                getApi={getDataApi}
                                onClick={(value) => {
                                    onChangeValue({
                                        key: "to",
                                        value: value.code,
                                    });
                                    setSearchTo(value.name);
                                }}
                                onChangeValue={(value) => {
                                    setSearchTo(value);
                                    onChangeValue({
                                        key: "to",
                                        value: undefined,
                                    });
                                }}
                            />
                        </Grid>

                        {/* Hãng bay */}
                        <Grid item xs={12} sm={6} md={6}>
                            <Autocomplete
                                // variant={"outlined"}
                                multiple
                                data={listAriLines || []}
                                defaultValue={dataItem?.carrier}
                                errorMessage={errorItem?.carrier}
                                label={t("setting:policy.flight_class")}
                                placeholder={t("setting:policy.flight_class")}
                                optionDisabled={([...dataItem?.carrier || []].length > 1) ? [VALUE_ALL] : undefined}
                                onChange={(value) => {
                                    const newValue = ([...value || []].length === 0)
                                        ? undefined
                                        : ([...value || []].length === 1)
                                            ? value
                                            : value.filter((el: any) => el !== VALUE_ALL)

                                    onChangeValue({
                                        key: "carrier",
                                        value: newValue,
                                    });
                                }}
                            />
                        </Grid>

                        {/* Hạng khoang */}
                        <Grid item xs={12} sm={6} md={6}>
                            <Autocomplete
                                // variant={"outlined"}
                                multiple
                                data={listCabinClass || []}
                                defaultValue={dataItem?.cabinClass}
                                errorMessage={errorItem?.cabinClass}
                                label={t("setting:policy.cabin_class")}
                                placeholder={t("setting:policy.select_cabin_class")}
                                onChange={(value) => {
                                    // const newValue = ([...value || []].length === 0)
                                    //     ? undefined
                                    //     : ([...value || []].length === 1)
                                    //         ? value
                                    //         : value.filter((el: any) => el !== VALUE_ALL)

                                    onChangeValue({
                                        value: value,
                                        key: "cabinClass",
                                    });
                                }}
                            />
                        </Grid>
                    </Grid>
                </Card>
            </Box>
        </Box>
    );
}

export default CardItemCriteriaDetail_V2Multiple