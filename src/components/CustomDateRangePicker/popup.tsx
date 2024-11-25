import { Card } from "@mui/material";

interface IProps {
    left?: number;
    right?: number;
    visibled: boolean;
    isCenter?: boolean;
    width?: number | string;
    children: React.ReactNode;
    onClickOutSide?: () => void;
}

const Popup: React.FC<IProps> = ({ visibled, width, children, onClickOutSide, left, right, isCenter }) => {
    if (!visibled) return <></>;
    return (
        <Card
            sx={{
                position: "absolute",
                zIndex: 99,
                maxHeight: "50vh",
                overflowY: "scroll",
                width: width || "100%",
                top: "4.5rem",
                border: "1px solid #c3c3c3",
                ...((left || Number(left) >= 0) && { left }),
                ...((right || Number(right) >= 0) && { right }),
                ...(isCenter && {
                    left: 0,
                    right: 0,
                    mx: "auto",
                }),
            }}
        >
            {children}
        </Card>
    );
};

export default Popup;
