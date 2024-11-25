import { Box, Typography, useCommonComponentContext } from "@maysoft/common-component-react";
import { useEffect, useMemo, useState } from "react";

import { Close } from "@mui/icons-material";
import Helpers from "@src/commons/helpers";
import { IItineraryDetail } from "@src/commons/interfaces";
import Constants from "@src/constants";
import UserService from "@src/services/identity/UserService";
import RequestV2Service, { ILog, IReponseGetByCondition } from "@src/services/maywork/RequestV2.service";
import { LoadingModal } from "../Loading";
import { Popper } from "../Popper";

///
export enum TargetType {
    User = 1,
    Role = 4,
    Group = 2,
}

type IMembers = Map<string, { id: string; fullName: string; avatarUrl: string }>;
type IData = Map<string, IReponseGetByCondition[]>;

const ApprovalInfoTooltip = ({ itineraryDetail, anchorEl }: { itineraryDetail: IItineraryDetail[]; anchorEl: HTMLButtonElement | null }) => {
    const { userInfo } = useCommonComponentContext();

    const organizationId = userInfo?.userProfile?.organizationId || "0";

    const openMoreMenu = Boolean(anchorEl);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [data, setData] = useState<IData>(new Map());
    const [members, setMembers] = useState<IMembers>(new Map());

    useEffect(() => {
        const getMapUserProfileByListID = async (ids: string[], organizationId: string) => {
            try {
                const result = await UserService.getPaged({
                    pageNumber: 1,
                    pageSize: ids.length,
                    listStatus: [1],
                    selectedIds: ids,
                    clientId: Constants.CLIENT_ID,
                    organizationId: organizationId,
                });

                const newData: IMembers = new Map();

                [...(result.selectedItems || [])].forEach((el) => {
                    let fullName = el.fullName || el.userName;
                    if (
                        !Helpers.isNullOrEmpty(el.organizationUserProfile?.firstName) ||
                        !Helpers.isNullOrEmpty(el.organizationUserProfile?.lastName)
                    ) {
                        fullName = `${el.organizationUserProfile?.lastName || ""} ${el.organizationUserProfile?.firstName || ""}`;
                    }

                    newData.set(el.id, {
                        id: el.id,
                        fullName: fullName,
                        avatarUrl: el.avatarUrl,
                    });
                });

                return newData;
            } catch (error) {
                return new Map();
            }
        };

        const addMemberIds = (userId: string, members: string[]) => {
            if (members.includes(userId)) return;
            members.push(userId);
        };

        const getData = async () => {
            try {
                setIsLoading(true);

                const memberId: string[] = [];
                const targetIds: string[] = [];

                for (const item of [...(itineraryDetail || [])]) {
                    if (!targetIds.includes(item.id)) targetIds.push(item.id);
                    for (const el of [...(item.itineraryMembers || [])]) {
                        addMemberIds(el.userId, memberId);
                    }
                }

                const result = await RequestV2Service.getByCondition({
                    permission: 8,
                    targetIds: targetIds,
                });

                const valuesOfResult: IReponseGetByCondition[] = targetIds
                    .map((el) => result[el])
                    .filter((el) => el)
                    .flat();

                const convertData: Map<string, IReponseGetByCondition[]> = new Map();

                for (const request of valuesOfResult) {
                    if (convertData.has(request.targetId)) {
                        convertData.set(request.targetId, [...(convertData.get(request.targetId) || []), request]);
                    } else {
                        convertData.set(request.targetId, [request]);
                    }

                    if (Helpers.isNullOrEmpty(request?.stakeHolders)) continue;

                    for (const stakeHolder of request.stakeHolders) {
                        if (stakeHolder.stakeholderType === TargetType.Role) {
                            addMemberIds(stakeHolder.userId, memberId);
                        }

                        if (stakeHolder.stakeholderType === TargetType.Group) {
                            addMemberIds(stakeHolder.userId, memberId);
                        }

                        if (stakeHolder.stakeholderType === TargetType.User) {
                            addMemberIds(stakeHolder.stakeholderId, memberId);
                        }
                    }
                }

                if (memberId.length > 0) {
                    const newDataMember = await getMapUserProfileByListID(memberId, organizationId);
                    setMembers(newDataMember);
                }
                setData(convertData);
            } catch (error) {
                console.log({ error });
            } finally {
                setIsLoading(false);
            }
        };

        if (openMoreMenu && itineraryDetail?.length > 0) getData();
    }, [openMoreMenu, organizationId, itineraryDetail]);

    return (
        <Popper anchorEl={anchorEl}>
            <>
                {isLoading && <LoadingModal height="100px" />}

                {!isLoading && (
                    <>
                        <TableHeader />
                        <TableBody data={data} members={members} itineraryDetail={itineraryDetail} />
                    </>
                )}
            </>
        </Popper>
    );
};

const TableHeader = () => {
    return (
        <Box
            display="grid"
            gridTemplateColumns="repeat(3, 1fr)"
            sx={{
                borderBottom: "1px solid #9F9F9F",
                p: 1.25,
            }}
            gap={1}
        >
            <TableCell mode="header">Người chờ duyệt</TableCell>
            <TableCell mode="header">Người duyệt</TableCell>
            <TableCell mode="header" textAlign="center">
                Trạng thái
            </TableCell>
        </Box>
    );
};

