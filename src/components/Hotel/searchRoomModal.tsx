import { Box, Modal } from "@maysoft/common-component-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { SearchHotelComponentMode } from "@src/commons/enum";
import Helpers from "@src/commons/helpers";
import { IOccupancy } from "@src/commons/interfaces";
import { ISearchHotelData } from "@src/hooks/searchHotel/useData";
import { ModalSearchUserByOrganization } from "../Modal/ModalSearchUserByOrganization";
import AdditionalForm from "../SearchHotel/additonalForm";

const SearchRoomModal = ({
    mode,
    visibled,
    data,
    setVisibled,
    onSubmit,
}: {
    mode: SearchHotelComponentMode;
    visibled: boolean;
    data: ISearchHotelData;
    setVisibled: React.Dispatch<React.SetStateAction<boolean>>;
    onSubmit: (data: ISearchHotelData) => void;
}) => {
    const { t } = useTranslation("common");
    const [additionalData, setAdditionalData] = useState<IOccupancy[]>([
        {
            adultSlot: 1,
            childrenOld: [],
        },
    ]);

    useEffect(() => {
        let additionalDataTemp: IOccupancy[] = [...additionalData];
        for (const [key, value] of Object.entries(data)) {
            if (key === "occupancy") additionalDataTemp = data[key];
        }
        setAdditionalData(additionalDataTemp);
    }, [visibled]);

    const onAddNewRoom = () => {
        setAdditionalData((prev) => [
            ...prev,
            {
                adultSlot: 1,
                childrenOld: [],
            },
        ]);
    };

    const getChildrenAgeList = (value: number, index: number) => {
        const childrenAgeList = additionalData[index].childrenOld;
        if (childrenAgeList.length === value) return;
        if (childrenAgeList.length > value) {
            return setAdditionalData((prev) => {
                const temp = [...prev];
                const occupancy = prev[index];
                occupancy.childrenOld.splice(value);
                return temp;
            });
        }
        if (childrenAgeList.length < value) {
            return setAdditionalData((prev) => {
                const temp = [...prev];
                const occupancy = prev[index];
                occupancy.childrenOld.push(1);
                return temp;
            });
        }
    };

    const onChangeAdditionalData = (value: number | string[], key: keyof IOccupancy, index: number, subIndex?: number) => {
        if (subIndex === -999)
            return setAdditionalData((prev) => {
                const temp = [...prev];
                temp.splice(index, 1);
                return temp;
            });
        if (index === -1) return onAddNewRoom();

        if (key === "userIds") {
            return setAdditionalData((prev) => {
                const temp = [...prev];
                const newValue = value as string[];
                prev[index][key] = newValue;
                prev[index]["adultSlot"] = newValue.length;
                return temp;
            });
        }
        if (key === "childrenOld" && Helpers.isNullOrEmpty(subIndex)) return getChildrenAgeList(value as number, index);
        if (key === "childrenOld" && !Helpers.isNullOrEmpty(subIndex)) {
            return setAdditionalData((prev) => {
                const temp = [...prev];
                prev[index][key][subIndex] = value as number;
                return temp;
            });
        }
        if (key !== "childrenOld")
            return setAdditionalData((prev) => {
                const temp = [...prev];
                prev[index][key] = value as number;
                return temp;
            });
    };

    const handleSubmit = () => {
        onSubmit({ ...data, occupancy: [...additionalData] });
        setVisibled(false);
    };

    const [visibledSearchUser, setVisibledSearchUser] = useState<boolean>(false);
    const [selectedIndex, setSelectedIndex] = useState<number | undefined>(undefined);

    const handleAddUserToRoom = (index: number) => {
        setSelectedIndex(index);
        setVisibledSearchUser(true);
    };

    return (
        <Modal
            fullWidth
            maxWidth={"lg"}
            hasActionButton
            visible={visibled}
            title={t("travelers")}
            onAction={handleSubmit}
            onClose={() => setVisibled(false)}
        >
            <Box
                sx={{
                    overflow: "auto",
                    height: "min(400px, 55vh)",
                }}
            >
                <AdditionalForm mode={mode} data={additionalData} handleAddUserToRoom={handleAddUserToRoom} onChangeValue={onChangeAdditionalData} />
            </Box>
            {visibledSearchUser && selectedIndex !== undefined && mode === SearchHotelComponentMode.Corporate && (
                <ModalSearchUserByOrganization
                    visibled={visibledSearchUser}
                    setVisibled={setVisibledSearchUser}
                    onAction={(data) => {
                        if (!Helpers.isNullOrEmpty(selectedIndex)) {
                            onChangeAdditionalData(
                                (data || []).map((el) => el.id),
                                "userIds",
                                selectedIndex
                            );
                        }
                    }}
                    userIds={[...(additionalData[selectedIndex]?.userIds || [])]}
                />
            )}
        </Modal>
    );
};

export default SearchRoomModal;
