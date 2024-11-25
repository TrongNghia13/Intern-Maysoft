import { Box, Button, Typography } from "@maysoft/common-component-react";
import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import Helpers from "@src/commons/helpers";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

interface IProps {
    setVisibled: React.Dispatch<React.SetStateAction<boolean>>;
    visibled: boolean;
    title: string;
    children: React.ReactNode;
    onAction?: () => void;
}

export const Popup: React.FC<IProps> = ({ visibled, setVisibled, title, children, onAction }) => {
    const { t } = useTranslation("common");
    const hasButton = useMemo(() => Helpers.isFunction(onAction), [onAction]);
    return (
        <Box
            sx={{
                position: "fixed",
                zIndex: 1200,
                top: 0,
                left: 0,
                width: "100%",
                height: "100vh",
                backgroundColor: "#f7f7f7",
                p: 2,
                opacity: 0,
                visibility: "hidden",
                transition: "opacity, visibility .3s ease-out ",
                ...(!hasButton && {
                    overflowY: "scroll",
                }),
                ...(visibled && {
                    opacity: 1,
                    visibility: "inherit",
                }),
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    px: 2,
                    py: 1,
                }}
            >
                <IconButton sx={{ border: "1px solid #000000" }} onClick={() => setVisibled(false)}>
                    <Close fontSize="small" />
                </IconButton>
                <Box width="100%" textAlign="center">
                    <Typography variant="h5" fontWeight="medium">
                        {title}
                    </Typography>
                </Box>
            </Box>
            <Box
                p={2}
                sx={{
                    ...(hasButton && {
                        height: "90%",
                        overflowY: "scroll",
                        overflowX: "hidden",
                    }),
                }}
            >
                {children}
            </Box>
            {hasButton && (
                <Box display="flex" alignItems="center" justifyContent="center">
                    <Button
                        sx={{
                            width: "100%",
                        }}
                        onClick={onAction}
                    >
                        {t("search")}
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default Popup;
