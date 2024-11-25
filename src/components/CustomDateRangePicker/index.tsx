import { Box, Typography } from "@maysoft/common-component-react";
import { Event } from "@mui/icons-material";
import { Fragment, useState } from "react";

import Helpers from "@src/commons/helpers";
import CalenderPopup from "./calendarPopup";
import FocusBox from "./focusBox";

interface IProps {
    value: {
        startDate?: number;
        endDate?: number;
    };
    error?: {
        startDate?: string;
        endDate?: string;
    };
    onChangeValue: (value: { startDate?: number; endDate?: number }) => void;
}

const CustomDateRangePicker: React.FC<IProps> = ({ value, error, onChangeValue }) => {
    const [calenderPopupVisibled, setCalenderPopupVisibled] = useState<boolean>(false);

    return (
        <Box>
            {/* is mobile */}
            {/* <CalenderCard
                value={value}
                onChangeValue={onChangeValue}
                calenderPopupVisibled={calenderPopupVisibled}
                onClick={() => {
                    setCalenderPopupVisibled(true);
                }}
            /> */}

            <FocusBox visibled={calenderPopupVisibled} setVisibled={setCalenderPopupVisibled}>
                <Fragment>
                    <Event color="secondary" />
                    <Box display="flex" flexDirection="column" gap={1}>
                        <Typography variant="button" color="secondary">
                            {Helpers.getDate(value.startDate) || "check in"}
                        </Typography>
                    </Box>
                    -
                    <Box display="flex" flexDirection="column" gap={1}>
                        <Typography variant="button" color="secondary">
                            {Helpers.getDate(value.endDate) || "check out"}
                        </Typography>
                    </Box>
                </Fragment>

                <CalenderPopup value={value} visibled={calenderPopupVisibled} setVisibled={setCalenderPopupVisibled} onChangeValue={onChangeValue} />
            </FocusBox>
            {error?.startDate && (
                <Typography variant="caption" color="error" sx={{ display: "block" }}>
                    {error?.startDate}
                </Typography>
            )}
            {error?.endDate && (
                <Typography variant="caption" color="error" sx={{ display: "block" }}>
                    {error?.endDate}
                </Typography>
            )}
        </Box>
    );
};

export default CustomDateRangePicker;
