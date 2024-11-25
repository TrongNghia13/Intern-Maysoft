import { Avatar, Box, Button, CheckBox, FormField, Typography, useCommonComponentContext } from "@maysoft/common-component-react";
import { CircularProgress } from "@mui/material";
import { Theme } from "@mui/material/styles/createTheme";
import { useEffect, useMemo, useState } from "react";

import Helpers from "@src/commons/helpers";
import UserService from "@src/services/identity/UserService";

import { ConfirmStatus } from "@src/commons/enum";
import { IInput } from "@src/commons/interfaces";
import { IRecordRequestV2Members } from "@src/hooks/useDataRequestApproveReject.hook";
import Modal from "../Modal";

type IMembersProfile = IRecordRequestV2Members & {
    confirmStatus?: number;
    userProfile: {
        email?: string;
        identityId?: string;
        fullName?: string;
        avatarId?: string;
        avatarUrl?: string;
        phoneNumber?: string;
    };
};

export const ModalApproveRejectItineraryDetail = ({
    visibled,
    typePopup,
    setVisibled,
    redirectUrl,
    dataItineraryMembers,
    onReject,
    onApprove,
}: {
    visibled: boolean;
    typePopup: "approve" | "reject";
    setVisibled: React.Dispatch<React.SetStateAction<boolean>>;

    redirectUrl: string;
    dataItineraryMembers: IRecordRequestV2Members[];

    onReject: (data: any) => void;
    onApprove: (data: any) => void;
}) => {
    const { userInfo, clientId } = useCommonComponentContext();

    const [loading, setLoading] = useState<boolean>(false);

    const [listUserIdSelected, setListUserIdSelected] = useState<string[]>([]);
    const [modalReason, setModalReason] = useState<{ open: boolean; reason?: IInput }>({ open: false });
    const [dataRows, setDataRows] = useState<Map<string, IMembersProfile>>(new Map()); //key = userId:, value = IMembersProfile;

    useEffect(() => {
        if (visibled) {
            const userIdsTemp: string[] = [];
            const userIdsSelectedTemp: string[] = [];
            const newDataMapTemp: Map<string, IMembersProfile> = new Map();

            for (const item of [...(dataItineraryMembers || [])]) {
                userIdsTemp.push(item?.userId);

                // if (![ConfirmStatus.Rejected, ConfirmStatus.Confirmed].includes(item?.confirmStatus || 0)) {
                userIdsSelectedTemp.push(item?.userId);
                // };

                if (!newDataMapTemp.has(item?.userId)) {
                    newDataMapTemp.set(item?.userId, item as any);
                }
            }

            setListUserIdSelected(userIdsSelectedTemp);

            if (userIdsTemp.length > 0) {
                getPaged({
                    userIds: userIdsTemp,
                    reqDataMap: newDataMapTemp,
                });
            }

            setModalReason({ open: false });
        }
    }, [visibled, dataItineraryMembers]);

    const dataFilter = useMemo(() => {
        const newDataConvert = Array.from(dataRows.values());
        const newDataFilter = newDataConvert.filter((el) => !Helpers.isNullOrEmpty(el?.userId)) || [];
        return newDataFilter;
    }, [dataRows]);

    const getPaged = async ({ userIds, reqDataMap }: { userIds: string[]; reqDataMap: Map<string, IMembersProfile> }) => {
        try {
            setLoading(true);

            const newQuery = {
                pageNumber: 1,
                pageSize: userIds.length,

                listStatus: [1],
                selectedIds: userIds,

                clientId: clientId,
                organizationId: userInfo?.userProfile?.organizationId || "0",
            };

            const result = await UserService.getPaged(newQuery);

            const newDataMap = new Map(reqDataMap);

            for (const item of [...(result?.selectedItems || [])]) {
                const itemTemp: any = newDataMap.get(item?.id);

                if (itemTemp.id) {
                    let fullName = item.fullName || item.userName;

                    if (
                        !Helpers.isNullOrEmpty(item.organizationUserProfile?.firstName) ||
                        !Helpers.isNullOrEmpty(item.organizationUserProfile?.lastName)
                    ) {
                        fullName = `${item.organizationUserProfile?.lastName || ""} ${item.organizationUserProfile?.firstName || ""}`;
                    }

                    newDataMap.set(item?.id, {
                        ...itemTemp,
                        userProfile: {
                            fullName: fullName,
                            identityId: item?.id,
                            avatarId: item?.avatarId,
                            avatarUrl: item?.avatarUrl,
                            email: item?.organizationUserProfile?.email,
                            phoneNumber: item?.organizationUserProfile?.phoneNumber,
                        },
                    });
                }
            }

            setDataRows(newDataMap);
        } catch (error) {
            const err = Helpers.handleException(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectedById = (userId: string) => {
        let newData = [...(listUserIdSelected || [])];

        const indexTemp = newData?.findIndex((str) => str === userId);

        if (indexTemp === -1) {
            newData.push(userId);
        } else {
            newData.splice(indexTemp, 1);
        }

        setListUserIdSelected(newData);
    };

    const handleApprove = () => {
        const newData: any[] = [];

        for (const item of dataItineraryMembers) {
            if (listUserIdSelected.includes(item.userId)) {
                newData.push({
                    dataId: item.id,
                    redirectUrl: redirectUrl,
                    requestDetail: undefined, // Hiện tại case này chưa có không cần gửi
                    criteria: {
                        name: "policyCompliance",
                        valueType: 8, // Enum CriteriaValueType loại Attribute
                        compareType: 2, //  Enum CompareType {   LessThan = 1,  Equal = 2, GreaterThan = 3 }
                        value: `${item.policyCompliance}`, // theo Enum của policyCompliance, phßải gửi string
                    },
                });
            }
        }

        onApprove({ datas: newData });
    };

    const handleReject = () => {
        if (Helpers.isNullOrEmpty(`${modalReason?.reason?.value || ""}`?.trim())) {
            setModalReason((prev) => ({
                ...prev,
                reason: { error: "Vui lòng nhập lý do từ chối!" },
            }));
        } else {
            const newData: any[] = [];

            for (const item of dataItineraryMembers) {
                if (listUserIdSelected.includes(item.userId)) {
                    newData.push({
                        dataId: item.id,
                        redirectUrl: redirectUrl,
                        requestDetail: undefined, // Hiện tại case này chưa có không cần gửi
                        criteria: {
                            name: "policyCompliance",
                            valueType: 8, // Enum CriteriaValueType loại Attribute
                            compareType: 2, //  Enum CompareType {   LessThan = 1,  Equal = 2, GreaterThan = 3 }
                            value: `${item.policyCompliance}`, // theo Enum của policyCompliance, phải gửi string
                        },
                    });
                }
            }

            onReject({
                datas: newData,
                reason: modalReason?.reason?.value,
            });

            setModalReason({ open: false });
        }
    };

    return (
        <>
            {modalReason?.open && (
                <Modal
                    fullWidth
                    maxWidth="sm"
                    hasActionButton
                    visible={modalReason?.open || false}
                    title={"Lý do từ chối"}
                    onClose={() => {
                        setModalReason({ open: false });
                    }}
                    onClickCloseIcon={() => {
                        setModalReason({ open: false });
                    }}
                    onAction={() => {
                        handleReject();
                    }}
                >
                    <Box padding={2}>
                        <FormField
                            multiline
                            minRows={3}
                            maxLength={500}
                            variant={"outlined"}
                            placeholder={"Nhập lý do từ chối"}
                            value={modalReason?.reason?.value || ""}
                            errorMessage={modalReason?.reason?.error}
                            error={!Helpers.isNullOrEmpty(modalReason?.reason?.error)}
                            onChangeValue={(value) => {
                                setModalReason((prev) => ({
                                    ...prev,
                                    reason: { value: value },
                                }));
                            }}
                        />
                    </Box>
                </Modal>
            )}

            <Modal
                fullWidth
                maxWidth="md"
                visible={visibled}
                title={"Thành viên tham gia"}
                onClose={() => {
                    setVisibled(false);
                }}
                onClickCloseIcon={() => {
                    setVisibled(false);
                }}
            >
                <Box
                    sx={{
                        padding: 2,
                        height: "50vh",
                        overflow: "auto",
                    }}
                >
                    <Box>
                        {loading && (
                            <Box
                                sx={{
                                    height: "40vh",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <CircularProgress />
                            </Box>
                        )}

                        {!loading && dataFilter.length === 0 && (
                            <Box sx={{ textAlign: "center" }}>
                                <Typography variant="button" color="secondary">
                                    Không có dữ liệu
                                </Typography>
                            </Box>
                        )}

                        {!loading && dataFilter.length > 0 && (
                            <Box>
                                {dataFilter.map((item) => (
                                    <Box
                                        key={item?.id}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (![ConfirmStatus.Rejected, ConfirmStatus.Confirmed].includes(item?.confirmStatus || 0)) {
                                                handleSelectedById(item?.userId);
                                            }
                                        }}
                                        sx={(theme: Theme) => {
                                            const {
                                                functions: { rgba },
                                                palette: { info },
                                            } = theme;
                                            const isDisable = [ConfirmStatus.Rejected, ConfirmStatus.Confirmed].includes(item?.confirmStatus || 0);
                                            return {
                                                gap: 1,
                                                padding: "8px",
                                                display: "flex",
                                                flexWrap: "wrap",
                                                borderRadius: "8px",
                                                marginBottom: "8px",
                                                alignItems: "center",
                                                border: "1px solid #c3c3c3",
                                                ":hover": {
                                                    border: `1.5px solid ${info.main}`,
                                                    backgroundColor: rgba(info.main, 0.1),
                                                    cursor: isDisable ? "default" : "pointer",
                                                },
                                                ...((listUserIdSelected.includes(item?.userId) || isDisable) && {
                                                    border: `1.5px solid ${info.main}`,
                                                    backgroundColor: rgba(info.main, 0.1),
                                                }),
                                                position: "relative",
                                            };
                                        }}
                                    >
                                        <CheckBox
                                            checked={listUserIdSelected.includes(item?.userId)}
                                            disabled={[ConfirmStatus.Rejected, ConfirmStatus.Confirmed].includes(item?.confirmStatus || 0)}
                                        />

                                        <Box
                                            sx={{
                                                gap: 1,
                                                display: "flex",
                                                flexWrap: "wrap",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Avatar
                                                src={item?.userProfile?.avatarUrl}
                                                style={{ border: "1px #dddddd solid" }}
                                                text={item?.userProfile?.fullName || item?.userProfile?.email || "No Name"}
                                            />

                                            <Box display="inline-grid">
                                                <Typography variant="button" fontWeight="bold">
                                                    {item?.userProfile?.fullName || item?.userProfile?.email || "No Name"}
                                                </Typography>
                                                {item?.userProfile?.phoneNumber && (
                                                    <Typography variant="button" color="secondary">
                                                        {"sđt"}:&nbsp;{item?.userProfile?.phoneNumber}
                                                    </Typography>
                                                )}
                                                {item?.userProfile?.email && (
                                                    <Typography variant="button" color="secondary">
                                                        {"email"}:&nbsp;{item?.userProfile?.email}
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Box>
                                        {[ConfirmStatus.Rejected, ConfirmStatus.Confirmed].includes(item?.confirmStatus || 0) && (
                                            <Box
                                                sx={{
                                                    right: 0,
                                                    top: "auto",
                                                    bottom: "auto",
                                                    position: "absolute",
                                                    padding: 2,
                                                }}
                                            >
                                                {ConfirmStatus.Rejected === item?.confirmStatus && (
                                                    <Typography variant="caption" color="warning" fontStyle="italic">
                                                        {"Đã phê duyệt"}
                                                    </Typography>
                                                )}
                                                {ConfirmStatus.Rejected === item?.confirmStatus && (
                                                    <Typography variant="caption" color="warning" fontStyle="italic">
                                                        {"Đã từ chối"}
                                                    </Typography>
                                                )}
                                            </Box>
                                        )}
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </Box>
                    <Box
                        sx={{
                            left: 0,
                            right: 0,
                            bottom: 0,
                            position: "absolute",
                        }}
                    >
                        <Box
                            sx={{
                                gap: 1,
                                padding: 2,
                                display: "flex",
                                flexWrap: "wrap",
                                alignItems: "center",
                                justifyContent: "end",
                            }}
                        >
                            {typePopup === "approve" && (
                                <Button
                                    color="info"
                                    disabled={listUserIdSelected.length === 0}
                                    onClick={() => {
                                        handleApprove();
                                    }}
                                >
                                    {"Phê duyệt"}
                                </Button>
                            )}
                            {typePopup === "reject" && (
                                <Button
                                    color="error"
                                    disabled={listUserIdSelected.length === 0}
                                    onClick={() => {
                                        setModalReason({ open: true });
                                    }}
                                >
                                    {"Từ chối"}
                                </Button>
                            )}
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default ModalApproveRejectItineraryDetail;
