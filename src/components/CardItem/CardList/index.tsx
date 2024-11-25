import { Box, Typography } from "@maysoft/common-component-react";
import { useTranslation } from "react-i18next";

export const CardList = <T, IP>({
    data,
    loading,
    emptyComponent: EmptyComponent,
    cardItem: CardItem,
    cardItemProps,
    skeletonComponent: SkeletonComponent,
    numberOfSkeleton = 5
}: {
    data: T[];
    loading: boolean;
    emptyComponent?: React.FC;
    cardItemProps: IP;
    cardItem: React.FunctionComponent<IP>;
    skeletonComponent: React.FC;
    numberOfSkeleton?: number;
}) => {
    const { t } = useTranslation("common");

    if (loading)
        return (
            <Box display="grid" gap={2}>
                {Array(numberOfSkeleton)
                    .fill(0)
                    .map((_, key) => (
                        <SkeletonComponent key={key} />
                    ))}
            </Box>
        );

    if (data.length === 0)
        return EmptyComponent ? (
            <EmptyComponent />
        ) : (
            <Box
                sx={{
                    height: "150px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Typography color="secondary" variant="h4">
                    {t("no_data")}
                </Typography>
            </Box>
        );

    return (
        <Box display="grid" gap={2}>
            {data.map((item, key) => (
                <CardItem key={key} {...cardItemProps} item={item} />
            ))}
        </Box>
    );
};

export default CardList;
