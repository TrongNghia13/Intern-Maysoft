import { Box, Typography } from "@maysoft/common-component-react";
import { Tooltip } from "@mui/material";
import { Theme } from "@mui/material/styles";
import { useMemo } from "react";

import Constants from "@src/constants";
import { typographyStyles } from "@src/styles/commonStyles";
import { rowStyles } from "./styles";

interface IProps {
    data: string[];
}

const MAX_LENGTH = 3;

const Categories: React.FC<IProps> = ({ data }) => {
    if (data.length === 0) return <></>;

    const { show, hidden } = useMemo(() => {
        const temp = [...data];
        temp.slice(0, MAX_LENGTH);
        return {
            show: temp.slice(0, MAX_LENGTH),
            hidden: temp.slice(MAX_LENGTH),
        };
    }, [data]);

    return (
        <Box sx={(theme: Theme) => rowStyles(theme, { gap: 1 })}>
            {show.slice(0, 3).map((item, index) => (
                <Box key={index} sx={chipStyles}>
                    <Typography sx={(theme) => typographyStyles(theme, { fontSize: Constants.FONT_SIZE.SMALL_TEXT })}>{item}</Typography>
                </Box>
            ))}
            {hidden.length > 0 && (
                <Box sx={chipStyles}>
                    <Tooltip arrow title={hidden.join(", ") || ""}>
                        <Typography sx={(theme) => typographyStyles(theme, { fontSize: Constants.FONT_SIZE.SMALL_TEXT, fontWeight: 600 })}>
                            {hidden.length} +
                        </Typography>
                    </Tooltip>
                </Box>
            )}
        </Box>
    );
};

const chipStyles = {
    px: 1,
    py: 0.5,
    border: "1px solid #d3d3d3",
    borderRadius: 100,
};

export default Categories;
