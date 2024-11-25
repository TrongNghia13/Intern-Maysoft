import { Typography } from "@maysoft/common-component-react";
import { TimelineContent as MuiTimelineContent } from "@mui/lab";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { BookingHelpers, IItineraryPrice } from "@src/commons/bookingHelpers";
import { FlightType, ItineraryType, PolicyCompliance } from "@src/commons/enum";
import Helpers from "@src/commons/helpers";
import { IDetailHotel, IFlightDetail, IFlightExtraInformation, IHotelExtraInformation, IItineraryDetail, IUser } from "@src/commons/interfaces";
import Constants from "@src/constants";
import { useTripContext } from "@src/providers/tripProvider";
import PropertyContentService from "@src/services/booking/PropertyContentService";
import { ItineraryFlightCard, ItineraryHotelCard, SkeletonItineraryFlightCard, SkeletonItineraryHotelCard } from "../CardItem";
import TimelineHeader from "./TimelineHeader";

interface IProps {
    showTime: boolean;
    users: IUser[];
    itemBooking: IItineraryDetail[];
    isSelected: boolean;
    onCallBack: () => void;
    onSelectItineraryDetail?: (item: IItineraryDetail) => void;

    onReselectDetail?: (item: IItineraryDetail) => void;
    onDeleteItemBooking?: (item: IItineraryDetail) => void;
    onUpdateMemberDetail?: (data: IUser[], itemBooking: IItineraryDetail) => Promise<void>;

    renderHeaderActions?: (item: IItineraryDetail) => React.ReactNode;
    hiddenSeparator?: boolean;
    itineraryPrice: IItineraryPrice;
    hiddenItemPrice?: boolean;
}

const TimelineContent: React.FC<IProps> = ({
    users,
    itemBooking,
    showTime,
    isSelected,
    onSelectItineraryDetail,
    onReselectDetail,

    onDeleteItemBooking,
    onUpdateMemberDetail,
    renderHeaderActions,
    hiddenSeparator,
    itineraryPrice,
    hiddenItemPrice,
    onCallBack,
}) => {
    const {
        t,
        i18n: { language },
    } = useTranslation(["common", "tripbooking"]);

    const [data, setData] = useState<IDetailHotel[] | IFlightDetail[] | undefined>(undefined);
    const [extraData, setExtraData] = useState<IHotelExtraInformation[] | IFlightExtraInformation[] | undefined>(undefined);
    const [addMembersVisibled, setAddMembersVisibled] = useState<boolean>(false);

    const item = itemBooking[0];
    // const maxUsers = getNumberOfUser(extraData);

    const isHotel = useCallback((agr: IDetailHotel | IFlightDetail | undefined): agr is IDetailHotel => {
        return agr !== undefined && "propertyId" in agr;
    }, []);

    const isExtraHotel = useCallback((agr: IHotelExtraInformation | IFlightExtraInformation | undefined): agr is IHotelExtraInformation => {
        return agr !== undefined && "propertyId" in agr;
    }, []);

    const isFlight = useCallback((agr: IDetailHotel | IFlightDetail | undefined): agr is IFlightDetail => {
        return agr !== undefined && "flightId" in agr;
    }, []);

    const isExtraFlight = useCallback((agr: IHotelExtraInformation | IFlightExtraInformation | undefined): agr is IFlightExtraInformation => {
        return agr !== undefined && "flightId" in agr;
    }, []);

    const isHotelCard = item.type === ItineraryType.Hotel && data?.some((el) => isHotel(el)) && extraData?.some(isExtraHotel);
    const isFlightCard = item.type === ItineraryType.Flight && data?.some((el) => isFlight(el)) && extraData?.some(isExtraFlight);

    useEffect(() => {
        const getData = async () => {
            if (item.type === ItineraryType.Hotel) {
                const extraInfo = JSON.parse(item.extraInfo);
                if (!Helpers.isNullOrEmpty(extraInfo)) {
                    const newExtraInfo: IHotelExtraInformation = Helpers.toCamelCaseObj(extraInfo);
                    const result = await PropertyContentService.detail({
                        language: Helpers.getSearchLanguge(language),
                        checkinTime: item.startTime || 0,
                        checkoutTime: item.endTime || 0,
                        propertyId: newExtraInfo.propertyId,
                        occupancy: newExtraInfo.occupancy,
                    });
                    setExtraData([newExtraInfo]);
                    setData([result]);
                }
            }
            if (item.type === ItineraryType.Flight) {
                const extraInfo = JSON.parse(item.extraInfo);
                if (!Helpers.isNullOrEmpty(extraInfo)) {
                    const newExtraInfo: IFlightExtraInformation = Helpers.toCamelCaseObj(extraInfo);
                    const { value, serviceFee } = BookingHelpers.getItineraryDetailPrice(item);
                    // newData.totalFareAmount = value + serviceFee;
                    newExtraInfo.totalFareAmount = value;
                    setExtraData([newExtraInfo]);
                    setData([newExtraInfo]);
                }
            }
        };
        getData();
    }, [item, language]);

    const onDelete = BookingHelpers.isItineraryDetailDeletable(item) && onDeleteItemBooking ? () => onDeleteItemBooking(item) : undefined;

    const onAddMembers = () => {
        setAddMembersVisibled(true);
    };

    const onSubmitModal = onUpdateMemberDetail
        ? async (data: IUser[]) => {
              await onUpdateMemberDetail(data, item);
              setAddMembersVisibled(false);
          }
        : undefined;

    const handleSelectItineraryDetail =
        BookingHelpers.isItineraryDetailSelectable(item) && onSelectItineraryDetail
            ? () => {
                  onSelectItineraryDetail(item);
              }
            : undefined;

    const handleReselect =
        BookingHelpers.isItineraryDetailReselectable(item) && onReselectDetail
            ? () => {
                  onReselectDetail(item);
              }
            : undefined;

    const isItineraryDetailInPolicy = item.itineraryMembers?.every((el) => el.policyCompliance === 1) || false;

    return (
        <MuiTimelineContent sx={{ py: "12px", px: hiddenSeparator ? 0 : 2 }}>
            {showTime && (
                <Typography
                    variant="h5"
                    sx={{
                        color: "#1C252E",
                        fontSize: "1.125rem",
                        fontWeight: 600,
                    }}
                >
                    {BookingHelpers.getFormatTimeWeekDay(Number(itemBooking[0].startTime) * 1000)}
                </Typography>
            )}

            <TimelineHeader
                // itineraryDetails={itemBooking || []}
                detail={itemBooking[0]}
                isSelected={isSelected}
                onDelete={onDelete}
                onShare={() => {}}
                onReselect={handleReselect}
                onSelect={handleSelectItineraryDetail}
                onAddMembers={onSubmitModal ? onAddMembers : undefined}
                itineraryPrice={itineraryPrice}
                renderHeaderActions={renderHeaderActions}
                onCallBack={onCallBack}
            />

            {isHotelCard && <HotelContent {...{ isSelected, items: itemBooking, users, hiddenItemPrice, onSelectItineraryDetail }} />}
            {isFlightCard && (
                <FlightContent {...{ isSelected, items: itemBooking, users, hiddenItemPrice, onSelectItineraryDetail, itineraryPrice }} />
            )}

            {/* {onSubmitModal && addMembersVisibled && (
                <ModalSearchUserLocal
                    data={users || []}
                    maxUsers={maxUsers}
                    visibled={addMembersVisibled}
                    setVisibled={setAddMembersVisibled}
                    userIds={userIds}
                    onAction={onSubmitModal}
                />
            )} */}
        </MuiTimelineContent>
    );
};

