import { useMemo, useState } from "react";
import { useTranslation } from "next-i18next";
import { AddOutlined, DeleteForever } from "@mui/icons-material";
import { Box, Button, DataTableBodyCell, Typography } from "@maysoft/common-component-react";
import { IconButton, Table, TableBody, TableContainer, TableRow, Tooltip } from "@mui/material";

import { Mode } from "@src/commons/enum";
import ModalSearchMemberApplies from "./ModalSearchMemberApplies";
import { IOrganization, IOrgUserProfile } from "@src/services/identity/Organization.service";
import { LoadingModal } from "../Loading";



const CardMemberApplies = (props: {
    mode: Mode;
    loadingMore: boolean;
    listMemberApplies: IOrgUserProfile[];
    dataDetailOrganization?: IOrganization;
    setListMemberApplies: React.Dispatch<React.SetStateAction<IOrgUserProfile[]>>
}) => {
    const {
        t,
        i18n: { language },
    } = useTranslation(["common", "setting"]);

    const [openModal, setOpenModal] = useState<boolean>(false);

    const handleDeleteItemUser = (userId: string) => {
        props.setListMemberApplies(prev => {
            let newList = [...prev || []];

            newList = newList.filter(el => (
                el.userId !== userId
            ));

            return newList;
        });
    };

    return (
        <>
            <Box paddingBottom={2}>
                <Box sx={{
                    gap: 2,
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}>
                    <Typography variant="button" fontWeight="bold">
                        {t("setting:workflow.member_applies")}
                    </Typography>
                    {
                        !props.loadingMore &&
                        (props.mode !== Mode.View) &&
                        (props.listMemberApplies.length > 0) &&
                        <Box
                            color="info"
                            sx={{
                                gap: 1,
                                display: "flex",
                                flexWrap: "wrap",
                                padding: "6px 12px",
                                borderRadius: "8px",
                                alignItems: "center",
                                backgroundColor: "#E4EBF7",
                                ".MuiSvgIcon-root": {
                                    fontSize: "1rem",
                                },
                                "&:hover": {
                                    cursor: "pointer",
                                    ".MuiSvgIcon-root": {
                                        fontSize: "1.5rem",
                                    },
                                    ".MuiTypography-root": {
                                        fontWeight: "bold",
                                    }
                                }
                            }}
                            onClick={() => {
                                setOpenModal(true);
                            }}
                        >
                            <AddOutlined />
                            <Typography variant="button" color="info" >{t("setting:workflow.add_member_applies")}</Typography>
                        </Box>
                    }
                </Box>

                {props.loadingMore &&
                    <LoadingModal height={"100px"} />
                }

                {
                    !props.loadingMore &&
                    (props.listMemberApplies.length > 0) &&
                    <RenderTable
                        mode={props.mode}
                        onDelete={handleDeleteItemUser}
                        listMemberApplies={props.listMemberApplies}
                    />
                }

                {
                    !props.loadingMore &&
                    (props.listMemberApplies.length === 0) &&
                    <Box sx={{
                        gap: 2,
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        flexDirection: "column",
                        justifyContent: "center",
                    }}>
                        <Typography variant="button">
                            {t("setting:workflow.no_member_appliesin_workflow")}
                        </Typography>
                        {(props.mode !== Mode.View) &&
                            <Button
                                color="info"
                                variant="outlined"
                                onClick={() => {
                                    setOpenModal(true);
                                }}
                            >
                                {t("setting:workflow.add_member_applies")}
                            </Button>
                        }
                    </Box>
                }

                {openModal &&
                    <ModalSearchMemberApplies
                        visibled={openModal}
                        setVisibled={setOpenModal}
                        dataDetailOrganization={props.dataDetailOrganization}
                        userIds={props.listMemberApplies.map(el => el.userId)}
                        onAction={(data) => {
                            setOpenModal(false);
                            props.setListMemberApplies(data);
                        }}
                    />
                }
            </Box>
        </>
    );
};

export default CardMemberApplies;

export const RenderTable = (props: {
    mode: Mode;
    listMemberApplies: IOrgUserProfile[];
    onDelete: (userId: string) => void;
}) => {
    const {
        t,
        i18n: { language },
    } = useTranslation(["common", "setting"]);

    let columnsHeader: JSX.Element[] = useMemo(() => {
        let columnsTemp: JSX.Element[] = [
            <DataTableBodyCell key={"h_name"} borderColor="#9F9F9F" >
                <Typography variant="caption" color="secondary"> {t("setting:invitation.first_name")} </Typography>
            </DataTableBodyCell>,

            <DataTableBodyCell key={"h_group"} borderColor="#9F9F9F" >
                <Typography variant="caption" color="secondary"> {t("setting:group_title_menu")} </Typography>
            </DataTableBodyCell>,
        ];

        if (props.mode !== Mode.View) {
            columnsTemp = [
                ...columnsTemp || [],
                <DataTableBodyCell key={"h_action"} borderColor="#9F9F9F" >
                    <Typography variant="caption" color="secondary"> {t("common:action")} </Typography>
                </DataTableBodyCell>,
            ]
        }

        return columnsTemp;
    }, [props.mode]);

    return (
        <>
            <TableContainer sx={{ boxShadow: "none" }}>
                <Table>
                    <Box component="thead">
                        <TableRow>
                            {columnsHeader}
                        </TableRow>
                    </Box>
                    <TableBody>
                        {props.listMemberApplies.map(item => (
                            <RenderItem
                                key={item.id}
                                mode={props.mode}
                                itemMember={item}
                                onDelete={props.onDelete}
                            />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
};

export const RenderItem = (props: {
    mode: Mode;
    itemMember: IOrgUserProfile;
    onDelete: (userId: string) => void;
}) => {
    const {
        t,
        i18n: { language },
    } = useTranslation(["common", "setting"]);

    let columnsBody = useMemo(() => {
        let columnsTemp = [
            <DataTableBodyCell key={"b_name"} borderColor="#E4EBF7">
                <Box display={"grid"}>
                    <Typography variant="caption">
                        {
                            `${props.itemMember?.lastName || ""} ${props.itemMember?.firstName || ""}`.trim()
                        }
                    </Typography>
                    {props.itemMember?.email && (
                        <Typography variant="caption" color="secondary">
                            {props.itemMember?.email}
                        </Typography>
                    )}
                </Box>
            </DataTableBodyCell>,
            <DataTableBodyCell key={"b_group"} borderColor="#E4EBF7">
                <Typography variant="caption">
                    {
                        props.itemMember?.groups?.[0]?.name?.value?.[language] || ""
                    }
                </Typography>
            </DataTableBodyCell>,
        ];

        if ((props.mode !== Mode.View)) {
            columnsTemp = [
                ...columnsTemp || [],
                <DataTableBodyCell key={"b_action"} borderColor="#E4EBF7" width={"50px"}>
                    <Tooltip title={t("common:delete")}>
                        <IconButton onClick={() => {
                            props.onDelete(props.itemMember?.userId)
                        }}>
                            <DeleteForever color="error" />
                        </IconButton>
                    </Tooltip>
                </DataTableBodyCell>,
            ];
        };

        return columnsTemp;
    }, [props.mode, props.itemMember]);

    return (<TableRow>{columnsBody}</TableRow>);
};