import { Box, FormField } from "@maysoft/common-component-react";
import { Slider } from "@mui/material";
import { useTranslation } from "react-i18next";

import { FilterBox } from "./fragment";
import { IPriceRange } from "@src/commons/interfaces";

const PriceSelect = (props: { title: string; data: IPriceRange; onChangeValue: (value: IPriceRange) => void }) => {
    const { t } = useTranslation("common");
    const minDistance = 10;

    const handleChangePrice = (event: Event, newValue: number | number[], activeThumb: number) => {
        if (!Array.isArray(newValue)) {
            return;
        }

        if (activeThumb === 0) {
            props.onChangeValue({
                min: Math.min(newValue[0], props.data.max - minDistance),
                max: props.data.max,
            });
        } else {
            props.onChangeValue({
                min: props.data.min,
                max: Math.max(newValue[1], props.data.min + minDistance),
            });
        }
    };

    return (
        <FilterBox title={props.title}>
            <Box display="flex" gap={1} alignItems="center" justifyContent="space-between" mt={2}>
                <FormField
                    label={t("min")}
                    variant="outlined"
                    placeholder="e.g Marriott"
                    defaultValue={props.data.min === 0 ? "0" : props.data.min}
                    onBlur={(value) => {
                        const valueMax = props.data.max;
                        props.onChangeValue({
                            max: valueMax,
                            min: Number(value) >= valueMax ? valueMax : Number(value) >= 1000 ? 1000 : Number(value),
                        });
                    }}
                />
                <FormField
                    label={t("max")}
                    variant="outlined"
                    placeholder="e.g Marriott"
                    defaultValue={props.data.max}
                    onBlur={(value) => {
                        const valueMin = props.data.min;
                        props.onChangeValue({
                            min: valueMin,
                            max: Number(value) >= 1000 ? 1000 : Number(value) <= valueMin ? valueMin : Number(value),
                        });
                    }}
                />
            </Box>
            <Slider
                min={0}
                max={1000}
                step={10}
                disableSwap
                color={"primary"}
                valueLabelDisplay={"auto"}
                value={[props.data.min, props.data.max]}
                onChange={handleChangePrice}
            />
        </FilterBox>
    );
};

export default PriceSelect;
