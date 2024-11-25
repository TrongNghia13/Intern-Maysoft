import { Box, Button, Typography } from "@maysoft/common-component-react";
import { Tune } from "@mui/icons-material";
import { Divider, Grid, useMediaQuery } from "@mui/material";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import Helpers from "@src/commons/helpers";
import { Pagination, Popup } from "@src/components";
import PropertyContentService from "@src/services/booking/PropertyContentService";

import { AttributeReferenceId, SearchHotelComponentMode } from "@src/commons/enum";
import { IDetailHotel, IPagedList } from "@src/commons/interfaces";
import FilterBooking, { IDataFilterBooking } from "@src/components/Search/filter";
import { ISearchHotelData } from "@src/hooks/searchHotel/useData";
import { SearchService } from "@src/services/search";
// import { addItemTravelersAlsoViewed } from "@src/store/slice/historySearchData";
import { CardList, HotelCard, SkeletonHotelCard } from "../CardItem";
import SearchHotelComponent from "../SearchHotel";

interface IProps {
    searchData: ISearchHotelData;
    filterData: IDataFilterBooking;
    pageNumber: number;
    hiddenSearchForm?: boolean;
    handleFilter: (req: { dataSearchBooking?: ISearchHotelData; dataFilterBooking?: IDataFilterBooking; pageNumber?: number }) => void;
    onItemClick?: (item: IDetailHotel) => void;
}

