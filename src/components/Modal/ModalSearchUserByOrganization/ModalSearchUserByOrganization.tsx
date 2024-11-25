import { Avatar, Box, CheckBox, CustomPagination, FormField, Typography, useCommonComponentContext } from "@maysoft/common-component-react";
import { Close, Search } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import Helpers from "@src/commons/helpers";
import { IUser } from "@src/commons/interfaces";
import Constants from "@src/constants";
import UserService from "@src/services/identity/UserService";
import { useEffect, useMemo, useState } from "react";
import { LoadingModal } from "../../Loading";
import Modal from "../Modal";

export const ModalSearchUserByOrganization = ({
    visibled,
    userIds,
    isSingle,
    titleModal,
    setVisibled,
    onAction,
}: {
    visibled: boolean;
    isSingle?: boolean;

    userIds: string[];
    titleModal?: string;

    setVisibled: React.Dispatch<React.SetStateAction<boolean>>;
    onAction: (data: IUser[]) => void;
}) => {
    const { userInfo, clientId, onError } = useCommonComponentContext();

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
        if (isSingle) {
            return "Chọn";
        } else {
            return `${"Chọn"} ${dataSelect.length > 0 ? dataSelect.length : ""}`;
        }
    }, [isSingle, dataSelect.length]);

    const getPaged = async (newReq?: any) => {
        try {
            setLoading(true);

            const pageSize = Constants.ROW_PER_PAGE;
            const pageNumber = Helpers.getPageNumber(newReq?.pageNumber || 1, pageSize, newReq?.totalCount || 0) || 1;

            const newQuery = {
                pageSize: pageSize,
                pageNumber: pageNumber,
                selectedUserIds: userIds,
                searchText: newReq?.searchText || undefined,
                organizationId: userInfo?.userProfile?.organizationId || "0",
            };

            if (!Helpers.isNullOrEmpty(userIds) && userIds.length > 0) newQuery.selectedUserIds = userIds;

            const result = await UserService.getPagedUserByOrganization(newQuery);

            setDataRows(result.items || []);
            setDataSelect(result.selectedItems || []);

            setRequestGetPaged({
                totalCount: result?.totalCount,
                pageNumber: result?.currentPage,
                searchText: newQuery?.searchText,
            });
        } catch (error) {
            console.log({ error });
            // const err = Helpers.handleException(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectedById = (item: any) => {
        let newData = [...(dataSelect || [])];

        const indexTemp = dataSelect?.findIndex((el) => el.id === item.id);

        if (isSingle) {
            if (indexTemp === -1) {
                newData = [item];
            } else {
                newData = [];
            }
        } else {
            if (indexTemp === -1) {
                newData.push(item);
            } else {
                newData.splice(indexTemp, 1);
            }
        }
        setDataSelect(newData);
    };

    return (
        <Modal
            fullWidth
            maxWidth="md"
            visible={visibled}
            hasActionButton
            buttonAction={textButtonAction}
            title={"Người dùng" || titleModal}
            onClose={() => setVisibled(false)}
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
                        placeholder={"TÌm kiếm"}
                        value={requestGetPaged?.searchText || ""}
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
                                Không có dữ liệu
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
                                            ":hover": {
                                                cursor: "pointer",
                                                backgroundColor: "#dddddd",
                                            },
                                        }}
                                    >
                                        <CheckBox checked={dataSelect?.findIndex((el) => el.id === item.id) !== -1} />

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
                                            <Typography variant="button" fontWeight="bold">
                                                {`${item?.organizationUserProfile?.lastName || ""} ${item?.organizationUserProfile?.firstName || ""}`.trim() ||
                                                    item?.fullName ||
                                                    "No Name"}
                                            </Typography>
                                            {item?.organizationUserProfile?.phoneNumber && (
                                                <Typography variant="button" color="secondary">
                                                    {"sđt"}:&nbsp;{item?.organizationUserProfile?.phoneNumber}
                                                </Typography>
                                            )}
                                            {item?.organizationUserProfile?.email && (
                                                <Typography variant="button" color="secondary">
                                                    {"email"}:&nbsp;{item?.organizationUserProfile?.email}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                            <Box mt={2}>
                                <CustomPagination
                                    rowsPerPageOptions={[20]}
                                    pageSize={Constants.ROW_PER_PAGE}
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

export default ModalSearchUserByOrganization;
