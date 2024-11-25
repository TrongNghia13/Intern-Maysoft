import { useState } from "react";

const useData = () => {
    const [mobilePopupVisibled, setMobilePopupVisibled] = useState<boolean>(false);
    const [locationPopupVisibled, setLocationPopupVisibled] = useState<boolean>(false);
    const [calenderPopupVisibled, setCalenderPopupVisibled] = useState<boolean>(false);
    const [additionalPopupVisibled, setAdditionalPopupVisibled] = useState<boolean>(false);

    return {
        mobilePopupVisibled,
        setMobilePopupVisibled,
        locationPopupVisibled,
        setLocationPopupVisibled,
        calenderPopupVisibled,
        setCalenderPopupVisibled,
        additionalPopupVisibled,
        setAdditionalPopupVisibled,
    };
};

export default useData;
