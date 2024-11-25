import { Box, Button, Typography } from "@maysoft/common-component-react";
import { Grid } from "@mui/material";
import Image from "next/image";
import { useTranslation } from "react-i18next";

import Resources from "@src/constants/Resources";
import Pagination from "../Pagination/Pagination";
import CardItemPolicy, { IPropsItemPolicy } from "./cardItemPolicy";

import { IPagedList } from "@src/commons/interfaces";
import { IRecordPolicy } from "@src/hooks/useDataPolicy.hook";
import { PageLoader } from "../Loader";

interface IProps {
    isActive: boolean;
    isLoading: boolean;

    hidenUpdate?: boolean;
    hidenDelete?: boolean;
    hidenCreate?: boolean;

    hidenFlightTime?: boolean;
    hidenBookingTime?: boolean;

    dataPolicy: IPagedList<IRecordPolicy>;

    onButtonCreate: () => void;
    onPageChange: (event: any, page: number) => void;
    setListIdOpen: React.Dispatch<React.SetStateAction<string[]>>;
}

const CardListItemPolicy = ({
    isActive,
    isLoading,
    dataPolicy,

    hidenCreate,
    hidenDelete,
    hidenUpdate,

    hidenFlightTime,
    hidenBookingTime,

    listAriLines,
    listStaySelected,
    listFlightSelected,

    onPageChange,
    onButtonCreate,

    listIdOpen,
    setListIdOpen,

    onArchive,
    onDelete,
    onCoppy,
    onEdit,

    onEditPolicyStay,
    onEditPolicyFlight,
}: IProps & IPropsItemPolicy) => {
    const {
        t,
        i18n: { language },
    } = useTranslation(["common", "setting"]);

    if (isLoading) {
        return <PageLoader />;
    }

    if (!dataPolicy?.items || dataPolicy?.items?.length === 0) {
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
                            <Typography variant="body1" fontWeight="bold">
                                {isActive ? t("setting:policy.title_create_by_active") : t("setting:policy.title_create_by_archive")}
                            </Typography>
                            <Typography variant="button">
                                {isActive ? t("setting:policy.description_create_by_active") : t("setting:policy.description_create_by_archive")}
                            </Typography>
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
                            {isActive ? (
                                <Image alt="img" width={0} height={0} src={Resources.Images.IMG_ADD_NEW_POLICY_ACTIVE} />
                            ) : (
                                <Image alt="img" width={0} height={0} src={Resources.Images.IMG_ADD_NEW_POLICY_ARCHIVE} />
                            )}
                        </Box>
                    </Grid>
                    {!hidenCreate && dataPolicy?.items?.length === 0 && (
                        <Grid item xs={12}>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Button onClick={onButtonCreate}>{t("setting:policy_title_create_view")}</Button>
                            </Box>
                        </Grid>
                    )}
                </Grid>
            </Box>
        );
    }

    return (
        <div style={{ overflow: "auto" }}>
            <Grid container spacing={3}>
                {dataPolicy.items.map((item) => (
                    <Grid item xs={12} key={item.id}>
                        <CardItemPolicy
                            item={item}
                            listAriLines={listAriLines}
                            listStaySelected={listStaySelected}
                            listFlightSelected={listFlightSelected}
                            hidenCreate={hidenCreate}
                            hidenDelete={hidenDelete}
                            hidenUpdate={hidenUpdate}
                            hidenFlightTime={hidenFlightTime}
                            hidenBookingTime={hidenBookingTime}
                            listIdOpen={listIdOpen}
                            setListIdOpen={setListIdOpen}
                            onEditPolicyStay={onEditPolicyStay}
                            onEditPolicyFlight={onEditPolicyFlight}
                            onArchive={onArchive}
                            onDelete={onDelete}
                            onCoppy={onCoppy}
                            onEdit={onEdit}
                        />
                    </Grid>
                ))}
            </Grid>
            {dataPolicy?.totalPages > 0 && (
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
                        {"Tổng: " + dataPolicy?.totalCount}
                    </Typography>
                    <Pagination onChange={onPageChange} page={dataPolicy?.currentPage} count={dataPolicy?.totalPages} />
                </Box>
            )}
        </div>
    );
};

export default CardListItemPolicy;
