import { Typography } from "@maysoft/common-component-react";
import { Palette, Theme } from "@mui/material/styles";
import Constants from "@src/constants";

export const Chip = ({ value, color }: { value: string | number; color: string | keyof Palette }) => {
    return (
        <Typography
            sx={(theme: Theme) => {
                const { palette } = theme;
                return {
                    px: 1,
                    py: 0.5,
                    fontWeight: 600,
                    borderRadius: 6,
                    width: "max-content",
                    color: "#ffffff",
                    fontSize: Constants.FONT_SIZE.SMALL_TEXT,
                    backgroundColor: palette[color as keyof Palette]?.main || color,
                };
            }}
        >
            {value}
        </Typography>
    );
};

export default Chip;
