import { Slide } from "@mui/material";
import { styled } from "@mui/material/styles";
import { TransitionProps } from "@mui/material/transitions";
import React, { ReactNode } from "react";

import { Box, Typography } from "@maysoft/common-component-react";
import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Helpers from "@src/commons/helpers";
import { useTranslation } from "react-i18next";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1),
    },
}));

export interface DialogTitleProps {
    id: string;
    children?: ReactNode;
    onClose: () => void;
}

function BootstrapDialogTitle(props: DialogTitleProps) {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
                {children}
                {onClose ? (
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{
                            // top: 16,
                            // right: 16,
                            // position: "absolute",
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                ) : null}
            </Box>
        </DialogTitle>
    );
}

interface IProps {
    title?: string;
    closeButton?: string;
    buttonAction?: string;

    visible: boolean;
    dividers?: boolean;
    fullWidth?: boolean;
    fullScreen?: boolean;
    hasActionButton?: boolean;
    disabledActionButton?: boolean;
    maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";

    children: ReactNode;

    onClose: () => void;
    onAction?: () => void;
    onClickCloseIcon?: () => void;
    className?: string;
}

export const Modal: React.FC<IProps> = ({
    title,
    children,
    visible,
    dividers,
    maxWidth,
    fullWidth,
    closeButton,
    buttonAction,
    hasActionButton,
    disabledActionButton,
    onClose,
    onAction,
    onClickCloseIcon,
    className,
}: IProps) => {
    const { t } = useTranslation("common");

    return (
        <BootstrapDialog
            aria-labelledby="customized-dialog-title"
            fullWidth={fullWidth}
            maxWidth={maxWidth}
            onClose={onClose}
            open={visible}
            className={className}
            sx={{
                "& .MuiDialog-paper": {
                    borderRadius: 3,
                },
            }}
        >
            <Box p={2.25} px={1.5}>
                {!Helpers.isNullOrEmpty(title) && (
                    <BootstrapDialogTitle id="customized-dialog-title" onClose={onClickCloseIcon ? onClickCloseIcon : onClose}>
                        {title}
                    </BootstrapDialogTitle>
                )}
                <DialogContent dividers={dividers}>{children}</DialogContent>
                {hasActionButton && (
                    <DialogActions>
                        <Box gap={2} display="flex" justifyContent="flex-end" alignItems="flex-end" pr={1}>
                            {Helpers.isFunction(onClose) && (
                                <Button onClick={onClose} backgroundColor={"#E4EBF7"} color={"#637381"}>
                                    {closeButton ? closeButton : t("Hủy")}
                                </Button>
                            )}
                            {Helpers.isFunction(onAction) && (
                                <Button
                                    onClick={onAction}
                                    // disabled={disabledActionButton}
                                    backgroundColor={"#1E97DE"}
                                    color={"#ffffff"}
                                >
                                    {buttonAction ? buttonAction : t("Lưu thông tin")}
                                </Button>
                            )}
                        </Box>
                    </DialogActions>
                )}
            </Box>
        </BootstrapDialog>
    );
};

const Button = ({ children, backgroundColor, color, onClick }: { children: string; onClick: () => void; backgroundColor: string; color: string }) => {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                borderRadius: 2,
                backgroundColor,
                py: 1.5,
                px: 2,
                border: "1px solid transparent",
                transitionProperty: "border-color",
                transitionTimingFunction: "ease-out",
                transitionDuration: ".3s",
                "&:hover": {
                    cursor: "pointer",
                    borderColor: color,
                },
            }}
            onClick={onClick}
        >
            <Typography
                sx={{
                    fontSize: "1rem",
                    fontWeight: 600,
                    color,
                }}
            >
                {children}
            </Typography>
        </Box>
    );
};

export default Modal;
