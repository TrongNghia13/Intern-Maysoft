import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Mode } from "@src/commons/enum";
import Helpers from "@src/commons/helpers";
import { IItinerary, IUser } from "@src/commons/interfaces";
import { Modal } from "@src/components/Modal";
import Constants from "@src/constants";
import PathName from "@src/constants/PathName";
import { IItineraryError } from "@src/hooks/trips/useTrips";
import { IErrorTrip } from "@src/hooks/useDataTrip.hook";
import ItineraryService from "@src/services/booking/ItineraryService";
import { RootState } from "@src/store";
import { hideLoading, showLoading } from "@src/store/slice/common.slice";
import { object, string } from "yup";
import FormInput from "./FormInput";

interface IProps {
    mode: Mode;
    itineraryData: IItinerary;
    userData: IUser[];
    visibled: boolean;
    onSubmit?: (data: IItinerary, users: IUser[]) => void;
    setVisibled: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ModalUpdateTrip: React.FC<IProps> = ({ mode, itineraryData, userData, visibled, setVisibled, onSubmit }) => {
    const {
        t,
        i18n: { language },
    } = useTranslation(["common", "tripbooking"]);

    const router = useRouter();
    const dispatch = useDispatch();

    const id: string = router?.query?.id as string;

    const userInfo = useSelector((state: RootState) => state.userInfo);

    const [data, setData] = useState<IItinerary>({} as IItinerary);

    const [error, setError] = useState<IItineraryError>({} as IItineraryError);
    const [loading, setLoading] = useState<boolean>(false);
    const [users, setUsers] = useState<IUser[]>([]);

    useEffect(() => {
        if (itineraryData && itineraryData?.id) {
            setData(itineraryData);
        }
        if (userData) {
            setUsers(userData);
        }
        return () => {
            setUsers([]);
            setData({} as IItinerary);
        };
    }, [visibled]);

    const handleGoBack = () => {
        setVisibled(false);
    };

    const onChangeUsers = (data: IUser[]) => {
        setUsers(data);
    };

    const onRemoveUser = (data: IUser) => {
        setUsers((prev) => prev.filter((el) => el.id !== data.id));
    };

    const requestSchema = object({
        name: string().required(),
    });

    const handleSubmit = async () => {
        try {
            setLoading(true);
            dispatch(showLoading());
            await requestSchema.validate(data, { abortEarly: false });
            if (Helpers.isNullOrEmpty(data?.id)) {
                const result = await ItineraryService.create({
                    nameDefault: data.name,
                    organizationId: userInfo?.userProfile?.organizationId,
                    description: data.description,
                    serviceCode: Constants.SERVICE_CODE,
                    userIds: users.map((el) => el.id),
                });
                router.push({
                    pathname: PathName.TRIPS_DETAIL,
                    query: {
                        id: result.id,
                    },
                });
                return;
            }

            const updateResult = await ItineraryService.update({
                id: data?.id,
                nameDefault: data.name,
                organizationId: userInfo?.userProfile?.organizationId,
                description: data.description,
                serviceCode: Constants.SERVICE_CODE,
                userIds: users.map((el) => el.id),
                updateTime: data?.updateTime,
            });
            onSubmit &&
                onSubmit(
                    {
                        ...data,
                        updateTime: updateResult.updateTime,
                    },
                    users
                );
            setVisibled(false);
            return;
        } catch (error: any) {
            if (error.name === "ValidationError") {
                const newError: IErrorTrip = Helpers.handleValidationError(error);
                setError(newError);
            } else {
                Helpers.handleError(error);
            }
        } finally {
            dispatch(hideLoading());
            setLoading(false);
        }
    };

    const onChangeValue = (value: string, key: keyof IItinerary) => {
        if (!Helpers.isNullOrEmpty(error[key])) setError((prev) => ({ ...prev, [key]: "" }));
        setData((prev) => ({ ...prev, [key]: value }));
    };

    const title = useMemo(() => {
        return mode === Mode.Create ? t("tripbooking:create_trip") : t("tripbooking:edit_trip");
    }, [mode, t]);

    return (
        <Modal
            visible={visibled}
            onClose={() => {
                handleGoBack();
            }}
            hasActionButton
            title={title}
            onAction={async () => await handleSubmit()}
        >
            <FormInput
                mode={mode}
                data={data}
                error={error}
                users={users}
                loading={loading}
                onChangeUsers={onChangeUsers}
                onRemoveUser={onRemoveUser}
                onChangeValue={onChangeValue}
                onCancel={handleGoBack}
                onSubmit={handleSubmit}
            />
        </Modal>
    );
};

export default ModalUpdateTrip;
