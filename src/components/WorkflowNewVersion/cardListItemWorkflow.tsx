
import { useState } from "react";
import { useTranslation } from "next-i18next";
import { IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import { Box, Button, Typography } from "@maysoft/common-component-react";
import { DeleteForever, Edit, InfoOutlined, MoreVert } from "@mui/icons-material";

import Image from "next/image";
import Helpers from "@src/commons/helpers";
import Resources from "@src/constants/Resources";
import { IRecordWorkflow } from "@src/services/maywork/WorkFlow.service";



const CardListItemWorkflow = ({
    dataItems,
    onDetail,
    onCreate,
    onDelete,
    onUpdate,
}: {
    dataItems: IRecordWorkflow[];
    onCreate?: () => void;
    onDetail: (id: string) => void;
    onUpdate?: (id: string) => void;
    onDelete?: (id: string) => void;
}) => {

    const {
        t,
        i18n: { language },
    } = useTranslation(["common", "setting"]);

    return (
        (dataItems?.length === 0)
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
                            {t("setting:workflow.note_list_workflow")}
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
                                {t("setting:workflow_title_create_view")}
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
                            {t("setting:workflow_title_menu")}
                        </Typography>
                    </Box>

                    <Box sx={{
                        overflow: "auto",
                        minWidth: "300px",
                    }}>
                        {[...dataItems || []].map((item) => (
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
                                        {item.name}
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
                                    {Helpers.isFunction(onDelete) &&
                                        <DropdownActionWorkflow
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

export default CardListItemWorkflow;

export const DropdownActionWorkflow = (props: {
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
                            props.onDelete();
                            handleCloseMoreMenu();
                        }}
                    >
                        <DeleteForever color="error" />
                        <Typography variant="button" color="error">
                            {t("common:delete")}
                        </Typography>
                    </MenuItem>
                </Box>
            </Menu>
        </>
    );
};