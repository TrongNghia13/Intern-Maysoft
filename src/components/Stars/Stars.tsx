import { Box } from "@maysoft/common-component-react";
import { Star } from "@mui/icons-material";

export const Stars = ({ value, fontSize = "1rem" }: { value: number; fontSize?: number | string }) => {
    return (
        <Box display="inline-flex" alignItems="center" flexWrap="wrap">
            {Array.from({ length: value }).map((_, index) => (
                <Star key={index} sx={{ fontSize: fontSize }} />
            ))}
        </Box>
    );
};

export default Stars;
