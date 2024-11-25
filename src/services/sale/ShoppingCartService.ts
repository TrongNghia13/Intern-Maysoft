import Constants from "@src/constants";
import SaleClient from "./SaleClient";

interface IRequest {
    // note?: string,
    // type: 0;
    clientId?: string;
    organizationId: string;
    userId: string;
    deviceId: string;
    note?: string;
    shoppingCartDetailRequests: {
        itemId: string;
        quantity: number;
    }[];
}

const ShoppingCartService = {
    async create(request: IRequest) {
        const result = await SaleClient().post(Constants.ApiPath.SHOPPING_CART.CREATE, {
            ...request,
            tenantCode: Constants.TENANT_CODE,
            serviceCode: Constants.SERVICE_CODE,
            clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
        });
        return result.data.result;
    },
};

export default ShoppingCartService;
