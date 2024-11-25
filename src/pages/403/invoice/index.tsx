import { Box, Button, Chip, DatePicker, FormField, Typography } from "@maysoft/common-component-react";
import { Close, FilterListOutlined, HotelOutlined, LocalAirportOutlined, Search } from "@mui/icons-material";
import { Grid, IconButton, Menu } from "@mui/material";
import moment from "moment";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Helpers from "@src/commons/helpers";
import { BreadCrumbs, Card, CustomDrawer, PageLoader, Pagination } from "@src/components";
import Constants, { SALE_API_URL } from "@src/constants";
import Resources from "@src/constants/Resources";
import useDataBudgetPlan from "@src/hooks/useDataBudgetPlan.hook";
import InvoiceService, { IItineraryMember, IRecordItinerary } from "@src/services/booking/InvoiceService";

import { ItineraryType } from "@src/commons/enum";
import { IFlightExtraInformation, IHotelExtraInformation, IPagedList } from "@src/commons/interfaces";
import { getServerSideTranslationsProps } from "@src/commons/translationHelpers";
import { withSSRErrorHandling } from "@src/commons/withSSRErrorHandling";
import { BaseLayout } from "@src/layout";
import { RootState } from "@src/store";
import { hideLoading, showLoading } from "@src/store/slice/common.slice";
import { typographyStyles } from "@src/styles/commonStyles";
import { NextApplicationPage } from "../_app";

interface IRequestGetPageInvoice {
    endTime?: number;
    startTime?: number;
    searchText?: string;

    orderby?: string;
    pageSize?: number;
    pageNumber?: number;
}

