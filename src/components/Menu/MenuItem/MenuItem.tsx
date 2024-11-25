import { Box, Typography } from "@maysoft/common-component-react";
import { Icon, Palette } from "@mui/material";

export const MenuItem = ({
  icon,
  disabled,
  color,
  name,
  onClick,
}: {
  icon: string;
  color: string | keyof Palette;
  name: string;
  disabled?: boolean;
  onClick: () => void;
}) => {
  return (
    <Box
      sx={(theme) => {
        const { palette } = theme;
        const defaultStyles = () => {
          const newColor = palette[color as keyof Palette]?.main || color;
          return {
            "& span": {
              color: newColor,
            },
            "& svg": {
              color: newColor,
            },
          };
        };
        const disabledStyles = () => {
          return {
            "& span": {
              color: "#c3c3c3",
            },
            "& svg": {
              color: "#c3c3c3",
            },
          };
        };
        return {
          display: "flex",
          alignItems: "center",
          gap: 1,
          py: 0.5,
          px: 2,
          width: 150,
          ...defaultStyles(),
          ...(!disabled && {
            "&:hover": {
              cursor: "pointer",
              backgroundColor: "#f3f3f3",
            },
          }),
          ...(disabled && disabledStyles()),
        };
      }}
      onClick={(event) => {
        event.stopPropagation();
        !disabled && onClick();
      }}
    >
      <Icon>{icon}</Icon>
      <Typography
        variant="button"
        sx={{
          pointerEvents: "none",
        }}
      >
        {name}
      </Typography>
    </Box>
  );
};

export default MenuItem;
