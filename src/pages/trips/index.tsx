import { Box, Typography } from "@maysoft/common-component-react";
import { Grid } from "@mui/material";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";

import Card from "@src/components/Card/Card";
import { Pagination } from "@src/components";
import Constants from "@src/constants";
import PathName from "@src/constants/PathName";

import { ValiIcon } from "@src/assets/svg";
import { BookingHelpers } from "@src/commons/bookingHelpers";
import { ConfirmStatus, PaymentStatus, Status, Timeline, TripTabs } from "@src/commons/enum";
import Helpers from "@src/commons/helpers";
import { IItinerary, IPagedList } from "@src/commons/interfaces";
import { getServerSideTranslationsProps } from "@src/commons/translationHelpers";
import { withSSRErrorHandling } from "@src/commons/withSSRErrorHandling";
import { ModalApproveRejectItineraryDetail, SearchTripForm, TripCardApproval, TripCardNormal, TripCardSkeleton } from "@src/components";
import { BreadCrumbs } from "@src/components/BreadCrumbs";
import { CardList } from "@src/components/CardItem";
import useUsers from "@src/hooks/trips/useUsers";
import useDataRequestApproveReject, { IRecordRequestV2Service } from "@src/hooks/useDataRequestApproveReject.hook";
import { BaseLayout } from "@src/layout";
import ItineraryService, { IRequestGetPagedItinerary } from "@src/services/booking/ItineraryService";
import { RootState } from "@src/store";
import { useDispatch } from "react-redux";
import useSWR from "swr";
import { NextApplicationPage } from "../_app";

// #Sonle
const completedPaymentStatus = [
    PaymentStatus.Completed,
    12, // Old paymentStatus issued
];
const draftPaymentConfirmNotIn = [
    ...completedPaymentStatus,
    PaymentStatus.WaitingRefund,
    PaymentStatus.Refunded,
    PaymentStatus.RefundFailed,
    PaymentStatus.PartialRefunded,
    PaymentStatus.PartialRefundFailed,
]

const itineraryGetpagedType = {
    draft: {
        isOrder: false,
        timeline: undefined,
        paymentConfirm: [PaymentStatus.New],
        paymentConfirmNotIn: draftPaymentConfirmNotIn,
        confirmStatus: [ConfirmStatus.Pending, ConfirmStatus.Processing, ConfirmStatus.Completed],
        isNoneDetail: true,
        orderBy: "startTime",
        statusDetail: [Status.Draft, Status.Active, Status.Inactive],
    },
    now: {
        isOrder: true,
        timeline: Timeline.Now,
        paymentConfirm: completedPaymentStatus,
        paymentConfirmNotIn: undefined,
        confirmStatus: [ConfirmStatus.Completed],
        isNoneDetail: undefined,
        orderBy: "startTime",
        statusDetail: [Status.Draft, Status.Active, Status.Inactive],
    },
    future: {
        isOrder: true,
        timeline: Timeline.Future,
        paymentConfirm: completedPaymentStatus,
        paymentConfirmNotIn: undefined,
        confirmStatus: [ConfirmStatus.Completed],
        isNoneDetail: undefined,
        orderBy: "startTime",
        statusDetail: [Status.Draft, Status.Active, Status.Inactive],
    },
    past: {
        isOrder: true,
        timeline: Timeline.Past,
        paymentConfirm: completedPaymentStatus,
        paymentConfirmNotIn: undefined,
        confirmStatus: [ConfirmStatus.Completed],
        isNoneDetail: undefined,
        orderBy: "startTime",
        statusDetail: [Status.Draft, Status.Active, Status.Inactive],
    },
    rejected: {
        isOrder: undefined,
        timeline: undefined,
        paymentConfirm: undefined,
        paymentConfirmNotIn: undefined,
        confirmStatus: [ConfirmStatus.Rejected, ConfirmStatus.Cancel],
        isNoneDetail: undefined,
        orderBy: "startTime",
        statusDetail: undefined,
    },
};

