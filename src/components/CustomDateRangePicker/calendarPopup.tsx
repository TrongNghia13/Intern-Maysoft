import { Box } from "@maysoft/common-component-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { DateRangePicker } from "react-date-range";
import Popup from "./popup";


interface IProps {
    value: {
        startDate?: number;
        endDate?: number;
    };
    visibled: boolean;
    setVisibled: React.Dispatch<React.SetStateAction<boolean>>;
    onChangeValue: (value: { startDate?: number; endDate?: number }) => void;
}

const CalenderPopup: React.FC<IProps> = ({ value, onChangeValue, visibled, setVisibled }) => {
    const covertValue = (newValue: number | undefined) => {
        if (newValue === undefined) return undefined;
        if (newValue === null) return undefined;
        if (newValue === 0) return undefined;

        return moment(newValue * 1000).toDate();
    };

    const [state, setState] = useState([
        {
            startDate: covertValue(value.startDate),
            endDate: covertValue(value.endDate),
            key: "selection",
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
    }, [value.startDate, value.endDate]);

    useEffect(() => {
        onChangeValue({
            startDate: state[0].startDate ? moment(state[0].startDate).unix() : undefined,
            endDate: state[0].endDate ? moment(state[0].endDate).unix() : undefined,
        });
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
                    months={2}
                    ranges={state}
                    direction="horizontal"
                    moveRangeOnFirstSelection={false}
                    onChange={(item: any) => {
                        setState([item.selection]);
                    }}
                />
            </Box>
        </Popup>
    );
};

export default CalenderPopup;
