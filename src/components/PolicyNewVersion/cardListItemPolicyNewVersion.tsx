
import { useState } from "react";
import { useTranslation } from "next-i18next";
import { IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import { Box, Button, Typography } from "@maysoft/common-component-react";
import { CopyAll, DeleteForever, Edit, InfoOutlined, MoreVert } from "@mui/icons-material";

import Image from "next/image";
import Helpers from "@src/commons/helpers";
import Resources from "@src/constants/Resources";
import { IRecordPolicy } from "@src/hooks/useDataPolicy.hook";



const CardListItemPolicyNewVersion = ({
    dataPolicies,
    onDetail,
    onCoppy,
    onCreate,
    onDelete,
    onUpdate,
}: {
    dataPolicies: any[];
    onCreate?: () => void;
    onDetail: (id: string) => void;
    onUpdate?: (id: string) => void;
    onDelete?: (id: string) => void;
    onCoppy?: (item: IRecordPolicy) => void;
}) => {

    const {
        t,
        i18n: { language },
    } = useTranslation(["common", "setting"]);

    return (
        (dataPolicies?.length === 0)
            ? (
                <Box sx={{
                    gap: 2,
                    paddingBottom: 3,
                    width: "100%",
                    display: "grid",
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                    <Box sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        "& img": {
                            width: 130,
                            height: 100,
                            objectFit: "contain !important",
                        }
                    }}>
                        {
                            <Image
                                alt="img"
                                width={0}
                                height={0}
                                src={Resources.Images.IMG_ADD_NEW_POLICY}
                            />
                        }
                    </Box>
                    <Box sx={{ display: "grid" }}>
                        <Typography variant="button">
                            {t("setting:policy.note_list_policy")}
                        </Typography>
                    </Box>
                    {
                        Helpers.isFunction(onCreate) &&
                        <Box sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}>
                            <Button color="info" onClick={() => { onCreate && onCreate() }}>
                                {t("setting:policy_title_create_view")}
                            </Button>
                        </Box>
                    }
                </Box>
            )
            : (
                <>
                    <Box sx={{
                        padding: "4px",
                        paddingLeft: "12px",
                        borderBottom: "1px #9F9F9F solid",
                    }}>
                        <Typography variant="button" fontWeight="bold">
                            {t("setting:policy_title_menu")}
                        </Typography>
                    </Box>

                    <Box sx={{
                        overflow: "auto",
                        minWidth: "300px",
                    }}>
                        {[...dataPolicies || []].map((item) => (
                            <Box key={item.id} sx={{
                                gap: "10px",
                                padding: "4px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                borderBottom: "1px #E4EBF7 solid",
                            }}>
                                <Box paddingLeft={"8px"}>
                                    <Typography variant="button">
                                        {item.name?.value?.[language]}
                                    </Typography>
                                </Box>
                                <Box sx={{
                                    gap: "4px",
                                    display: "flex",
                                    alignItems: "center",
                                }}>
                                    <Tooltip title={t("common:detail")}>
                                        <IconButton onClick={() => { onDetail && onDetail(item.id) }}>
                                            <InfoOutlined color="info" />
                                        </IconButton>
                                    </Tooltip>
                                    {Helpers.isFunction(onUpdate) &&
                                        <Tooltip title={t("common:edit")}>
                                            <IconButton onClick={() => { onUpdate && onUpdate(item.id) }}>
                                                <Edit />
                                            </IconButton>
                                        </Tooltip>
                                    }
                                    {(Helpers.isFunction(onDelete) || Helpers.isFunction(onCoppy)) &&
                                        <DropdownActionPolicy
                                            onCoppy={() => { onCoppy && onCoppy(item) }}
                                            onDelete={() => { onDelete && onDelete(item.id) }}
                                        />
                                    }
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </>
            )
    );
};

export default CardListItemPolicyNewVersion;

export const DropdownActionPolicy = (props: {
    onCoppy: () => void;
    onDelete: () => void;
}) => {
    const {
        t,
        i18n: { language },
    } = useTranslation(["common", "setting"]);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const openMoreMenu = Boolean(anchorEl);

    const handleCloseMoreMenu = () => { setAnchorEl(null); };

    const handleOpenMoreMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    return (
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
                    <MenuItem
                        sx={{ gap: 1 }}
                        onClick={(event) => {
                            props.onCoppy();
                            handleCloseMoreMenu();
                        }}
                    >
                        <CopyAll color="success" />
                        <Typography variant="button" color="success">
                            {t("setting:policy.create_copy")}
                        </Typography>
                    </MenuItem>
                    <MenuItem
                        sx={{ gap: 1 }}
                        onClick={(event) => {
                            props.onDelete();
                            handleCloseMoreMenu();
                        }}
                    >
                        <DeleteForever color="error" />
                        <Typography variant="button" color="error">
                            {t("setting:policy.delete")}
                        </Typography>
                    </MenuItem>
                </Box>
            </Menu>
        </>
    );
};