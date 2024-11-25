import { useTranslation } from "next-i18next";
import { useState } from "react";

import { ICodename } from "@src/commons/interfaces";

export const useArrivalTime = () => {
    const [arrivalTime, setArrivalTime] = useState<string>("-1");

    const { t } = useTranslation("booking");
    const arrivalTimes: ICodename[] = [
        { code: "-1", name: t("i_don't_know") },
        { code: "9", name: `09:00 - 10:00` },
        { code: "10", name: `10:00 - 11:00` },
        { code: "11", name: `11:00 - 12:00` },
        { code: "12", name: `12:00 - 13:00` },
        { code: "13", name: `13:00 - 14:00` },
        { code: "14", name: `14:00 - 15:00` },
        { code: "15", name: `15:00 - 16:00` },
        { code: "16", name: `16:00 - 17:00` },
        { code: "17", name: `17:00 - 18:00` },
        { code: "18", name: `18:00 - 19:00` },
        { code: "19", name: `19:00 - 20:00` },
        { code: "20", name: `20:00 - 21:00` },
        { code: "21", name: `21:00 - 22:00` },
        { code: "22", name: `22:00 - 23:00` },
        { code: "23", name: `23:00 - 00:00` },
        { code: "24", name: `00:00 - 01:00 (${t("the_next_day")})` },
        { code: "25", name: `01:00 - 02:00 (${t("the_next_day")})` },
    ];

    const onChangeArrivalTime = (value: string) => setArrivalTime(value);

    return {
        arrivalTime,
        arrivalTimes,
        onChangeArrivalTime,
    };
};

export default useArrivalTime;
