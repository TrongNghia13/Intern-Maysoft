import Helpers from "@src/commons/helpers";
import { IUser } from "@src/commons/interfaces";
import Constants from "@src/constants";
import UserService from "@src/services/identity/UserService";
import { RootState } from "@src/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const useUsers = ({ userIds }: { userIds: string[] }) => {
    const userProfile = useSelector((state: RootState) => state.userInfo.userProfile);
    const [users, setUsers] = useState<IUser[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const getPaged = async (userIds: string[]) => {
            try {
                if (userIds.length === 0) return;
                setLoading(true);
                const pageNumber = 1;

                const newQuery = {
                    pageSize: userIds.length,
                    pageNumber: pageNumber,

                    listStatus: [1],
                    selectedIds: userIds,
                    searchText: undefined,

                    clientId: Constants.CLIENT_ID,
                    organizationId: userProfile?.organizationId || "0",
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
        getPaged(userIds);
    }, [userIds]);

    return { users, loading };
};

export default useUsers;
