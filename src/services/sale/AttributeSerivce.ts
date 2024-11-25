import Helpers from "@src/commons/helpers";
import SaleClient from "./SaleClient";
import { IMultiLanguageContent } from "@src/commons/interfaces";
import Constants from "@src/constants";

export interface IRecordAttributeValue {
    attributeValues: IAttributeValues[];
    type: number;
    organizationId: string;
    displayType: number;
    valueType: number;
    valueSourceType: number;
    code: string;
    title: IMultiLanguageContent;
    iconId: string;
    tagId: any;
    referenceId: any;
    id: string;
    status: number;
    createTime: string;
    createUser: string;
    updateTime: string;
    updateUser: string;
}

export interface IAttributeValues {
    organizationId: string;
    attributeCode: string;
    valueType: number;
    value: IMultiLanguageContent;
    iconId: string;
    referenceId: string;
    id: string;
    status: number;
    createTime: string;
    createUser: string;
    updateTime: string;
    updateUser: string;
}

const AttributeService = {
    async getByCode(data: { code: string; referenceIds?: string[]; organizationId?: string }): Promise<IRecordAttributeValue> {
        // let params: any = {
        //     code,
        // };
        // if (organizationId) {
        //     params.organizationId = organizationId;
        // }
        // if (referenceIds) {
        //     params.referenceIds = referenceIds;
        // }
        const result = await SaleClient().get(Constants.ApiPath.ATTRIBUTE.GET_BY_CODE + `?${Helpers.handleFormatParams(data)}`, {
            // params: {
            //     code,
            //     referenceIds,
            //     organizationId,
            // },
        });
        return result.data.result;
    },
};

export default AttributeService;
