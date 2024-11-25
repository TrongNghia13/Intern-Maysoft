
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import Helpers from "@src/commons/helpers";
import ItineraryService from "@src/services/booking/ItineraryService";
import RequestV2Service, { IDataAppRoveRequest, IDataRejctRequest } from "@src/services/maywork/RequestV2.service";
import { useCommonComponentContext } from "@maysoft/common-component-react";
import useDataBudgetPlan from "./useDataBudgetPlan.hook";
import { useCallback, useEffect, useState } from "react";



export interface IRecordRequestV2Service {
    id: string;
    name: string;
    description: string;
    estimateAmount: string;
    detailId: string;
    details: {
        detailType: number;
        detailEndTime: number;
        detailStartTime: number;
        detailExtraInformation: string;
    }[];

    members: IRecordRequestV2Members[]
}

export interface IRecordRequestV2Members {
    id: string,
    userId: string,
    flowId: string,
    fullname: string,
    detailId: string,
    policyCompliance: number,
}

const useDataRequestApproveReject = (id?: string) => {
    const dispatch = useDispatch();

    const {
        t,
        i18n: { language },
    } = useTranslation(["common", "setting"]);

    const { getMapUserProfileByListID } = useDataBudgetPlan();

    const {
        onError,
        userInfo,
        onSuccess,
        onShowLoading,
        onHideLoading,
    } = useCommonComponentContext();

    const [allowApproval, setAllowApproval] = useState<"idle" | "allowed" | "forbidden">("idle");
    const checkAllowApprovalRequest = useCallback(async () => {
        try {
            const resultMemberIds = await RequestV2Service.getApprovalRequest();
            return (resultMemberIds.length > 0)
        } catch (error) {
            return false
        }
    }, []) 
    useEffect(() => {
        (async function() {
            const isAllow = await checkAllowApprovalRequest(); 
            setAllowApproval(isAllow ? "allowed" : "forbidden");
        })()
    }, [checkAllowApprovalRequest, userInfo?.userProfile?.organizationId])

    const getDataRequestApprovalReject = async ({ setLoading, searchText }: {
        searchText?: string,
        setLoading: (value: React.SetStateAction<boolean>) => void,
    }) => {
        try {
            setLoading(true);

            const resultMemberIds = await RequestV2Service.getApprovalRequest();

            if (resultMemberIds.length === 0) {
                setAllowApproval("forbidden");
                return { dataRequestApprovalReject: [], newDataUser: new Map() };
            } else {
                setAllowApproval("allowed");
                const result = await ItineraryService.getApproval({
                    memberIds: resultMemberIds,
                    searchText: searchText,
                });

                const ids: string[] = [];
                for (const item of result) {
                    for (const el of [...item.members || []]) {
                        !ids.includes(el.userId) && ids.push(el.userId)
                    }
                }

                const newDataUser = await getMapUserProfileByListID(ids, userInfo?.userProfile?.organizationId || "");

                return { dataRequestApprovalReject: result, newDataUser: newDataUser };
            }

        } catch (error) {
            Helpers.handleError(error);

            return { dataRequestApprovalReject: [], newDataUser: new Map() };
        } finally {
            setLoading(false);
        }
    };

    const handleApprovalRequest = async ({ data, onCallBack }: {
        data: IDataAppRoveRequest,
        onCallBack: () => void;
    }) => {
        try {
            onShowLoading && onShowLoading();

            await RequestV2Service.appRoveRequest(data);

            onCallBack();

            onSuccess && onSuccess("Đã phê duyệt thành công");
        } catch (error) {
            Helpers.handleError(error);
        } finally {
            onHideLoading && onHideLoading();
        }
    };

    const handleRejectRequest = async ({ data, onCallBack }: {
        data: IDataRejctRequest,
        onCallBack: () => void;
    }) => {
        try {
            onShowLoading && onShowLoading();

            await RequestV2Service.rejectRequest(data);

            onCallBack();

            onSuccess && onSuccess("Đã từ chối thành công");
        } catch (error) {
            Helpers.handleError(error);
        } finally {
            onHideLoading && onHideLoading();
        }
    };

    return {
        allowApproval,
        
        handleRejectRequest,
        handleApprovalRequest,
        getDataRequestApprovalReject,
    };
};

export default useDataRequestApproveReject;
