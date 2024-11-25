import { FormField, Typography } from "@maysoft/common-component-react";
import { Grid } from "@mui/material";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { Mode } from "@src/commons/enum";
import { IItinerary, IUser } from "@src/commons/interfaces";
import { IItineraryError } from "@src/hooks/trips/useTrips";

interface IProps {
    mode: Mode;
    data: IItinerary;
    error: IItineraryError;
    users: IUser[];

    loading: boolean;
    onChangeValue: (value: string, key: keyof IItinerary) => void;
    onCancel: () => void;
    onSubmit: () => void;

    onChangeUsers: (data: IUser[]) => void;
    onRemoveUser: (data: IUser) => void;
}

const FormInput: React.FC<IProps> = ({ mode, data, error, loading, onChangeValue, onCancel, onSubmit, users, onChangeUsers, onRemoveUser }) => {
    const { t } = useTranslation(["tripbooking", "common"]);

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Typography
                    sx={{
                        color: "#637381",
                        fontWeight: 500,
                        fontSize: "0.875rem",
                    }}
                >
                    {"Nhập tên và thông tin gợi nhớ cho chuyến đi của bạn"}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <FormField
                    required
                    isFullRow
                    mode={mode}
                    variant="outlined"
                    value={data?.name || ""}
                    errorMessage={error?.name}
                    label={t("tripbooking:trip_name")}
                    placeholder={t("trip_name_enter")}
                    onChangeValue={(value) => onChangeValue(value, "name")}
                />
            </Grid>

            <Grid item xs={12}>
                <FormField
                    isFullRow
                    multiline
                    minRows={3}
                    mode={mode}
                    variant="outlined"
                    value={data?.description || ""}
                    errorMessage={error?.description}
                    label={t("tripbooking:description")}
                    placeholder={t("tripbooking:enter_description")}
                    onChangeValue={(value) => onChangeValue(value, "description")}
                />
            </Grid>

            {/* User */}

            {/* <Grid item xs={12}>
                {mode !== Mode.View && (
                    <FormField
                        value=""
                        variant="outlined"
                        // errorMessage={errUserIds}
                        placeholder={t("tripbooking:add_participants_trip")}
                        onClick={() => setVisibled(true)}
                        InputProps={{ startAdornment: <PersonAddOutlined color="secondary" /> }}
                    />
                )}

                {visibled && (
                    <ModalSearchUserByOrganization visibled={visibled} setVisibled={setVisibled} userIds={userIds || []} onAction={(data) => onChangeUsers(data)} />
                )}

                {mode === Mode.View && (
                    <Typography variant="button" fontWeight="bold">
                        {t("tripbooking:participants")}:
                    </Typography>
                )}
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        mt: 1,
                        gap: 1,
                    }}
                >
                    {(users || [])?.map((el, index) => (
                        <Box
                            key={index}
                            sx={{
                                px: 1,
                                py: 0.5,
                                display: "flex",
                                borderRadius: 4,
                                alignItems: "center",
                                border: "1px solid #ddd",
                                justifyContent: "space-between",
                                gap: 1,
                            }}
                        >
                            <Avatar
                                text={el?.organizationUserProfile?.firstName}
                                // src={Helpers.getFileAccessUrl(el.avatarId)}
                                src={el?.avatarUrl}
                                style={{
                                    width: "25px",
                                    height: "25px",
                                }}
                            />

                            <Typography
                                variant="button"
                                fontWeight="bold"
                                sx={{
                                    overflow: "hidden",
                                    whiteSpace: "nowrap",
                                    textOverflow: "ellipsis",
                                    width: { xs: "100px", sm: "auto" },
                                }}
                            >
                                {`${el?.organizationUserProfile?.lastName || ""} ${el?.organizationUserProfile?.firstName || ""}`}
                            </Typography>

                            {mode !== Mode.View && (
                                <IconButton onClick={() => onRemoveUser(el)}>
                                    <Close fontSize="small" />
                                </IconButton>
                            )}
                        </Box>
                    ))}
                </Box>
            </Grid> */}
        </Grid>
    );
};

export default FormInput;
