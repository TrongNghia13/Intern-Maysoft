import { useMemo } from "react";
import { Add, Remove } from "@mui/icons-material";
import { IconButton, InputAdornment } from "@mui/material";
import { FormField, Typography } from "@maysoft/common-component-react";

import { Mode } from "@src/commons/enum";

interface IProps {
    mode: Mode;
    value: number;
    onChangeValue: (value: number) => void;
    min?: number;
    max?: number;
    width?: number | string;
}

export const InputNumber = ({ value, onChangeValue, min, max, width, mode }: IProps) => {
    const minValue = useMemo(() => (Number(min) < 0 ? 0 : min || 0), [min]);
    const maxValue = useMemo(() => max || Infinity, [max]);

    const [disabledMinusButton, disabledAddButton] = useMemo(() => {
        return [value <= minValue, value >= maxValue];
    }, [minValue, maxValue, value]);

    const onChange = (value: number) => {
        if (value < minValue) return onChangeValue(minValue);
        if (value > maxValue) return onChangeValue(maxValue);
        return onChangeValue(value);
    };

    if (mode === Mode.View) return <Typography variant="caption">{value}</Typography>;

    return (
        <FormField
            mode={mode}
            key={value}
            variant="outlined"
            onChangeValue={(value) => onChange(Number(value) || 0)}
            value={value}
            sx={{
                width: width || "200px",
                "& .MuiOutlinedInput-input": {
                    textAlign: "center",
                },
            }}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <IconButton
                            disabled={disabledMinusButton}
                            onClick={(e) => {
                                e.stopPropagation();
                                onChange(value - 1 < minValue ? minValue : value - 1);
                            }}
                        >
                            <Remove color={disabledMinusButton ? "disabled" : "error"} />
                        </IconButton>
                    </InputAdornment>
                ),
                endAdornment: (
                    <InputAdornment position="start">
                        <IconButton
                            disabled={disabledAddButton}
                            onClick={(e) => {
                                e.stopPropagation();
                                onChange(value + 1 > maxValue ? maxValue : value + 1);
                            }}
                        >
                            <Add color={disabledAddButton ? "disabled" : "info"} />
                        </IconButton>
                    </InputAdornment>
                ),
            }}
        />
    );
};
export default InputNumber;
