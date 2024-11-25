import { Box, Typography } from "@maysoft/common-component-react";
import { Add, Close, Flight } from "@mui/icons-material";
import { Menu, MenuItem } from "@mui/material";
import { useTranslation } from "next-i18next";

import { Status, TypeSearchForm } from "@src/commons/enum";
import Constants from "@src/constants";
import React, { useMemo } from "react";

export const ActionForm = ({
    status,
    addForm,
    anchorEl,
    setAnchorEl,
    setTypeForm,
    setAddForm,
    handleCancelAddTrips,
}: {
    status: Status;
    addForm: boolean;
    anchorEl: HTMLElement | null;
    setAnchorEl: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
    setTypeForm: React.Dispatch<React.SetStateAction<number | undefined>>;
    setAddForm: React.Dispatch<React.SetStateAction<boolean>>;
    handleCancelAddTrips: () => void;
}) => {
    const { t } = useTranslation(["common", "tripbooking"]);

    const openMenu = Boolean(anchorEl);

    const arrItemMenu = [
        {
            title: "Chuyến bay",
            icon: <Flight />,
            value: TypeSearchForm.Flight,
        },
        // {
        //     title: t("tripbooking:stays"),
        //     icon: <HotelOutlined />,
        //     value: TypeSearchForm.Stays,
        // },
        // {
        //     title: "Trains",
        //     icon: <TrainOutlined />,
        //     value: TypeSearchForm.Trains,
        // },
        // {
        //     title: "Cars",
        //     icon: <LocalTaxiOutlined />,
        //     value: TypeSearchForm.Cars,
        // },
    ];
    //

    const handleClickMenu = (event: React.MouseEvent<HTMLButtonElement> | React.MouseEvent<HTMLDivElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    return (
        <>
            {status !== Status.Reject && (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "right",
                    }}
                >
                    {addForm && <CustomButton mode="cancel" onClick={handleCancelAddTrips} />}
                    {!addForm && (
                        <CustomButton
                            mode="add"
                            onClick={handleClickMenu}
                            id="basic-button"
                            aria-haspopup="true"
                            aria-expanded={openMenu ? "true" : undefined}
                            aria-controls={openMenu ? "basic-menu" : undefined}
                        />
                    )}
                </Box>
            )}

            <Menu id="basic-menu" open={openMenu} anchorEl={anchorEl} onClose={handleCloseMenu} MenuListProps={{ "aria-labelledby": "basic-button" }}>
                {arrItemMenu.map((item, key: number) => (
                    <MenuItem
                        key={key}
                        onClick={(event) => {
                            handleCloseMenu();
                            setTypeForm(item.value);
                            setAddForm(true);
                        }}
                    >
                        <Box
                            sx={{
                                py: 0,
                                lineHeight: 1,
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <Typography variant="body1" color="secondary" lineHeight={0.75} sx={{ marginRight: "16px", fontSize: "0.8rem" }}>
                                {item.icon}
                            </Typography>
                            <Typography
                                variant="button"
                                fontWeight="regular"
                                sx={{
                                    overflow: "hidden",
                                    whiteSpace: "nowrap",
                                    textOverflow: "ellipsis",
                                    fontSize: "0.8rem",
                                }}
                            >
                                {item.title}
                            </Typography>
                        </Box>
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};

const CustomButton = ({
    mode,
    onClick,
    id,
    ...rest
}: {
    id?: string;
    mode: "add" | "cancel";
    onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
    rest?: React.HTMLProps<HTMLButtonElement>;
}) => {
    const { backgroundColor, color, text, Icon } = useMemo(() => {
        if (mode === "add")
            return {
                backgroundColor: "#E4EBF7",
                color: "#1E97DE",
                Icon: () => <Add sx={{ color: "#1E97DE" }} />,
                text: "Chọn thêm",
            };
        return {
            backgroundColor: "#FFE5DF",
            color: "#B71D18",
            Icon: () => <Close sx={{ color: "#B71D18" }} />,
            text: "Hủy",
        };
    }, [mode]);

    return (
        <Box
            {...rest}
            id={id}
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                borderRadius: 2,
                backgroundColor,
                p: 0.75,
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
            <Icon />
            <Typography
                sx={{
                    fontSize: Constants.FONT_SIZE.SMALL_TEXT,
                    fontWeight: 500,
                    color,
                }}
            >
                {text}
            </Typography>
        </Box>
    );
};
export default ActionForm;
