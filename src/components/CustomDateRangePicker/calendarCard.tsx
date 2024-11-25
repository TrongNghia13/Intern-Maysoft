import moment from "moment";
import { Card } from "@mui/material";
import { DateRangePicker } from "react-date-range";
import { useCallback, useEffect, useState } from "react";
import { Box, Typography } from "@maysoft/common-component-react";

import Helpers from "../../commons/helpers";


const CalenderCard = ({
    value,
    calenderPopupVisibled,
    onClick,
    onChangeValue,
}: {
    calenderPopupVisibled: boolean;
    value: {
        startDate?: number;
        endDate?: number;
    };
    onClick: () => void;
    onChangeValue: (value: {
        startDate?: number;
        endDate?: number;
    }) => void;
}) => {

    const covertValue = (newValue: number | undefined) => {
        if (newValue === undefined) return undefined;
        if (newValue === null) return undefined;
        if (newValue === 0) return undefined;

        return moment(newValue * 1000).toDate();
    };

    const [state, setState] = useState([
        {
            key: "selection",
            endDate: covertValue(value.endDate),
            startDate: covertValue(value.startDate),
        },
    ]);

    useEffect(() => {
        setState([
            {
                key: "selection",
                endDate: covertValue(value.endDate),
                startDate: covertValue(value.startDate),
            },
        ]);
    }, [value.startDate, value.endDate])

    useEffect(() => {
        onChangeValue({
            startDate: state[0].startDate ? moment(state[0].startDate).unix() : undefined,
            endDate: state[0].endDate ? moment(state[0].endDate).unix() : undefined,
        });
    }, [state]);

    return (
        <Card>
            <Box
                p={2}
                onClick={onClick}
                sx={{
                    ...(calenderPopupVisibled && {
                        ":hover": {
                            cursour: "pointer",
                        },
                    }),
                }}
            >
                <Box>
                    <Box
                        sx={{
                            opacity: calenderPopupVisibled ? 1 : 0,
                            height: calenderPopupVisibled ? "100%" : 0,
                            display: calenderPopupVisibled ? "inherit" : "none",
                            visibility: calenderPopupVisibled ? "inherit" : "hidden",
                            transition: calenderPopupVisibled ? "opacity, visibility, height 1.5s " : "all 0s",
                        }}
                    >
                        <Typography variant="h6" fontWeight="medium">
                            {"when_is_your_trip"}
                        </Typography>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                p: 2,
                                "& .rdrDefinedRangesWrapper, .rdrDateDisplay": {
                                    display: "none",
                                },
                            }}
                        >
                            <DateRangePicker
                                months={2}
                                ranges={state}
                                direction="vertical"
                                moveRangeOnFirstSelection={false}
                                onChange={(item: any) => setState([item.selection])}
                            />
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            transition: "all .3s",
                            opacity: !calenderPopupVisibled ? 1 : 0,
                            visibility: !calenderPopupVisibled ? "inherit" : "hidden",
                        }}
                    >
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                            mb={calenderPopupVisibled ? 1 : 0}
                        >
                            <Typography
                                variant="caption"
                                color="secondary"
                                fontWeight="medium"
                            >
                                {"when"}
                            </Typography>
                            <Typography variant="caption" fontWeight="medium">
                                {[Helpers.getDate(value.startDate, "choice date"), Helpers.getDate(value.endDate, "choice date")].join(" - ")}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Card>
    );
};

export default CalenderCard;
