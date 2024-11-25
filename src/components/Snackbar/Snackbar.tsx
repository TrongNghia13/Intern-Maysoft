import React from "react";
import { useTranslation } from "next-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Snackbar as MUISnackbar, Alert } from "@mui/material";

import { RootState } from "@src/store";
import { hideSnackbar } from "@src/store/slice/common.slice";

export const Snackbar: React.FC = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation("common");
    const dataSnackbar = useSelector((state: RootState) => state.base.dataSnackbar);

    const handleClose = () => {
        dispatch(hideSnackbar());
    };

    return (
        dataSnackbar?.message
            ? <MUISnackbar
                open={dataSnackbar?.visible || false}
                autoHideDuration={5000}
                onClose={handleClose}
            >
                <Alert
                    variant="filled"
                    onClose={handleClose}
                    sx={{
                        width: "100%", color: "#FFFFFF",
                        ".MuiAlert-root": {
                            color: "#FFFFFF",
                        }
                    }}
                    severity={dataSnackbar?.type || "info"}
                >
                    {dataSnackbar?.message}
                </Alert>
            </MUISnackbar>
            : null

    );
};

export default Snackbar;
