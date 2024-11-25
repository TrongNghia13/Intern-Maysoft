import { useMemo } from "react";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

import Helpers from "@src/commons/helpers";
import SearchComponent from "@src/components/Search";

import { BaseLayout } from "@src/layout";
import { NextApplicationPage } from "../_app";
import { ISearchHotelData } from "@src/hooks/searchHotel/useData";
import { IDataFilterBooking } from "@src/components/Search/filter";
import { withSSRErrorHandling } from "@src/commons/withSSRErrorHandling";
import { makeServerSideTranslations } from "@src/commons/translationHelpers";
// import { addItemTravelersAlsoViewed } from "@src/store/slice/historySearchData";

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
    let props = { ...(await makeServerSideTranslations(locale, ["home", "search_hotel", "search", "detail"])) };

    try {
        return {
            props: {
                ...props,
            },
        };
    } catch (error) {
        return {
            props: {
                error,
                ...props,
            },
        };
    }
};

interface IProps { }

const SearchPage: NextApplicationPage<IProps> = ({ }) => {
    const router = useRouter();
    const {
        t,
        i18n: { language },
    } = useTranslation("search");

    const pageNumber = useMemo<number>(() => Number(router?.query?.pageNumber?.toString() || 1), [router?.query?.pageNumber]);

    const filterData = useMemo<IDataFilterBooking>(
        () => ({
            amenities: Array.isArray(router?.query?.amenities)
                ? router?.query?.amenities
                : router?.query?.amenities
                    ? [router?.query?.amenities]
                    : [],
            paymentType: Array.isArray(router?.query?.paymentType)
                ? router?.query?.paymentType
                : router?.query?.paymentType
                    ? [router?.query?.paymentType]
                    : [],
            popularFilter: Array.isArray(router?.query?.popularFilter)
                ? router?.query?.popularFilter
                : router?.query?.popularFilter
                    ? [router?.query?.popularFilter]
                    : [],
            starRating: Array.isArray(router?.query?.starRating)
                ? router?.query?.starRating
                : router?.query?.starRating
                    ? [router?.query?.starRating]
                    : [],
            price: {
                max: Helpers.isNullOrEmpty(router?.query?.maxPrice) ? undefined : Number(router?.query?.maxPrice),
                min: Helpers.isNullOrEmpty(router?.query?.minPrice) ? undefined : Number(router?.query?.minPrice),
            },
        }),
        [
            router?.query?.amenities,
            router?.query?.paymentType,
            router?.query?.starRating,
            router?.query?.popularFilter,
            router?.query?.maxPrice,
            router?.query?.minPrice,
            router?.query?.pageNumber,
        ]
    );

    const searchData = useMemo<ISearchHotelData>(
        () => ({
            isApartment: router?.query?.isApartment?.toString() === "true",
            endDate: Number(router?.query?.endDate?.toString()),
            startDate: Number(router?.query?.startDate?.toString()),
            searchText: router?.query?.searchText?.toString(),
            occupancy: Helpers.isNullOrEmpty(router?.query?.occupancy)
                ? [
                    {
                        childrenOld: 1,
                        adultSlot: [],
                    },
                ]
                : JSON.parse(router?.query?.occupancy?.toString()),
            userIds: Helpers.isNullOrEmpty(router?.query?.userIds) ? [] : JSON.parse(router?.query?.userIds?.toString()),
        }),
        [
            router?.query?.endDate,
            router?.query?.startDate,
            router?.query?.searchText,
            router?.query?.occupancy,
            router?.query?.isApartment,
            router?.query?.userIds,
        ]
    );

    const handleFilter = (req: { dataSearchBooking?: ISearchHotelData; dataFilterBooking?: IDataFilterBooking; pageNumber?: number }) => {
        router.push(
            {
                query: {
                    ...router.query,
                    ...{
                        isApartment: req?.dataSearchBooking?.isApartment,
                        searchText: req?.dataSearchBooking?.searchText,
                        startDate: req?.dataSearchBooking?.startDate,
                        endDate: req?.dataSearchBooking?.endDate,
                        occupancy: req?.dataSearchBooking?.occupancy ? JSON.stringify(req?.dataSearchBooking?.occupancy) : "",

                        amenities: req.dataFilterBooking?.amenities,
                        paymentType: req.dataFilterBooking?.paymentType,
                        popularFilter: req.dataFilterBooking?.popularFilter,
                        starRating: req.dataFilterBooking?.starRating,
                        minPrice: req.dataFilterBooking?.price?.min,
                        maxPrice: req.dataFilterBooking?.price?.max,
                        pageNumber: req.pageNumber || 1,
                    },
                },
            },
            undefined,
            { shallow: true }
        );
    };

    return (
        <BaseLayout>
            <SearchComponent pageNumber={pageNumber} searchData={searchData} filterData={filterData} handleFilter={handleFilter} />
        </BaseLayout>
    );
};

export default withSSRErrorHandling(SearchPage);
