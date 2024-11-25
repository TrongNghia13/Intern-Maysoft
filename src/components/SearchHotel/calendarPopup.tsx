import moment from "moment";
import { Box } from "@maysoft/common-component-react";
import { useCallback, useEffect, useState } from "react";
import { DateRangePicker } from "react-date-range";

import Popup from "./popup";
import { IBasicData } from "../../hooks/searchHotel/useData";

interface IProps {
    data: IBasicData;
    onChangeValue: (value: string | number, key: keyof IBasicData) => void;
    visibled: boolean;
    setVisibled: React.Dispatch<React.SetStateAction<boolean>>;
}

const CalenderPopup: React.FC<IProps> = ({ data, onChangeValue, visibled, setVisibled }) => {
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
        // if (state[0].startDate === state[0].endDate) {
        //     onChangeValue(moment(state[0].startDate).unix(), "startDate");
        //     onChangeValue(moment(state[0].endDate).add(1, "days").unix(), "endDate");
        // } else {
        // }
        onChangeValue(moment(state[0].startDate).unix(), "startDate");
        onChangeValue(moment(state[0].endDate).unix(), "endDate");
    }, [state]);

    return (
        <Popup visibled={visibled} onClickOutSide={() => setVisibled(false)} isCenter width={"80%"}>
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
                    onChange={(item: any) => {
                        // if(item.selection.startDate === item.selection.startDate) {
                        //     setState([item.selection]);
                        // } else {
                        // }
                        setState([item.selection]);
                    }}
                    moveRangeOnFirstSelection={false}
                    months={2}
                    ranges={state}
                    direction="horizontal"
                />
            </Box>
        </Popup>
    );
};

export default CalenderPopup;