const getPagedTypeFromTripTab = (tab: TripTabs) => {
    switch (tab) {
        case TripTabs.Draft:
            return itineraryGetpagedType.draft;
        case TripTabs.Now:
            return itineraryGetpagedType.now;
        case TripTabs.Future:
            return itineraryGetpagedType.future;
        case TripTabs.Past:
            return itineraryGetpagedType.past;
        case TripTabs.Rejected:
            return itineraryGetpagedType.rejected;
        default:
            return itineraryGetpagedType.now;
    }
};
const getValidInputTripTabs = (input?: string, defaultValue?: TripTabs): TripTabs => {
    if (input === undefined) return TripTabs.Now;
    const inputAsTripTabs = input as TripTabs;
    return Object.values<string>(TripTabs).includes(input) ? inputAsTripTabs : (defaultValue ?? TripTabs.Now);
};

const numberOfSkeleton = 9;

const TripPage: NextApplicationPage = () => {
    const { t } = useTranslation(["common", "tripbooking"]);
    const router = useRouter();
    const dispatch = useDispatch();
    const userProfile = useSelector((state: RootState) => state.userInfo.userProfile);

    const { data: countByTimeline } = useSWR(userProfile.organizationId ? ["tripbooking", userProfile?.organizationId] : null, async () => {
        const keys = Object.keys(itineraryGetpagedType);
        try {
            const response = await Promise.all(
                Object.values(itineraryGetpagedType).map(async (request) =>
                    ItineraryService.getCountItinerary({
                        ...request,
                        organizationId: userProfile?.organizationId,
                    })
                )
            );
            return response.reduce((acc, curr, index) => {
                acc[keys[index]] = curr || 0;
                return acc;
            }, {} as any);
        } catch (e) {
            return keys.reduce(
                (acc, curr) => {
                    acc[curr] = 0;
                    return acc;
                },
                {} as Record<string, number>
            );
        }
    });

    const [data, setData] = useState<IPagedList<IItinerary>>({
        totalPages: 0,
        totalCount: 0,
        currentPage: 0,
        hasNext: false,
        hasPrevious: false,
        pageSize: Constants.ROW_PER_PAGE,
        items: [],
    });

    const activeTab = getValidInputTripTabs(router.query[Constants.PAGE_QUERY_KEY.ACTIVE_TAB] as string);
    const page = router.query[Constants.PAGE_QUERY_KEY.PAGE_NUMBER] as string;

    const [loading, setLoading] = useState<boolean>(true);
    const [requestData, setRequestData] = useState<IRequestGetPagedItinerary>({
        organizationId: userProfile?.organizationId,
        pageSize: Constants.ROW_PER_PAGE,
        searchText: router.query[Constants.PAGE_QUERY_KEY.SEARCH_TEXT] as string,
        pageNumber: page ? parseInt(page) : 1,
        ...getPagedTypeFromTripTab(activeTab),
    });

    // #Sonle
    const { allowApproval, handleRejectRequest, handleApprovalRequest, getDataRequestApprovalReject } = useDataRequestApproveReject();
    const [isReject, setIsReject] = useState<boolean>(false);
    const [dataMapUser, setDataMapUser] = useState<Map<string, any>>(new Map());
    const [dataRequestApproveReject, setDataRequestApproveReject] = useState<IRecordRequestV2Service[]>([]);
    const [openPopupApproveRejectItineraryDetail, setOpenPopupApproveRejectItineraryDetail] = useState<boolean>(false);
    const [itemApproveRejectItineraryDetail, setItemApproveRejectItineraryDetail] = useState<IRecordRequestV2Service | undefined>(undefined);
    // #Sonle

    const userIds = useMemo(() => {
        if (activeTab === TripTabs.Approval) {
            if (dataRequestApproveReject.length === 0) return [];
            return dataRequestApproveReject.reduce((acc, cur, index) => {
                acc = [...acc, ...(cur?.members || [])?.map((member) => member.userId)];
                if (index === data.items.length - 1) acc = acc.filter((v, i, a) => a.indexOf(v) === i);
                return acc;
            }, [] as string[]);
        }

        if (data.items.length === 0) return [];
        return data.items.reduce((acc, cur, index) => {
            acc = [...acc, ...(cur?.itineraryMembers || [])?.map((member) => member.userId)];
            if (index === data.items.length - 1) acc = acc.filter((v, i, a) => a.indexOf(v) === i);
            return acc;
        }, [] as string[]);
    }, [data, activeTab, dataRequestApproveReject]);

    const { users, loading: userLoading } = useUsers({ userIds });

    if (userProfile?.organizationId && userProfile?.organizationId !== requestData.organizationId) {
        setRequestData((prev) => ({ ...prev, organizationId: userProfile?.organizationId }));
    }

    // first load data
    useEffect(() => {
        let ignore = false;
        if (!userProfile?.organizationId) return;
        if (activeTab === TripTabs.Approval) {
            if (allowApproval === "allowed") {
                getDataRequestApprovalReject({
                    setLoading: setLoading,
                    searchText: requestData?.searchText,
                }).then((value) => {
                    if (ignore) return;
                    setDataRequestApproveReject(value.dataRequestApprovalReject);
                    setDataMapUser(value.newDataUser);
                });
            }
            if (allowApproval === "forbidden") {
                router.push({
                    ...router,
                    query: {
                        ...router.query,
                        [Constants.PAGE_QUERY_KEY.ACTIVE_TAB]: TripTabs.Now,
                    },
                });
            }
        }
        return () => {
            ignore = true;
        };
    }, [allowApproval, userProfile?.organizationId, router.isReady, router]);
    // first load data
    useEffect(() => {
        if (!userProfile?.organizationId) return;
        if (activeTab !== TripTabs.Approval) {
            getPagedTrip(requestData);
        }
    }, [userProfile?.organizationId]);

    const getPagedTrip = async (newRequestData: IRequestGetPagedItinerary & { tab?: TripTabs }) => {
        try {
            setLoading(true);
            const { tab = activeTab, ...newRequestDataWithoutTab } = newRequestData;
            const result = await ItineraryService.getPaged(newRequestDataWithoutTab);
            const processedTrips = BookingHelpers.getProcessedTrips(result.items, tab);
            result.items = processedTrips;
            setData(result);
            setRequestData(newRequestData);
        } catch (error) {
            Helpers.handleError(error, router, dispatch);
            setData({
                totalPages: 0,
                totalCount: 0,
                currentPage: newRequestData.pageNumber,
                hasNext: false,
                hasPrevious: false,
                pageSize: newRequestData.pageSize,
                items: [],
            });
        } finally {
            setLoading(false);
        }
    };

    const onSearch = async (value: string) => {
        if (activeTab === TripTabs.Approval) {
            getDataRequestApprovalReject({
                setLoading: setLoading,
                searchText: value || undefined,
            }).then((newResult) => {
                setDataRequestApproveReject(newResult.dataRequestApprovalReject);
                setDataMapUser(newResult.newDataUser);
            });
        } else {
            getPagedTrip({ ...requestData, searchText: value, pageNumber: 1 });
        }

        setRequestData((prev) => ({ ...prev, searchText: value }));
        const newQuery = { ...router.query, [Constants.PAGE_QUERY_KEY.SEARCH_TEXT]: value, [Constants.PAGE_QUERY_KEY.PAGE_NUMBER]: 1 };
        if (value === "") {
            delete newQuery[Constants.PAGE_QUERY_KEY.SEARCH_TEXT];
        }
        router.push({ pathname: PathName.TRIPS, query: newQuery }, undefined, { shallow: true });
    };

    const onChangeTab = async (tab: TripTabs) => {
        if (tab === TripTabs.Approval) {
            getDataRequestApprovalReject({
                setLoading: setLoading,
                searchText: requestData?.searchText,
            }).then((newResult) => {
                setDataRequestApproveReject(newResult.dataRequestApprovalReject);
                setDataMapUser(newResult.newDataUser);
            });
        } else {
            getPagedTrip({ ...requestData, ...getPagedTypeFromTripTab(tab), pageNumber: 1, tab });
        }

        router.push(
            {
                pathname: PathName.TRIPS,
                query: {
                    ...router.query,
                    [Constants.PAGE_QUERY_KEY.ACTIVE_TAB]: tab,
                    [Constants.PAGE_QUERY_KEY.PAGE_NUMBER]: 1,
                },
            },
            undefined,
            { shallow: true }
        );
    };

    const paginationAnchorDivRef = useRef<HTMLDivElement>(null);
    const onChangePage = async (pageNumber: number) => {
        if (activeTab === TripTabs.Approval) {
            return;
        } else {
            getPagedTrip({ ...requestData, pageNumber });
            paginationAnchorDivRef.current?.scrollIntoView({ behavior: "smooth" });
            router.push(
                {
                    pathname: PathName.TRIPS,
                    query: {
                        ...router.query,
                        [Constants.PAGE_QUERY_KEY.PAGE_NUMBER]: pageNumber,
                    },
                },
                undefined,
                { shallow: true }
            );
        }
    };

    const isPaginationShown = data?.totalPages > 1 && activeTab !== TripTabs.Approval;

    return (
        <BaseLayout>
            <BreadCrumbs title={"Danh sách chuyến đi"} route={["Chuyến đi", "Danh sách chuyến đi"]} />

            <div id="pagination-anchor" ref={paginationAnchorDivRef}></div>
            <Grid container spacing={3} mt={0}>
                {/* <Grid item xs={12}>
                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                      
                        <Button
                            onClick={() => {
                                setVisibled(true);
                            }}
                        >
                            <Add /> &nbsp; {t("common:add")}
                        </Button>
                    </Box>

                    <ModalUpdateTrip
                        mode={Mode.Create}
                        userData={[]}
                        visibled={visibled}
                        setVisibled={setVisibled}
                        itineraryData={{} as IItinerary}
                    />
                </Grid> */}

                <Grid item xs={12}>
                    <SearchTripForm
                        {...{
                            requestData,
                            activeTab,
                            onChangeTab,
                            onSearch,
                            showApprovalTab: allowApproval === "allowed",
                            isLoading: loading,
                            countByTimeline,
                        }}
                    />
                </Grid>

                <Grid item xs={12}>
                    {activeTab !== TripTabs.Approval && (
                        <CardList
                            data={data.items || []}
                            loading={loading}
                            numberOfSkeleton={numberOfSkeleton}
                            cardItem={TripCardNormal}
                            cardItemProps={{
                                item: {} as any,
                                hidenStatus: true,
                                users,
                                userLoading,
                                // refreshData: async () => {
                                //     const newPageNumber = calculateNewPageNumber({
                                //         pageNumber: requestData.pageNumber,
                                //         totalCount: data.totalCount,
                                //         pageSize: requestData.pageSize,
                                //     });
                                //     await getPagedTrip({ ...requestData, pageNumber: newPageNumber });
                                // },
                                onClick: (item) => {
                                    router.push({
                                        pathname: PathName.TRIPS_DETAIL,
                                        query: {
                                            id: item.id,
                                            [Constants.PAGE_QUERY_KEY.TRIP_DETAIL.FROM_TAB]: activeTab,
                                        },
                                    });
                                },
                            }}
                            skeletonComponent={TripCardSkeleton}
                            emptyComponent={EmptyComponent}
                        />
                    )}

                    {/* #Sonle */}
                    {activeTab === TripTabs.Approval && allowApproval && (
                        <CardList
                            loading={loading}
                            cardItem={TripCardApproval}
                            skeletonComponent={TripCardSkeleton}
                            data={dataRequestApproveReject || []}
                            cardItemProps={{
                                item: {} as IRecordRequestV2Service,
                                users,
                                userLoading,
                                onReject(newData) {
                                    setIsReject(true);
                                    setOpenPopupApproveRejectItineraryDetail(true);
                                    setItemApproveRejectItineraryDetail(newData);
                                },
                                onApprove(newData) {
                                    setIsReject(false);
                                    setOpenPopupApproveRejectItineraryDetail(true);
                                    setItemApproveRejectItineraryDetail(newData);
                                },
                            }}
                            emptyComponent={EmptyComponent}
                        />
                    )}
                    {/* #Sonle */}
                </Grid>

                <Grid item xs={12}>
                    {isPaginationShown && !loading && (
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
                                {"Tổng: " + data?.totalCount}
                            </Typography>
                            <Pagination page={requestData?.pageNumber} count={data?.totalPages} onChange={(_, page) => onChangePage(page)} />
                        </Box>
                    )}
                </Grid>
            </Grid>

            {/* #Sonle */}
            {openPopupApproveRejectItineraryDetail && (
                <ModalApproveRejectItineraryDetail
                    typePopup={isReject ? "reject" : "approve"}
                    visibled={openPopupApproveRejectItineraryDetail}
                    setVisibled={setOpenPopupApproveRejectItineraryDetail}
                    dataItineraryMembers={itemApproveRejectItineraryDetail?.members || []}
                    redirectUrl={`${window.location.origin}${PathName.TRIPS_DETAIL.replace("[id]", itemApproveRejectItineraryDetail?.id || "")}`}
                    onApprove={(newData) => {
                        handleApprovalRequest({
                            data: newData,
                            onCallBack: async () => {
                                setOpenPopupApproveRejectItineraryDetail(false);
                                setItemApproveRejectItineraryDetail(undefined);
                                setIsReject(false);
                                const newResult = await getDataRequestApprovalReject({
                                    setLoading: setLoading,
                                    searchText: requestData?.searchText,
                                });
                                setDataRequestApproveReject(newResult.dataRequestApprovalReject);
                                setDataMapUser(newResult.newDataUser);
                            },
                        });
                    }}
                    onReject={(newData) => {
                        handleRejectRequest({
                            data: newData,
                            onCallBack: async () => {
                                setIsReject(false);
                                setItemApproveRejectItineraryDetail(undefined);
                                setOpenPopupApproveRejectItineraryDetail(false);
                                const newResult = await getDataRequestApprovalReject({
                                    setLoading: setLoading,
                                    searchText: requestData?.searchText,
                                });
                                setDataRequestApproveReject(newResult.dataRequestApprovalReject);
                                setDataMapUser(newResult.newDataUser);
                            },
                        });
                    }}
                />
            )}
            {/* #Sonle */}
        </BaseLayout>
    );
};

const EmptyComponent = () => (
    <Card
        sx={{
            width: "100%",
        }}
    >
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                minHeight: 300,
            }}
        >
            <ValiIcon />
            <Typography
                sx={{
                    fontSize: Constants.FONT_SIZE.SMALL_TEXT,
                    fontWeight: 400,
                    color: "#1C252E",
                    textAlign: "center",
                }}
            >
                Không có chuyến đi nào
            </Typography>
        </Box>
    </Card>
);
TripPage.requiredAuth = true;
export default withSSRErrorHandling(TripPage);

const getStaticProps = getServerSideTranslationsProps(["common", "tripbooking"]);
export { getStaticProps };

const calculateNewPageNumber = ({ pageNumber, pageSize, totalCount }: { pageNumber: number; totalCount: number; pageSize: number }) => {
    const newTotalCount = totalCount - 1;
    const newTotalPage = Math.ceil(newTotalCount / pageSize);
    return Math.max(pageNumber > newTotalPage ? newTotalPage : pageNumber, 1);
};
