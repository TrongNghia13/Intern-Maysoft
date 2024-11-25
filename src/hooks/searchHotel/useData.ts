import moment from "moment";
import { useEffect, useState } from "react";
import Helpers from "../../commons/helpers";
import { IOccupancy } from "@src/commons/interfaces";
import { SearchHotelComponentMode } from "@src/commons/enum";

export type IBasicData = {
    searchText: string | undefined;
    startDate: number;
    endDate: number;
    isApartment: boolean;
};

export type IChildrenAge = { title: string; value: number };

// export type IAdditionalData = {
//     rooms: number;
//     adults: number;
//     children: number;
//     childrenAgeList: IChildrenAge[];
// };

export type ISearchHotelData = IBasicData & { occupancy: IOccupancy[] };

export type IUser = {
    id: string;
    email?: string;
    userCode?: string;
    fullName?: string;
    avatarId?: string;
    avatarUrl?: string;
    phoneNumber?: string;
};

interface IProps {
    mode: SearchHotelComponentMode;
    searchData: ISearchHotelData;
    onSearch: (data: ISearchHotelData) => void;
    setLocationPopupVisibled: React.Dispatch<React.SetStateAction<boolean>>;
    setCalenderPopupVisibled: React.Dispatch<React.SetStateAction<boolean>>;
}

const title = "Age of child";

const useData = ({ mode, searchData, onSearch, setLocationPopupVisibled, setCalenderPopupVisibled }: IProps) => {
    const [data, setData] = useState<IBasicData>({
        searchText: undefined,
        startDate: moment().unix(),
        endDate: moment().add(7, "day").unix(),
        isApartment: false,
    });

    const [additionalData, setAdditionalData] = useState<IOccupancy[]>([
        {
            adultSlot: 1,
            childrenOld: [],
        },
    ]);

    const [users, setUsers] = useState<IUser[]>([]);

    useEffect(() => {
        const dataTemp: IBasicData = { ...data };
        let additionalDataTemp: IOccupancy[] = [...additionalData];
        for (const [key, value] of Object.entries(searchData)) {
            if (key in data) Object.assign(dataTemp, { [key]: value });

            if (key === "occupancy") {
                const occupany: IOccupancy[] = searchData[key];
                additionalDataTemp = occupany.map((el) => ({
                    ...el,
                    adultSlot: mode === SearchHotelComponentMode.Corporate ? el.userIds?.length || 0 : 1,
                }));
            }
        }
        setData(dataTemp);
        setAdditionalData(additionalDataTemp);
    }, [searchData, mode]);

    const onAddNewUsers = (users: IUser[]) => {
        setUsers(users);
    };

    const onRemoveUser = (user: IUser) => {
        setUsers((prev) => prev.filter((el) => el.id !== user.id));
    };

    const onClickSelectLocation = (searchText: string) => {
        setData((prev) => ({ ...prev, searchText }));
        setLocationPopupVisibled(false);
        setCalenderPopupVisibled(true);
    };

    const onChangeValue = (value: string | number, key: keyof IBasicData) => {
        setData((prev) => ({ ...prev, [key]: value }));
    };

    const onAddNewRoom = () => {
        setAdditionalData((prev) => [
            ...prev,
            {
                adultSlot: mode === SearchHotelComponentMode.Corporate ? 0 : 1,
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

    const onSubmit = () => {
        onSearch({ ...data, occupancy: additionalData });
    };

    return {
        data,
        additionalData,
        onChangeValue,
        onChangeAdditionalData,
        onClickSelectLocation,
        onSubmit,
        users,
        onAddNewUsers,
        onRemoveUser,
    };
};

export default useData;
