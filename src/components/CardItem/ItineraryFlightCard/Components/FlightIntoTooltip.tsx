import { Box, Typography } from "@maysoft/common-component-react";
import { useMemo } from "react";

import Helpers from "@src/commons/helpers";

import { RadioButtonChecked } from "@mui/icons-material";
import { IFlightDetail } from "@src/commons/interfaces";

type ISegment =
    | {
          place: string;
          terminal: string;
          name: string;
      }
    | {
          name: string;
          minutes: number;
      };

export const FlightIntoTooltip = ({ data, language }: { data: IFlightDetail; language: string }) => {
    const formatSegmentsList = (data: IFlightDetail) => {
        const result: ISegment[] = [];
        const segmentsList = data.segmentsList || [];
        segmentsList.map((el, index) => {
            result.push({
                place: el.departPlace,
                terminal: el.departTerminal,
                name: el.departPlaceObj?.name,
            });
            result.push({
                place: el.arrivalPlace,
                terminal: el.arrivalTerminal,
                name: el.arrivalPlaceObj?.name,
            });
            if (el.arrivalPlace === data.departPlace && el.arrivalPlace !== data.arrivalPlace) {
                result.push({
                    name: el.arrivalPlaceObj?.city,
                    minutes: (segmentsList[index + 1]?.departDate - segmentsList[index]?.arrivalDate) / 1000 / 60,
                });
            }
            if (index !== segmentsList.length - 1 && el.arrivalPlace !== data.departPlace && el.arrivalPlace !== data.arrivalPlace) {
                result.push({
                    name: el.arrivalPlaceObj?.city,
                    minutes: (segmentsList[index + 1]?.departDate - segmentsList[index]?.arrivalDate) / 1000 / 60,
                });
            }
        });
        return result;
    };

    const segmentsList = useMemo(() => formatSegmentsList(data), [data]);

    return (
        <Box
            sx={{
                display: "grid",
                gap: 1,
                px: 2,
                py: 1,
            }}
        >
            {segmentsList.map((item, index) => {
                if ("minutes" in item) {
                    return (
                        <Box key={index} display="flex" alignItems="center" gap={0.5} flexWrap="wrap">
                            <RadioButtonChecked sx={{ fontSize: 12 }} color="warning" />
                            <Typography variant="caption" color="warning">
                                Trung chuyển tại {item.name} {Helpers.formatDuration(item.minutes, false, language)}
                            </Typography>
                        </Box>
                    );
                }

                return (
                    <Box key={index} display="flex" alignItems="center" gap={0.5} flexWrap="wrap">
                        <RadioButtonChecked sx={{ fontSize: 12 }} color="secondary" />
                        <Typography variant="caption" color="secondary">
                            {item.place}
                        </Typography>
                        <Typography variant="caption">{item.name}</Typography>
                        <Typography variant="caption" color="warning">
                            ga {item.terminal}
                        </Typography>
                    </Box>
                );
            })}
        </Box>
    );
};

export default FlightIntoTooltip;
