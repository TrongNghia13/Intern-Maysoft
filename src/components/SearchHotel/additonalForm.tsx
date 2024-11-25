import { Box, Button, FormField, Typography } from "@maysoft/common-component-react";
import { Divider, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";

import { Add, AddOutlined, Remove } from "@mui/icons-material";
import { Mode, SearchHotelComponentMode } from "@src/commons/enum";
import { IOccupancy } from "@src/commons/interfaces";
import { typographyStyles } from "@src/styles/commonStyles";
import { InputNumber } from "../InputNumber";
import { UserList } from "../UserList";

interface IProps {
    data: IOccupancy[];
    onChangeValue: (value: number, key: keyof IOccupancy, index: number, subIndex?: number) => void;
    handleAddUserToRoom: (index: number) => void;
    mode: SearchHotelComponentMode;
}

const MAX_ROOM = 10;
const MAX_ADULTS = 14;
const MAX_CHILD = 6;

const AdditionalForm: React.FC<IProps> = ({ data, mode, onChangeValue, handleAddUserToRoom }) => {
    const { t } = useTranslation(["common", "search_hotel"]);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                p: 2,
            }}
        >
            {data.map((item, index) => (
                <Box key={index} display="flex" flexDirection="column" gap={0.5}>
                    <Typography sx={(theme) => typographyStyles(theme, { fontWeight: 600 })}>
                        {t("rooms")} {index + 1}
                    </Typography>

                    {mode === SearchHotelComponentMode.Corporate && (
                        <AdditionalItem title={t("Thành viên")} userIds={item.userIds || []}>
                            <Box>
                                <Button
                                    variant="outlined"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleAddUserToRoom(index);
                                    }}
                                >
                                    <AddOutlined />
                                </Button>
                            </Box>
                        </AdditionalItem>
                    )}

                    {mode === SearchHotelComponentMode.Normal && (
                        <>
                            <AdditionalItem title={t("search_hotel:adults")} description={t("search_hotel:ages_18_or_above")}>
                                <InputNumber
                                    mode={Mode.Create}
                                    value={item.adultSlot}
                                    onChangeValue={(value) => onChangeValue(value, "adultSlot", index)}
                                    min={1}
                                    max={MAX_ADULTS}
                                />
                            </AdditionalItem>
                            <AdditionalItem title={t("search_hotel:children")} description={t("search_hotel:ages_0_17")}>
                                <InputNumber
                                    mode={Mode.Create}
                                    value={item.childrenOld.length}
                                    onChangeValue={(value) => onChangeValue(value, "childrenOld", index)}
                                    min={0}
                                    max={MAX_CHILD}
                                />
                            </AdditionalItem>
                            <Grid container spacing={2} my={0.5}>
                                {item.childrenOld.map((child, key) => (
                                    <Grid item xs={4}>
                                        <FormField
                                            // type="number"
                                            variant="outlined"
                                            label={t("age_of_child", { index: key + 1 })}
                                            // data={childOldData}
                                            defaultValue={child}
                                            onBlur={(value) =>
                                                onChangeValue(Number(value) > 17 ? 17 : Number(value) < 1 ? 1 : value, "childrenOld", index, key)
                                            }
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </>
                    )}
                    {data.length > 1 && (
                        <Box display="flex" justifyContent="right">
                            <Button
                                color="error"
                                variant="outlined"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onChangeValue(1, "adultSlot", index, -999);
                                }}
                            >
                                <Remove /> &nbsp; {t("remove")}
                            </Button>
                        </Box>
                    )}
                    <Divider />
                </Box>
            ))}
            <Button disabled={data.length === MAX_ROOM} variant="outlined" onClick={() => onChangeValue(1, "adultSlot", -1)}>
                <Add /> &nbsp; {t("add_new_room")}
            </Button>
        </Box>
    );
};

const AdditionalItem = ({
    title,
    description,
    children,
    userIds,
}: {
    title: string;
    description?: string;
    userIds?: string[];
    children: JSX.Element;
}) => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                gap: 2,
            }}
        >
            <Box display="flex" flexDirection="column">
                <Typography variant="caption" fontWeight="medium" mb={userIds ? 1 : 0}>
                    {title}
                </Typography>
                {userIds && <UserList userIds={userIds || []} />}
                {description && (
                    <Typography variant="caption" color="secondary">
                        {description}
                    </Typography>
                )}
            </Box>
            {children}
        </Box>
    );
};
export default AdditionalForm;
