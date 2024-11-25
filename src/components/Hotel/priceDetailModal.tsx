import { Box, Button, Modal, Typography } from "@maysoft/common-component-react";
import { useTranslation } from "react-i18next";

import { Divider } from "@mui/material";
import Helpers from "@src/commons/helpers";
import { IOptionalAttributes, IRate, IRoom } from "@src/commons/interfaces";
import Constants from "@src/constants";
import { typographyStyles } from "@src/styles/commonStyles";
import { useMemo } from "react";

const PriceDetail = ({
    visibled,
    data,
    setVisibled,
    onSelectOption,
    optionalAttributes,
    numberOfNights = 1,
    onReserve,
}: {
    visibled: boolean;
    data: IRoom;
    numberOfNights: number;
    optionalAttributes: IOptionalAttributes;
    setVisibled: React.Dispatch<React.SetStateAction<boolean>>;
    onSelectOption?: (option: IRate) => void;
    onReserve: (item: IRoom) => void;
}) => {
    const {
        t,
        i18n: { language },
    } = useTranslation(["common", "detail"]);
    const handleSubmit = () => {
        setVisibled(false);
    };

    const currentRate = data.rates.find((el) => el.referenceId === data.selectedRate) as IRate;
    const available = currentRate.available;
    const exclusive = useMemo(() => Helpers.getTotalByKey(currentRate.prices[0], "exclusive"), [currentRate]);
    const inclusive = useMemo(() => Helpers.getTotalByKey(currentRate.prices[0], "inclusive"), [currentRate]);
    const inclusiveStrikethrough = useMemo(() => Helpers.getTotalByKey(currentRate.prices[0], "inclusiveStrikethrough"), [currentRate]);
    const strikethrough = useMemo(() => Helpers.getTotalByKey(currentRate.prices[0], "strikethrough"), [currentRate]);
    const taxes = useMemo(() => Math.round(inclusive.value - exclusive.value), [inclusive.value, exclusive.value]);

    return (
        <Modal
            fullWidth
            maxWidth={"sm"}
            // hasActionButton
            visible={visibled}
            title={t("detail:price_details")}
            onAction={handleSubmit}
            onClose={() => setVisibled(false)}
        >
            <Box
                sx={{
                    overflow: "auto",
                    maxHeight: "min(600px, 70vh)",
                    pb: 2,
                }}
            >
                <Box display="grid" gap={1}>
                    <Item
                        title={`${numberOfNights} ${t("night").toLocaleLowerCase()}`}
                        description={t("per_night", {
                            string: `${exclusive.currency} ${Helpers.formatCurrency(Math.round(exclusive.value / numberOfNights))}`,
                        })}
                        value={`${exclusive.currency} ${Helpers.formatCurrency(exclusive.value)}`}
                    />
                    <Item title={t("taxes")} value={`${exclusive.currency} ${Helpers.formatCurrency(taxes)}`} />
                    <Divider />

                    <Item bold title={t("total")} value={`${inclusive.currency} ${Helpers.formatCurrency(inclusive.value)}`} />

                    {/* <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Box>
                            <Typography sx={(theme) => typographyStyles(theme)}>Taxes</Typography>
                        </Box>
                        <Typography sx={(theme) => typographyStyles(theme)}>
                            {inclusive.currency} {Helpers.formatCurrency(inclusive.value)}
                        </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Box>
                            <Typography sx={(theme) => typographyStyles(theme)}>Total</Typography>
                        </Box>
                        <Typography sx={(theme) => typographyStyles(theme)}>
                            {inclusive.currency} {Helpers.formatCurrency(inclusive.value)}
                        </Typography>
                    </Box> */}
                    <Button variant="outlined" onClick={() => onReserve(data)}>
                        {t("reserve")}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

const Item = ({ title, description, value, bold }: { title: string; description?: string; value: string; bold?: boolean }) => {
    return (
        <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box>
                <Typography sx={(theme) => typographyStyles(theme, { fontWeight: bold ? 600 : 400 })}>{title}</Typography>
                {description && (
                    <Box ml={2}>
                        <Typography sx={(theme) => typographyStyles(theme, { fontSize: Constants.FONT_SIZE.SMALL_TEXT, color: "#c3c3c3" })}>
                            {description}
                        </Typography>
                    </Box>
                )}
            </Box>
            <Typography sx={(theme) => typographyStyles(theme, { fontWeight: bold ? 600 : 400 })}>{value}</Typography>
        </Box>
    );
};

export default PriceDetail;