const TableBody = ({ data, itineraryDetail, members }: { data: IData; itineraryDetail: IItineraryDetail[]; members: IMembers }) => {
    const staffMembers = useMemo(() => {
        const result = itineraryDetail.map((el) => el.itineraryMembers);
        return result.flat();
    }, [itineraryDetail]);

    return (
        <>
            {Array.from(data.values())
                .flat()
                .map((el) => {
                    if (Helpers.isNullOrEmpty(el?.stakeHolders)) return null;

                    const staffId = staffMembers.find((member) => member.id === el.dataId)?.userId || "";
                    const staff = members.get(staffId);

                    return el.stakeHolders.map((stakeHolder) => {
                        const approveId = stakeHolder.userId || "";
                        const approve = members.get(approveId);

                        return (
                            <Box
                                display="grid"
                                gridTemplateColumns="repeat(3, 1fr)"
                                p={1.25}
                                gap={1}
                                key={el.id}
                                sx={{
                                    borderBottom: "1px solid #E4EBF7",
                                }}
                            >
                                <TableCell>{staff?.fullName}</TableCell>
                                <TableCell>{approve?.fullName}</TableCell>
                                <StatusBox logs={el.logs || []} userId={stakeHolder.userId} />
                            </Box>
                        );
                    });
                })}
        </>
    );
};

const getStatus = (logs: ILog[], userId: string) => {
    const isWaiting = [...(logs || [])].length === 0;
    const itemLog = [...(logs || [])].find((e) => e.stakeholder === userId);
    const isReject = itemLog && itemLog.requestStatus < 0 && itemLog.requestStatus !== -3;
    const isApproved = itemLog && itemLog.requestStatus % 10 === 0;

    return { isWaiting, isReject, isApproved };
};

const StatusBox = ({ logs, userId }: { logs: ILog[]; userId: string }) => {
    const { isWaiting, isReject, isApproved } = getStatus(logs, userId);
    if (isWaiting)
        return (
            <Box display="flex" gap={1} alignItems={"center"} justifyContent={"center"}>
                <WaitingIcon />
                <Typography
                    sx={({ palette: { warning } }) => ({
                        color: warning.main,
                        fontWeight: 500,
                        fontSize: Constants.FONT_SIZE.SMALL_TEXT,
                    })}
                >
                    {"Chờ duyệt"}
                </Typography>
            </Box>
        );

    if (isReject)
        return (
            <Box display="flex" gap={1} alignItems={"center"} justifyContent={"center"}>
                <Close
                    sx={{
                        color: "#B71D18",
                    }}
                />
                <Typography
                    sx={{
                        color: "#B71D18",
                        fontWeight: 500,
                        fontSize: Constants.FONT_SIZE.SMALL_TEXT,
                    }}
                >
                    {"Từ chối"}
                </Typography>
            </Box>
        );

    if (isApproved)
        return (
            <Box display="flex" gap={1} alignItems={"center"} justifyContent={"center"}>
                <ApprovalIcon />
                <Typography
                    sx={{
                        color: "#0F8D57",
                        fontWeight: 500,
                        fontSize: Constants.FONT_SIZE.SMALL_TEXT,
                    }}
                >
                    {"Đã duyệt"}
                </Typography>
            </Box>
        );

    return <></>;
};

const WaitingIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M8.66671 4H7.33337V4.66667C7.33337 4.84348 7.40361 5.01305 7.52864 5.13807C7.65366 5.2631 7.82323 5.33333 8.00004 5.33333C8.17685 5.33333 8.34642 5.2631 8.47145 5.13807C8.59647 5.01305 8.66671 4.84348 8.66671 4.66667V4Z"
            fill="#FBA400"
        />
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M4 1.33325V2.66659H4.66667V4.66659C4.66667 5.55064 5.01786 6.39849 5.64298 7.02361C6.2681 7.64873 7.11595 7.99992 8 7.99992C7.11595 7.99992 6.2681 8.35111 5.64298 8.97623C5.01786 9.60135 4.66667 10.4492 4.66667 11.3333V13.3333H4V14.6666H12V13.3333H11.3333V11.3333C11.3333 10.4492 10.9821 9.60135 10.357 8.97623C9.7319 8.35111 8.88406 7.99992 8 7.99992C8.43774 7.99992 8.87119 7.9137 9.27561 7.74618C9.68003 7.57867 10.0475 7.33314 10.357 7.02361C10.6666 6.71408 10.9121 6.34662 11.0796 5.9422C11.2471 5.53778 11.3333 5.10433 11.3333 4.66659V2.66659H12V1.33325H4ZM6 2.66659H10V4.66659C10 5.19702 9.78929 5.70573 9.41421 6.0808C9.03914 6.45587 8.53043 6.66659 8 6.66659C7.46957 6.66659 6.96086 6.45587 6.58579 6.0808C6.21071 5.70573 6 5.19702 6 4.66659V2.66659ZM6 11.3333V13.3333H10V11.3333C10 10.8028 9.78929 10.2941 9.41421 9.91904C9.03914 9.54397 8.53043 9.33325 8 9.33325C7.46957 9.33325 6.96086 9.54397 6.58579 9.91904C6.21071 10.2941 6 10.8028 6 11.3333Z"
            fill="#FBA400"
        />
    </svg>
);

const ApprovalIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.66667 10.9334L4 8.26675L4.93333 7.33341L6.66667 9.06675L11.0667 4.66675L12 5.60008L6.66667 10.9334Z" fill="#0F8D57" />
    </svg>
);

const TableCell = ({
    mode = "body",
    textAlign,
    children,
}: {
    mode?: "header" | "body";
    children: string | undefined;
    textAlign?: "right" | "left" | "center";
}) => (
    <Box>
        <Typography
            sx={{
                color: mode === "body" ? "1C252E" : "#637381",
                fontWeight: 500,
                fontSize: Constants.FONT_SIZE.SMALL_TEXT,
                textAlign,
            }}
        >
            {children}
        </Typography>
    </Box>
);

export default ApprovalInfoTooltip;
