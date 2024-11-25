import Image from "next/image";
import { Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Box, Button, Typography } from "@maysoft/common-component-react";

import { Pagination } from "../Pagination";
import Resources from "@src/constants/Resources";
import CardItemBudgetPlan from "./cardItemBudgetPlan";

import { IPagedList } from "@src/commons/interfaces";
import { IRecordBudget } from "@src/services/sale/BudgetService";
import { PageLoader } from "../Loader";

interface IProps {
    isLoading: boolean;
    hidenActionDelete?: boolean;
    hidenActionUpdate?: boolean;

    dataBudgetPlan: IPagedList<IRecordBudget>;

    dataMapUser?: Map<string, any>;
    dataMapGroup?: Map<string, any>;

    onCreate: () => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onPageChange: (event: any, pageNumber: number) => void;
}

const CardListItemBudgetPlan: React.FC<IProps> = ({
    isLoading,
    dataBudgetPlan,
    hidenActionDelete,
    hidenActionUpdate,

    dataMapUser,
    dataMapGroup,

    onEdit,
    onCreate,
    onDelete,
    onPageChange,
}: IProps) => {
    const {
        t,
        i18n: { language },
    } = useTranslation(["common", "setting"]);

    if (isLoading) {
        return <PageLoader />;
    }

    if (!dataBudgetPlan?.items || dataBudgetPlan?.items?.length === 0) {
        return (
            <Box
                sx={{
                    width: "100%",
                    minHeight: 300,
                    paddingTop: 1,
                    paddingBottom: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                "& img": {
                                    width: 150,
                                    height: 150,
                                    objectFit: "contain !important",
                                },
                            }}
                        >
                            {<Image alt="img" width={0} height={0} src={Resources.Images.IMAGE_BUDGET_PLAN} />}
                        </Box>
                    </Grid>
                    {dataBudgetPlan?.items?.length === 0 && (
                        <Grid item xs={12}>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Button onClick={onCreate}>{t("setting:payment_title_create_view")}</Button>
                            </Box>
                        </Grid>
                    )}
                </Grid>
            </Box>
        );
    }

    return (
        <>
            <Grid container spacing={3}>
                {dataBudgetPlan.items.map((item) => (
                    <Grid item xs={12} key={item.id}>
                        <CardItemBudgetPlan
                            item={item}
                            dataMapUser={dataMapUser}
                            dataMapGroup={dataMapGroup}
                            hidenActionDelete={hidenActionDelete}
                            hidenActionUpdate={hidenActionUpdate}
                            onEdit={() => onEdit(item.id || "")}
                            onDelete={() => onDelete(item.id || "")}
                        />
                    </Grid>
                ))}
            </Grid>
            {dataBudgetPlan?.totalPages > 0 && (
                <Box
                    sx={{
                        my: 2,
                        gap: 1,
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Typography variant="button" sx={{ paddingLeft: 1 }}>
                        {"Tổng: " + dataBudgetPlan?.totalCount}
                    </Typography>
                    <Pagination onChange={onPageChange} page={dataBudgetPlan?.currentPage} count={dataBudgetPlan?.totalPages} />
                </Box>
            )}
        </>
    );
};

export default CardListItemBudgetPlan;
