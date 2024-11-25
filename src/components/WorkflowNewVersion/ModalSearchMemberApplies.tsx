import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import {
    Avatar, Box, Button,
    CheckBox, Modal, Typography,
} from "@maysoft/common-component-react";

import { LoadingModal } from "../Loading";
import { Status } from "@src/commons/enum";
import { IOrganization, IOrgUserProfile } from "@src/services/identity/Organization.service";



export const ModalSearchMemberApplies = ({
    userIds,
    onAction,
    visibled,
    setVisibled,
    dataDetailOrganization,
}: {
    userIds: string[];
    dataDetailOrganization?: IOrganization;
    onAction: (data: IOrgUserProfile[]) => void;

    visibled: boolean;
    setVisibled: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const {
        t,
        i18n: { language },
    } = useTranslation(["common", "setting"]);

    const [loading, setLoading] = useState<boolean>(false);

    const [dataSelect, setDataSelect] = useState<IOrgUserProfile[]>([]);
    const [dataRows, setDataRows] = useState<Map<string, IOrgUserProfile[]>>(new Map());

    useEffect(() => {
        if (visibled) {
            getDetailOrg();
        }
        return () => {
            setDataSelect([]);
            setDataRows(new Map());
        };
    }, [visibled, userIds]);

    const textButtonAction = useMemo(() => {
        const val = (dataSelect.length > 0) ? dataSelect.length : "";
        return `${t("common:select")} ${val} ${t("setting:staff_title_menu").toLowerCase()}`;
    }, [dataSelect.length]);

    const getDetailOrg = async () => {

        setLoading(true);

        const newItemSelected: IOrgUserProfile[] = [];
        const newMapGroupUser: Map<string, IOrgUserProfile[]> = new Map;

        for (const itemGroup of [...dataDetailOrganization?.organizationProfiles || []]) {
            if (itemGroup.groupStatus === Status.Active) {
                newMapGroupUser.set(itemGroup.groupId, []);
            }
        };

        for (const itemUser of [...dataDetailOrganization?.organizationUserProfiles || []]) {
            if (itemUser.status === Status.Active) {
                if (userIds.includes(itemUser?.userId)) {
                    newItemSelected.push(itemUser);
                }

                if (newMapGroupUser.has(itemUser?.groups?.[0]?.id || "")) {
                    const listTemp = newMapGroupUser.get(itemUser?.groups?.[0]?.id || "") || [];
                    listTemp.push(itemUser);
                    newMapGroupUser.set(itemUser?.groups?.[0]?.id || "", [...listTemp || []]);
                }
            }
        };

        setDataRows(newMapGroupUser);
        setDataSelect(newItemSelected);

        setLoading(false);
    };

    const handleSelectedById = (item: any) => {
        let newData = [...dataSelect || []];

        const indexTemp = dataSelect?.findIndex((el) => el.userId === item.userId);

        if (indexTemp === -1) {
            newData.push(item);
        } else {
            newData.splice(indexTemp, 1);
        }

        setDataSelect(newData);
    };

    const handleSelectedByGroupId = (groupId: string) => {
        let newData = [...dataSelect || []];

        const arrays = dataRows.get(groupId);

        for (const item of [...arrays || []]) {
            if (checkAllByGroupId(groupId)) {
                newData = newData?.filter((el) => el.userId !== item.userId);
            } else {
                const indexTemp = dataSelect?.findIndex((el) => el.userId === item.userId);
                if (indexTemp === -1) {
                    newData.push(item);
                } else { }
            }
        }

        setDataSelect(newData);
    };

    const checkAllByGroupId = (groupId: string) => {
        let count = 0;

        const arrays = dataRows.get(groupId)?.map(el => el.userId);

        for (const id of [...arrays || []]) {
            if (dataSelect?.findIndex((el) => el.userId === id) !== -1) {
                count = count + 1;
            }
        }


        return count === arrays?.length;
    };

    return (
        <Modal
            fullWidth
            maxWidth="md"
            hasActionButton
            visible={visibled}
            buttonAction={textButtonAction}
            title={t("setting:workflow.select_member_applies")}
            onClose={() => {
                setVisibled(false);
                setDataSelect([]);
                setDataRows(new Map());
            }}
            onAction={() => {
                onAction(dataSelect);
                setVisibled(false);
            }}
        >
            <>
                <Box
                    sx={{
                        marginTop: 2,
                        overflow: "auto",
                        minHeight: "40vh",
                    }}
                >
                    {loading ? (
                        <LoadingModal height="40vh" />
                    ) : dataRows.size === 0 ? (
                        <Box sx={{ textAlign: "center" }}>
                            <Typography variant="button" color="secondary">
                                {t("common:no_data")}
                            </Typography>
                        </Box>
                    ) : (
                        <Box>
                            <Box>
                                {Array.from(dataRows.keys()).map((key, index) => {
                                    const arrays = [...dataRows.get(key) || []];

                                    return (
                                        (arrays.length === 0)
                                            ? null
                                            : <Box key={key}>
                                                <Box sx={{
                                                    padding: "8px",
                                                    display: "flex",
                                                    flexWrap: "wrap",
                                                    alignItems: "center",
                                                    justifyContent: "space-between",
                                                    marginTop: (index !== 0) ? "16px" : "0px",
                                                }}>
                                                    <Typography variant="button" fontWeight="bold">
                                                        {arrays?.[0]?.groups?.[0]?.name?.value?.[language] || ""}
                                                        {` (${arrays.length || 0})`}
                                                    </Typography>
                                                    <Button variant="text" onClick={() => { handleSelectedByGroupId(key) }}>
                                                        <Typography variant="button" color="info">
                                                            {checkAllByGroupId(key) ? t("common:deselect_all") : t("common:select_all")}
                                                        </Typography>
                                                    </Button>
                                                </Box>
                                                <Box>
                                                    {
                                                        arrays.map(item => (
                                                            <Box
                                                                key={item.id}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleSelectedById(item);
                                                                }}
                                                                sx={{
                                                                    padding: "8px",
                                                                    display: "flex",
                                                                    flexWrap: "wrap",
                                                                    borderRadius: "8px",
                                                                    marginBottom: "8px",
                                                                    alignItems: "center",
                                                                    border: "1px #dddddd solid",
                                                                    justifyContent: "space-between",
                                                                    ":hover": {
                                                                        cursor: "pointer",
                                                                        backgroundColor: "#dddddd",
                                                                    },
                                                                }}
                                                            >
                                                                <Box sx={{
                                                                    display: "flex",
                                                                    flexWrap: "wrap",
                                                                    alignItems: "center",
                                                                }} >
                                                                    <Avatar
                                                                        src={item.avatarUrl}
                                                                        text={item?.firstName}
                                                                        style={{
                                                                            marginLeft: "16px",
                                                                            marginRight: "16px",
                                                                            border: "1px #dddddd solid",
                                                                        }}
                                                                    />
                                                                    <Box display="inline-grid">
                                                                        <Typography variant="button">
                                                                            {
                                                                                `${item?.lastName || ""} ${item?.firstName || ""}`.trim()
                                                                                || item?.email
                                                                                || "No Name"
                                                                            }
                                                                        </Typography>
                                                                        {item?.email && (
                                                                            <Typography variant="caption" color="secondary">
                                                                                {item?.email}
                                                                            </Typography>
                                                                        )}
                                                                    </Box>
                                                                </Box>
                                                                <CheckBox checked={dataSelect?.findIndex((el) => el.userId === item.userId) !== -1} />
                                                            </Box>
                                                        ))
                                                    }
                                                </Box>
                                            </Box>
                                    )
                                })}
                            </Box>
                        </Box>
                    )}
                </Box>
            </>
        </Modal>
    );
};


export default ModalSearchMemberApplies;