import { Box, Typography } from "@maysoft/common-component-react";
import { Menu } from "@mui/material";
import { useMemo, useState } from "react";

import Helpers from "@src/commons/helpers";

import { IFlightDetail } from "@src/commons/interfaces";
import Constants from "@src/constants";
import FlightIntoTooltip from "./FlightIntoTooltip";
import { Tooltip } from "./ToolTip";

export const FlightInfoDuration = ({
    data,
    language,
    showDate,
}: {
    data: IFlightDetail;
    language: string;
    showDate?: boolean;
}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const handleClick = (event: any) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (event: any) => {
        event.stopPropagation();
        setAnchorEl(null);
    };

    const segmentsList = data?.segmentsList || [];

    const length = segmentsList.length;
    const isStraightFlight = length === 1;
    const isOneStopFlight = length === 2;
    const isMultiStopFlight = length > 2;
    const numberSegmentBetween = Array.from({ length }, (_, index) => index + 1);

    const labelDurationLine = useMemo(() => {
        if (isStraightFlight) {
            return "Bay thẳng";
        }

        if (isOneStopFlight) {
            const duration = Helpers.formatDuration((segmentsList[1].departDate - segmentsList[0].arrivalDate) / (60 * 1000), false, language);
            return `${duration} tại ${segmentsList[1].departPlaceObj?.name || segmentsList[1].departPlaceObj?.city || ""}`;
        }

        if (isMultiStopFlight) {
            const stopPoints = segmentsList.reduce((res: string[], segment, index) => {
                if (index !== 0) {
                    return [...res, segment?.departPlaceObj?.name || segment?.departPlaceObj?.city];
                }
                return [...res];
            }, []);
            return `${length - 1} điểm dừng tại ${stopPoints.join(", ")}`;
        }
    }, [isMultiStopFlight, isOneStopFlight, isStraightFlight, length, segmentsList]);

    const open = Boolean(anchorEl);

    return (
        <Box
            sx={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column-reverse",
                    flexGrow: 1,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexShrink: 0,
                        alignItems: "center",
                        gap: 1,
                        overflow: "hidden",
                        justifyContent: {
                            xs: "start",
                            md: "space-between",
                        },
                    }}
                >
                    <FlightTime time={data?.departDate} code={data?.departPlaceObj?.code} showDate={showDate || false} />

                    <Tooltip.Wrapper
                        place={"bottom"}
                        sx={{
                            width: "50%",
                            display: "flex",
                            justifyContent: "space-between",
                            my: 1,
                            overflow: "hidden",
                            flexDirection: "column",
                        }}
                    >
                        <TimeDuration>{Helpers.formatDuration(data?.flightDuration || 0, false, language)}</TimeDuration>

                        <Box
                            sx={{
                                position: "relative",
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            <Box
                                sx={{
                                    backgroundColor: "rgb(209, 209, 216)",
                                    height: ".375rem",
                                    width: ".375rem",
                                    borderRadius: 999,
                                }}
                            />

                            {numberSegmentBetween.map((_, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        height: ".375rem",
                                        width: ".375rem",
                                        borderRadius: 999,
                                        border: "1px solid rgb(209, 209, 216)",
                                        backgroundColor: "#ffffff",
                                        zIndex: 10,
                                        "--tw-bg-opacity": 1,
                                    }}
                                />
                            ))}

                            <Box
                                sx={{
                                    backgroundColor: "rgb(209, 209, 216)",
                                    height: ".375rem",
                                    width: ".375rem",
                                    borderRadius: 999,
                                }}
                            />

                            <Box
                                sx={{
                                    position: "absolute",
                                    backgroundColor: "rgb(209, 209, 216)",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    zIndex: 0,
                                    height: ".125rem",
                                    width: "100%",
                                }}
                            />
                        </Box>

                        <Box
                            sx={{
                                fontSize: "0.75rem",
                                textAlign: "center",
                                color: "rgb(134, 134, 145)",
                            }}
                        >
                            {isStraightFlight ? (
                                <Typography variant="caption" color="inherit" sx={{ fontSize: "0.75rem" }}>
                                    {labelDurationLine}
                                </Typography>
                            ) : (
                                <a
                                    className="line-clamp-2 text-sky-500 underline"
                                    aria-controls={open ? "basic-menu" : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? "true" : undefined}
                                    onClick={handleClick}
                                    style={{ cursor: "pointer", display: "inline-block" }}
                                >
                                    <Typography variant="caption" color="inherit" sx={{ fontSize: "0.75rem" }}>
                                        {labelDurationLine}
                                    </Typography>
                                </a>
                            )}
                        </Box>
                    </Tooltip.Wrapper>

                    <FlightTime time={data?.arrivalDate} code={data?.arrivalPlaceObj?.code} showDate={showDate || false} />

                    {(isOneStopFlight || isMultiStopFlight) && (
                        <>
                            <Menu
                                id="basic-menu"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                MenuListProps={{
                                    "aria-labelledby": "basic-button",
                                }}
                            >
                                <FlightIntoTooltip {...{ data, language }} />
                            </Menu>
                        </>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

const FlightTime = ({ showDate, code, time }: { showDate: boolean; code: string; time: number }) => {
    return (
        <Box
            sx={{
                flexShrink: 0,
                my: 1,
                textAlign: "center",
            }}
        >
            {showDate && (
                <Typography
                    variant="caption"
                    sx={({ palette: { secondary } }) => ({
                        color: secondary.main,
                        fontSize: Constants.FONT_SIZE.SMALL_TEXT,
                    })}
                >
                    {Helpers.formatDate(time * 1000, "DD/MM")}
                </Typography>
            )}
            <Typography sx={{ fontSize: "1.25rem", fontWeight: 700 }}>{Helpers.formatDate(time * 1000, "HH:mm")}</Typography>
            <Typography
                variant="caption"
                sx={({ palette: { secondary } }) => ({
                    color: secondary.main,
                    fontSize: Constants.FONT_SIZE.SMALL_TEXT,
                })}
            >
                {code}
            </Typography>
        </Box>
    );
};

const TimeDuration = ({ children }: { children: string }) => {
    return (
        <Box
            sx={{
                overflow: "hidden",
                textAlign: "center",
                fontSize: "0.75rem",
                color: "rgb(250 250 250)",
            }}
        >
            <Box
                component="span"
                sx={{
                    display: "inline-block",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                }}
            >
                {children}
            </Box>
        </Box>
    );
};
export default FlightInfoDuration;
