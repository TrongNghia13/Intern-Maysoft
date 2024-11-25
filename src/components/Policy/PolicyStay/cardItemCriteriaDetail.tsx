import { Grid, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Box, CustomIcon, FormField, SearchInputAPI, } from "@maysoft/common-component-react";

import Constants from "@src/constants";
import Helpers from "@src/commons/helpers";
import AdministrativeDivisionService from "@src/services/common/AdministrativeDivisionService";

import { ICodename } from "@src/commons/interfaces";
import { IPolicyCriteriaDetail, VALUE_ALL } from "@src/hooks/useDataPolicy.hook";
import { AdministrativeDivisionType } from "@src/commons/enum";




const CardItemCriteriaDetail = ({
    item,
    countryCode,
    hidenActionDelete,
    listStaySelected,
    listStayDefaule,
    errorPolicyCriteriaDetail,
    onDelete,
    onChangeValue,
}: {
    countryCode?: string;
    hidenActionDelete?: boolean;

    item: IPolicyCriteriaDetail;
    errorPolicyCriteriaDetail?: any;

    listStaySelected: ICodename[];
    listStayDefaule?: ICodename[];
    onDelete: () => void;
    onChangeValue: (data: { key: keyof IPolicyCriteriaDetail, value: any }) => void;
}) => {
    const {
        t,
        i18n: { language },
    } = useTranslation(["common", "setting"]);

    const [searchText, setSearchText] = useState("");

    useEffect(() => {

        if (item.from) {
            const temp1 = listStaySelected.find(el => el.code === item.from);
            temp1 && setSearchText(temp1?.name || "");
        }

    }, [item.from, listStaySelected]);

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
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={7} md={8} lg={9}>
                        <SearchInputAPI
                            maxLength={255}
                            isAutocompleteMode
                            value={searchText || ""}
                            dataOptionInit={listStayDefaule}
                            label={t("setting:policy.point")}
                            placeholder={t("setting:policy.select_point")}
                            errorMessage={errorPolicyCriteriaDetail?.from}
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

                    <Grid item xs={12} sm={5} md={4} lg={3}>
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
                </Grid>
            </Box>
        </Box>
    );
}

export default CardItemCriteriaDetail;