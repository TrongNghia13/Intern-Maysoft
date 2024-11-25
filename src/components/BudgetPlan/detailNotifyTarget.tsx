import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Close, Search } from "@mui/icons-material";
import { FormControl, FormControlLabel, IconButton, RadioGroup } from "@mui/material";
import { Avatar, Box, FormField, ModalSearchUser, Typography, Radio, Autocomplete } from "@maysoft/common-component-react";

import Helpers from "@src/commons/helpers";

import { ICodename } from "@src/commons/interfaces";
import { Mode, NotifyTarget } from "@src/commons/enum";
import { ICreateUpdateBudget } from "@src/services/sale/BudgetService";


export interface IRecordUserProps {
    id: string;
    email?: string;
    userCode?: string;
    fullName?: string;
    avatarId?: string;
    avatarUrl?: string;
    phoneNumber?: string;
}

const RenderDetailNotifyTarget = ({
    mode,
    dataBudgetPlan,
    errorBudgetPlan,
    handleOnChangeValue,

    listGroup,
    listNotifyTarget,

    listTargetProfile,
    setListTargetProfile,
}: {
    mode: number,
    errorBudgetPlan: any;
    dataBudgetPlan: ICreateUpdateBudget;

    listGroup: ICodename[];
    listNotifyTarget: ICodename[];
    listTargetProfile: IRecordUserProps[];
    setListTargetProfile: React.Dispatch<React.SetStateAction<IRecordUserProps[]>>;

    handleOnChangeValue: (key: string, value: any) => void;
}) => {
    const {
        t,
        i18n: { language },
    } = useTranslation(["common", "setting"]);

    const listGroupId = useMemo(() => {
        const listId: string[] = [];
        dataBudgetPlan?.notifyTargetCustom?.forEach(el => {
            if (el.targetType === NotifyTarget.GroupAdmin) {
                el.targetId && listId.push(el.targetId);
            }
        });
        return listId;
    }, [dataBudgetPlan?.notifyTargetCustom]);

    const [openModalTarget, setOpenTarget] = useState<boolean>(false);

    return (
        <>
            <Box>
                <Box>
                    <Typography variant="button" fontWeight="bold">
                        {t("setting:budget.manager")}
                    </Typography>
                </Box>
                <FormControl
                    disabled={mode === Mode.View}
                    sx={{
                        ".MuiFormControlLabel-label": {
                            fontWeight: "400 !important",
                        }
                    }}
                >
                    <RadioGroup
                        name="radio-buttons-group"
                        aria-labelledby="radio-buttons-group-label"
                        value={
                            Helpers.isNullOrEmpty(dataBudgetPlan?.notifyTarget)
                                ? listNotifyTarget[0]?.code
                                : dataBudgetPlan?.notifyTarget
                        }
                        onChange={(event, value) => {
                            handleOnChangeValue("notifyTarget", Number(value));
                        }}
                    >
                        {listNotifyTarget?.map((item) => (
                            <FormControlLabel
                                key={item.code}
                                label={item.name}
                                value={item.code}
                                disabled={mode === Mode.View}
                                control={<Radio sx={{ p: 0 }} />}
                                sx={{ mb: 0, mt: 0, ml: 0, p: 0 }}
                            />
                        ))}
                    </RadioGroup>
                </FormControl>
            </Box>
            {
                (Number(dataBudgetPlan?.notifyTarget) === NotifyTarget.GroupAdmin) &&
                <Box mt={1}>
                    <Box paddingLeft={"44px"}>
                        <Autocomplete
                            multiple
                            variant={"outlined"}
                            data={listGroup || []}
                            defaultValue={listGroupId || []}
                            disabled={mode === Mode.View}
                            errorMessage={errorBudgetPlan?.notifyTargetCustom}
                            placeholder={t("setting:invitation.select_group")}
                            onChange={(data) => {
                                const newData = data.map((el: string) => ({
                                    targetId: el,
                                    targetType: dataBudgetPlan?.notifyTarget,
                                }));
                                handleOnChangeValue("notifyTargetCustom", newData);
                            }}
                        />
                    </Box>
                </Box>
            }
            {
                (Number(dataBudgetPlan?.notifyTarget) === NotifyTarget.Custom) &&
                <Box mt={1}>
                    <Box paddingLeft={"44px"}>
                        <FormField
                            value=""
                            variant="outlined"
                            disabled={mode === Mode.View}
                            onClick={() => { setOpenTarget(true); }}
                            errorMessage={errorBudgetPlan?.notifyTargetCustom}
                            placeholder={t("setting:budget.select_user_manager")}
                            InputProps={{ startAdornment: <Search color="secondary" /> }}
                            error={!Helpers.isNullOrEmpty(errorBudgetPlan?.notifyTargetCustom)}
                        />

                        {openModalTarget &&
                            <ModalSearchUser
                                open={openModalTarget}
                                userIds={listTargetProfile.map(el => el.id)}
                                onClose={() => {
                                    setOpenTarget(false);
                                }}
                                onAction={(data) => {
                                    const newData = data.map(el => ({
                                        targetId: el.id,
                                        targetType: dataBudgetPlan?.notifyTarget,
                                    }));
                                    handleOnChangeValue("notifyTargetCustom", newData);

                                    setListTargetProfile(data);

                                    setOpenTarget(false);
                                }}
                            />
                        }

                        {listTargetProfile?.length > 0 &&
                            <Box
                                sx={{
                                    my: 2,
                                    gap: 1,
                                    display: "flex",
                                    flexWrap: "wrap",
                                    alignItems: "center",
                                }}
                            >
                                {listTargetProfile?.map((el, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            gap: 1,
                                            padding: "8px",
                                            display: "flex",
                                            flexWrap: "wrap",
                                            borderRadius: "25px",
                                            alignItems: "center",
                                            border: "1px solid #ddd",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <Avatar
                                            text={el.fullName || el.email}
                                            src={el.avatarUrl}
                                            style={{
                                                width: "35px",
                                                height: "35px",
                                            }}
                                        />
                                        <Box sx={{
                                            display: "grid",
                                            overflow: "hidden",
                                            whiteSpace: "nowrap",
                                            textOverflow: "ellipsis",
                                            width: { xs: "100px", sm: "auto" },
                                        }}>
                                            <Typography variant="button" fontWeight="bold" >
                                                {el.fullName || el.email}
                                            </Typography>
                                            <Typography variant="caption">
                                                {el.email}
                                            </Typography>
                                        </Box>
                                        {mode !== Mode.View &&
                                            <IconButton
                                                onClick={() => {
                                                    const newData1 = listTargetProfile?.filter((item) => item.id !== el.id);
                                                    setListTargetProfile(newData1);

                                                    const newData2 = newData1.map(el => ({
                                                        targetId: el.id,
                                                        targetType: dataBudgetPlan?.notifyTarget,
                                                    }));
                                                    handleOnChangeValue("notifyTargetCustom", newData2);
                                                }}
                                            >
                                                <Close />
                                            </IconButton>
                                        }
                                    </Box>
                                ))}
                            </Box>
                        }
                    </Box>
                </Box>
            }
        </>
    )
}

export default RenderDetailNotifyTarget