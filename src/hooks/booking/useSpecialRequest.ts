import { useState } from "react";
import { ISpecialRequests } from "./type";

export const useSpecialRequests = () => {
    const [specialRequests, setSpecialRequest] = useState<ISpecialRequests>({
        request: "",
        roomsClose: false,
    });

    const onChangeSpecialRequests = (value: string | boolean, key: keyof ISpecialRequests) => {
        setSpecialRequest((prev) => ({ ...prev, [key]: value }));
    };

    return {
        specialRequests,
        onChangeSpecialRequests,
    };
};

export default useSpecialRequests;
