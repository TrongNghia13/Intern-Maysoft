import { Box, Typography } from "@maysoft/common-component-react";
import { ConfirmStatus } from "@src/commons/enum";
import { useMemo } from "react";

export const ConfirmStatusText = ({ status }: { status: ConfirmStatus }) => {
    const text = useMemo(() => {
        if (status === ConfirmStatus.Completed) return "Đã duyệt";
        if (status === ConfirmStatus.Rejected) return "Đã hủy";
        return "Chờ phê duyệt";
    }, [status]);

    return (
        <Box
            sx={(theme) => {
                const {
                    palette: { info, warning, error },
                } = theme;
                const getColor = (status: ConfirmStatus) => {
                    if (status === ConfirmStatus.Processing) return warning;
                    if (status === ConfirmStatus.Completed) return info;
                    if (status === ConfirmStatus.Rejected) return error;
                    return warning;
                };
                return {
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    border: `1px solid ${getColor(status).main}`,
                    backgroundColor: getColor(status).main,
                };
            }}
        >
            <Typography color="white" variant="caption">
                {text}
            </Typography>
        </Box>
    );
};

export default ConfirmStatusText;