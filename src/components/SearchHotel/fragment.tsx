import { Box, Typography } from "@maysoft/common-component-react";
import { Card } from "@mui/material";

const TitleValue = ({ title, value, hasMarginBottom }: { title: string; value: string; hasMarginBottom: boolean }) => (
    <Box display="flex" alignItems="center" justifyContent="space-between" mb={hasMarginBottom ? 1 : 0}>
        <Typography variant="caption" color="secondary" fontWeight="medium">
            {title}
        </Typography>
        <Typography variant="caption" fontWeight="medium">
            {value}
        </Typography>
    </Box>
);

const InfoBox = ({ title, description }: { title: string; description: string | undefined }) => {
    return (
        <Box display="flex" flexDirection="column" gap={1}>
            <Typography variant="caption" fontWeight="medium">
                {title}
            </Typography>
            <Typography variant="caption">{description}</Typography>
        </Box>
    );
};

const HorizontalDivider = () => <Box sx={{ width: "1px", height: "40px", backgroundColor: "#dddddd" }} />;

const CardBase = ({
    title,
    value,
    header,
    expanded,
    children,
    onClick,
}: {
    title: string;
    value: string;
    header: string;
    expanded: boolean;
    children: React.ReactNode;
    onClick: () => void;
}) => (
    <Card>
        <Box
            p={2}
            onClick={onClick}
            sx={{
                ...(expanded && {
                    ":hover": {
                        cursour: "pointer",
                    },
                }),
            }}
        >
            <Box>
                <Box
                    sx={{
                        opacity: expanded ? 1 : 0,
                        visibility: expanded ? "inherit" : "hidden",
                        height: expanded ? "100%" : 0,
                        transition: expanded ? "opacity, visibility, height 1.5s " : "all 0s",
                        display: expanded ? "inherit" : "none",
                    }}
                >
                    <Typography variant="h6" fontWeight="medium">
                        {header}
                    </Typography>
                    {children}
                </Box>
                <Box
                    sx={{
                        opacity: !expanded ? 1 : 0,
                        visibility: !expanded ? "inherit" : "hidden",
                        transition: "all .3s",
                    }}
                >
                    <TitleValue title={title} value={value} hasMarginBottom={expanded} />
                </Box>
            </Box>
        </Box>
    </Card>
);

export { TitleValue, InfoBox, HorizontalDivider, CardBase };
