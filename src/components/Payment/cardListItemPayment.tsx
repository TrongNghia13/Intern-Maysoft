import Image from "next/image";
import { Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Box, Button, Typography } from "@maysoft/common-component-react";

import CardItemPayment from "./cardItemPayment";
import Resources from "@src/constants/Resources";

import { IPagedList } from "@src/commons/interfaces";
import { PaymentAccountType } from "@src/commons/enum";
import { IRecordPayment } from "@src/services/sale/PaymentAccountService";
import { Pagination } from "../Pagination";
import { PageLoader } from "../Loader";

interface IProps {
    type: number;
    isLoading: boolean;
    hidenCreate?: boolean;
    hidenUpdate?: boolean;
    hidenDelete?: boolean;
    hidenPagination?: boolean;
    dataPayment: IPagedList<IRecordPayment>;

    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onButtonCreate: () => void;
    onPageChange: (event: any, page: number) => void;
}

const CardListItemPayment: React.FC<IProps> = ({
    type,
    isLoading,
    hidenCreate,
    hidenDelete,
    hidenUpdate,
    hidenPagination,

    dataPayment,
    onEdit,
    onDelete,
    onPageChange,
    onButtonCreate,
}: IProps) => {
    const {
        t,
        i18n: { language },
    } = useTranslation(["common", "setting"]);

    if (isLoading) {
        return <PageLoader />;
    }

    if (!dataPayment?.items || dataPayment?.items?.length === 0) {
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
                        <Box sx={{ display: "grid" }}>
                            {type === PaymentAccountType.Group && (
                                <Typography variant="body1" fontWeight="bold">
                                    {t("setting:payment.title_create_by_group")}
                                </Typography>
                            )}
                            {type === PaymentAccountType.Organization && (
                                <Typography variant="body1" fontWeight="bold">
                                    {t("setting:payment.title_create_by_company")}
                                </Typography>
                            )}
                            {type === PaymentAccountType.Debit && (
                                <Typography variant="body1" fontWeight="bold">
                                    {t("setting:payment.title_create_by_debit")}
                                </Typography>
                            )}
                            {[PaymentAccountType.Group, PaymentAccountType.Organization].includes(type) && (
                                <Typography variant="button">{t("setting:payment.description_create")}</Typography>
                            )}
                        </Box>
                    </Grid>

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
                            {type === PaymentAccountType.Group ? (
                                <Image alt="img" width={0} height={0} src={Resources.Images.IMG_ADD_NEW_PAYMENT_GROUP} />
                            ) : (
                                <Image alt="img" width={0} height={0} src={Resources.Images.IMG_ADD_NEW_PAYMENT_COMPANY} />
                            )}
                        </Box>
                    </Grid>
                    {!hidenCreate && dataPayment?.items?.length === 0 && type !== PaymentAccountType.Debit && (
                        <Grid item xs={12}>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Button onClick={onButtonCreate}>{t("setting:payment_title_create_view")}</Button>
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
                {dataPayment.items.map((item) => (
                    <Grid item xs={12} key={item.id}>
                        <CardItemPayment item={item} onEdit={() => onEdit(item.id || "")} onDelete={() => onDelete(item.id || "")} />
                    </Grid>
                ))}
            </Grid>
            {!hidenPagination && dataPayment?.totalPages > 0 && (
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
                        {"Tổng: " + dataPayment?.totalCount}
                    </Typography>
                    <Pagination onChange={onPageChange} page={dataPayment?.currentPage} count={dataPayment?.totalPages} />
                </Box>
            )}
        </>
    );
};

export default CardListItemPayment;
