import { useMediaQuery } from "@mui/material";
import React, { useEffect, useState } from "react";

import { SearchHotelComponentMode } from "@src/commons/enum";
import Helpers from "@src/commons/helpers";
import { useData, usePopup } from "../../hooks/searchHotel";
import { ISearchHotelData } from "../../hooks/searchHotel/useData";
import { ModalSearchUserByOrganization } from "../Modal/ModalSearchUserByOrganization";
import MobileView from "./mobileView";
import WebView from "./webView";

interface IProps {
    hidenInputUserIds?: boolean;
    onSearch: (data: ISearchHotelData) => void;
    searchData: ISearchHotelData;
    mode?: SearchHotelComponentMode;
}

const SearchHotelComponent: React.FC<IProps> = ({ onSearch, searchData, hidenInputUserIds, mode = SearchHotelComponentMode.Normal }) => {
    const isWebview = useMediaQuery("(min-width:1190px)");

    const {
        mobilePopupVisibled,
        setMobilePopupVisibled,
        locationPopupVisibled,
        setLocationPopupVisibled,
        calenderPopupVisibled,
        setCalenderPopupVisibled,
        additionalPopupVisibled,
        setAdditionalPopupVisibled,
    } = usePopup();

    const { data, additionalData, onChangeValue, onChangeAdditionalData, onClickSelectLocation, onSubmit, users, onAddNewUsers, onRemoveUser } =
        useData({
            mode,
            onSearch,
            setLocationPopupVisibled,
            setCalenderPopupVisibled,
            searchData,
        });

    useEffect(() => {
        if (!isWebview) {
            setLocationPopupVisibled(true);
            setCalenderPopupVisibled(false);
            setAdditionalPopupVisibled(false);
        }
        if (isWebview) setMobilePopupVisibled(false);
    }, [isWebview]);

    const [visibledSearchUser, setVisibledSearchUser] = useState<boolean>(false);
    const [selectedIndex, setSelectedIndex] = useState<number | undefined>(undefined);

    const props = {
        users,
        onAddNewUsers,
        onRemoveUser,
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
        hidenInputUserIds: hidenInputUserIds || false,
        setSelectedIndex,
        setVisibledSearchUser,
        mode,
    };

    return (
        <>
            {isWebview ? <WebView {...props} /> : <MobileView {...props} />}
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
        </>
    );
};

export default SearchHotelComponent;
