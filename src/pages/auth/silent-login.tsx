import { useEffect } from "react";

import Helpers from "@src/commons/helpers";

import { PageLoader } from "@src/components";
import { NextApplicationPage } from "../_app";

const SilentLoginPage: NextApplicationPage = () => {
    useEffect(() => {
        const device = Helpers.getDeviceInfo();
        // signIn("identity-server4", undefined, {
        //     deviceId: device.deviceId,
        //     deviceInfo: device.deviceInfo,
        // });
    }, []);

    return <PageLoader />;
};

export default SilentLoginPage;
