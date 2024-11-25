import { Divider } from "@mui/material";
import { Box, Typography } from "@maysoft/common-component-react";
import { titleStyles, typographyStyles } from "@src/styles/commonStyles";

export const FilterBox = ({
    title,
    children,
    direction = "vertical",
}: {
    title: string;
    children: React.ReactNode;
    direction?: "horizontal" | "vertical";
}) => (
    <Box>
        <Typography sx={(theme) => typographyStyles(theme, { fontWeight: 600 })}>{title}</Typography>
        <Box
            {...(direction === "vertical"
                ? { display: "grid" }
                : {
                    display: "flex",
                    flexWrap: "wrap",
                })}
            gap={1}
        >
            {children}
        </Box>
    </Box>
);

export const BaseBox = ({ children, title }: { children: React.ReactNode; title: string }) => (
    <Box display="flex" flexDirection="column" gap={2}>
        <Typography sx={titleStyles}>{title} </Typography>
        {children}
        <Divider />
    </Box>
);
