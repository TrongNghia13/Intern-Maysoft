import { Gender } from "@src/commons/enum";
import Helpers from "@src/commons/helpers";
import { ICodename, IUser } from "@src/commons/interfaces";
import { ModalEditOrganizationProfile } from "@src/components";
import AdministrativeDivisionService from "@src/services/common/AdministrativeDivisionService";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

interface TripContextType {
    hasTable: boolean;
    disabled: boolean;
    listCountry: ICodename[];
    genderList: ICodename[];
    onEditUser: (user: IUser, isInternational?: boolean) => void;
}

const TripContext = createContext<TripContextType>(null!);

const useTripContext = () => useContext(TripContext);

const TripProvider = ({
    children,
    disabled,
    onChangeUser,
}: {
    children: React.ReactNode;
    disabled?: boolean;
    onChangeUser?: (user: IUser) => void;
}) => {
    const [visibled, setVisibled] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<IUser | undefined>(undefined);

    const [listCountry, setCountryList] = useState<ICodename[]>([]);
    const [international, setInternational] = useState<boolean>(false);

    const genderList: ICodename[] = useMemo(
        () => [
            { code: Gender.Male, name: "Nam" },
            { code: Gender.Female, name: "Nữ" },
            // { code: Gender.Other, name: "Khác" },
        ],
        []
    );

    const hasTable = Helpers.isFunction(onChangeUser);

    useEffect(() => {
        const getCountry = async () => {
            if (!hasTable) return;
            const result = await AdministrativeDivisionService.getAll({ type: 1 });
            setCountryList(
                result.map((item) => {
                    return {
                        code: item.code,
                        name: item.name,
                    };
                })
            );
        };
        getCountry();
    }, [hasTable]);

    const onAction = (user: IUser) => {
        if (Helpers.isNullOrEmpty(user)) return;
        onChangeUser && onChangeUser(user);
        setSelectedUser(undefined);
        setInternational(false);
    };

    const value = useMemo(
        () => ({
            listCountry,
            genderList,
            disabled: disabled || false,
            onEditUser: (user: IUser, isInternational?: boolean) => {
                setSelectedUser(user);
                setVisibled(true);
                setInternational(isInternational || false);
            },
            hasTable,
        }),
        [hasTable, listCountry, genderList, disabled]
    );

    return (
        <TripContext.Provider value={value}>
            {children}
            {selectedUser && visibled && (
                <ModalEditOrganizationProfile
                    isInternational={international}
                    user={selectedUser}
                    visibled={visibled}
                    setVisibled={setVisibled}
                    onAction={onAction}
                />
            )}
        </TripContext.Provider>
    );
};

export { TripProvider, useTripContext };
