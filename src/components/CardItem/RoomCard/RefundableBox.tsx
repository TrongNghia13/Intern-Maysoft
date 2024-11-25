import { Box, Typography } from "@maysoft/common-component-react";
import { InfoOutlined } from "@mui/icons-material";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import Helpers from "@src/commons/helpers";
import { IRoom } from "@src/commons/interfaces";
import { typographyStyles } from "@src/styles/commonStyles";
import RefundableModal from "./RefundaleModal";
import { TextWithIcon } from "@src/components";

const RefundableBox = ({ item }: { item: IRoom }) => {
    const { t } = useTranslation("detail");
    const currentRate = item.rates.find((el) => el.referenceId === item.selectedRate);

    const [visibled, setVisibled] = useState<boolean>(false);
    if (currentRate?.refunable === true)
        return (
            <Box>
                <TextWithIcon
                    value={t("fully_refundable")}
                    Icon={InfoOutlined}
                    isLink
                    color="success"
                    iconPosition="right"
                    onClick={() => setVisibled(true)}
                />
                <Typography sx={typographyStyles}>
                    {t("before")} {Helpers.formatDate(1712549427 * 1000)}
                </Typography>
                <RefundableModal rate={currentRate} {...{ visibled, setVisibled }} />
            </Box>
        );
    // if (item?.refundableType === RefundableType.Partially)
    //     return (
    //         <Box>
    //             <TextWithIcon
    //                 value={t("partially_refundable")}
    //                 Icon={InfoOutlined}
    //                 isLink
    //                 color="secondary"
    //                 iconPosition="right"
    //                 onClick={() => setVisibled(true)}
    //             />
    //             <Typography sx={typographyStyles}>&nbsp;</Typography>
    //             <RefundableModal type={item.refundableType} {...{ visibled, setVisibled }} />
    //         </Box>
    //     );
    if (currentRate?.refunable === false)
        return (
            <Box>
                <TextWithIcon
                    value={t("non_refundable")}
                    Icon={InfoOutlined}
                    isLink
                    color="error"
                    iconPosition="right"
                    onClick={() => setVisibled(true)}
                />
                <Typography sx={typographyStyles}>&nbsp;</Typography>
                <RefundableModal rate={currentRate} {...{ visibled, setVisibled }} />
            </Box>
        );
    return <></>;
};

export default RefundableBox;
