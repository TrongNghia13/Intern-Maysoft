import { Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FormField, Modal } from "@maysoft/common-component-react";

import Helpers from "@src/commons/helpers";

import { Mode } from "@src/commons/enum";
import useDataPolicy, { IBasicPolicy, IRecordPolicy } from "@src/hooks/useDataPolicy.hook";



const ModalCreateUpdatePolicy = ({
    title,
    openCreate,
    setOpenCreate,

    hidenFlightTime,
    hidenBookingTime,

    serviceCode,
    organizationId,
    dataItemPolicy,
    onCallBack,
}: {
    title: string,
    openCreate: boolean,
    setOpenCreate: Dispatch<SetStateAction<boolean>>,

    hidenFlightTime?: boolean,
    hidenBookingTime?: boolean,

    serviceCode?: string;
    organizationId?: string;
    dataItemPolicy?: IRecordPolicy,
    onCallBack: (data: IBasicPolicy) => void,
}) => {
    const {
        t,
        i18n: { language },
    } = useTranslation(["common", "setting"]);

    const {
        handleCreatePolicy,
        handleUpdatePolicy,
    } = useDataPolicy();

    const [dataPolicy, setDataPolicy] = useState<IBasicPolicy>({} as IBasicPolicy);
    const [errorPolicy, setErrorPolicy] = useState<IBasicPolicy>({} as IBasicPolicy);

    useEffect(() => {
        if (openCreate) {
            setErrorPolicy({});

            if (dataItemPolicy && !Helpers.isNullOrEmpty(dataItemPolicy?.id)) {
                setDataPolicy({
                    id: dataItemPolicy?.id,
                    name: dataItemPolicy?.name?.value?.["vi"],
                    description: dataItemPolicy?.description?.value?.["vi"],
                });
            }
        }
    }, [openCreate, dataItemPolicy]);

    const onChangeValuePolicy = (key: string, newValue: any) => {
        setDataPolicy((prev: any) => ({
            ...prev,
            [key]: newValue,
        }));

        setErrorPolicy((prev: any) => ({
            ...prev,
            [key]: undefined,
        }));
    };

    const handleClose = () => {
        setDataPolicy({});
        setErrorPolicy({});

        setOpenCreate(false);
    };

    const handleSubmit = async () => {
        if (Helpers.isNullOrEmpty(dataPolicy.name)) {
            setErrorPolicy((prev: any) => ({
                ...prev,
                name: t("setting:policy.required_policy_name"),
            }));
        } else {
            const newDataTemp = {
                ...dataPolicy,
                serviceCode: serviceCode,
                organizationId: organizationId,
            };

            if (Helpers.isNullOrEmpty(newDataTemp?.id)) {
                await handleCreatePolicy({
                    data: newDataTemp,
                    onCallBack: onCallBack,
                    hidenFlightTime: hidenFlightTime,
                    hidenBookingTime: hidenBookingTime,
                });
            } else {
                await handleUpdatePolicy({
                    data: {
                        ...dataItemPolicy,
                        serviceCode: dataItemPolicy?.serviceCode || serviceCode,
                        organizationId: dataItemPolicy?.organizationId || organizationId,
                        name: {
                            ...dataItemPolicy?.name,
                            value: {
                                "vi": newDataTemp?.name || "",
                                "en": newDataTemp?.name || "",
                            },
                        },
                        description: {
                            ...dataItemPolicy?.description,
                            value: {
                                "vi": newDataTemp?.description || "",
                                "en": newDataTemp?.description || "",
                            },
                        }
                    } as IRecordPolicy,
                    onCallBack: onCallBack,
                });
            }

            setDataPolicy({});
            setErrorPolicy({});

            setOpenCreate(false);
        }
    };

    return (
        <Modal
            fullWidth
            maxWidth="md"
            hasActionButton

            onClose={() => { handleClose(); }}
            onAction={() => { handleSubmit(); }}

            title={title}
            visible={openCreate}
        >
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <FormField
                        required
                        maxLength={255}
                        mode={Mode.Create}
                        value={dataPolicy.name}
                        errorMessage={errorPolicy.name}
                        label={t("setting:policy.name_policy")}
                        placeholder={t("setting:policy.enter_name_policy")}
                        onChangeValue={(value) => { onChangeValuePolicy("name", value); }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormField
                        multiline
                        minRows={3}
                        maxLength={500}
                        mode={Mode.Create}
                        value={dataPolicy.description}
                        errorMessage={errorPolicy.description}
                        label={t("setting:policy.description_policy")}
                        placeholder={t("setting:policy.enter_description_policy")}
                        onChangeValue={(value) => { onChangeValuePolicy("description", value); }}
                    />
                </Grid>
            </Grid>
        </Modal>
    );
};

export default ModalCreateUpdatePolicy;