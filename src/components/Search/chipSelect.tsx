import { SvgIconTypeMap } from "@mui/material";
import { Box, Typography } from "@maysoft/common-component-react";
import { OverridableComponent } from "@mui/material/OverridableComponent";

import { FilterBox } from "./fragment";
import { ICodename } from "@src/commons/interfaces";
import { typographyStyles } from "@src/styles/commonStyles";



const ChipSelect = ({ Icon, ...props }: {
    title: string;
    data: ICodename[];
    idsSelected: string[];
    onSelect: (item: ICodename) => void;
    Icon?: OverridableComponent<SvgIconTypeMap>;
}) => {

    return (
        <FilterBox title={props.title} direction="horizontal">
            {props.data.map((item, index) => (
                <Box
                    key={index}
                    onClick={(e) => { props.onSelect(item) }}
                    sx={(theme) => ({
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        py: 1,
                        px: 1.5,
                        gap: 0.5,
                        borderRadius: 2,
                        border: "1px solid #c7c7c7",
                        width: "fit-content",
                        transitionDuration: ".3s",
                        transitionTimingFunction: "ease-out",
                        transitionProperty: "border-color, background-color",
                        ...(props.idsSelected.includes(item.code.toString()) && {
                            borderColor: theme.palette.primary.main,
                            backgroundColor: theme.functions.rgba(theme.palette.primary.main, 0.8),
                            color: theme.palette.white.main,
                            "& p": {
                                color: theme.palette.white.main,
                            },
                        }),
                        "&:hover": {
                            cursor: "pointer",
                            borderColor: theme.palette.primary.main,
                        },
                    })}
                >
                    <Typography sx={typographyStyles}>{item.name}</Typography>
                    {Icon && <Icon />}
                </Box>
            ))}
        </FilterBox>
    );
};

export default ChipSelect;
