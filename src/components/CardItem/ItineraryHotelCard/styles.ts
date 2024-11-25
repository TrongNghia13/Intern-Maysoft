import { Theme } from "@mui/material/styles";

export const cardContainer = (theme: Theme, ownerState: { isSelected: boolean, disabled?: boolean }) => {
    const { isSelected, disabled } = ownerState;
    const {
        palette: { info },
        functions: { rgba },
    } = theme;
    const isActiveStyles = () => {
        return {
            border: `1px solid ${info.main}`,
            // backgroundColor: rgba(info.main, 0.1),
        };
    };
    return {
        borderRadius: 2,
        border: "1px solid #c3c3c3",
        p: 2,
        display: "grid",
        gap: 1,
        ...(isSelected && isActiveStyles()),
        ...(!disabled && ({"&:hover": {
            cursor: "pointer",
            border: `1px solid ${info.main}`,
            backgroundColor: rgba(info.main, 0.05),
        }})),
    };
};
