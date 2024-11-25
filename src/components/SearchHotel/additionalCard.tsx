import { useTranslation } from "react-i18next";

import AdditionalForm from "./additonalForm";
import { CardBase } from "./fragment";
import { IOccupancy } from "@src/commons/interfaces";
import { useMemo } from "react";
import Helpers from "@src/commons/helpers";
import { SearchHotelComponentMode } from "@src/commons/enum";

const AdditionalCard = ({
    additionalPopupVisibled,
    additionalData,
    onChangeAdditionalData,
    onClick,
}: {
    additionalPopupVisibled: boolean;
    additionalData: IOccupancy[];
    onChangeAdditionalData: (value: number, key: keyof IOccupancy, index: number, subIndex?: number) => void;
    onClick: () => void;
}) => {
    const {
        t,
        i18n: { language },
    } = useTranslation("search_hotel");

    const { numberOfAdult, numberOfChild } = useMemo(() => Helpers.calcNumberOfAdultAndChild(additionalData), [additionalData]);

    return (
        <CardBase
            expanded={additionalPopupVisibled}
            title={`${additionalData.length} ${t("room")}`}
            value={t("adults_and_child", { number_of_adult: numberOfAdult, number_of_child: numberOfChild })}
            header={t("who_is_comming")}
            onClick={onClick}
        >
            <AdditionalForm
                data={additionalData}
                handleAddUserToRoom={() => { }}
                onChangeValue={onChangeAdditionalData}
                mode={SearchHotelComponentMode.Corporate}
            />
        </CardBase>
    );
};

export default AdditionalCard;