const InvoicePage: NextApplicationPage = () => {
    const {
        t,
        i18n: { language },
    } = useTranslation(["common", "tripbooking"]);

    const router = useRouter();

    const dispatch = useDispatch();

    const userProfile = useSelector((state: RootState) => state.userInfo.userProfile);

    const { getMapUserProfileByListID } = useDataBudgetPlan();
    const [dataMapUser, setDataMapUser] = useState<Map<string, any>>(new Map());

    const isLoading = false;

    const [openFilter, setOpenFilter] = useState<boolean>(false);
    const [model, setModel] = useState<{
        requestData?: IRequestGetPageInvoice;
        requestDataTemp?: IRequestGetPageInvoice;
    }>({});

    const [dataInvoice, setDataInvoice] = useState<IPagedList<IRecordItinerary>>({
        totalPages: 0,
        totalCount: 0,
        currentPage: 1,
        hasNext: false,
        hasPrevious: false,
        pageSize: Constants.ROW_PER_PAGE_20,
        items: [],
    });

    useEffect(() => {
        const pageNumber = Number(router?.query?.page || 1);
        const pageSize = Number(router?.query?.pageSize || 20);
        const searchText = router?.query?.searchText as string;
        const endTime = Helpers.isNullOrEmpty(router?.query?.endTime) ? undefined : Number(router?.query?.endTime);
        const startTime = Helpers.isNullOrEmpty(router?.query?.startTime) ? undefined : Number(router?.query?.startTime);

        getPaged({ pageSize, pageNumber, searchText, endTime, startTime });
    }, [userProfile?.organizationId]);

    const getPaged = async (req?: IRequestGetPageInvoice) => {
        try {
            dispatch(showLoading());

            const newReq = {
                endTime: req?.endTime,
                startTime: req?.startTime,
                searchText: req?.searchText,
                pageNumber: req?.pageNumber ?? 1,
                pageSize: req?.pageSize ?? Constants.ROW_PER_PAGE_20,
            };

            const result = await InvoiceService.getPaged({
                ...newReq,
                organizationId: userProfile?.organizationId,
            });

            // get user id
            const listUserIds: string[] = [];
            for (const item of [...(result?.items || [])]) {
                for (const el of [...(item.itineraryMembers || [])]) {
                    if (!listUserIds.includes(el.userId)) {
                        listUserIds.push(el.userId);
                    }
                }
            }

            if (listUserIds.length > 0) {
                const dataMapUser = await getMapUserProfileByListID(listUserIds, userProfile?.organizationId);

                setDataMapUser(dataMapUser);
            }

            setDataInvoice(result);

            setModel({
                requestData: newReq,
                requestDataTemp: newReq,
            });

            router.push(
                {
                    query: {
                        ...router.query,
                        ...newReq,
                    },
                },
                undefined,
                { shallow: true }
            );
        } catch (error) {
            Helpers.handleError(error);
        } finally {
            dispatch(hideLoading());
        }
    };

    const getItemUser = (data: IItineraryMember[]) => {
        const newNameUser: any[] = [];
        for (const item of data) {
            newNameUser.push(dataMapUser?.get(item.userId)?.fullName);
        }
        return newNameUser;
    };

    const getNewExtraInfo: any = (dataDetail: any) => {
        if (dataDetail?.type === ItineraryType.Hotel) {
            const newData: IHotelExtraInformation = Helpers.toCamelCaseObj(JSON.parse(dataDetail?.extraInfo));
            return newData;
        }
        if (dataDetail?.type === ItineraryType.Flight) {
            const newData: IFlightExtraInformation = Helpers.toCamelCaseObj(JSON.parse(dataDetail?.extraInfo));
            return newData;
        }
        return null;
    };

    const getStartTimeEndTime = (itineraryDetails: any[]) => {
        if (Helpers.isNullOrEmpty(itineraryDetails)) {
            return "";
        } else {
            const newDateTime = Helpers.getStartAndEndTimeOfTrip(itineraryDetails);

            return (
                `${Helpers.getDateNameFormat(Number(newDateTime.startTime) * 1000, language)}` +
                ` - ` +
                `${Helpers.getDateNameFormat(Number(newDateTime.endTime) * 1000, language)}`
            );
        }
    };

    const numberOfNights = (start: any, end: any) => {
        return Number(moment(Number(end || 0) * 1000).diff(Number(start || 0) * 1000, "days") || 1);
    };

    const getTextAndDate = ({ text, startTime, endTime }: { text: any; startTime: number | string; endTime: number | string }) => {
        const start = Helpers.isNumber(startTime) ? Helpers.formatDate(startTime, Constants.DateFormat.DDMMYYYY_HHMM) : startTime;

        const end = Helpers.isNumber(endTime) ? Helpers.formatDate(endTime, Constants.DateFormat.DDMMYYYY_HHMM) : endTime;

        return [text, `(${[start, end].join(" - ")})`].join(" ");
    };

    const CardItemInvoice = (item: IRecordItinerary) => (
        <Card
            sx={{
                backgroundColor: "#ffffff",
            }}
        >
            <Box
                sx={{
                    gap: 1,
                    padding: 2,
                    paddingTop: 0,
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                }}
            >
                <Box sx={{ gap: 1 }}>
                    <Typography variant="h6">{item.name}</Typography>
                    <Typography variant="button">{getStartTimeEndTime(item.itineraryDetails || [])}</Typography>
                </Box>
                <Box>
                    <Typography variant="button">{`ID: ${item.id}`}</Typography>
                </Box>
            </Box>

            <Box
                sx={{
                    gap: 1,
                    padding: 2,
                    paddingBottom: 0,
                    borderTop: "1px #c3c3c3 solid",
                }}
            >
                {item?.itineraryDetails?.map((element) =>
                    Helpers.isNullOrEmpty(element?.extraInfo) ? (
                        <></>
                    ) : (
                        <>
                            {element?.type === ItineraryType.Hotel && (
                                <Box
                                    sx={{
                                        gap: 1,
                                        display: "flex",
                                        flexWrap: "wrap",
                                        alignItems: "center",
                                    }}
                                >
                                    <HotelOutlined />
                                    <Typography variant="button">
                                        {getTextAndDate({
                                            endTime: Number(element?.endTime || 0) * 1000,
                                            startTime: Number(element?.startTime || 0) * 1000,
                                            text: t("number_of_night_in_hotel", {
                                                name: getNewExtraInfo(element)?.roomName,
                                                night: numberOfNights(element.startTime, element.endTime),
                                            }),
                                        })}
                                    </Typography>
                                </Box>
                            )}
                            {element?.type === ItineraryType.Flight && (
                                <Box gap={1}>
                                    <Box
                                        sx={{
                                            gap: 1,
                                            display: "flex",
                                            flexWrap: "wrap",
                                            alignItems: "center",
                                        }}
                                    >
                                        <LocalAirportOutlined />
                                        <Typography variant="button">
                                            {getTextAndDate({
                                                endTime: Number(getNewExtraInfo(element)?.arrivalDate || 0) * 1000,
                                                startTime: Number(getNewExtraInfo(element)?.departDate || 0) * 1000,
                                                text: Helpers.getFlightName(getNewExtraInfo(element)),
                                            })}
                                        </Typography>
                                    </Box>
                                </Box>
                            )}
                        </>
                    )
                )}

                <Box sx={{ gap: 1, mt: 1, display: "flex", flexWrap: "wrap", alignItems: "center" }}>
                    <Typography variant="button" fontWeight="bold">
                        {"Tổng tiền: "}
                    </Typography>
                    <Typography variant="button">{`${Helpers.formatCurrency(item.estimateAmount || 0)} ${Constants.CURRENCY_DEFAULT}`}</Typography>
                </Box>

                <Box sx={{ gap: 1, mt: 1, display: "flex", flexWrap: "wrap", alignItems: "center" }}>
                    <Typography variant="button" fontWeight="bold">
                        {"Người tham gia: "}
                    </Typography>
                    <RenderListName dataName={getItemUser(item.itineraryMembers || [])} maxLeght={10} />
                </Box>

                {[...(item.bookingOrders || [])].length === 0 && (
                    <Box sx={{ paddingTop: 2 }}>
                        <Typography variant="button">{"Không có hóa đơn"}</Typography>
                    </Box>
                )}

                {[...(item.bookingOrders || [])].length > 0 && (
                    <Box
                        sx={{
                            gap: 2,
                            paddingTop: 2,
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                        }}
                    >
                        {[...(item.bookingOrders || [])].map((el, index) => (
                            <Box
                                key={index}
                                sx={{
                                    gap: 1,
                                    display: "flex",
                                    flexWrap: "wrap",
                                    alignItems: "center",
                                    "&:hover .MuiTypography-root": {
                                        cursor: "pointer",
                                        fontWeight: "bold",
                                        textDecoration: "underline",
                                    },
                                }}
                                onClick={() => {
                                    window.open(`${SALE_API_URL}/Invoice/PrintBookingInvoice/${el.orderId}`, "_blank", "noopener");
                                }}
                            >
                                <Image alt="DOWNLOAD_FILE" src={Resources.Icon.DOWNLOAD_FILE} width={21} height={21} />
                                <Typography variant="button" color="info">
                                    {`Hoá đơn - Mã đặt: ${el.orderId}`}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                )}
            </Box>
        </Card>
    );

    const CardListItemInvoice = () => {
        if (isLoading) {
            return <PageLoader />;
        }

        if (!dataInvoice?.items || dataInvoice?.items?.length === 0) {
            return (
                <Card sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", minHeight: 300 }}>
                    <Box
                        sx={{
                            backgroundColor: "#ffffff",
                        }}
                    >
                        <Typography variant="h6" textAlign={"center"} sx={(theme) => typographyStyles(theme, { fontWeight: 600 })}>
                            {t("tripbooking:no_filter_data")}
                        </Typography>
                    </Box>
                </Card>
            );
        }

        return (
            <>
                <Grid container spacing={3}>
                    {[...(dataInvoice.items || [])].map((item) => (
                        <Grid item xs={12} key={item.id}>
                            {CardItemInvoice(item)}
                        </Grid>
                    ))}
                </Grid>
                {dataInvoice?.totalPages > 0 && (
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
                            {"Tổng: " + dataInvoice?.totalCount}
                        </Typography>
                        <Pagination
                            page={dataInvoice?.currentPage}
                            count={dataInvoice?.totalPages}
                            onChange={(event: any, newPage: number) => {
                                getPaged({ ...model.requestData, pageNumber: newPage });
                            }}
                        />
                    </Box>
                )}
            </>
        );
    };

    const FormFilter = () => (
        <CustomDrawer variant="permanent" ownerState={{ width: "400px", openConfigurator: openFilter }}>
            <Box p={2}>
                <Box
                    style={{
                        top: 0,
                        left: 0,
                        right: 0,
                        zIndex: 111,
                        position: "sticky",
                        backgroundColor: "#fff",
                    }}
                >
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="h6">{"Lọc"}</Typography>
                        <IconButton
                            onClick={() => {
                                setOpenFilter(false);
                                setModel({
                                    ...model,
                                    requestDataTemp: { ...model.requestData },
                                });
                            }}
                        >
                            <Close />
                        </IconButton>
                    </Box>
                </Box>

                <Box mt={2}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <FormField
                                label={"Mã chuyến đi"}
                                placeholder={"Nhập mã chuyến đi"}
                                value={model?.requestDataTemp?.searchText}
                                onChangeValue={(value) => {
                                    setModel((prev) => ({
                                        ...prev,
                                        requestDataTemp: {
                                            ...prev.requestDataTemp,
                                            searchText: value,
                                        },
                                    }));
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Box
                                sx={{
                                    ".MuiOutlinedInput-input": {
                                        padding: "12px 12px !important",
                                        margin: "0px !important",
                                    },
                                    ".MuiInputLabel-root": {
                                        top: "-8px !important",
                                        left: "12px !important",
                                    },
                                }}
                            >
                                <DatePicker
                                    label="Từ"
                                    placeholder="Chọn thời gian"
                                    value={model?.requestDataTemp?.startTime ? Number(model?.requestDataTemp?.startTime) * 1000 : undefined}
                                    onChangeValue={(value) => {
                                        let end = model?.requestDataTemp?.endTime ? moment(Number(model?.requestDataTemp?.endTime) * 1000).unix() : 0;
                                        const newValue = !Helpers.isNullOrEmpty(value) ? moment(value).unix() : undefined;

                                        if (!Helpers.isNullOrEmpty(end) && !Helpers.isNullOrEmpty(newValue) && newValue > Number(end)) {
                                            end = moment(value).endOf("month").unix();
                                        }

                                        setModel((prev) => ({
                                            ...prev,
                                            requestDataTemp: {
                                                ...prev.requestDataTemp,
                                                startTime: newValue,
                                                endTime: end,
                                            },
                                        }));
                                    }}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box
                                sx={{
                                    ".MuiOutlinedInput-input": {
                                        padding: "12px 12px !important",
                                        margin: "0px !important",
                                    },
                                    ".MuiInputLabel-root": {
                                        top: "-8px !important",
                                        left: "12px !important",
                                    },
                                }}
                            >
                                <DatePicker
                                    label="Đến"
                                    placeholder="Chọn thời gian"
                                    value={model?.requestDataTemp?.endTime ? Number(model?.requestDataTemp?.endTime) * 1000 : undefined}
                                    onChangeValue={(value) => {
                                        let start = model?.requestDataTemp?.startTime
                                            ? moment(Number(model?.requestDataTemp?.startTime) * 1000).unix()
                                            : 0;
                                        const newValue = !Helpers.isNullOrEmpty(value) ? moment(value).unix() : undefined;

                                        if (!Helpers.isNullOrEmpty(start) && !Helpers.isNullOrEmpty(newValue) && newValue < Number(start)) {
                                            start = moment(value).startOf("month").unix();
                                        }

                                        setModel((prev) => ({
                                            ...prev,
                                            requestDataTemp: {
                                                ...prev.requestDataTemp,
                                                endTime: newValue,
                                                startTime: start,
                                            },
                                        }));
                                    }}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </Box>

                <Box
                    style={{
                        left: 0,
                        right: 0,
                        bottom: 0,
                        position: "absolute",
                        backgroundColor: "#fff",
                    }}
                >
                    <Box
                        sx={{
                            p: 1,
                            gap: 1,
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Button
                            color={"secondary"}
                            onClick={() => {
                                setOpenFilter(false);
                                getPaged({
                                    pageNumber: 1,
                                    pageSize: Constants.ROW_PER_PAGE_20,
                                });
                            }}
                        >
                            {"Huỷ"}
                        </Button>
                        <Button
                            onClick={() => {
                                setOpenFilter(false);
                                getPaged(model?.requestDataTemp);
                            }}
                        >
                            {"Lọc"}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </CustomDrawer>
    );

    return (
        <BaseLayout>
            <BreadCrumbs title="Hóa đơn" route={["Hóa đơn", "Danh sách hóa đơn"]} />
            <Grid container spacing={3} mt={0}>
                {/* Filter */}
                <Grid item xs={12}>
                    <Card>
                        <Box
                            sx={{
                                gap: 1,
                                display: "flex",
                                flexWrap: "wrap",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <Box sx={{ width: { sm: "80%", md: "90%" } }}>
                                <FormField
                                    value=""
                                    variant="outlined"
                                    placeholder={"Tìm mã chuyến đi"}
                                    onChangeValue={(value) => {}}
                                    InputProps={{ startAdornment: <Search color="secondary" /> }}
                                />
                            </Box>
                            <Box
                                onClick={() => {
                                    setOpenFilter(true);
                                }}
                                style={{
                                    display: "flex",
                                    borderRadius: "50px",
                                    border: "1px solid #ccc",
                                }}
                            >
                                <IconButton>
                                    <FilterListOutlined />
                                </IconButton>
                            </Box>
                        </Box>
                    </Card>
                    {openFilter && <FormFilter />}
                </Grid>
                {/* Value Filter */}
                <Grid item xs={12}>
                    {!Helpers.isNullOrEmpty(model?.requestData?.startTime) && (
                        <Chip
                            label={t("từ")}
                            value={Helpers.formatDate(Number(model?.requestData?.startTime) * 1000)}
                            onDelete={() => {
                                getPaged({ ...model.requestData, startTime: undefined });
                            }}
                        />
                    )}
                    {!Helpers.isNullOrEmpty(model?.requestData?.endTime) && (
                        <Chip
                            label={t("đến")}
                            value={Helpers.formatDate(Number(model?.requestData?.endTime) * 1000)}
                            onDelete={() => {
                                getPaged({ ...model.requestData, endTime: undefined });
                            }}
                        />
                    )}
                </Grid>
                {/* List Invoice */}
                <Grid item xs={12}>
                    <CardListItemInvoice />
                </Grid>
            </Grid>
        </BaseLayout>
    );
};

InvoicePage.requiredAuth = true;
export default withSSRErrorHandling(InvoicePage);

const getStaticProps = getServerSideTranslationsProps(["common", "tripbooking"]);
export { getStaticProps };

const RenderListName = (props: { dataName: string[]; maxLeght: number }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openModalSeeUser = Boolean(anchorEl);

    const handleOpenModalSeeUser = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseModalSeeUser = () => {
        setAnchorEl(null);
    };

    return props.dataName?.length > props.maxLeght ? (
        <Typography variant="button" fontStyle="italic">
            {props.dataName?.slice(0, props.maxLeght)?.join(", ") + ", "}
            <Box
                id="button-user-more"
                aria-haspopup="true"
                aria-expanded={openModalSeeUser ? "true" : undefined}
                aria-controls={openModalSeeUser ? "dropdown-user-more" : undefined}
                onClick={(event: any) => {
                    event.stopPropagation();
                    handleOpenModalSeeUser(event);
                }}
                sx={{
                    display: "inline-flex",
                    "&:hover": {
                        ".MuiTypography-root": {
                            color: "#1A73E8",
                            cursor: "pointer",
                            fontWeight: "bold",
                        },
                    },
                }}
            >
                <Typography color="info" variant="button" fontStyle="italic">
                    {"...xem thêm."}
                </Typography>
            </Box>
            <Menu
                anchorEl={anchorEl}
                open={openModalSeeUser}
                onClose={handleCloseModalSeeUser}
                MenuListProps={{ "aria-labelledby": "button-user-more" }}
                id="dropdown-user-more"
            >
                <Box
                    sx={{
                        gap: 1,
                        py: "8px",
                        px: "16px",
                        display: "grid",
                        maxHeight: "70vh",
                        overflowY: "auto",
                    }}
                >
                    {props.dataName?.slice(props.maxLeght, props.dataName?.length).map((el, index) => (
                        <Typography key={index} variant="button" fontStyle="italic">
                            {el}
                        </Typography>
                    ))}
                </Box>
            </Menu>
        </Typography>
    ) : (
        <Typography variant="button" fontStyle="italic">
            {props.dataName?.join("; ")}
        </Typography>
    );
};
