import { Box, Button, Typography } from "@maysoft/common-component-react";
import { Search, Tune } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React from "react";

import { IOccupancy } from "@src/commons/interfaces";
import { useTranslation } from "react-i18next";
import Helpers from "../../commons/helpers";
import { IBasicData } from "../../hooks/searchHotel/useData";
import Popup from "../Popup/Popup";
import AdditionalCard from "./additionalCard";
import CalenderCard from "./calendarCard";
import LocationCard from "./locationCard";

const MobileView = ({
    mobilePopupVisibled,
    setMobilePopupVisibled,
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
}: {
    mobilePopupVisibled: boolean;
    setMobilePopupVisibled: React.Dispatch<React.SetStateAction<boolean>>;
    locationPopupVisibled: boolean;
    setLocationPopupVisibled: React.Dispatch<React.SetStateAction<boolean>>;
    calenderPopupVisibled: boolean;
    setCalenderPopupVisibled: React.Dispatch<React.SetStateAction<boolean>>;
    additionalPopupVisibled: boolean;
    setAdditionalPopupVisibled: React.Dispatch<React.SetStateAction<boolean>>;
    data: IBasicData;
    additionalData: IOccupancy[];
    onChangeValue: (value: string | number, key: keyof IBasicData) => void;
    onChangeAdditionalData: (value: number, key: keyof IOccupancy, index: number, subIndex?: number) => void;
    onClickSelectLocation: (searchText: string) => void;
    onSubmit: () => void;
}) => {
    const {
        t,
        i18n: { language },
    } = useTranslation("search_hotel");
    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 2,
                    py: 1,
                    gap: 1,
                    width: "70vw",
                }}
            >
                <Box
                    display="flex"
                    alignItems="center"
                    gap={1}
                    sx={{
                        border: "1px solid #f3f3f3",
                        boxShadow: "0 0 25px rgba(0, 0, 0, 0.1)",
                        borderRadius: 20,
                        px: 2,
                        py: 1,
                        width: "100%",
                        "&:hover": {
                            cursor: "pointer",
                        },
                    }}
                    onClick={() => setMobilePopupVisibled(true)}
                >
                    <Search />
                    <Box display="flex" flexDirection="column" gap={1}>
                        <Typography variant="caption" fontWeight="bold">
                            {data.searchText || t("any_location")}
                        </Typography>
                        <Typography variant="caption" color="secondary">
                            {[
                                `${t("from_date")}: ${Helpers.getDate(data.startDate, t("choice_date"))}`,
                                `${t("to_date")}: ${Helpers.getDate(data.endDate, t("choice_date"))}`,
                            ].join(" - ")}
                        </Typography>
                    </Box>
                </Box>
                <IconButton
                    size="small"
                    sx={{
                        border: "1px solid #000000",
                    }}
                    onClick={() => setMobilePopupVisibled(true)}
                >
                    <Tune />
                </IconButton>
            </Box>
            <Popup
                visibled={mobilePopupVisibled}
                setVisibled={setMobilePopupVisibled}
                title={t("stays")}
                onAction={() => {
                    onSubmit();
                    setMobilePopupVisibled(false);
                }}
            >
                <Box display="flex" flexDirection="column" gap={1} pb={2}>
                    <LocationCard
                        locationPopupVisibled={locationPopupVisibled}
                        setLocationPopupVisibled={setLocationPopupVisibled}
                        data={data}
                        onChangeValue={onChangeValue}
                        onClick={() => {
                            setLocationPopupVisibled(true);
                            setCalenderPopupVisibled(false);
                            setAdditionalPopupVisibled(false);
                        }}
                    />

                    <CalenderCard
                        calenderPopupVisibled={calenderPopupVisibled}
                        data={data}
                        onChangeValue={onChangeValue}
                        onClick={() => {
                            setLocationPopupVisibled(false);
                            setCalenderPopupVisibled(true);
                            setAdditionalPopupVisibled(false);
                        }}
                    />

                    <AdditionalCard
                        additionalPopupVisibled={additionalPopupVisibled}
                        additionalData={additionalData}
                        onChangeAdditionalData={onChangeAdditionalData}
                        onClick={() => {
                            setLocationPopupVisibled(false);
                            setCalenderPopupVisibled(false);
                            setAdditionalPopupVisibled(true);
                        }}
                    />
                </Box>
            </Popup>
        </>
    );
};

export default MobileView;
