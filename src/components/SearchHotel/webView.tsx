import { Box, Button, FormField } from "@maysoft/common-component-react";
import { Search } from "@mui/icons-material";
import { InputAdornment } from "@mui/material";
import React, { Fragment, useEffect, useMemo, useState } from "react";

import { SearchHotelComponentMode } from "@src/commons/enum";
import { IOccupancy, ISearch } from "@src/commons/interfaces";
import { SearchService } from "@src/services/search";
import { showSnackbar } from "@src/store/slice/common.slice";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import Helpers from "../../commons/helpers";
import { IBasicData, IUser } from "../../hooks/searchHotel/useData";
import AdditionalPopup from "./additionalPopup";
import CalenderPopup from "./calendarPopup";
import FocusBox from "./focusBox";
import { InfoBox } from "./fragment";
import LocationPopup from "./locationPopup";

let debounce: any = undefined;

const WebView = ({
    locationPopupVisibled,
    setLocationPopupVisibled,
    calenderPopupVisibled,
    setCalenderPopupVisibled,
    additionalPopupVisibled,
    setAdditionalPopupVisibled,
    data,
    additionalData,
    onChangeValue,
    onChangeAdditionalData,
    onClickSelectLocation,
    onSubmit,
    users,
    onAddNewUsers,
    onRemoveUser,
    hidenInputUserIds,
    setVisibledSearchUser,
    setSelectedIndex,
    mode,
}: {
    locationPopupVisibled: boolean;
    setLocationPopupVisibled: React.Dispatch<React.SetStateAction<boolean>>;
    calenderPopupVisibled: boolean;
    setCalenderPopupVisibled: React.Dispatch<React.SetStateAction<boolean>>;
    additionalPopupVisibled: boolean;
    setAdditionalPopupVisibled: React.Dispatch<React.SetStateAction<boolean>>;
    data: IBasicData;
    additionalData: IOccupancy[];
    onChangeValue: (value: string | number, key: keyof IBasicData) => void;
    onChangeAdditionalData: (value: number | string[], key: keyof IOccupancy, index: number, subIndex?: number) => void;
    onClickSelectLocation: (searchText: string) => void;
    onSubmit: () => void;
    users: IUser[];
    onAddNewUsers: (users: IUser[]) => void;
    onRemoveUser: (user: IUser) => void;
    hidenInputUserIds?: boolean;
    setSelectedIndex: React.Dispatch<React.SetStateAction<number | undefined>>;
    setVisibledSearchUser: React.Dispatch<React.SetStateAction<boolean>>;
    mode: SearchHotelComponentMode;
}) => {
    const dispatch = useDispatch();
    const {
        t,
        i18n: { language },
    } = useTranslation("search_hotel");

    const [loading, setLoading] = useState<boolean>(false);
    const [visibled, setVisibled] = useState<boolean>(false);

    const [locationData, setLocationData] = useState<ISearch[]>([]);

    const handleAddUserToRoom = (index: number) => {
        setSelectedIndex(index);
        setVisibledSearchUser(true);
    };

    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            if (debounce) clearTimeout(debounce);
            debounce = setTimeout(async () => {
                const result = await SearchService.search({
                    entity: "partner",
                    pageNumber: 1,
                    pageSize: 10,
                    partner: {
                        partnerName: data.searchText,
                    },
                });
                setLocationData(result.items);
                setLoading(false);
            }, 500);
        };
        getData();
    }, [data.searchText]);

    const { numberOfAdult, numberOfChild } = useMemo(() => Helpers.calcNumberOfAdultAndChild(additionalData), [additionalData]);

    const userIds = useMemo(() => {
        if (users.length === 0) return [];
        return users.map((user) => user.id);
    }, [users]);

    return (
        <Box position="relative">
            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                gap={1}
                sx={{
                    // border: "1px solid #c3c3c3",
                    // backgroundColor: "#ebebeb",
                    borderRadius: 2,
                    overflow: "hidden",
                    px: 2,
                    py: 0.5,
                }}
            >
                <FocusBox visibled={locationPopupVisibled} setVisibled={setLocationPopupVisibled} width={"50%"}>
                    <Box width="100%">
                        <FormField
                            sx={{ py: 0.5 }}
                            value={data.searchText}
                            onChangeValue={(value) => onChangeValue(value, "searchText")}
                            placeholder={t("search")}
                            onFocus={() => !locationPopupVisibled && setLocationPopupVisibled(true)}
                            InputProps={{
                                autoComplete: "off",
                                startAdornment: (
                                    <InputAdornment position="end">
                                        <Search />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>
                    <LocationPopup
                        data={locationData}
                        loading={loading}
                        visibled={locationPopupVisibled}
                        setVisibled={setLocationPopupVisibled}
                        onClick={onClickSelectLocation}
                    />
                </FocusBox>
                <FocusBox visibled={calenderPopupVisibled} setVisibled={setCalenderPopupVisibled} width={"30%"}>
                    <Fragment>
                        <InfoBox title={t("check_in")} description={Helpers.getDate(data.startDate, t("choice_date"))} />
                        <InfoBox title={t("check_out")} description={Helpers.getDate(data.endDate, t("choice_date"))} />
                    </Fragment>
                    {/* <Fragment>
                        <Event color="secondary" />
                        <Typography variant="button" color="secondary">
                            {Helpers.getDate(data.startDate) || "check in"}
                        </Typography>
                        <Typography variant="button" color="secondary">
                            -
                        </Typography>

                        <Typography variant="button" color="secondary">
                            {Helpers.getDate(data.endDate) || "check out"}
                        </Typography>
                    </Fragment> */}

                    <CalenderPopup
                        visibled={calenderPopupVisibled}
                        setVisibled={setCalenderPopupVisibled}
                        data={data}
                        onChangeValue={onChangeValue}
                    />
                </FocusBox>
                <FocusBox visibled={additionalPopupVisibled} setVisibled={setAdditionalPopupVisibled} width={"40%"}>
                    <Fragment>
                        <InfoBox
                            title={`${additionalData.length} ${t("room")}`}
                            description={t("total_adults_in_booking", { number_of_adult: numberOfAdult })}
                        />
                        <Button
                            variant="outlined"
                            onClick={(e) => {
                                e.stopPropagation();

                                if (numberOfAdult === 0) {
                                    dispatch(showSnackbar({ msg: t("must_have_at_least_one_person_to_search"), type: "error" }));
                                    return;
                                }

                                setAdditionalPopupVisibled(false);
                                onSubmit();
                            }}
                            sx={{ width: "110px", borderRadius: 20 }}
                        >
                            {t("search")}
                        </Button>
                    </Fragment>
                    <AdditionalPopup
                        mode={mode}
                        visibled={additionalPopupVisibled}
                        setVisibled={setAdditionalPopupVisibled}
                        data={additionalData}
                        onChangeValue={onChangeAdditionalData}
                        handleAddUserToRoom={handleAddUserToRoom}
                    />
                </FocusBox>
            </Box>

            {/* <Box
            
                sx={{
                    mt: 1,
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "flex-end",
                }}
            >
                <ControlLabelCheckBox
                    value={data.isApartment}
                    label={t("tripbooking:apartments_only")}
                    onChangeValue={(value) => onChangeValue(value, "isApartment")}
                />
                <Button
                    onClick={(e) => {
                        e.stopPropagation();
                        setAdditionalPopupVisibled(false);
                        onSubmit();
                    }}
                >  {t("search")}
                </Button>
            </Box> */}

            {/* <Grid container spacing={1}>
                <Grid item xs={5}>
                    <FocusBox visibled={locationPopupVisibled} setVisibled={setLocationPopupVisibled}>
                        <Box width="100%">
                            <FormField
                                value={data.searchText}
                                onChangeValue={(value) => onChangeValue(value, "searchText")}
                                placeholder={t("search")}
                                onFocus={() => !locationPopupVisibled && setLocationPopupVisibled(true)}
                                InputProps={{
                                    autoComplete: "off",
                                    startAdornment: (
                                        <InputAdornment position="end">
                                            <Search />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>
                        <LocationPopup
                            data={locationData}
                            loading={loading}
                            visibled={locationPopupVisibled}
                            setVisibled={setLocationPopupVisibled}
                            onClick={onClickSelectLocation}
                        />
                    </FocusBox>
                </Grid>
                <Grid item xs={3}>
                    <FocusBox visibled={calenderPopupVisibled} setVisibled={setCalenderPopupVisibled}>
                        {/* <Fragment>
                        <InfoBox title={t("check_in")} description={Helpers.getDate(data.startDate, t("choice_date"))} />
                        <InfoBox title={t("check_out")} description={Helpers.getDate(data.endDate, t("choice_date"))} />
                    </Fragment> 
                        <Fragment>
                            <Event color="secondary" />
                            <Typography variant="button" color="secondary">
                                {Helpers.getDate(data.startDate) || "check in"}
                            </Typography>
                            <Typography variant="button" color="secondary">
                                -
                            </Typography>

                            <Typography variant="button" color="secondary">
                                {Helpers.getDate(data.endDate) || "check out"}
                            </Typography>
                        </Fragment>

                        <CalenderPopup
                            visibled={calenderPopupVisibled}
                            setVisibled={setCalenderPopupVisibled}
                            data={data}
                            onChangeValue={onChangeValue}
                        />
                    </FocusBox>
                </Grid>
                <Grid item xs={4}>
                    <FocusBox visibled={additionalPopupVisibled} setVisibled={setAdditionalPopupVisibled}>
                        <Fragment>
                            <InfoBox
                                title={`${additionalData.length} ${t("room")}`}
                                description={t("adults_and_child", { number_of_adult: numberOfAdult, number_of_child: numberOfChild })}
                            />
                            <Button
                                variant="outlined"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setAdditionalPopupVisibled(false);
                                    onSubmit();
                                }}
                                sx={{ width: "110px", borderRadius: 20 }}
                            >
                                {t("search")}
                            </Button>  
                        </Fragment>
                        <AdditionalPopup
                            visibled={additionalPopupVisibled}
                            setVisibled={setAdditionalPopupVisibled}
                            data={additionalData}
                            onChangeValue={onChangeAdditionalData}
                        />
                    </FocusBox>
                </Grid>

                {!hidenInputUserIds && (
                    <Grid item xs={12}>
                        <FormField
                            value=""
                            variant="outlined"
                            // errorMessage={errUserIds}
                            placeholder={t("tripbooking:add_participants_trip")}
                            onClick={() => setVisibled(true)}
                            InputProps={{ startAdornment: <PersonAddOutlined color="secondary" /> }}
                        />

                        <ModalSearchUserByOrganization
                            open={visibled}
                            userIds={userIds || []}
                            onClose={() => setVisibled(false)}
                            onAction={(data) => {
                                onAddNewUsers(data);
                                setVisibled(false);
                            }}
                        />

                        <Box
                            sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                alignItems: "center",
                                mt: 1,
                            }}
                        >
                            {(users || [])?.map((el, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        px: 2,
                                        py: 0.5,
                                        display: "flex",
                                        borderRadius: 10,
                                        alignItems: "center",
                                        border: "1px solid #ddd",
                                        justifyContent: "space-between",
                                        gap: 1,
                                    }}
                                >
                                    <Avatar
                                        text={el.fullName}
                                        src={Helpers.getFileAccessUrl(el.avatarId)}
                                        style={{
                                            width: "35px",
                                            height: "35px",
                                        }}
                                    />

                                    <Typography
                                        variant="button"
                                        fontWeight="bold"
                                        sx={{
                                            overflow: "hidden",
                                            whiteSpace: "nowrap",
                                            textOverflow: "ellipsis",
                                            width: { xs: "100px", sm: "auto" },
                                        }}
                                    >
                                        {el.fullName}
                                    </Typography>

                                    <IconButton onClick={() => onRemoveUser(el)}>
                                        <Close fontSize="small" />
                                    </IconButton>
                                </Box>
                            ))}
                        </Box>
                    </Grid>
                )}
                <Grid item xs={12}>
                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                            justifyContent: "flex-end",
                        }}
                    >
                        <ControlLabelCheckBox
                            value={data.isApartment}
                            label={t("tripbooking:apartments_only")}
                            onChangeValue={(value) => onChangeValue(value, "isApartment")}
                        />
                        <Button
                            onClick={(e) => {
                                e.stopPropagation();
                                setAdditionalPopupVisibled(false);
                                onSubmit();
                            }}
                        >
                            {t("tripbooking:search_stays")}
                        </Button>
                    </Box>
                </Grid>
              
            </Grid> */}
        </Box>
    );
};

export default WebView;
