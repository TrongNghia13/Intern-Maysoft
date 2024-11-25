import { Box } from "@maysoft/common-component-react";
import React, { useEffect, useMemo, useState } from "react";

import Helpers from "@src/commons/helpers";

import { IUser } from "@src/commons/interfaces";
import Constants from "@src/constants";
import UserService from "@src/services/identity/UserService";
import { RootState } from "@src/store";
import { useSelector } from "react-redux";
import UserChips from "./UserChips";

type IProps = (
    | {
          users: IUser[];
      }
    | {
          userIds: string[];
      }
) & {
    isOutPolicy?: boolean;
    loading?: boolean;
};

export interface IUserData {
    hidden: IUser[];
    display: IUser[];
}

export const UserList: React.FC<IProps> = (props) => {
    const isOutPolicy = props.isOutPolicy;

    const [users, setUsers] = useState<IUser[]>("users" in props ? props.users : []);
    const [loading, setLoading] = useState<boolean>(false);
    const { users: usersProps, userIds: userIdsProps } = props as { users?: IUser[]; userIds?: string[] };

    const isApiFetch = "userIds" in props;

    const userInfo = useSelector((state: RootState) => state.userInfo.userProfile);

    const numberOfSkeleton = isApiFetch ? props.userIds.length : props.users.length;

    useEffect(() => {
        if ("userIds" in props) {
            getPaged(userIdsProps || []);
        }
        if ("users" in props) {
            setUsers(usersProps || []);
        }
    }, [usersProps, userIdsProps]);

    const getPaged = async (userIds: string[]) => {
        try {
            setLoading(true);

            const pageNumber = 1;

            const newQuery = {
                pageSize: userIds.length,
                pageNumber: pageNumber,

                listStatus: [1],
                selectedIds: userIds,
                searchText: undefined,

                clientId: Constants.CLIENT_ID,
                organizationId: userInfo?.organizationId || "0",
            };

            if (!Helpers.isNullOrEmpty(userIds) && userIds.length > 0) newQuery.selectedIds = userIds;

            const result = await UserService.getPaged(newQuery);

            setUsers(result.selectedItems || []);
        } catch (error) {
            console.log({ error });
            // const err = Helpers.handleException(error);
        } finally {
            setLoading(false);
        }
    };

    const userData = useMemo(() => {
        const newUsers = [...users];
        const maximunUserDisplay = Math.min(users.length, 6);
        return {
            hidden: newUsers.splice(maximunUserDisplay) || [],
            display: newUsers,
        };
    }, [users]);

    return (
        <Box display="flex" alignItems="center" gap={1}>
            <UserChips {...{ isOutPolicy, loading: isApiFetch ? loading : props.loading || false, numberOfSkeleton, userData }} />
        </Box>
    );
};

export default UserList;

{
    /* <Tooltip title={fullName}>
                        <Avatar
                            text={fullName}
                            src={user?.avatarUrl}
                            style={{
                                width: "35px",
                                height: "35px",
                            }}
                        />
                    </Tooltip> */
}
