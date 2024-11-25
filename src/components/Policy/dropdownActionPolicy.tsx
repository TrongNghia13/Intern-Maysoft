import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MoreVert } from "@mui/icons-material";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { Box, Typography } from "@maysoft/common-component-react";

import Helpers from "@src/commons/helpers";


export interface IPropsDropdownActionPolicy {
    onEdit?: () => void;
    onCoppy?: () => void;
    onDelete?: () => void;
    onArchive?: () => void;
};

const DropdownActionPolicy: React.FC<IPropsDropdownActionPolicy> = ({
    onCoppy, onDelete, onEdit, onArchive
}: IPropsDropdownActionPolicy) => {
    const {
        t,
        i18n: { language },
    } = useTranslation(["common", "setting"]);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const openMoreMenu = Boolean(anchorEl);

    const handleOpenMoreMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMoreMenu = () => { setAnchorEl(null); };

    const handleArchive = () => {
        Helpers.showConfirmAlert(
            t("setting:policy.confirm_archive"),
            () => {

            }
        );
    };

    return (
        (
            Helpers.isFunction(onEdit) ||
            Helpers.isFunction(onCoppy) ||
            Helpers.isFunction(onArchive) ||
            Helpers.isFunction(onDelete)
        ) ?
            <>
                <IconButton
                    id="more-icon-button"
                    aria-haspopup="true"
                    aria-expanded={openMoreMenu ? "true" : undefined}
                    aria-controls={openMoreMenu ? "dropdown-menu-more" : undefined}
                    onClick={handleOpenMoreMenu}
                >
                    <MoreVert />
                </IconButton>
                <Menu
                    open={openMoreMenu}
                    anchorEl={anchorEl}
                    id="dropdown-menu-more"
                    onClose={handleCloseMoreMenu}
                    MenuListProps={{
                        "aria-labelledby": "more-icon-button",
                    }}
                >
                    <Box>
                        {Helpers.isFunction(onEdit) &&
                            <MenuItem
                                onClick={(event) => {
                                    onEdit();
                                    handleCloseMoreMenu();
                                }}
                            >
                                <Typography variant="button">{t("setting:policy.change_name")}</Typography>
                            </MenuItem>
                        }
                        {Helpers.isFunction(onCoppy) &&
                            <MenuItem
                                onClick={(event) => {
                                    onCoppy();
                                    handleCloseMoreMenu();
                                }}
                            >
                                <Typography variant="button">{t("setting:policy.create_copy")}</Typography>
                            </MenuItem>
                        }
                        {Helpers.isFunction(onArchive) &&
                            <MenuItem
                                onClick={(event) => {
                                    onArchive();
                                    handleCloseMoreMenu();
                                }}
                            >
                                <Typography variant="button">{t("setting:policy.archive")}</Typography>
                            </MenuItem>
                        }
                        {Helpers.isFunction(onDelete) &&
                            <MenuItem
                                onClick={(event) => {
                                    onDelete();
                                    handleCloseMoreMenu();
                                }}
                            >
                                <Typography variant="button" color="error">{t("setting:policy.delete")}</Typography>
                            </MenuItem>
                        }
                    </Box>
                </Menu>
            </>
            : null
    );
};

export default DropdownActionPolicy;