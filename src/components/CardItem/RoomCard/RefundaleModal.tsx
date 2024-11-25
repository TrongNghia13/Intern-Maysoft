import { Box, Modal, Typography } from "@maysoft/common-component-react";
import { useTranslation } from "react-i18next";

import Helpers from "@src/commons/helpers";
import { IRate } from "@src/commons/interfaces";
import { typographyStyles } from "@src/styles/commonStyles";

const RefundableModal = ({
    visibled,
    rate,
    setVisibled,
}: {
    visibled: boolean;
    rate: IRate;
    setVisibled: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const { t } = useTranslation("detail");
    const handleSubmit = () => {
        setVisibled(false);
    };

    const getTexts = () => {
        if (rate?.refunable === true)
            return [
                t("cancel_your_reservation_before_date_and_you'll_get_a_full_refund", {
                    date: Helpers.formatDate(Number(rate.cancelPenalties[0].endTime) * 1000),
                }),
                t("after_that_you_won't_get_a_refund"),
                t("times_are_based_on_the_property’s_local_time"),
            ];
        // if (type === RefundableType.Partially)
        //     return [t("if_you_cancel_your_reservation_you'll_be_charged_for_the_first_night_of_your_stay_plus_taxes_and_fees")];
        return [t("if_you_cancel_your_reservation_you'll_be_charged_for_the_first_night_of_your_stay_plus_taxes_and_fees")];
    };

    const title = () => {
        if (rate?.refunable === true) return t("fully_refundable");
        // if (type === RefundableType.Partially) return t("partially_refundable");
        return t("non_refundable");
    };

    return (
        <Modal
            fullWidth
            maxWidth={"sm"}
            // hasActionButton
            visible={visibled}
            title={title()}
            onAction={handleSubmit}
            onClose={() => setVisibled(false)}
        >
            <Box
                sx={{
                    overflow: "auto",
                    maxheight: "min(600px, 70vh)",
                    pb: 2,
                }}
            >
                <Box display="grid" gap={1}>
                    {getTexts().map((text, index) => (
                        <Typography key={index} sx={typographyStyles}>
                            {text}
                        </Typography>
                    ))}
                </Box>
            </Box>
        </Modal>
    );
};

export default RefundableModal;
