import { useMemo, useState } from "react";
import { useTranslation } from "next-i18next";
import { AddOutlined, DeleteForever } from "@mui/icons-material";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { Box, Button, DataTableBodyCell, Typography } from "@maysoft/common-component-react";
import { IconButton, Table, TableBody, TableContainer, TableRow, Tooltip } from "@mui/material";

import { Mode } from "@src/commons/enum";
import { IUser } from "@src/commons/interfaces";
import ModalSearchApprovers from "./ModalSearchApprovers";
import { LoadingModal } from "../Loading";




const CardApprovers = (props: {
    mode: Mode;
    loadingMore: boolean;
    listApprovers: IUser[];
    setListApprovers: React.Dispatch<React.SetStateAction<IUser[]>>;
}) => {
    const {
        t,
        i18n: { language },
    } = useTranslation(["common", "setting"]);

    const [openModal, setOpenModal] = useState<boolean>(false);

    const handleDeleteItemUser = (userId: string) => {
        props.setListApprovers(prev => {
            let newList = [...prev || []];

            newList = newList.filter(el => (
                el.id !== userId
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
                        {t("setting:workflow.approver")}
                    </Typography>
                    {
                        !props.loadingMore &&
                        (props.mode !== Mode.View) &&
                        (props.listApprovers.length > 0) &&
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
                            <Typography variant="button" color="info" >{t("setting:workflow.add_approver")}</Typography>
                        </Box>
                    }
                </Box>

                {props.loadingMore &&
                    <LoadingModal height={"100px"} />
                }

                {
                    !props.loadingMore &&
                    (props.listApprovers.length > 0) &&
                    <RenderTable
                        mode={props.mode}
                        listApprovers={props.listApprovers}

                        onDelete={handleDeleteItemUser}
                        onUpdateSequence={(newData) => {
                            props.setListApprovers(newData);
                        }}
                    />
                }

                {
                    !props.loadingMore &&
                    (props.listApprovers.length === 0) &&
                    <Box sx={{
                        gap: 2,
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        flexDirection: "column",
                        justifyContent: "center",
                    }}>
                        <Typography variant="button">
                            {t("setting:workflow.no_approver_in_workflow")}
                        </Typography>
                        {(props.mode !== Mode.View) &&
                            <Button
                                color="info"
                                variant="outlined"
                                onClick={() => {
                                    setOpenModal(true);
                                }}
                            >
                                {t("setting:workflow.add_approver")}
                            </Button>
                        }
                    </Box>
                }
            </Box>

            {openModal &&
                <ModalSearchApprovers
                    visibled={openModal}
                    setVisibled={setOpenModal}
                    userIds={props.listApprovers.map(el => el.id)}
                    onAction={(data) => {
                        setOpenModal(false);
                        props.setListApprovers(data);
                    }}
                />
            }
        </>
    );
};

export default CardApprovers;

const reorder = (list: any[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);

    const [removed] = result.splice(startIndex, 1);

    result.splice(endIndex, 0, removed);

    return result;
};

export const RenderTable = (props: {
    mode: Mode;
    listApprovers: IUser[];

    hidenActionDelete?: boolean;
    hidenActionUpdateSequence?: boolean;

    onDelete: (userId: string) => void;
    onUpdateSequence: (data: IUser[]) => void;
}) => {
    const {
        t,
        i18n: { language },
    } = useTranslation(["common", "setting"]);

    let columnsHeader: JSX.Element[] = useMemo(() => {
        let columnsTemp: JSX.Element[] = [
            <DataTableBodyCell key={"h_index"} borderColor="#9F9F9F" >
                <Typography variant="caption" color="secondary"> {t("setting:workflow.level_approve")} </Typography>
            </DataTableBodyCell>,

            <DataTableBodyCell key={"h_name_member"} borderColor="#9F9F9F" >
                <Typography variant="caption" color="secondary"> {t("setting:workflow.approver")} </Typography>
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

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) {
            return;
        } else {
            if (result.source?.index !== result.destination?.index) {
                const dataTemp = reorder(
                    [...props.listApprovers || []],
                    result.source?.index,
                    result.destination?.index
                );

                props.onUpdateSequence(dataTemp);
            }
        }
    }

    return (
        <>
            <TableContainer sx={{ boxShadow: "none" }}>
                <Table>
                    <Box component="thead">
                        <TableRow>
                            {columnsHeader}
                        </TableRow>
                    </Box>
                    <>
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable
                                droppableId="droppable"
                                isDropDisabled={props.hidenActionUpdateSequence || (props.mode === Mode.View)}
                            >
                                {provided => (
                                    <TableBody {...provided.droppableProps} ref={provided.innerRef}>
                                        {[...props.listApprovers || []].map((item, index) => (
                                            <Draggable
                                                key={item.id}
                                                index={index}
                                                draggableId={item.id}
                                                isDragDisabled={props.hidenActionUpdateSequence || (props.mode === Mode.View)}
                                            >
                                                {provided => (
                                                    <TableRow
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <RenderItem
                                                            index={index}
                                                            itemUser={item}
                                                            mode={props.mode}
                                                            onDelete={props.onDelete}
                                                            lengthArray={props.listApprovers.length}
                                                        />
                                                    </TableRow>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </TableBody>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </>
                </Table>
            </TableContainer>
        </>
    );
};

export const RenderItem = (props: {
    mode: Mode;
    index: number;
    itemUser: IUser;
    lengthArray: number;
    onDelete: (userId: string) => void;
}) => {
    const {
        t,
        i18n: { language },
    } = useTranslation(["common", "setting"]);

    const textSequence = useMemo(() => {
        let text = `Cấp duyệt thứ ${props.index + 1}`;

        if (props.index === 0) {
            text = "Cấp duyệt đầu tiên";
        }

        if ((props.index + 1) === props.lengthArray) {
            text = "Cấp duyệt cuối";
        }

        return text;
    }, [props.index, props.lengthArray]);

    let columnsBody = useMemo(() => {
        let columnsTemp = [
            <DataTableBodyCell key={"b_index"} borderColor="#E4EBF7">
                <Typography variant="caption">
                    {textSequence}
                </Typography>
            </DataTableBodyCell>,
            <DataTableBodyCell key={"b_name_member"} borderColor="#E4EBF7">
                <Box display={"grid"}>
                    <Typography variant="caption">
                        {
                            `${props.itemUser?.organizationUserProfile?.lastName || ""} ${props.itemUser?.organizationUserProfile?.firstName || ""}`.trim()
                        }
                    </Typography>
                    {props.itemUser?.organizationUserProfile?.email && (
                        <Typography variant="caption" color="secondary">
                            {props.itemUser?.organizationUserProfile?.email}
                        </Typography>
                    )}
                </Box>
            </DataTableBodyCell>,
        ];

        if ((props.mode !== Mode.View)) {
            columnsTemp = [
                ...columnsTemp || [],
                <DataTableBodyCell key={"b_action"} borderColor="#E4EBF7" width={"50px"}>
                    <Tooltip title={t("common:delete")}>
                        <IconButton onClick={() => {
                            props.onDelete(props.itemUser?.id)
                        }}>
                            <DeleteForever color="error" />
                        </IconButton>
                    </Tooltip>
                </DataTableBodyCell>,
            ];
        };

        return columnsTemp;
    }, [textSequence, props.mode, props.itemUser]);

    return (
        <>{columnsBody}</>
    );
};