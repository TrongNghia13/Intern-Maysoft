import { Box } from "@maysoft/common-component-react";
import { Fade, PopperPlacementType } from "@mui/material";
import { useState } from "react";
import PopperRoot from "./PopperRoot";

interface IProps {
    anchorEl: HTMLButtonElement | null;
    children: React.ReactNode;
    placement?: PopperPlacementType;
}

export const Popper = ({ anchorEl, children, placement = "top" }: IProps) => {
    const openMoreMenu = Boolean(anchorEl);

    const [arrowRef, setArrowRef] = useState<HTMLDivElement | null>(null);

    return (
        <PopperRoot
            open={openMoreMenu}
            anchorEl={anchorEl}
            disablePortal={false}
            placement={placement}
            transition
            modifiers={[
                {
                    name: "flip",
                    enabled: true,
                    options: {
                        altBoundary: true,
                        rootBoundary: "document",
                        padding: 8,
                    },
                },
                {
                    name: "preventOverflow",
                    enabled: true,
                    options: {
                        altAxis: true,
                        altBoundary: true,
                        tether: true,
                        rootBoundary: "document",
                        padding: 8,
                    },
                },
                {
                    name: "arrow",
                    enabled: true,
                    options: {
                        element: arrowRef,
                    },
                },
            ]}
        >
            {({ TransitionProps }) => (
                <Fade {...TransitionProps} timeout={350}>
                    <Box
                        sx={{
                            overflow: "auto",
                            minWidth: "400px",
                            maxHeight: "350px",
                            minHeight: "100px",
                            boxShadow: "0px 2px 20px 0px #00000026",
                            backgroundColor: "#ffffff",
                            borderRadius: 3,
                            p: 2.5,
                        }}
                    >
                        <Box
                            component="span"
                            className="arrow"
                            ref={setArrowRef}
                            sx={{
                                position: "absolute",
                                fontSize: 7,
                                width: "3em",
                                height: "3em",
                                "&::before": {
                                    content: '""',
                                    margin: "auto",
                                    display: "block",
                                    width: 0,
                                    height: 0,
                                    borderStyle: "solid",
                                },
                            }}
                        />
                        {children}
                    </Box>
                </Fade>
            )}
        </PopperRoot>
    );
};

export default Popper;
