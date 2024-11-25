import { IconButton } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Close, Search } from "@mui/icons-material";
import { useEffect, useMemo, useState } from "react";
import {
    Avatar, Box, CheckBox, CustomPagination, FormField,
    Modal, Typography, useCommonComponentContext,
} from "@maysoft/common-component-react";

import Constants from "@src/constants";
import Helpers from "@src/commons/helpers";
import UserService from "@src/services/identity/UserService";

import { LoadingModal } from "../Loading";
import { IUser } from "@src/commons/interfaces";



export const ModalSearchApprovers = ({
    userIds,
    onAction,

    visibled,
    setVisibled,
}: {
    userIds: string[];
    onAction: (data: IUser[]) => void;

    visibled: boolean;
    setVisibled: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const {
        t,
        i18n: { language },
    } = useTranslation(["common", "setting"]);

    const { userInfo } = useCommonComponentContext();

    const [loading, setLoading] = useState<boolean>(false);

    const [dataRows, setDataRows] = useState<IUser[]>([]);
    const [dataSelect, setDataSelect] = useState<IUser[]>([]);

    const [requestGetPaged, setRequestGetPaged] = useState<{
        searchText?: string;
        pageNumber?: number;
        totalCount?: number;
    }>({
        pageNumber: 1,
        totalCount: 0,
    });

    useEffect(() => {
        if (visibled) {
            getPaged(requestGetPaged);
        }
        return () => {
            setDataRows([]);
            setDataSelect([]);
            setRequestGetPaged({
                pageNumber: 1,
                totalCount: 0,
            });
        };
    }, [visibled, userIds]);

    const textButtonAction = useMemo(() => {
        const val = (dataSelect.length > 0) ? dataSelect.length : "";
        return `${t("common:select")} ${val} ${t("setting:workflow.approver").toLowerCase()}`;
    }, [dataSelect.length]);

    const getPaged = async (newReq?: any) => {
        try {
            setLoading(true);

            const pageSize = Constants.ROW_PER_PAGE_20;
            const pageNumber = Helpers.getPageNumber(newReq?.pageNumber || 1, pageSize, newReq?.totalCount || 0) || 1;

            const newQuery = {
                pageSize: pageSize,
                pageNumber: pageNumber,
                listStatus: [1],
                selectedIds: userIds,
                searchText: newReq?.searchText || undefined,
                organizationId: userInfo?.userProfile?.organizationId || "0",
            };

            if (!Helpers.isNullOrEmpty(userIds) && userIds.length > 0) newQuery.selectedIds = userIds;

            const result = await UserService.getPaged(newQuery);

            setDataRows(result.items || []);
            setDataSelect(result.selectedItems || []);

            setRequestGetPaged({
                totalCount: result?.totalCount,
                pageNumber: result?.currentPage,
                searchText: newQuery?.searchText,
            });
        } catch (error) {
            console.log({ error });
        } finally {
            setLoading(false);
        }
    };

    const handleSelectedById = (item: any) => {
        let newData = [...(dataSelect || [])];

        const indexTemp = dataSelect?.findIndex((el) => el.id === item.id);

        if (indexTemp === -1) {
            newData.push(item);
        } else {
            newData.splice(indexTemp, 1);
        }

        setDataSelect(newData);
    };

    return (
        <Modal
            fullWidth
            maxWidth="md"
            hasActionButton
            visible={visibled}
            buttonAction={textButtonAction}
            title={t("setting:workflow.select_approver")}
            onClose={() => {
                setVisibled(false);
                setDataRows([]);
                setDataSelect([]);
            }}
            onAction={() => {
                onAction(dataSelect);
                setVisibled(false);
            }}
        >
            <>
                <Box>
                    {/* input search text by getpage */}
                    <FormField
                        maxLength={255}
                        variant="outlined"
                        value={requestGetPaged?.searchText || ""}
                        placeholder={t("setting:workflow.search_name_member")}
                        onChangeValue={(value: any) => {
                            setRequestGetPaged((prev) => ({
                                ...prev,
                                searchText: value,
                            }));
                        }}
                        onKeyPress={(e: any) => {
                            if (e.key === "Enter") {
                                getPaged({ ...requestGetPaged });
                            }
                        }}
                        InputProps={{
                            startAdornment: (
                                <IconButton
                                    color="info"
                                    onClick={() => {
                                        getPaged({ ...requestGetPaged });
                                    }}
                                >
                                    <Search />
                                </IconButton>
                            ),
                            endAdornment: requestGetPaged?.searchText && (
                                <IconButton
                                    color="secondary"
                                    onClick={() => {
                                        getPaged({ searchText: "", pageNumber: 1 });
                                    }}
                                >
                                    <Close />
                                </IconButton>
                            ),
                        }}
                    />
                </Box>

                {/* list record */}
                <Box
                    sx={{
                        marginTop: 2,
                        height: "48vh",
                        overflow: "auto",
                    }}
                >
                    {loading ? (
                        <LoadingModal height="48vh" />
                    ) : dataRows.length === 0 ? (
                        <Box sx={{ textAlign: "center" }}>
                            <Typography variant="button" color="secondary">
                                {t("common:no_data")}
                            </Typography>
                        </Box>
                    ) : (
                        <Box>
                            <Box>
                                {dataRows.map((item) => (
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
                                            width: "60%",
                                            minWidth: "200px",
                                            display: "flex",
                                            flexWrap: "wrap",
                                            alignItems: "center",
                                        }} >
                                            <Avatar
                                                text={item?.organizationUserProfile?.firstName}
                                                src={item.avatarUrl}
                                                style={{
                                                    marginLeft: "16px",
                                                    marginRight: "16px",
                                                    border: "1px #dddddd solid",
                                                }}
                                            />
                                            <Box display="inline-grid">
                                                <Typography variant="button">
                                                    {
                                                        `${item?.organizationUserProfile?.lastName || ""} ${item?.organizationUserProfile?.firstName || ""}`.trim()
                                                        || item?.fullName || item?.userName
                                                        || "No Name"
                                                    }
                                                </Typography>
                                                {item?.organizationUserProfile?.email && (
                                                    <Typography variant="caption" color="secondary">
                                                        {item?.organizationUserProfile?.email}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Box>
                                        <Box sx={{
                                            width: "40%",
                                            display: "flex",
                                            flexWrap: "wrap",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                        }} >
                                            <Typography variant="button">
                                                {item?.groupUsers?.[0]?.groupName?.value?.[language] || ""}
                                            </Typography>

                                            <CheckBox checked={dataSelect?.findIndex((el) => el.id === item.id) !== -1} />
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                            <Box mt={2}>
                                <CustomPagination
                                    rowsPerPageOptions={[20]}
                                    pageSize={Constants.ROW_PER_PAGE_20}
                                    page={requestGetPaged?.pageNumber || 1}
                                    total={requestGetPaged?.totalCount || 0}
                                    onChangePage={(value) => {
                                        getPaged({ ...requestGetPaged, pageNumber: value });
                                    }}
                                />
                            </Box>
                        </Box>
                    )}
                </Box>
            </>
        </Modal>
    );
};

export default ModalSearchApprovers;
