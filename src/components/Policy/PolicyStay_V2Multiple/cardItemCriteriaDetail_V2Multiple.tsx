import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, Grid, IconButton } from "@mui/material";
import { Box, CustomIcon, FormField, SearchInputAPI, Typography, } from "@maysoft/common-component-react";

import Constants from "@src/constants";
import Helpers from "@src/commons/helpers";
import AdministrativeDivisionService from "@src/services/common/AdministrativeDivisionService";

import { BoxStar } from ".";
import { ICodename } from "@src/commons/interfaces";
import { VALUE_ALL } from "@src/hooks/useDataPolicy.hook";
import { AdministrativeDivisionType } from "@src/commons/enum";



export interface IItemCriteriaDetail_V2Multiple {
    sequence?: number;

    from?: string;
    currency?: string;
    startClass?: number;
    bookingBudget?: number;
}

const CardItemCriteriaDetail_V2Multiple = ({
    dataItem,
    errorItem,
    countryCode,
    hidenActionDelete,
    listStaySelected,
    listStayDefaule,
    onDelete,
    onChangeValue,
}: {
    countryCode?: string;
    hidenActionDelete?: boolean;

    dataItem: IItemCriteriaDetail_V2Multiple;
    errorItem?: { [key in keyof IItemCriteriaDetail_V2Multiple]?: string };

    listStayDefaule?: ICodename[];
    listStaySelected: ICodename[];
    onDelete: () => void;
    onChangeValue: (data: { key: keyof IItemCriteriaDetail_V2Multiple, value: any }) => void;
}) => {
    const {
        t,
        i18n: { language },
    } = useTranslation(["common", "setting"]);

    const [searchText, setSearchText] = useState("");

    useEffect(() => {

        if (dataItem.from) {
            const temp1 = listStaySelected.find(el => el.code === dataItem.from);
            temp1 && setSearchText(temp1?.name || "");
        }

    }, [dataItem.from, listStaySelected]);

    const getDataApi = async (data: any) => {
        const result = await AdministrativeDivisionService.getPaged({
            ...data,
            searchText: undefined,
            name: data?.searchText,
        });

        const items = [...result?.items || []]?.map((item: any) => ({
            code: item.code,
            name: item.name,
            detail: item,
        } as ICodename));

        return {
            currentPage: result?.currentPage || 0,
            hasNext: result?.hasNext || false,
            data: [
                { code: VALUE_ALL, name: t("setting:policy.all_destinations") },
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
                    <Grid container spacing={3} padding={3}>
                        <Grid item xs={12} sm={6} md={7} lg={8}>
                            <SearchInputAPI
                                maxLength={255}
                                isAutocompleteMode
                                value={searchText || ""}
                                label={t("setting:policy.point")}
                                placeholder={t("setting:policy.select_point")}
                                errorMessage={errorItem?.from}
                                dataOptionInit={listStayDefaule}
                                requestGetApiDefault={{
                                    searchText: searchText,
                                    countryCode: countryCode,
                                    type: AdministrativeDivisionType.Province,
                                    pageNumber: 1,
                                }}
                                getApi={getDataApi}
                                onClick={(value) => {
                                    onChangeValue({
                                        key: "from",
                                        value: value.code,
                                    });
                                    setSearchText(value.name);
                                }}
                                onChangeValue={(value) => {
                                    setSearchText(value);
                                    onChangeValue({
                                        key: "from",
                                        value: undefined,
                                    });
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={5} lg={4}>
                            <FormField
                                isMoney
                                maxLength={100}
                                type={"number"}
                                value={dataItem?.bookingBudget}
                                label={t("setting:policy.flight_budget")}
                                placeholder={t("setting:policy.enter_value")}
                                unit={dataItem?.currency || Constants.CURRENCY_DEFAULT}
                                errorMessage={errorItem?.bookingBudget}
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

                        {/* Hạng khách sạn */}
                        <Grid item xs={12}>
                            <Box sx={{ display: "grid" }} >
                                <Typography variant="button">{t("setting:policy.maximum_star_rating")}</Typography>
                                <Typography variant="button" sx={{ color: "#8AB9FF" }}>{t("setting:policy.note_maximum_star_rating")}</Typography>
                                <BoxStar
                                    number={dataItem?.startClass || 0}
                                    onChange={(value) => {
                                        const newValue = Helpers.isNullOrEmpty(value) ? Number(value) : ((Number(value) > 0) ? Number(value) : 0);
                                        onChangeValue({
                                            key: "startClass",
                                            value: newValue,
                                        });
                                    }}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </Card>
            </Box>
        </Box>
    );
}

export default CardItemCriteriaDetail_V2Multiple;