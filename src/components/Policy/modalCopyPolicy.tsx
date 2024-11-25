import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FormField, Modal } from "@maysoft/common-component-react";

import Helpers from "@src/commons/helpers";
import { IInput } from "@src/commons/interfaces";
import useDataPolicy, { IRecordPolicy } from "@src/hooks/useDataPolicy.hook";



const ModalCopyPolicy = ({
    dataPolicyCopy,
    onClose,
    onSubmit,
}: {
    dataPolicyCopy?: IRecordPolicy,
    onClose?: () => void,
    onSubmit: () => void,
}) => {
    const {
        t,
        i18n: { language },
    } = useTranslation(["common", "setting"]);

    const { handleCreateCopyPolicy } = useDataPolicy();

    const [openModal, setOpenModal] = useState<boolean>(false);
    const [dataModal, setDataModal] = useState<{ name?: IInput, description?: string }>({});

    useEffect(() => {
        if (Helpers.isNullOrEmpty(dataPolicyCopy?.id)) {
            setOpenModal(false);
            setDataModal({});
        } else {
            const newName = dataPolicyCopy?.name?.value?.["vi"] + " - bản sao";

            setOpenModal(true);
            setDataModal({ name: { value: newName } });
        }

    }, [dataPolicyCopy?.id]);

    const handleClose = () => {
        setDataModal({});
        setOpenModal(false);
        onClose && onClose();
    };

    const handleSubmit = async () => {
        if (Helpers.isNullOrEmpty(dataModal.name?.value)) {
            setDataModal((prev: any) => ({
                ...prev,
                name: { error: t("setting:policy.required_policy_name") },
            }));
        } else {
            dataPolicyCopy?.id &&
                await handleCreateCopyPolicy({
                    ...dataPolicyCopy,
                    name: {
                        value: {
                            "vi": dataModal?.name?.value || "",
                            "en": dataModal?.name?.value || "",
                        },
                    },
                    description: {
                        value: {
                            "vi": dataModal?.description || "",
                            "en": dataModal?.description || "",
                        },
                    },
                });

            setDataModal({});
            setOpenModal(false);

            onSubmit();
        }
    };

    return (
        <Modal
            fullWidth
            maxWidth="md"
            hasActionButton

            onClose={() => { handleClose(); }}
            onAction={() => { handleSubmit(); }}

            title={"Tạo bản sao chế độ công tác"}
            visible={openModal}
        >
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <FormField
                        required
                        maxLength={255}
                        value={dataModal?.name?.value}
                        errorMessage={dataModal?.name?.error}
                        label={t("setting:policy.name_policy")}
                        placeholder={t("setting:policy.enter_name_policy")}
                        onChangeValue={(value) => {
                            setDataModal(prev => ({
                                ...prev,
                                name: { value: value },
                            }));
                        }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormField
                        multiline
                        minRows={3}
                        maxLength={500}
                        value={dataModal?.description}
                        label={t("setting:policy.description_policy")}
                        placeholder={t("setting:policy.enter_description_policy")}
                        onChangeValue={(value) => {
                            setDataModal(prev => ({
                                ...prev,
                                description: value,
                            }))
                        }}
                    />
                </Grid>
            </Grid>
        </Modal>
    );
};

export default ModalCopyPolicy;