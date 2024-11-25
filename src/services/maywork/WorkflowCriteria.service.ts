import Constants from "@src/constants";
import MayworkClient from "./MayworkClient";
import { IMultiLanguageContent } from "../../commons/interfaces";



export interface IRecordWorkflowCriteria {
    id: string
    caseCode: string
    template: number
    updateTime: string
    phaseId: string
    phaseName: string
    workflowId: string
    workflowName: string
    description: IMultiLanguageContent
    details: IRecordWorkflowCriteriaDetail[]
}

export interface IRecordWorkflowCriteriaDetail {
    id: string
    name: string
    value: string
    valueType: number
    compareType: number
    criteriaId: string
    updateTime: string
}



const WorkflowCriteriaService = {

    async getByCaseCode(caseCode: string): Promise<IRecordWorkflowCriteria[]> {
        const result = await MayworkClient().get(
            Constants.ApiPath.WORKFLOW_CRITERIA.GET_BY_CASECODE + `/${caseCode}`,
        );
        return result.data.result;
    },

}

export default WorkflowCriteriaService;
