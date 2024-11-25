import { Grid, SvgIconTypeMap } from "@mui/material";
import { useTranslation } from "next-i18next";

import { Box, Typography } from "@maysoft/common-component-react";
import { CalendarMonth, Person } from "@mui/icons-material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { AttributeCodes, AttributeReferenceId, SearchHotelComponentMode } from "@src/commons/enum";
import Helpers from "@src/commons/helpers";
import { IDetailHotel, IOccupancy, IRoom } from "@src/commons/interfaces";
import { IBasicData, ISearchHotelData } from "@src/hooks/searchHotel/useData";
import { useAuth } from "@src/providers/authProvider";
import { RootState } from "@src/store";
import { titleStyles } from "@src/styles/commonStyles";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { RoomCard } from "../CardItem";
import DataNotFound from "../DataNotFound/DataNotFound";
import CalendarModal from "./calendarModal";
import PriceDetailModal from "./priceDetailModal";
import RoomDetailModal from "./roomDetailModal";
import SearchRoomModal from "./searchRoomModal";

interface IProps {
    searchData: ISearchHotelData;
    detailHotel: IDetailHotel;
    onFilter: (searchData: ISearchHotelData) => void;
    onReverse: (item: IRoom) => Promise<void>;
}

const Rooms: React.FC<IProps> = ({ searchData, detailHotel, onFilter, onReverse }) => {
    const router = useRouter();
    const {
        t,
        i18n: { language },
    } = useTranslation(["detail", "search_hotel", "common"]);

    const auth = useAuth();

    const userInfo = useSelector((state: RootState) => state.userInfo.userProfile);

    const [data, setData] = useState<IBasicData>({
        searchText: undefined,
        startDate: moment().unix(),
        endDate: moment().add(7, "day").unix(),
        isApartment: false,
    });

    const [additionalData, setAdditionalData] = useState<IOccupancy[]>([
        {
            adultSlot: 1,
            childrenOld: [],
        },
    ]);

    useEffect(() => {
        const dataTemp: IBasicData = { ...data };
        let additionalDataTemp: IOccupancy[] = [...additionalData];
        for (const [key, value] of Object.entries(searchData)) {
            if (key in data) Object.assign(dataTemp, { [key]: value });
            if (key === "occupancy") additionalDataTemp = searchData[key];
            // if (key in additionalData) Object.assign(additionalDataTemp, { [key]: value });
        }
        setData(dataTemp);
        setAdditionalData(additionalDataTemp);
    }, [searchData]);

    const [calendarVisibled, setCalendarVisibled] = useState<boolean>(false);
    const [roomVisibled, setRoomVisibled] = useState<boolean>(false);
    const [roomDetailVisibled, setRoomDetailVisibled] = useState<boolean>(false);
    const [priceDetailVisibled, setPriceDetailVisibled] = useState<boolean>(false);

    const [rooms, setRooms] = useState<IRoom[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<IRoom>({} as IRoom);

    useEffect(() => {
        const getRooms = async () => {
            setRooms(detailHotel.rooms.map((item) => ({ ...item, selectedRate: item.rates[0]?.referenceId || "" })));
        };
        getRooms();
    }, [detailHotel.rooms]);

    const onSelectRooms = (value: number, id: string) => {
        // setRooms((prev) => {
        //     const temp = [...prev];
        //     const index = temp.findIndex((el) => el.id === id);
        //     if (index !== -1) prev[index].quantity = value;
        //     return temp;
        // });
    };

    const numberOfNights = useMemo(
        () => Number(moment(Number(searchData.endDate || 0) * 1000).diff(Number(searchData.startDate || 0) * 1000, "days") || 1),
        [searchData.startDate, searchData.endDate]
    );

    const optionalAttributes = useMemo(
        () => ({
            reserve: Helpers.getAttributeValue(detailHotel.attributes, AttributeCodes.partner_booking_business_model_expedia_collect) === "1",
            wifi: detailHotel.attributes?.findIndex((el) => el.referenceId === AttributeReferenceId.wifi) !== -1,
            parking: detailHotel.attributes?.findIndex((el) => el.referenceId === AttributeReferenceId.self_parking) !== -1,
        }),
        [detailHotel]
    );

    const onViewPriceDetails = (item: IRoom) => {
        setSelectedRoom(item);
        setPriceDetailVisibled(true);
    };

    const { numberOfAdult, numberOfChild } = useMemo(() => Helpers.calcNumberOfAdultAndChild(additionalData), [additionalData]);

    return (
        <>
            <Box display="flex" flexDirection="column" gap={2}>
                <Typography sx={titleStyles}>{t("choose_your_room")}</Typography>
                <Box display="flex" gap={1}>
                    <InputBox
                        title={t("search_hotel:check_in")}
                        value={Helpers.formatDate(data.startDate * 1000)}
                        Icon={CalendarMonth}
                        onClick={() => setCalendarVisibled(true)}
                    />
                    <InputBox
                        title={t("search_hotel:check_out")}
                        value={Helpers.formatDate(data.endDate * 1000)}
                        Icon={CalendarMonth}
                        onClick={() => setCalendarVisibled(true)}
                    />
                    <InputBox
                        title={`${additionalData.length} ${t("search_hotel:room")}`}
                        value={t("search_hotel:adults_and_child", {
                            number_of_adult: numberOfAdult,
                            number_of_child: numberOfChild,
                        })}
                        Icon={Person}
                        onClick={() => setRoomVisibled(true)}
                    />
                </Box>
                <Grid container spacing={3}>
                    {rooms.length === 0 && (
                        <Grid item xs={12}>
                            <DataNotFound />
                        </Grid>
                    )}
                    {rooms.length !== 0 && (
                        <Box
                            sx={{
                                mt: 3,
                                px: 2,
                                width: "100%",
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "repeat(1, 1fr)",
                                    lg: "repeat(1, 1fr)",
                                    md: "repeat(2, 1fr)",
                                    xl: "repeat(3, 1fr)",
                                },
                                gap: 2,
                            }}
                        >
                            {rooms.map((item, index) => (
                                <RoomCard
                                    {...{
                                        item,
                                        key: item.referenceId,
                                        optionalAttributes,
                                        numberOfNights,
                                        onSelectRooms,
                                        fromDate: searchData.startDate,
                                        toDate: searchData.endDate,
                                        viewMoreClick: () => {
                                            setSelectedRoom(item);
                                            setRoomDetailVisibled(true);
                                        },
                                        onViewPriceDetails: () => onViewPriceDetails(item),
                                        onSelectOption: (rate, id) => {
                                            setRooms((prev) => {
                                                const temp = [...prev];
                                                temp[index].selectedRate = rate.referenceId;
                                                return temp;
                                            });
                                        },
                                        onReserve: onReverse,
                                    }}
                                />
                            ))}
                        </Box>
                    )}
                </Grid>
            </Box>
            <CalendarModal
                data={{ ...data, occupancy: [...additionalData] }}
                visibled={calendarVisibled}
                setVisibled={setCalendarVisibled}
                onSubmit={(submitData) => {
                    // router.replace({
                    //     query: { ...router.query, ...submitData, occupancy: JSON.stringify(additionalData) },
                    // });
                    onFilter(submitData);
                    // setData(data);
                }}
            />
            <SearchRoomModal
                mode={SearchHotelComponentMode.Corporate}
                data={{ ...data, occupancy: [...additionalData] }}
                visibled={roomVisibled}
                setVisibled={setRoomVisibled}
                // onSubmit={setAdditionalData}
                onSubmit={(submitData) => {
                    // router.replace({
                    //     query: { ...router.query, ...data, ...submitData, occupancy: JSON.stringify(submitData.occupancy) },
                    // });
                    onFilter(submitData);
                    // setAdditionalData(submitData.occupancy);
                }}
            />
            {roomDetailVisibled && (
                <RoomDetailModal
                    data={selectedRoom}
                    numberOfNights={numberOfNights}
                    visibled={roomDetailVisibled}
                    optionalAttributes={optionalAttributes}
                    setVisibled={setRoomDetailVisibled}
                    onViewPriceDetails={onViewPriceDetails}
                    onSelectOption={(rate) => {
                        const index = rooms.findIndex((el) => el.referenceId === selectedRoom.referenceId);
                        setRooms((prev) => {
                            const temp = [...prev];
                            temp[index].selectedRate = rate.referenceId;
                            return temp;
                        });
                    }}
                    onReserve={onReverse}
                />
            )}
            {priceDetailVisibled && (
                <PriceDetailModal
                    data={selectedRoom}
                    numberOfNights={numberOfNights}
                    visibled={priceDetailVisibled}
                    optionalAttributes={optionalAttributes}
                    setVisibled={setPriceDetailVisibled}
                    onSelectOption={(rate) => {
                        const index = rooms.findIndex((el) => el.referenceId === selectedRoom.referenceId);
                        setRooms((prev) => {
                            const temp = [...prev];
                            temp[index].selectedRate = rate.referenceId;
                            return temp;
                        });
                    }}
                    onReserve={onReverse}
                />
            )}
        </>
    );
};

const InputBox = ({
    title,
    value,
    onClick,
    Icon,
}: {
    title: string;
    value: string;
    onClick: () => void;
    Icon: OverridableComponent<SvgIconTypeMap>;
}) => {
    return (
        <Box
            display="flex"
            alignItems="center"
            gap={1}
            sx={(theme) => {
                const {
                    palette: { primary },
                } = theme;
                return {
                    px: 2,
                    py: 1,
                    border: "1px solid #c7c7c7",
                    borderRadius: 2,
                    width: "100%",
                    transition: "border-color .3s ease-in",
                    "&:hover": {
                        cursor: "pointer",
                        borderColor: primary.main,
                    },
                };
            }}
            onClick={onClick}
        >
            <Icon />
            <Box display="flex" flexDirection="column" alignItems="normal" gap={1}>
                <Typography variant="caption">{title}</Typography>
                <Typography variant="caption" fontWeight="medium">
                    {value}
                </Typography>
            </Box>
        </Box>
    );
};

export default Rooms;
