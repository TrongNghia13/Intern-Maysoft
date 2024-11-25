import { Avatar, Box, CheckBox, FormField, Modal, Typography, useCommonComponentContext } from "@maysoft/common-component-react";
import { Close, Search } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import Helpers from "@src/commons/helpers";
import { IUser } from "@src/commons/interfaces";
import { useEffect, useMemo, useState } from "react";
import { LoadingModal } from "../../Loading";

export const ModalSearchUserLocal = ({
    visibled,
    userIds,
    isSingle,
    titleModal,
    maxUsers,
    data,
    setVisibled,
    onAction,
}: {
    visibled: boolean;
    isSingle?: boolean;

    maxUsers: number;
    userIds: string[];
    data: IUser[];
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
    }, [visibled, userIds, data]);

    const getPaged = (newReq: any) => {
        setDataRows(data);
        setDataSelect(data.filter((el) => userIds.includes(el.id)));
        setRequestGetPaged({
            ...newReq,
        });
    };

    const textButtonAction = useMemo(() => {
        if (isSingle) {
            return `Chọn)`;
        } else {
            return `${"Chọn"} (${dataSelect.length}/${maxUsers}`;
        }
    }, [isSingle, dataSelect.length, maxUsers]);

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
        if (newData.length > maxUsers) return;

        setDataSelect(newData);
    };

    const filteredData = useMemo(() => {
        if (Helpers.isNullOrEmpty(requestGetPaged?.searchText)) return dataRows;
        return dataRows.filter((item) =>
            Helpers.removeVietnameseTones(item?.organizationUserProfile?.firstName).includes(requestGetPaged?.searchText || "")
        );
    }, [dataRows, requestGetPaged?.searchText]);

    const disabled = useMemo(() => dataSelect.length >= maxUsers, [dataSelect, maxUsers]);

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
            disabledActionButton={!disabled}
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
                    ) : filteredData.length === 0 ? (
                        <Box sx={{ textAlign: "center" }}>
                            <Typography variant="button" color="secondary">
                                Không có dữ liệu
                            </Typography>
                        </Box>
                    ) : (
                        <Box>
                            <Box>
                                {filteredData.map((item) => {
                                    const checked = dataSelect?.findIndex((el) => el.id === item.id) !== -1;

                                    return (
                                        <Box
                                            key={item.id}
                                            onClick={() => handleSelectedById(item)}
                                            sx={{
                                                padding: "8px",
                                                display: "flex",
                                                flexWrap: "wrap",
                                                borderRadius: "8px",
                                                marginBottom: "8px",
                                                alignItems: "center",
                                                border: "1px #dddddd solid",
                                                ...((!disabled || checked) && {
                                                    ":hover": {
                                                        cursor: "pointer",
                                                        backgroundColor: "#dddddd",
                                                    },
                                                }),

                                                ...(disabled &&
                                                    !checked && {
                                                        backgroundColor: "#f3f3f3",
                                                    }),
                                            }}
                                        >
                                            <CheckBox checked={checked} />

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
                                    );
                                })}
                            </Box>
                            {/* <Box mt={2}>
                                <CustomPagination
                                    rowsPerPageOptions={[20]}
                                    pageSize={Constants.ROW_PER_PAGE}
                                    page={requestGetPaged?.pageNumber || 1}
                                    total={requestGetPaged?.totalCount || 0}
                                    onChangePage={(value) => {
                                        getPaged({ ...requestGetPaged, pageNumber: value });
                                    }}
                                />
                            </Box> */}
                        </Box>
                    )}
                </Box>
            </>
        </Modal>
    );
};

export default ModalSearchUserLocal;
