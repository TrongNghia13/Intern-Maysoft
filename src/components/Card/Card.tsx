import { CardProps, Card as MUICard } from "@mui/material";

export const Card = (props: CardProps) => {
    return (
        <MUICard
            {...props}
            sx={{
                // backgroundColor: "transparent",
                // "&.MuiPaper-root": {
                //     backgroundColor: "transparent !important",
                // },
                // ...props.sx,
                boxShadow: "0px 2px 4px 0px #0000000D",
                // py: 1.25,
                // px: 2.5,
                p: 2.5,
                width: "100%",
                ...props.sx,
            }}
        >
            {props.children}
        </MUICard>
    );
};

export default Card;
