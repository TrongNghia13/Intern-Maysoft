import { Typography } from "@maysoft/common-component-react";
import moment from "moment";
import { useEffect, useState } from "react";

import Helpers from "@src/commons/helpers";
import Constants from "@src/constants";

const useCountDown = (countDownTime: number) => {
    const [time, setTime] = useState<number>((countDownTime - moment().unix()) * 1000);

    useEffect(() => {
        const countDown = setInterval(() => {
            setTime((prev) => {
                const result = prev - 1000;
                if (result <= 0) clearInterval(countDown);
                return result;
            });
        }, 1000);
    }, []);

    const formatDuration = (time: number) => {
        const second = Math.floor((time / 1000) % 60);
        const min = Math.floor((time / 60 / 1000) % 60);
        const hour = Math.floor((time / 60 / 60 / 1000) % 60);
        return { hour, min, second };
    };

    return formatDuration(time);
};

export const CountDown = ({ time }: { time: number }) => {
    const { hour, min, second } = useCountDown(time);

    if (hour <= 0 && min <= 0 && second <= 0)
        return (
            <Typography
                sx={({ palette: { error } }) => ({
                    fontSize: "0.875rem",
                    color: error.main,
                    fontWeight: 500,
                })}
            >
                Đã hủy
            </Typography>
        );

    return (
        <>
            <Typography
                sx={({ palette: { error } }) => ({
                    fontSize: "0.875rem",
                    color: error.main,
                    fontWeight: 500,
                })}
            >{`${Helpers.formatDate(time * 1000, Constants.DateFormat.DDMMYYYY_HHMM)} (${hour}h ${min}m ${second}s)`}</Typography>
        </>
    );
};

export default CountDown;
