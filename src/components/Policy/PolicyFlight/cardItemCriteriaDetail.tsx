import { Grid, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Autocomplete, Box, CustomIcon, FormField, SearchInputAPI } from "@maysoft/common-component-react";

import Constants from "@src/constants";
import Helpers from "@src/commons/helpers";
import TransportHubService from "@src/services/common/TransportHubService";

import { ICodename } from "@src/commons/interfaces";
import { BookingTypePolicy } from "@src/commons/enum";
import { IPolicyCriteriaDetail, VALUE_ALL } from "@src/hooks/useDataPolicy.hook";



const CardItemCriteriaDetail = ({
    item,
    countryCode,
    hidenActionDelete,
    listBookingType,
    listFlightSelected,
    listFlightDefaule,
    errorPolicyCriteriaDetail,
    onChangeValue,
    onDelete,
}: {
    countryCode?: string;
    hidenActionDelete?: boolean;
    item: IPolicyCriteriaDetail;
    listBookingType: ICodename[];
    errorPolicyCriteriaDetail?: any;
    listFlightSelected: ICodename[];
    listFlightDefaule?: ICodename[];
    onDelete: () => void;
    onChangeValue: (data: { key: keyof IPolicyCriteriaDetail, value: any }) => void;
}) => {
    const {
        t,
        i18n: { language },
    } = useTranslation(["common", "setting"]);

    const [searchFrom, setSearchFrom] = useState("");
    const [searchTo, setSearchTo] = useState("");

    useEffect(() => {

        if (item.from) {
            const temp1 = listFlightSelected.find(el => el.code === item.from);
            temp1 && setSearchFrom(temp1?.name || "");
        }

        if (item.to) {
            const temp2 = listFlightSelected.find(el => el.code === item.to);
            temp2 && setSearchTo(temp2?.name || "");
        }

    }, [item.from, item.to, listFlightSelected]);

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
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={6} lg={2}>
                        <Autocomplete
                            data={listBookingType || []}
                            defaultValue={item?.bookingType}
                            placeholder={t("setting:policy.select_type")}
                            errorMessage={errorPolicyCriteriaDetail?.bookingType}
                            onChange={(value) => {
                                onChangeValue({
                                    key: "bookingType",
                                    value: value ?? BookingTypePolicy.OneWay,
                                });
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={6} lg={2}>
                        <FormField
                            isMoney
                            maxLength={100}
                            type={"number"}
                            value={item?.bookingBudget}
                            placeholder={t("setting:policy.enter_value")}
                            unit={item?.currency || Constants.CURRENCY_DEFAULT}
                            errorMessage={errorPolicyCriteriaDetail?.bookingBudget}
                            error={!Helpers.isNullOrEmpty(errorPolicyCriteriaDetail?.bookingBudget)}
                            onChangeValue={(value) => {
                                const newValue = value ? ((Number(value) > 0) ? Number(value) : 0) : undefined;
                                onChangeValue({
                                    key: "bookingBudget",
                                    value: newValue,
                                });
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={6} lg={4}>
                        <SearchInputAPI
                            label={""}
                            maxLength={255}
                            isAutocompleteMode
                            value={searchFrom || ""}
                            dataOptionInit={listFlightDefaule}
                            errorMessage={errorPolicyCriteriaDetail?.from}
                            placeholder={t("setting:policy.search_air_port")}
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

                    <Grid item xs={12} sm={6} md={6} lg={4}>
                        <SearchInputAPI
                            label={""}
                            maxLength={255}
                            isAutocompleteMode
                            value={searchTo || ""}
                            dataOptionInit={listFlightDefaule}
                            errorMessage={errorPolicyCriteriaDetail?.to}
                            placeholder={t("setting:policy.search_air_port")}
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
                </Grid>
            </Box>
        </Box>
    );
}

export default CardItemCriteriaDetail