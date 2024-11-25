import { Box, Typography } from "@maysoft/common-component-react";

import { Tooltip } from "@mui/material";
import SkeletonDummy from "./SkeletonDummy";
import UserItem from "./UserItem";
import { IUserData } from "./UserList";

const UserChips = ({
    userData,
    isOutPolicy,
    loading,
    numberOfSkeleton,
}: {
    userData: IUserData;
    isOutPolicy?: boolean;
    loading: boolean;
    numberOfSkeleton: number;
}) => {
    return (
        <Box display="flex" alignItems="center" gap={1}>
            {loading && <SkeletonDummy numberOfSkeleton={numberOfSkeleton} />}

            {!loading &&
                userData.display.length > 0 &&
                userData.display.map((user) => {
                    return <UserItem {...{ user, isOutPolicy }} />;
                })}
            {userData.hidden.length > 0 && (
                <Tooltip
                    title={userData?.hidden
                        .map((el) => `${el?.organizationUserProfile?.lastName || ""} ${el?.organizationUserProfile?.firstName || ""}`.trim())
                        .join(", ")}
                >
                    <Typography variant="caption" fontWeight="medium">
                        {userData.hidden.length}+
                    </Typography>
                </Tooltip>
            )}
        </Box>
    );
};

export default UserChips;
