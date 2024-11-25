import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { Box, Modal } from "@maysoft/common-component-react";

import { useMediaQuery } from "@mui/material";
import { useTranslation } from "react-i18next";
import { DateRangePicker } from "react-date-range";
import { ISearchHotelData } from "@src/hooks/searchHotel/useData";

const CalendarModal = ({
    visibled,
    data,
    setVisibled,
    onSubmit,
}: {
    visibled: boolean;
    data: ISearchHotelData;
    setVisibled: React.Dispatch<React.SetStateAction<boolean>>;
    onSubmit: (data: ISearchHotelData) => void;
}) => {
    const { t } = useTranslation("common");
    const maches = useMediaQuery("(max-width: 800px)");

    useEffect(() => {
        setState([
            {
                startDate: covertValue(data.startDate),
                endDate: covertValue(data.endDate),
                key: "selection",
            },
        ]);
    }, [visibled, data.startDate, data.endDate]);

    const handleSubmit = () => {
        onSubmit({
            ...data,
            startDate: moment(state[0].startDate).unix(),
            endDate: moment(state[0].endDate).unix(),
        });
        setVisibled(false);
    };

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

    return (
        <Modal
            fullWidth
            maxWidth={"lg"}
            hasActionButton
            visible={visibled}
            title={t("date_range")}
            onAction={handleSubmit}
            onClose={() => setVisibled(false)}
        >
            <Box
                sx={{
                    overflow: "auto",
                    height: "min(400px, 55vh)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
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
                        direction={!maches ? "horizontal" : "vertical"}
                    />
                </Box>
            </Box>
        </Modal>
    );
};

export default CalendarModal;
