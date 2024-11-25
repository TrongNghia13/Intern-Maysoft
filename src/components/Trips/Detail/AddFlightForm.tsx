import { Grid } from "@mui/material";
import { useTranslation } from "next-i18next";
import { useDispatch } from "react-redux";

import Helpers from "@src/commons/helpers";

import { IFlight, IItinerary } from "@src/commons/interfaces";
import { hideLoading, showLoading } from "@src/store/slice/common.slice";

// DeepTech
import { IEmployee, SearchComponent } from "@deeptech/flight-components";
import { ModalSearchUserByOrganization } from "@src/components";
import useReverseFlight from "@src/hooks/reverse/useReverseFlight";
import { RootState } from "@src/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { useSelector } from "react-redux";

// Create a client
const queryClient = new QueryClient();

export const AddFlightForm = ({
    data,
    getDetail,
    handleCancelAddTrips,
}: {
    getDetail: (id: string) => Promise<void>;
    data: IItinerary;
    handleCancelAddTrips: () => void;
}) => {
    const { t } = useTranslation(["common", "tripbooking"]);
    const dispatch = useDispatch();
    const authRoot = useSelector((state: RootState) => state.authRoot.authInfo);
    const userInfo = useSelector((state: RootState) => state.userInfo.userProfile);

    const [listSelectedUser, setListSelectedUser] = useState<IEmployee[]>([]);
    const [openModalSearchUser, setOpenModalSearchUser] = useState<boolean>(false);

    const { handleReverseFlight } = useReverseFlight();

    return (
        <Grid item xs={12} display="flex" justifyContent="center">
            <QueryClientProvider client={queryClient}>
                <SearchComponent
                    authKey={authRoot?.access_token || ""}
                    organizationId={userInfo?.organizationId}
                    onAddUsers={() => {
                        setOpenModalSearchUser(true);
                    }}
                    users={listSelectedUser || []}
                    onComplete={async (fligthData) => {
                        if (Helpers.isNullOrEmpty(fligthData?.flightId)) return;
                        try {
                            dispatch(showLoading());
                            await handleReverseFlight(
                                fligthData as IFlight,
                                (listSelectedUser || []).map((u) => u.id),
                                {
                                    itineraryId: data?.id,
                                    nameDefault: data?.name,
                                    description: data?.description,
                                    updateTime: data?.updateTime,
                                    userIds: (data?.itineraryMembers || []).map((el) => el.userId),
                                }
                            );
                            await getDetail(data?.id);
                            handleCancelAddTrips();
                        } catch (error) {
                            console.log({ error });
                        } finally {
                            dispatch(hideLoading());
                        }
                    }}
                />
            </QueryClientProvider>
            {openModalSearchUser && (
                <ModalSearchUserByOrganization
                    visibled={openModalSearchUser}
                    setVisibled={setOpenModalSearchUser}
                    userIds={listSelectedUser.map((el) => el.id)}
                    onAction={(data) => {
                        const newData = data.map(
                            (el) =>
                                ({
                                    id: el.id,
                                    avatarUrl: el.avatarUrl,
                                    name:
                                        `${el?.organizationUserProfile?.lastName || ""} ${el?.organizationUserProfile?.firstName || ""}`.trim() ||
                                        el?.fullName ||
                                        "No Name",
                                }) as IEmployee
                        );

                        setListSelectedUser(newData);

                        setOpenModalSearchUser(false);
                    }}
                />
            )}
        </Grid>
    );
};

export default AddFlightForm;