const HotelContent = ({
    users,
    items,
    isSelected,
    onSelectItineraryDetail,
    hiddenItemPrice,
}: {
    users: IUser[];
    items: IItineraryDetail[];
    isSelected: boolean;
    onSelectItineraryDetail?: (item: IItineraryDetail) => void;
    hiddenItemPrice?: boolean;
}) => {
    const item = items[0];
    const { hasTable } = useTripContext();

    const {
        t,
        i18n: { language },
    } = useTranslation(["common", "tripbooking"]);

    const [data, setData] = useState<IDetailHotel | IFlightDetail | undefined>(undefined);
    const [extraData, setExtraData] = useState<IHotelExtraInformation | IFlightExtraInformation | undefined>(undefined);
    const userIds = (item.itineraryMembers || []).map((el) => el.userId);

    const isHotel = useCallback((agr: IDetailHotel | IFlightDetail | undefined): agr is IDetailHotel => {
        return agr !== undefined && "propertyId" in agr;
    }, []);

    const isExtraHotel = useCallback((agr: IHotelExtraInformation | IFlightExtraInformation | undefined): agr is IHotelExtraInformation => {
        return agr !== undefined && "propertyId" in agr;
    }, []);

    const isHotelCard = item.type === ItineraryType.Hotel && isHotel(data) && isExtraHotel(extraData);

    useEffect(() => {
        const getData = async () => {
            if (item.type === ItineraryType.Hotel) {
                const extraInfo = JSON.parse(item.extraInfo);
                if (!Helpers.isNullOrEmpty(extraInfo)) {
                    const newExtraInfo: IHotelExtraInformation = Helpers.toCamelCaseObj(extraInfo);
                    const result = await PropertyContentService.detail({
                        language: Helpers.getSearchLanguge(language),
                        checkinTime: item.startTime || 0,
                        checkoutTime: item.endTime || 0,
                        propertyId: newExtraInfo.propertyId,
                        occupancy: newExtraInfo.occupancy,
                    });
                    setExtraData(newExtraInfo);
                    setData(result);
                }
            }
        };
        getData();
    }, [item, language]);

    const loading = Helpers.isNullOrEmpty(data);

    const handleSelectItineraryDetail =
        BookingHelpers.isItineraryDetailSelectable(item) && onSelectItineraryDetail
            ? () => {
                  onSelectItineraryDetail(item);
              }
            : undefined;

    const isItineraryDetailInPolicy = item.itineraryMembers?.every((el) => el.policyCompliance === 1) || false;

    return (
        <>
            {loading && <SkeletonItineraryHotelCard />}

            {isHotelCard && (
                <ItineraryHotelCard
                    data={data}
                    userIds={userIds}
                    users={users}
                    startTime={Number(item.startTime || 0)}
                    endTime={Number(item.endTime || 0)}
                    inclusive={{
                        value:
                            Helpers.isNullOrEmpty(item.amountBooking) || Number(item.amountBooking || 0) === 0
                                ? item.estimateAmount
                                : item.amountBooking,
                        currency: extraData?.currency || Constants.CURRENCY_DEFAULT,
                    }}
                    isSelected={isSelected}
                    disabled={!handleSelectItineraryDetail}
                    onClick={handleSelectItineraryDetail}
                    hiddenUserList={hasTable}
                    isInPolicy={isItineraryDetailInPolicy}
                />
            )}
        </>
    );
};

