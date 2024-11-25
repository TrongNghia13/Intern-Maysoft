import moment from "moment";
import { useTranslation } from "react-i18next";
import { DateRangePicker } from "react-date-range";
import { Box } from "@maysoft/common-component-react";
import { useCallback, useEffect, useState } from "react";

import Helpers from "../../commons/helpers";
import { CardBase } from "./fragment";
import { IBasicData } from "../../hooks/searchHotel/useData";

const CalenderCard = ({
    calenderPopupVisibled,
    data,
    onChangeValue,
    onClick,
}: {
    calenderPopupVisibled: boolean;
    data: IBasicData;
    onChangeValue: (value: string | number, key: keyof IBasicData) => void;
    onClick: () => void;
}) => {
    const {
        t,
        i18n: { language },
    } = useTranslation("search_hotel");

    const covertValue = useCallback((value: number | undefined) => {
        if (value === undefined) return undefined;
        if (value === 0) return undefined;
        return moment(value * 1000).toDate();
    }, []);

    const [state, setState] = useState([
        {
            startDate: covertValue(data.startDate),
            endDate: covertValue(data.endDate),
            key: "selection",
        },
    ]);

    useEffect(() => {
        onChangeValue(moment(state[0].startDate).unix(), "startDate");
        onChangeValue(moment(state[0].endDate).unix(), "endDate");
    }, [state]);

    return (
        <CardBase
            expanded={calenderPopupVisibled}
            title={t("when")}
            value={[Helpers.getDate(data.startDate, t("choice_date")), Helpers.getDate(data.endDate, t("choice_date"))].join(" - ")}
            header={t("when_is_your_trip")}
            onClick={onClick}
        >
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
                    onChange={(item: any) => setState([item.selection])}
                    moveRangeOnFirstSelection={false}
                    months={2}
                    ranges={state}
                    direction="vertical"
                />
            </Box>
        </CardBase>
    );
};

export default CalenderCard;
