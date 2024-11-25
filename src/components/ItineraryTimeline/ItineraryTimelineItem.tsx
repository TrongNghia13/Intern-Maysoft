import { Box } from "@maysoft/common-component-react";
import { TimelineConnector, TimelineDot, TimelineItem, TimelineSeparator } from "@mui/lab";
import { IItineraryPrice } from "@src/commons/bookingHelpers";
import { IItineraryDetail } from "@src/commons/interfaces";
import { TimelineProvider } from "@src/providers/timelineProvider";
import { IExtraTimeline } from "./ItineraryTimeline";
import TimelineContent from "./TimelineContent";

type IProps = {
    selectedSequence: number[];
    dictionaryKey: number;
    renderHeaderActions?: (item: IItineraryDetail) => React.ReactNode;
    hiddenSeparator?: boolean;
    hiddenItemPrice?: boolean;
    onCallBack: () => void;
    itineraryData: Map<number, IItineraryDetail[]>;
    hasConnector: boolean;
    priceDictionary: Map<number | "total", IItineraryPrice>;
} & Omit<IExtraTimeline, "orderData">;

const ItineraryTimelineItem = ({
    selectedSequence,
    dictionaryKey,
    users,
    onDeleteItemBooking,
    onSelectItineraryDetail,
    onReselectDetail,
    onUpdateMemberDetail,
    renderHeaderActions,
    hiddenSeparator,
    hiddenItemPrice,
    onCallBack,
    itineraryData,
    hasConnector,
    priceDictionary,
}: IProps) => {
    const itineraries = itineraryData.get(dictionaryKey);
    if (itineraries === undefined) return null;

    const data = new Map<number, IItineraryDetail[]>();
    for (const item of itineraries) {
        data.set(item.sequence, [...(data.get(item.sequence) || []), item]);
    }

    return (
        <TimelineItem sx={{ "&:before": { p: 0 } }}>
            <TimelineProvider itineraryDetails={itineraries}>
                {!hiddenSeparator && (
                    <TimelineSeparator>
                        <TimelineDot sx={{ color: "#000", backgroundColor: "#E4EBF7" }}>
                            <Box
                                sx={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: "50%",
                                    backgroundColor: "#1E97DE",
                                }}
                            />
                        </TimelineDot>
                        {hasConnector && <TimelineConnector />}
                    </TimelineSeparator>
                )}

                <Box display="flex" flexDirection="column" width={"100%"}>
                    {Array.from(data.keys()).map((sequence, subIndex) => {
                        return (
                            <TimelineContent
                                isSelected={selectedSequence.includes(sequence)}
                                showTime={subIndex === 0}
                                users={users}
                                itemBooking={data.get(sequence) || []}
                                onDeleteItemBooking={onDeleteItemBooking}
                                onUpdateMemberDetail={onUpdateMemberDetail}
                                onReselectDetail={onReselectDetail}
                                onSelectItineraryDetail={onSelectItineraryDetail}
                                renderHeaderActions={renderHeaderActions}
                                hiddenSeparator={hiddenSeparator}
                                hiddenItemPrice={hiddenItemPrice}
                                onCallBack={onCallBack}
                                key={subIndex}
                                itineraryPrice={
                                    priceDictionary.get(sequence) || {
                                        currency: "VND",
                                        serviceFee: 0,
                                        value: 0,
                                    }
                                }
                            />
                        );
                    })}
                </Box>
            </TimelineProvider>
        </TimelineItem>
    );
};

export default ItineraryTimelineItem;