const FlightContent = ({
    users,
    items,
    isSelected,
    onSelectItineraryDetail,
    hiddenItemPrice,
    itineraryPrice,
}: {
    users: IUser[];
    items: IItineraryDetail[];
    isSelected: boolean;
    onSelectItineraryDetail?: (item: IItineraryDetail) => void;
    hiddenItemPrice?: boolean;
    itineraryPrice: IItineraryPrice;
}) => {
    const item = items[0];
    const { hasTable } = useTripContext();

    const {
        t,
        i18n: { language },
    } = useTranslation(["common", "tripbooking"]);

    const [data, setData] = useState<IFlightDetail[]>([]);
    const [extraData, setExtraData] = useState<IFlightExtraInformation[]>([]);

    const { inPolicyUserIds, outPolicyUserIds } = (item?.itineraryMembers || []).reduce(
        (acc, cur) => {
            if (cur.policyCompliance === PolicyCompliance.No) acc.outPolicyUserIds.push(cur.userId);
            if (cur.policyCompliance === PolicyCompliance.Compliance) acc.inPolicyUserIds.push(cur.userId);
            return acc;
        },
        {
            inPolicyUserIds: [] as string[],
            outPolicyUserIds: [] as string[],
        }
    );

    useEffect(() => {
        const getData = async () => {
            const newData: IFlightExtraInformation[] = [];
            for (const item of items) {
                if (item.type === ItineraryType.Flight) {
                    const extraInfo: IFlightExtraInformation = JSON.parse(item.extraInfo);
                    if (!Helpers.isNullOrEmpty(extraInfo)) {
                        const result = Helpers.toCamelCaseObj(extraInfo);
                        const { value, serviceFee } = BookingHelpers.getItineraryDetailPrice(item);
                        // newData.totalFareAmount = value + serviceFee;
                        result.totalFareAmount = value;
                        newData.push(result);
                    }
                }
            }
            setExtraData(newData);
            setData(newData);
        };
        getData();
    }, [items, language]);

    const loading = Helpers.isNullOrEmpty(data);

    const handleSelectItineraryDetail =
        BookingHelpers.isItineraryDetailSelectable(item) && onSelectItineraryDetail
            ? () => {
                  onSelectItineraryDetail(item);
              }
            : undefined;

    const isItineraryDetailInPolicy = item.itineraryMembers?.every((el) => el.policyCompliance === 1) || false;

    return (
        <>
            {/* {visibled && <ShareModal visibled={visibled} setVisibled={setVisibled} data={items} />} */}
            {loading && <SkeletonItineraryFlightCard />}

            <ItineraryFlightCard
                isInPolicy={isItineraryDetailInPolicy}
                datas={data}
                users={users}
                isSelected={isSelected}
                inPolicyUserIds={inPolicyUserIds}
                outPolicyUserIds={outPolicyUserIds}
                disabled={!handleSelectItineraryDetail}
                onClick={handleSelectItineraryDetail}
                hiddenUserList={hasTable}
                isInternational={extraData[0]?.isInternational || false}
                hiddenItemPrice={hiddenItemPrice}
                showDate={extraData[0]?.flightType !== FlightType.OneWay}
                itineraryPrice={itineraryPrice}
            />
        </>
    );
};

const getNumberOfUser = (data: IHotelExtraInformation | IFlightExtraInformation | undefined) => {
    if (data !== undefined && "propertyId" in data) {
        return (data.occupancy || 0).reduce((acc, cur) => (acc = acc + cur?.adultSlot), 0);
    }
    if (data !== undefined && "flightId" in data) {
        const occupancy = data.occupancy[0];
        if (Helpers.isNullOrEmpty(occupancy)) return 0;
        return occupancy.adultSlot + occupancy.childrenOld.length;
    }
    return 0;
};

export default TimelineContent;