const SearchComponent: React.FC<IProps> = ({ pageNumber, hiddenSearchForm, searchData, filterData, onItemClick, handleFilter }) => {
    const router = useRouter();
    const dispatch = useDispatch();

    const {
        t,
        i18n: { language },
    } = useTranslation("search");

    const isWebview = useMediaQuery("(min-width:1190px)");

    const [mobilePopupVisibled, setMobilePopupVisibled] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    const [dataSearch, setDataSearch] = useState<ISearchHotelData | undefined>(undefined);
    const [dataFilter, setDataFilter] = useState<IDataFilterBooking | undefined>(undefined);
    const [dataPagedListHotel, setDataPagedListHotel] = useState<IPagedList<IDetailHotel>>({
        currentPage: 1,
        hasNext: false,
        hasPrevious: false,
        items: [],
        pageSize: 10,
        totalCount: 0,
        totalPages: 0,
    });

    const getPageNumber = (pageNumber: number, pageSize: number, totalCount: number) => {
        const mathCeil = Math.ceil((totalCount || 0) / pageSize);
        const valTemp = mathCeil > 0 ? mathCeil : 1;
        return pageNumber > valTemp ? valTemp : pageNumber;
    };

    useEffect(() => {
        mobilePopupVisibled && setMobilePopupVisibled((prev) => !prev);
    }, [isWebview]);

    useEffect(() => {
        getDataSearchBooking({
            dataSearchBooking: searchData,
            dataFilterBooking: filterData,
            pageNumber: Number(router?.query?.pageNumber || 1),
        });
    }, [
        language,
        searchData?.endDate,
        searchData?.startDate,
        searchData?.searchText,
        searchData?.occupancy,
        // router?.query?.adults,
        // router?.query?.children,
        // router?.query?.childrenAgeList,
        filterData?.amenities,
        filterData?.paymentType,
        filterData?.starRating,
        filterData?.popularFilter,
        filterData?.price?.max,
        filterData?.price?.min,
        pageNumber,
    ]);

    const getnumberOfNights = useMemo(() => {
        const checkouttime = dataSearch?.endDate;
        const checkintime = dataSearch?.startDate;
        if (!Helpers.isNullOrEmpty(checkouttime) && !Helpers.isNullOrEmpty(checkintime)) {
            const value = moment(Number(checkouttime) * 1000).diff(moment(Number(checkintime) * 1000), "day");
            return value;
        }
        return 0;
    }, [dataSearch?.startDate, dataSearch?.endDate]);

    const getDataSearchBooking = async (req: {
        dataSearchBooking?: ISearchHotelData;
        dataFilterBooking?: IDataFilterBooking;
        pageNumber?: number;
    }) => {
        try {
            setLoading(true);
            const checkouttime = req.dataSearchBooking?.endDate;
            const checkintime = req.dataSearchBooking?.startDate;
            const searchText = req.dataSearchBooking?.searchText;
            const occupancy = req.dataSearchBooking?.occupancy || [
                {
                    adultSlot: 1,
                    childrenOld: [],
                },
            ];

            const pageNumber = getPageNumber(req?.pageNumber || 1, dataPagedListHotel.pageSize || 20, dataPagedListHotel.totalCount || 0);

            const resultSearch = await SearchService.search({
                entity: "partner",
                pageNumber: pageNumber,
                pageSize: dataPagedListHotel.pageSize,
                orderBy: {
                    descending: ["payNow"],
                },
                partner: {
                    partnerName: searchText,
                    attributeValues: [
                        ...(req?.dataFilterBooking?.amenities || []),
                        ...(req?.dataFilterBooking?.starRating || []),
                        ...(req?.dataFilterBooking?.paymentType || []),
                        ...(req?.dataFilterBooking?.popularFilter || []),
                    ],
                },
            });

            const newIds = resultSearch?.items?.map((el) => el.externalId);

            const amenityids = [
                AttributeReferenceId.laundry_facilities,
                AttributeReferenceId.air_conditioning,
                AttributeReferenceId.outdoor_pools,
                AttributeReferenceId.self_parking,
                AttributeReferenceId.wifi,
            ];

            if (newIds.length > 0) {
                const resultSearchBooking = await PropertyContentService.search({
                    language: language === "vi" ? "vi-VN" : "en-US",
                    pageNumber: pageNumber,
                    pageSize: dataPagedListHotel.pageSize,
                    // minPrice: req?.dataFilterBooking?.price?.min,
                    // maxPrice: req?.dataFilterBooking?.price?.max,
                    amenityIds: amenityids,
                    checkinTime: checkintime || 0,
                    checkoutTime: checkouttime || 0,
                    propertyIds: newIds || [],
                    occupancy: occupancy,
                });

                setDataPagedListHotel({
                    hasNext: resultSearch.hasNext,
                    hasPrevious: resultSearch.hasPrevious,
                    currentPage: resultSearch.currentPage,
                    totalPages: resultSearch.totalPages,
                    totalCount: resultSearch.totalCount,
                    pageSize: resultSearch.pageSize,
                    items: resultSearchBooking.items,
                });
            } else {
                setDataPagedListHotel({
                    hasNext: resultSearch.hasNext,
                    hasPrevious: resultSearch.hasPrevious,
                    currentPage: resultSearch.currentPage,
                    totalPages: resultSearch.totalPages,
                    totalCount: resultSearch.totalCount,
                    pageSize: resultSearch.pageSize,
                    items: [],
                });
            }

            setDataFilter(req?.dataFilterBooking);
            setDataSearch(req?.dataSearchBooking);
            setLoading(false);
        } catch (error) {
            console.log({ error });
        } finally {
            // dispatch(hideLoading());
        }
    };

    return (
        <>
            <Grid container spacing={4}>
                {!hiddenSearchForm && (
                    <Grid item xs={12}>
                        <SearchHotelComponent
                            mode={SearchHotelComponentMode.Corporate}
                            searchData={searchData}
                            onSearch={(data) => {
                                handleFilter({
                                    dataFilterBooking: dataFilter,
                                    dataSearchBooking: data,
                                    pageNumber: dataPagedListHotel.currentPage,
                                });
                            }}
                            hidenInputUserIds={true}
                        />
                    </Grid>
                )}
                {isWebview && (
                    <Grid item xs={12} lg={3}>
                        <FilterBooking
                            dataFilter={dataFilter}
                            onChangeDataFilter={(data) => {
                                handleFilter({
                                    dataFilterBooking: data,
                                    dataSearchBooking: dataSearch,
                                    pageNumber: dataPagedListHotel.currentPage,
                                });
                            }}
                        />
                    </Grid>
                )}
                {!isWebview && (
                    <Grid item xs={12}>
                        <Button variant="outlined" onClick={() => setMobilePopupVisibled(true)}>
                            <Tune />
                            &nbsp;{t("sort_and_filter")}
                        </Button>
                    </Grid>
                )}

                <Grid item xs={12} lg={isWebview ? 9 : 12}>
                    <CardList
                        loading={loading}
                        data={dataPagedListHotel.items || []}
                        cardItemProps={{
                            item: {} as any,
                            numberOfNights: getnumberOfNights,
                            onClick: (item) => {
                                // dispatch(
                                //     addItemTravelersAlsoViewed({
                                //         name: item.name,
                                //         id: item.propertyId,
                                //         photoUrl: item.photos[0]?.photoUrl,
                                //         description: item.address?.cityName,
                                //     })
                                // );
                                if (Helpers.isFunction(onItemClick)) return onItemClick(item);

                                return router.push({
                                    pathname: "hotel/[id]",
                                    query: {
                                        id: item.propertyId,
                                        searchText: dataSearch?.searchText,
                                        startDate: dataSearch?.startDate,
                                        endDate: dataSearch?.endDate,
                                        occupancy: JSON.stringify(dataSearch?.occupancy),
                                    },
                                });
                            },
                        }}
                        cardItem={HotelCard}
                        skeletonComponent={SkeletonHotelCard}
                    />
                    {/* <HotelList
                        loading={loading}
                        numberOfNights={getnumberOfNights}
                        dataRows={dataPagedListHotel.items || []}
                        onClick={(item) => {
                            // dispatch(
                            //     addItemTravelersAlsoViewed({
                            //         name: item.name,
                            //         id: item.propertyId,
                            //         photoUrl: item.photos[0]?.photoUrl,
                            //         description: item.address?.cityName,
                            //     })
                            // );
                            if (Helpers.isFunction(onItemClick)) return onItemClick(item);

                            return router.push({
                                pathname: "hotel/[id]",
                                query: {
                                    id: item.propertyId,
                                    searchText: dataSearch?.searchText,
                                    startDate: dataSearch?.startDate,
                                    endDate: dataSearch?.endDate,
                                    occupancy: JSON.stringify(dataSearch?.occupancy),
                                },
                            });
                        }}
                    /> */}

                    {!loading && dataPagedListHotel?.totalPages > 0 && (
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
                                {"Tổng: " + dataPagedListHotel?.totalCount}
                            </Typography>
                            <Box
                                sx={{
                                    p: 1,
                                    borderRadius: "25px",
                                    border: "1px #c7c7c7 solid",
                                    ":hover": {
                                        borderColor: "#005efe",
                                    },
                                }}
                            >
                                <Pagination
                                    page={dataPagedListHotel?.currentPage}
                                    count={dataPagedListHotel?.totalPages}
                                    onChange={(event, page) => {
                                        handleFilter({
                                            dataSearchBooking: dataSearch,
                                            dataFilterBooking: dataFilter,
                                            pageNumber: page,
                                        });
                                    }}
                                />
                            </Box>
                        </Box>
                    )}

                    <Divider sx={{ my: 2 }} />
                    {/* Lịch sử xem gần đây*/}
                    {/* <TravelersAlsoViewed /> */}
                </Grid>
            </Grid>

            <Popup
                title={t("sort_and_filter")}
                visibled={mobilePopupVisibled}
                setVisibled={setMobilePopupVisibled}
                onAction={() => {
                    setMobilePopupVisibled(false);
                    handleFilter({
                        dataSearchBooking: dataSearch,
                        dataFilterBooking: dataFilter,
                        pageNumber: dataPagedListHotel.currentPage,
                    });
                }}
            >
                <FilterBooking dataFilter={dataFilter} onChangeDataFilter={(data) => setDataFilter(data)} />
            </Popup>
        </>
    );
};

export default SearchComponent;
