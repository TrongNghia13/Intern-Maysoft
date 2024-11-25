import { RootState } from "@src/store";
import { NextRouter, useRouter } from "next/router";
import { useRef } from "react";
import { useSelector } from "react-redux";

const useNavigateOnChangingOrganization = ({ to, action }: { to?: string, action?: (route: NextRouter) => void}) => {
    const router = useRouter();
    const organizationId = useSelector((state: RootState) => state.userInfo.userProfile.organizationId);
    const currentOrganizationIdRef = useRef(organizationId);
    if (currentOrganizationIdRef.current !== organizationId) {
        currentOrganizationIdRef.current = organizationId;
        if (action) {
            action(router);
        } else if (to) {
            router.replace(to);
        }
    }
 }

 export default useNavigateOnChangingOrganization;