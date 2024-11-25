import React from "react";
import { useSelector } from "react-redux";
import { Backdrop, CircularProgress, Theme } from "@mui/material";

import { RootState } from "@src/store";

const backdrop = (theme: Theme | any) => {
    return {
        zIndex: 1500,
        color: "#fff",
    };
};

export const PageLoading: React.FC = () => {
    const open = useSelector((state: RootState) => state.base.loading);

    return (
        <Backdrop open={open || false} sx={backdrop} style={{ display: open ? undefined : "none" }}>
            <CircularProgress color="inherit" />
        </Backdrop>
    );
};

export default PageLoading;
