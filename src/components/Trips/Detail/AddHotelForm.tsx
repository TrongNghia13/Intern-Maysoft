import { Box, Stepper } from "@maysoft/common-component-react";
import { Grid } from "@mui/material";
import moment from "moment";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import { useDispatch } from "react-redux";

import Helpers from "@src/commons/helpers";

import { IDetailHotel, IItinerary, IRoom } from "@src/commons/interfaces";
import HotelDetail from "@src/components/Hotel";
import SearchComponent from "@src/components/Search";
import { IDataFilterBooking } from "@src/components/Search/filter";
import SearchHotelComponent from "@src/components/SearchHotel";
import { ISearchHotelData } from "@src/hooks/searchHotel/useData";
import { hideLoading, showLoading } from "@src/store/slice/common.slice";

// DeepTech
import { ActionSubmit, SearchHotelComponentMode } from "@src/commons/enum";
import useReverseHotel from "@src/hooks/reverse/useReverseHotel";

const AddHotelForm = ({
    data,
    getDetail,
    handleCancelAddTrips,
}: {
    getDetail: (id: string) => Promise<void>;
    data: IItinerary;
    handleCancelAddTrips: () => void;
}) => {
    const { t } = useTranslation(["common", "tripbooking"]);

    const dispatch = useDispatch();

    const stepLabels = [t("tripbooking:search_stays"), t("tripbooking:stays"), t("common:detail")];
    const { handleReverse } = useReverseHotel();

    const [activeStep, setActiveStep] = useState<number>(1);
    const [selectedId, setSelectedId] = useState<string>("");

    const [pageNumber, setPageNumber] = useState<number>(1);
    const [filterData, setFilterData] = useState<IDataFilterBooking>({
        price: {
            max: 1000,
            min: 0,
        },
    } as IDataFilterBooking);
    const [searchData, setSearchData] = useState<ISearchHotelData>({
        endDate: moment().add(7, "days").unix(),
        startDate: moment().unix(),
        isApartment: false,
        occupancy: [
            {
                adultSlot: 1,
                childrenOld: [],
            },
        ],
        searchText: "",
    });

    const handleFilter = (req: { dataSearchBooking?: ISearchHotelData; dataFilterBooking?: IDataFilterBooking; pageNumber?: number }) => {
        req?.dataSearchBooking && setSearchData(req?.dataSearchBooking);
        req?.dataFilterBooking && setFilterData(req?.dataFilterBooking);
        req?.pageNumber && setPageNumber(req?.pageNumber);
    };

    const handleReverseHotel = async (room: IRoom, detail: IDetailHotel) => {
        try {
            dispatch(showLoading());
            await handleReverse(room, detail, searchData, {
                action: ActionSubmit.Create,
                itineraryId: data?.id,
                nameDefault: data?.name,
                updateTime: data?.updateTime,
                description: data?.description,
                userIds: (data?.itineraryMembers || []).map((el) => el.userId),
            });
            await getDetail(data?.id);
            handleCancelAddTrips();
            return;
        } catch (error) {
            Helpers.handleError(error, undefined, dispatch);
        } finally {
            dispatch(hideLoading());
        }
    };

    return (
        <>
            <Grid item xs={12}>
                <Stepper
                    hidenSequency
                    stepLabels={stepLabels}
                    activeStep={activeStep - 1}
                    onStepChange={setActiveStep}
                    canChangeStep={!Helpers.isNullOrEmpty(selectedId)}
                />
            </Grid>

            <Grid item xs={12}>
                {activeStep === 1 && (
                    <Box>
                        <SearchHotelComponent
                            mode={SearchHotelComponentMode.Corporate}
                            searchData={searchData}
                            onSearch={(data) => {
                                // const newQuery: any = {
                                //     id: data?.id,
                                //     isApartment: data.isApartment,
                                //     searchText: data.searchText,
                                //     startDate: data.startDate,
                                //     endDate: data.endDate,
                                //     occupancy: JSON.stringify(data.occupancy),
                                //     typeForm: TypeSearchForm.Stays,
                                // };

                                // setSearchData(data);
                                setActiveStep((prev) => prev + 1);
                                setSearchData(data);
                                // router.replace({
                                //     // id: id,
                                //     pathname: PathName.TRIPS_DETAIL,
                                //     query: newQuery,
                                // });
                            }}
                        />
                    </Box>
                )}

                {activeStep === 2 && (
                    <SearchComponent
                        pageNumber={pageNumber}
                        searchData={searchData}
                        filterData={filterData}
                        handleFilter={handleFilter}
                        onItemClick={(item) => {
                            setSelectedId(item?.propertyId);
                            setActiveStep((prev) => prev + 1);
                        }}
                    />
                )}

                {activeStep === 3 && <HotelDetail id={selectedId} searchData={searchData} onFilter={setSearchData} onReverse={handleReverseHotel} />}
            </Grid>
        </>
    );
};

export default AddHotelForm;
