import { Box } from "@maysoft/common-component-react";
import { Divider, Skeleton } from "@mui/material";
import React from "react";
import { Tooltip } from "../ItineraryFlightCard/Components/ToolTip";

interface IProps {}

export const SkeletonItineraryFlightCard: React.FC<IProps> = () => {
    return (
        <Box
            sx={{
                borderRadius: 2,
                border: "1px solid #c3c3c3",
                backgroundColor: "#ffffff"
            }}
        >
            <Box
                onClick={() => {}}
                sx={(theme) => ({
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    flexDirection: "row",
                    borderRadius: 2,
                    overflow: "hidden",
                    p: 2,
                })}
            >
                <CarrierMarketing />

                <Box
                    sx={(theme) => ({
                        width: "70%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                    })}
                >
                    <Box
                        sx={{
                            display: "grid",
                            gap: 1,
                            p: 2,
                        }}
                    >
                        <SkeletonFlightInfoDuration />
                    </Box>
                </Box>
                <Box>
                    <Divider />
                </Box>
            </Box>
        </Box>
    );
};

const CarrierMarketing = () => {
    return (
        <Box
            sx={{
                width: "30%",
                display: "flex",
                gap: 1,
                flexDirection: "column",
            }}
        >
            <Skeleton variant="text" sx={{ fontSize: "1.5rem" }} />
            <Skeleton variant="text" sx={{ fontSize: "0.85rem" }} />
        </Box>
    );
};

const SkeletonFlightInfoDuration = () => {
    return (
        <div className={"flex grow flex-col-reverse sm:flex-row"}>
            <div className="flex w-full shrink-0 items-center justify-between gap-2 overflow-hidden xs:justify-start xs:gap-4 sm:w-1/2 sm:px-2">
                <div className="shrink-0 space-y-1 text-center">
                    <Skeleton variant="text" sx={{ fontSize: "0.85rem" }} width={50} />
                    <Skeleton variant="text" sx={{ fontSize: "0.85rem" }} width={50} />
                </div>

                <Tooltip.Wrapper place={"bottom"} className=" flex w-1/2 flex-col justify-between space-y-1 overflow-hidden">
                    <div className="flex justify-center overflow-hidden text-center text-xs text-neutral-50">
                        <Skeleton variant="text" sx={{ fontSize: "0.5rem" }} width={50} />
                    </div>

                    <div className=" relative flex justify-between">
                        <div className="h-1.5 w-1.5 rounded-full bg-neutral-30" />

                        <div className="h-1.5 w-1.5 rounded-full bg-neutral-30" />

                        <div className="absolute top-1/2 z-0 h-0.5 w-full -translate-y-1/2 bg-neutral-30" />
                    </div>

                    <div className="flex justify-center text-center text-xxs text-neutral-50">
                        <Skeleton variant="text" sx={{ fontSize: "0.5rem" }} width={50} />
                    </div>

                    <Tooltip.Content>
                        <div className="flex flex-col items-start"></div>
                    </Tooltip.Content>
                </Tooltip.Wrapper>

                <div className="shrink-0 space-y-1 text-center">
                    {/* <div className="font-semibold xl:text-md">{Helpers.formatDate(data?.arrivalDate, "HH:mm")}</div>
            <Typography variant="caption">{data?.arrivalPlaceObj?.code}</Typography> */}
                    <Skeleton variant="text" sx={{ fontSize: "0.85rem" }} width={50} />
                    <Skeleton variant="text" sx={{ fontSize: "0.85rem" }} width={50} />
                </div>
            </div>
        </div>
    );
};

export default SkeletonItineraryFlightCard;
