import { Box } from "@maysoft/common-component-react";
import { Fragment } from "react";

import { Skeleton } from "@mui/material";

export const SkeletonDummy = ({ numberOfSkeleton }: { numberOfSkeleton: number }) => {
    return (
        <Fragment>
            {Array(numberOfSkeleton)
                .fill(0)
                .map((_, index) => (
                    <Box key={index}>
                        <Skeleton variant="rounded" width={100} height={35} sx={{ borderRadius: 50 }} />
                    </Box>
                ))}
        </Fragment>
    );
};

export default SkeletonDummy;
