import React, { useMemo } from "react";

import Timeline from "@mui/lab/Timeline";
import { timelineOppositeContentClasses } from "@mui/lab/TimelineOppositeContent";

import Helpers from "@src/commons/helpers";

import { BookingHelpers } from "@src/commons/bookingHelpers";
import { Status } from "@src/commons/enum";
import { IItineraryDetail, IUser } from "@src/commons/interfaces";
import { TripProvider } from "@src/providers/tripProvider";
import moment from "moment";
import ItineraryTimelineItem from "./ItineraryTimelineItem";

type IProps = {
    id: string;
    data: IItineraryDetail[];
    status?: Status;
    selectedSequence?: number[];
    renderHeaderActions?: (item: IItineraryDetail) => React.ReactNode;
    hiddenSeparator?: boolean;
    hiddenItemPrice?: boolean;
    onCallBack: () => void;
} & IExtraTimeline;

export type IExtraTimeline = {
    users: IUser[];

    disabled?: boolean;
    onSelectItineraryDetail?: (item: IItineraryDetail) => void;
    onDeleteItemBooking?: (item: IItineraryDetail) => void;
    onUpdateMemberDetail?: (data: IUser[], itemBooking: IItineraryDetail) => Promise<void>;
    onReselectDetail?: (item: IItineraryDetail) => void;
    onChangeUser?: (user: IUser) => void;
};

export type IndexValue = {
    index: number;
    value: number;
};

export const ItineraryTimeline: React.FC<IProps> = ({
    data,

    users = [],
    selectedSequence = [],
    disabled,
    onSelectItineraryDetail,
    onDeleteItemBooking,
    onReselectDetail,
    onUpdateMemberDetail,

    onChangeUser,
    renderHeaderActions,
    hiddenSeparator,
    hiddenItemPrice,
    onCallBack,
}) => {
    const priceDictionary = useMemo(() => BookingHelpers.getItineraryDetailPriceGroupBySequence(data), [data]);

    const itineraryData = useMemo<Map<number, IItineraryDetail[]>>(() => {
        const result = data.map((el) => ({
            ...el,
            startTime: moment(Number(el.startTime) * 1000)
                .startOf("date")
                .unix(),
        }));
        const dictionary = result.reduce((acc, cur) => {
            const key = cur.sequence;

            if (acc.has(key)) {
                acc.set(key, [...acc.get(key), { ...cur, hiddenHeader: true }]);
            } else {
                acc.set(key, [cur]);
            }
            return acc;
        }, new Map());

        return result.reduce((acc, cur) => {
            const key = cur.startTime;

            const item = dictionary.get(cur.sequence);

            if (!Helpers.isNullOrEmpty(item) && item.length !== 0) {
                if (acc.has(key)) {
                    acc.set(key, [...acc.get(key), ...item]);
                } else {
                    acc.set(key, [...item]);
                }
                dictionary.delete(cur.sequence);
            }
            return acc;
        }, new Map());
    }, [data]);

    const itinerarykeys = useMemo(() => {
        return Array.from(itineraryData.keys());
    }, [itineraryData]);

    return (
        <TripProvider disabled={disabled} onChangeUser={onChangeUser}>
            <Timeline
                position="right"
                sx={{
                    [`& .${timelineOppositeContentClasses.root}`]: {
                        flex: 0.2,
                    },
                    ...(hiddenSeparator && {
                        p: 0,
                    }),
                }}
            >
                {itinerarykeys.map((key, index) => {
                    // const itineraries = itineraryData.get(key);
                    // if (itineraries === undefined) return null;

                    // const data = new Map<number, IItineraryDetail[]>();
                    // for (const item of itineraries) {
                    //     data.set(item.sequence, [...(data.get(item.sequence) || []), item]);
                    // }

                    return (
                        <ItineraryTimelineItem
                            key={key}
                            dictionaryKey={key}
                            selectedSequence={selectedSequence}
                            users={users}
                            onDeleteItemBooking={onDeleteItemBooking}
                            onUpdateMemberDetail={onUpdateMemberDetail}
                            onReselectDetail={onReselectDetail}
                            onSelectItineraryDetail={onSelectItineraryDetail}
                            renderHeaderActions={renderHeaderActions}
                            hiddenSeparator={hiddenSeparator}
                            hiddenItemPrice={hiddenItemPrice}
                            onCallBack={onCallBack}
                            hasConnector={index !== itinerarykeys.length - 1}
                            itineraryData={itineraryData}
                            priceDictionary={priceDictionary}
                        />
                        // <TimelineItem sx={{ "&:before": { p: 0 } }}>
                        //     <TimelineProvider itineraryDetails={itineraries} key={key}>
                        //         {!hiddenSeparator && (
                        //             <TimelineSeparator>
                        //                 <TimelineDot sx={{ color: "#000", backgroundColor: "#E4EBF7" }}>
                        //                     <Box
                        //                         sx={{
                        //                             width: 12,
                        //                             height: 12,
                        //                             borderRadius: "50%",
                        //                             backgroundColor: "#1E97DE",
                        //                         }}
                        //                     />
                        //                 </TimelineDot>
                        //                 {index !== itinerarykeys.length - 1 && <TimelineConnector />}
                        //             </TimelineSeparator>
                        //         )}

                        //         <Box display="flex" flexDirection="column" width={"100%"}>
                        //             {Array.from(data.keys()).map((sequence, subIndex) => {
                        //                 return (
                        //                     <TimelineContent
                        //                         isSelected={selectedSequence.includes(sequence)}
                        //                         showTime={subIndex === 0}
                        //                         users={users}
                        //                         itemBooking={data.get(sequence) || []}
                        //                         onDeleteItemBooking={onDeleteItemBooking}
                        //                         onUpdateMemberDetail={onUpdateMemberDetail}
                        //                         onReselectDetail={onReselectDetail}
                        //                         onSelectItineraryDetail={onSelectItineraryDetail}
                        //                         renderHeaderActions={renderHeaderActions}
                        //                         hiddenSeparator={hiddenSeparator}
                        //                         hiddenItemPrice={hiddenItemPrice}
                        //                         onCallBack={onCallBack}
                        //                         key={sequence}
                        //                         itineraryPrice={
                        //                             priceDictionary.get(sequence) || {
                        //                                 currency: "VND",
                        //                                 serviceFee: 0,
                        //                                 value: 0,
                        //                             }
                        //                         }
                        //                     />
                        //                 );
                        //             })}
                        //         </Box>
                        //     </TimelineProvider>
                        // </TimelineItem>
                    );
                })}

                  {/* {openModalDetail && (
                <PopupDetailHotel
                    dataDetailHotel={itemSelected}
                    itemRoomSelected={itemSelected?.listRooms}
                    itemSelected={itemSelected?.listRooms?.listPrice}
                    endTime={itemSelected.endTime}
                    startTime={itemSelected.startTime}
                    openModal={openModalDetail}
                    setOpenModal={setOpenModalDetail}
                />
            )} */}

          
            </Timeline>
        </TripProvider>
    );
};

export default ItineraryTimeline;
