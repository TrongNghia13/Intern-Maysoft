import { Box } from "@maysoft/common-component-react";
import moment from "moment";
import { useRouter } from "next/router";

import { AttributeReferenceId } from "@src/commons/enum";
import Helpers from "@src/commons/helpers";
import { IDetailHotel, IRoom } from "@src/commons/interfaces";
import About from "@src/components/Hotel/about";
import Accessibility from "@src/components/Hotel/accessibility";
import Overview from "@src/components/Hotel/overView";
import Polices from "@src/components/Hotel/polices";
import Rooms from "@src/components/Hotel/rooms";
import SimilarProperties from "@src/components/Hotel/similarProperties";
import { PageLoader } from "@src/components";
import { ISearchHotelData } from "@src/hooks/searchHotel/useData";
import PropertyContentService from "@src/services/booking/PropertyContentService";
import { SearchService } from "@src/services/search";
import { hideLoading } from "@src/store/slice/common.slice";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

interface IProps {
    id: string;
    searchData: ISearchHotelData;
    onFilter: (searchData: ISearchHotelData) => void;
    onReverse: (item: IRoom, hotelDetail: IDetailHotel) => Promise<void>;
}

const HotelDetail: React.FC<IProps> = ({ id, searchData, onFilter, onReverse }) => {
    const router = useRouter();
    const {
        i18n: { language },
    } = useTranslation("common");

    // const data = hotelList.find((item) => item.name === id);
    const [data, setData] = useState<IDetailHotel>({} as IDetailHotel);
    const [similarProperties, setSimilarProperties] = useState<IDetailHotel[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const dispatch = useDispatch();

    const numberOfNights = useMemo(
        () => Number(moment(Number(searchData.endDate || 0) * 1000).diff(Number(searchData.startDate || 0) * 1000, "days") || 1),
        [searchData.startDate, searchData.endDate]
    );

    useEffect(() => {
        getSimilarProperties();
    }, []);

    useEffect(() => {
        const getData = async () => {
            try {
                await getDataSearchBooking(searchData);
            } catch (error) {
                Helpers.handleError(error, undefined, dispatch);
            } finally {
                // dispatch(hideLoading());
            }
        };
        getData();
    }, [id, searchData, dispatch]);

    const getSimilarProperties = async () => {
        const resultSearch = await SearchService.search({
            entity: "partner",
            pageNumber: 1,
            pageSize: 5,
            orderBy: {
                descending: ["payNow"],
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

        const resultSearchBooking = await PropertyContentService.search({
            language: Helpers.getSearchLanguge(language),
            pageNumber: 1,
            pageSize: 5,
            // minPrice: req?.dataFilterBooking?.price?.min,
            // maxPrice: req?.dataFilterBooking?.price?.max,
            amenityIds: amenityids,
            checkinTime: searchData.startDate || 0,
            checkoutTime: searchData.endDate || 0,
            propertyIds: newIds || [],
            occupancy: searchData.occupancy,
        });

        setSimilarProperties(resultSearchBooking.items.filter((el) => el.propertyId !== id).splice(0, 4));
    };

    const getDataSearchBooking = async (searchData: ISearchHotelData) => {
        try {
            setLoading(true);

            const result = await PropertyContentService.detail({
                language: Helpers.getSearchLanguge(language),
                checkinTime: searchData.startDate || 0,
                checkoutTime: searchData.endDate || 0,
                propertyId: id,
                occupancy: searchData.occupancy,
            });

            setData(result);
            setLoading(false);

            dispatch(hideLoading());
        } catch (error) {
            Helpers.handleException(error);
        }
    };

    if (id === undefined || loading) return <PageLoader />;

    return (
        <Box display="flex" flexDirection="column" gap={3}>
            <Overview data={data} />
            <Rooms detailHotel={data} searchData={searchData} onFilter={onFilter} onReverse={(item) => onReverse(item, data)} />
            <SimilarProperties data={similarProperties} numberOfNights={numberOfNights} searchData={searchData} />
            <About data={data} />
            <Accessibility data={data} />
            <Polices data={data} />
        </Box>
    );
};

export default HotelDetail;
