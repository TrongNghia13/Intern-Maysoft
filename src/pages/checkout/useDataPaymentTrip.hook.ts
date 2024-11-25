import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import Helpers from "@src/commons/helpers";
import Constants from "@src/constants";
import PathName from "@src/constants/PathName";
import Resources from "@src/constants/Resources";
import BookingService from "@src/services/booking/BookingService";
import AdministrativeDivisionService from "@src/services/common/AdministrativeDivisionService";
import UserService from "@src/services/identity/UserService";
import OrderService from "@src/services/sale/OrderService";

import { OrderPricingType, PaymentStatus, PaymentType } from "@src/commons/enum";
import { ICodename, IDetailBooking, IMultiLanguageContent, IMultiLanguageContentByDeepTech, IPlaceObj } from "@src/commons/interfaces";
import { hideLoading, showLoading } from "@src/store/slice/common.slice";

const useDataPaymentTrip = (id?: string) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { t } = useTranslation(["common", "tripbooking"]);

    const [loading, setLoading] = useState<boolean>(true);
    const [loadingPage, setLoadingPage] = useState<boolean>(false);

    const [expanded, setExpanded] = useState<boolean[]>([]);
    const [dataOrderCheckout, setDataOrderCheckout] = useState<IOrderCheckout[]>([]);
    const [paymentMethod, setPaymentMethod] = useState<PaymentType>(PaymentType.Debt);
    const [dataBooking, setDataBooking] = useState<IDetailBooking | undefined>(undefined);

    const listPaymentMethod: ICodename[] = [
        { code: PaymentType.NinePayCollection, name: "Chuyển khoản ngân hàng/ QR code", detail: { logo: Resources.Images.VIET_QR } },
        { code: PaymentType.NinePayATM, name: "Thẻ ATM nội địa", detail: { logo: Resources.Images.NAPAS } },
        { code: PaymentType.NinePayCredit, name: "Thẻ Visa/Master/JCB phát hành trong nước", detail: { logo: Resources.Images.MASTERCARD } },
        {
            code: PaymentType.NinePayCreditInternational,
            name: "Thẻ Visa/Master/JCB phát hành nước ngoài",
            detail: { logo: Resources.Images.MASTERCARD },
        },
        { code: PaymentType.Debt, name: "Ví công nợ", detail: { logo: Resources.Images.DEBT } },
    ];

    const [orderId] = useState(router?.query?.orderId);
    const [targetId] = useState(router?.query?.targetId);
    const [dataMember, setDataMember] = useState<any[]>([]);

    useEffect(() => {
        if (!Helpers.isNullOrEmpty(orderId)) {
            getDetailOrder(orderId as string);
        } else {
            router.back();
        }
    }, [orderId]);

    useEffect(() => {
        if (dataOrderCheckout?.[0]?.paymentStatus === PaymentStatus.Completed || dataOrderCheckout?.[0]?.paymentStatus === PaymentStatus.Issued) {
            Helpers.showAlert("Đã thanh toán thành công!", "success", () => {
                router.push({
                    pathname: PathName.TRIPS_DETAIL,
                    query: {
                        id: targetId,
                    },
                });
            });
        }
    }, [dataOrderCheckout?.[0]?.paymentStatus]);

    useEffect(() => {
        (async () => {
            if ([...(dataBooking?.members || [])].length > 0) {
                const result = await getDataUserByListID([...(dataBooking?.members || [])], dataBooking?.organizationId || "");

                setDataMember(result);
            }
        })();
    }, [dataBooking?.members, dataBooking?.organizationId]);

    const getPaymentMethod = (data: IOrderCheckout[]) => {
        if (data.length === 0) return PaymentType.Debt;
        return data[0].paymentMethod;
    };

    const getPricingRequest = (data: IOrderCheckout[], paymentMethod: PaymentType) => {
        const requestData: IRequestPricing[] = [];
        for (const item of data) {
            let pricingType = OrderPricingType.Normal;
            let externalRequest: IExternalRequest = {};

            const orderDetailRequests = (item.orderDetails || []).map((orderDetail) => {
                const newExtra: IFlightDetailByOrder = Helpers.converStringToJson(orderDetail.extraInformation);

                const extraInformation: IFlightDetailByOrder = Helpers.toCamelCaseObj(newExtra);

                pricingType = extraInformation?.pricingType;

                externalRequest = extraInformation?.externalRequest;

                const newItemReturn: OrderDetailRequest = {
                    id: orderDetail?.id,
                    type: orderDetail?.type,
                    itemId: orderDetail?.itemId,
                    orderId: orderDetail?.orderId,
                    quantity: orderDetail?.quantity,
                    promotionId: orderDetail?.promotionId,
                    description: orderDetail?.description,
                    discounts: [
                        {
                            discountRate: 0,
                            discount: 0,
                        },
                    ],
                    amount: orderDetail?.amount,
                    unitPrice: orderDetail?.unitPrice,
                    adjustPrice: extraInformation?.adjustPrice || 0,
                    specificTax: extraInformation?.specificTax || 0,
                    feeCode: extraInformation?.serviceeFeeSettingCode,
                    extraInformation: orderDetail?.extraInformation,
                };

                return newItemReturn;
            });

            requestData.push({
                id: item.id,
                serviceCode: item.serviceCode,
                organizationId: item.organizationId,
                groupId: item.groupId,
                buyer: item.buyer,
                paymentMethod,
                type: item.type,
                seller: item.seller,
                shippingMethod: item.shippingMethod,
                shippingAddress: item.shippingAddress,
                billingAddress: item.billingAddress,
                orderDetailRequests: orderDetailRequests || [],
                billDiscount: {
                    discount: 0,
                    discountRate: 0,
                },
                note: item.note,
                usePoint: 0,
                promotionIds: [],
                voucherCodes: [],
                location: item.location,
                pricingType: pricingType,
                orderStatus: item.orderStatus,
                externalRequest: externalRequest,
            });
        }

        return requestData;
    };

    const saveData = (orderData: IOrderCheckout[], paymentMethod: PaymentType) => {
        setDataOrderCheckout(orderData);
        setPaymentMethod(paymentMethod);
        setExpanded(Array(orderData.length).fill(true));
    };

    const checkRefreshPricing = async (result: IOrderCheckout[]) => {
        const checkPricing = {
            isPricing: false,
            index: -1,
        };

        // result.some((item, index) => {
        //     const isPricing = item?.partnerPaymentMethod !== item?.paymentMethod;
        //     if (isPricing) {
        //         Object.assign(checkPricing, { isPricing, index });
        //         return true;
        //     }
        //     return isPricing;
        // });

        // if (checkPricing.isPricing) {
        //     const paymentMethod = result[checkPricing.index]?.partnerPaymentMethod || PartnerPaymentMethod.None;

        //     const requestData = getPricingRequest(result, paymentMethod);

        //     const pricingResult = await OrderService.pricingMultiple(requestData);

        //     saveData(pricingResult || [], paymentMethod);

        //     setLoading(false);
        // }
        return checkPricing.isPricing;
    };

    const getLastTicketDate = (data: IOrderCheckout[]) => {
        const newExtra = Helpers.converStringToJson(data?.[0]?.orderDetails[0]?.extraInformation);

        const extraInformation: { lastTicketDate: string } = Helpers.toCamelCaseObj(newExtra);

        const lastTicketDate = extraInformation?.lastTicketDate || "";

        return moment.utc(lastTicketDate, "DD/MM/YYYY HH:mm").unix();
    };

    const getDetailOrder = async (id: string) => {
        try {
            dispatch(showLoading());

            setLoading(true);
            setLoadingPage(true);

            const resultOrder = await OrderService.getDetailByIds([id]);

            if (resultOrder?.[0]?.paymentStatus === PaymentStatus.Completed || resultOrder?.[0]?.paymentStatus === PaymentStatus.Issued) {
                Helpers.showAlert("Đã thanh toán thành công!", "success", () => {
                    router.push({
                        pathname: PathName.TRIPS_DETAIL,
                        query: {
                            id: targetId,
                        },
                    });
                });
            } else {
                const lastTicketDate = getLastTicketDate(resultOrder);

                if (lastTicketDate < moment().unix()) {
                    Helpers.showAlert("Đơn hàng đã hết hạn thanh toán!", "warning", () => {
                        router.push({
                            pathname: PathName.TRIPS_DETAIL,
                            query: {
                                id: targetId,
                            },
                        });
                    });
                }

                if (![PaymentStatus.New, PaymentStatus.Pending, PaymentStatus.WaitingConfirm].includes(resultOrder?.[0]?.paymentStatus)) {
                    Helpers.showAlert("Đơn hàng đã được xử lý!", "warning", () => {
                        router.push({
                            pathname: PathName.TRIPS_DETAIL,
                            query: {
                                id: targetId,
                            },
                        });
                    });
                    return;
                }

                const resultBooking = await BookingService.getDetailByOrderId(id);
                setDataBooking(resultBooking);

                const isRefreshPricing = await checkRefreshPricing(resultOrder);
                if (isRefreshPricing) return;

                saveData(resultOrder || [], getPaymentMethod(resultOrder));
                setLoading(false);
            }
        } catch (error) {
            Helpers.handleError(error, router, dispatch);
        } finally {
            setLoadingPage(false);
            dispatch(hideLoading());
        }
    };

    const handlePricing = async (paymentMethod: number) => {
        setPaymentMethod(paymentMethod);

        try {
            dispatch(showLoading());

            setLoadingPage(true);

            const requestData = getPricingRequest(dataOrderCheckout, paymentMethod);

            const result = await OrderService.pricingMultiple(requestData);

            setDataOrderCheckout(result);
        } catch (error) {
            Helpers.handleError(error, router, dispatch);
        } finally {
            setLoadingPage(false);
            dispatch(hideLoading());
        }
    };

    const getDataUserByListID = async (ids: string[], organizationId: string) => {
        try {
            const newDataCities: Map<string, string> = new Map();

            const newData: {
                id: string;
                fullName: string;
                email: string;
                dateOfBirth: any;
                gender: number;
                phoneNumber: string;
                passportNo?: string;
                nationality?: string;
                passportIssuedPlace?: string;
                passportExpiredDate?: string | number;
            }[] = [];

            const result = await UserService.getPaged({
                pageNumber: 1,
                pageSize: ids.length,
                listStatus: [1],
                selectedIds: ids,
                clientId: Constants.CLIENT_ID,
                organizationId: organizationId,
            });

            const resultCities = await AdministrativeDivisionService.getAll({ type: 1 });
            [...(resultCities || [])].forEach((item: any) => {
                newDataCities.set(item.code, item.name);
            });

            [...(result.selectedItems || [])].forEach((el) => {
                let fullName = el.fullName || el.userName;

                if (!Helpers.isNullOrEmpty(el.organizationUserProfile?.firstName) || !Helpers.isNullOrEmpty(el.organizationUserProfile?.lastName)) {
                    fullName = `${el.organizationUserProfile?.lastName || ""} ${el.organizationUserProfile?.firstName || ""}`;
                }

                newData.push({
                    id: el.id,
                    fullName: fullName,
                    email: el.organizationUserProfile?.email,
                    gender: el.organizationUserProfile?.gender,
                    dateOfBirth: el.organizationUserProfile?.dateOfBirth,
                    phoneNumber: el.organizationUserProfile?.phoneNumber,

                    passportNo: el.organizationUserProfile?.passportNo,
                    passportExpiredDate: el.organizationUserProfile?.passportExpiredDate,
                    nationality: newDataCities.get(el.organizationUserProfile?.nationality),
                    passportIssuedPlace: newDataCities.get(el.organizationUserProfile?.passportIssuedPlace),
                });
            });

            return newData;
        } catch (error) {
            return [];
        }
    };

    const convertPMToPT = (paymentMethod: PaymentType) => {
        if (paymentMethod === PaymentType.Paypal) return PaymentType.Paypal;
        if (paymentMethod === PaymentType.Banking) return PaymentType.Banking;
        if (paymentMethod === PaymentType.VnPay) return PaymentType.VnPay;
        if (paymentMethod === PaymentType.Cash) return PaymentType.Cash;
        if (paymentMethod === PaymentType.Debt) return PaymentType.Debt;

        if (paymentMethod === PaymentType.Mobile) return PaymentType.Mobile;

        if (paymentMethod === PaymentType.NinePayATM) return PaymentType.NinePayATM;
        if (paymentMethod === PaymentType.NinePayCredit) return PaymentType.NinePayCredit;
        if (paymentMethod === PaymentType.NinePayCollection) return PaymentType.NinePayCollection;
        if (paymentMethod === PaymentType.NinePayCreditInternational) return PaymentType.NinePayCreditInternational;

        return PaymentType.Cash;
    };

    const getConfirmPaymentRequest = (
        data: IOrderCheckout[],
        paymentMethod: PaymentType,
        targetId: string
    ): {
        targetId: string;
        orderIds: string[];
        paymentType: number;
    } => {
        return {
            targetId,
            orderIds: data.map((el) => el.id),
            paymentType: convertPMToPT(paymentMethod),
        };
    };

    const handlePaymentDebt = async (newReq: { targetId: string; paymentMethod: number; data: IOrderCheckout[] }) => {
        try {
            dispatch(showLoading());

            let request = await getConfirmPaymentRequest(newReq?.data, paymentMethod, newReq?.targetId);

            await OrderService.confirmPayment(request);

            Helpers.showAlert("Đã thanh toán thành công!", "success", () => {
                router.push({
                    pathname: PathName.TRIPS_DETAIL,
                    query: {
                        id: newReq?.targetId,
                    },
                });
            });
        } catch (error) {
            Helpers.handleError(error, router, dispatch);
        } finally {
            dispatch(hideLoading());
        }
    };

    const handlePaymentNinePay = async (newReq: { targetId: string; paymentMethod: number; data: IOrderCheckout[] }) => {
        try {
            dispatch(showLoading());

            let request = await getConfirmPaymentRequest(newReq?.data, paymentMethod, newReq?.targetId);

            const result = await OrderService.confirmPayment({
                ...request,
                returnUrl: `${window.location.origin}${PathName.TRIPS}/${newReq?.targetId}`,
            });

            router.push(result?.redirectUrl || "");
        } catch (error) {
            Helpers.handleError(error, router, dispatch);
        } finally {
            dispatch(hideLoading());
        }
    };

    const lastTicketDate = getLastTicketDate(dataOrderCheckout);

    const handleSubmit = () => {
        if (lastTicketDate <= moment().unix()) {
            Helpers.showAlert("Đơn hàng đã hết hạn thanh toán!", "warning");
            return;
        }
        if (paymentMethod === PaymentType.Debt) {
            handlePaymentDebt({
                data: dataOrderCheckout,
                paymentMethod: paymentMethod,
                targetId: targetId as string,
            });
        } else {
            handlePaymentNinePay({
                data: dataOrderCheckout,
                paymentMethod: paymentMethod,
                targetId: targetId as string,
            });
        }
    };

    return {
        lastTicketDate,
        listPaymentMethod,
        loading,
        setLoading,
        expanded,
        setExpanded,
        dataMember,
        setDataMember,
        loadingPage,
        setLoadingPage,
        dataBooking,
        setDataBooking,
        paymentMethod,
        setPaymentMethod,
        dataOrderCheckout,
        setDataOrderCheckout,

        handleSubmit,
        handlePricing,
        getDetailOrder,
        getPricingRequest,
        checkRefreshPricing,
        getDataUserByListID,

        handlePaymentDebt,
        handlePaymentNinePay,
    };
};

export default useDataPaymentTrip;

export interface IRequestPricing {
    id: string;
    serviceCode: string;
    organizationId: string;
    groupId?: string;
    buyer: string;
    paymentMethod: number;
    type: number;
    seller: string;
    shippingMethod: number;
    shippingAddress: number;
    billingAddress: number;
    orderDetailRequests: OrderDetailRequest[];
    billDiscount: {
        discountRate: number;
        discount: number;
    };
    note: string;
    shoppingCartId?: number;
    shoppingCartUserId?: number;
    promotionIds: number[];
    voucherCodes: string[];
    usePoint: number;
    location: string;
    orderStatus: number;
    platform?: number;
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    pricingType: number;
    externalRequest?: IExternalRequest;
}

export interface OrderDetailRequest {
    id: string;
    type: number;
    orderId: string;
    itemId: string;
    quantity: number;
    promotionId: string;
    description: string;
    discounts: {
        discountRate: number;
        discount: number;
    }[];
    extraInformation: string;
    amount: number;
    unitPrice: number;
    adjustPrice: number;
    specificTax: number;
    feeCode?: string;
}

export interface IOrderCheckout {
    mobileAmount: number;
    originAmount: number;
    totalItem: number;
    discountWithPromotion: number;
    discountWithoutPromotion: number;
    sellerName: string;
    buyerName: string;
    buyerPhoneNumber: any;
    buyerAddress: string;
    buyerType: any;
    buyerClass: any;
    buyerUserId: string;
    createUserName: string;
    transactionId: any;
    organization: IOrganization;
    orderDetails: IOrderDetail[];
    orderDiscounts: IOrderDiscount[];
    orderTaxs: any[];
    orderHistories: IOrderHistory[];
    discountDetails: any;
    availablePromotions: any;
    applyPromotions: any;
    discountNumber: number;
    paymentInfo: any;
    type: number;
    tenantCode: string;
    serviceCode: string;
    organizationId: string;
    groupId: any;
    seller: string;
    buyer: string;
    shippingMethod: number;
    shippingAddress: any;
    paymentMethod: number;
    billingAddress: any;
    orderCode: string;
    orderDate: string;
    discount: number;
    amount: number;
    tax: number;
    currency: string;
    location: any;
    note: string;
    paymentFee: number;
    paymentStatus: number;
    orderStatus: number;
    referenceId: any;
    id: string;
    status: number;
    serviceFee: number;
    createTime: string;
    createUser: string;
    updateTime: string;
    updateUser: string;
    partnerPaymentMethod: number;
}

export interface IOrderDiscount {
    itemId: string;
    orderDetailId: string;
    isIssued: boolean;
    promotionCode: string;
    type: number;
    invoiceId: string;
    invoiceDetailId: string;
    promotionId: string;
    voucherCodeId: string;
    discountRate: number;
    discount: number;
    discountQuantity: number;
    id: string;
    status: number;
    createTime: string;
    createUser: string;
    updateTime: string;
    updateUser: string;
}

export interface IOrganization {
    id: string;
    tenantCode: string;
    tenantName: string;
    organizationProfiles: IOrganizationProfile[];
    name: IMultiLanguageContent;
    description: IMultiLanguageContent;
    type: number;
    ownerId: string;
}

export interface IOrganizationProfile {
    name: IMultiLanguageContent;
    description: IMultiLanguageContent;
    addressId: string;
    phoneNumber: string;
    email: string;
    id: string;
    faxNumber: string;
    taxNumber: string;
    location: string;
    currency: string;
}

export interface IOrderDetail {
    itemName: IMultiLanguageContent;
    productName: IMultiLanguageContent;
    productCode: string;
    itemSku: string;
    itemStatus: number;
    promotionId: any;
    productDiscountType: number;
    suggestQuantity: number;
    suggestDiscount: number;
    orderDetailComboItems: any;
    itemTaxes: any;
    itemDiscount: IItemDiscount[];
    itemAttributes: IItemAttribute[];
    itemPhotos: IItemPhoto[];
    type: number;
    orderId: string;
    itemId: string;
    promotion: number;
    description: any;
    quantity: number;
    discount: number;
    unitPrice: number;
    amount: number;
    tax: number;
    extraInformation: string;
    id: string;
    status: number;
    createTime: string;
    createUser: string;
    updateTime: string;
    updateUser: string;
}

export interface IItemDiscount {
    itemId: string;
    orderDetailId: string;
    isIssued: boolean;
    promotionCode: string;
    type: number;
    invoiceId: string;
    invoiceDetailId: string;
    promotionId: string;
    voucherCodeId: string;
    discountRate: number;
    discount: number;
    discountQuantity: number;
    id: string;
    status: number;
    createTime: string;
    createUser: string;
    updateTime: string;
    updateUser: string;
}

export interface IItemAttribute {
    type: number;
    valueType: number;
    organizationId: string;
    value: any;
    title: IMultiLanguageContent;
    iconId: any;
    itemId: string;
    attributeCode: string;
    attributeValue: string;
    id: string;
    status: number;
    createTime: string;
    createUser: string;
    updateTime: string;
    updateUser: string;
}

export interface IItemPhoto {
    itemId: string;
    sectionId: string;
    photoId: string;
    photoUrl: string;
    displayOrder: number;
    pixels: number;
    id: string;
    status: number;
    createTime: string;
    createUser: string;
    updateTime: string;
    updateUser: string;
}

export interface IOrderHistory {
    createUserName: string;
    orderId: string;
    orderStatus: number;
    note: any;
    id: string;
    status: number;
    createTime: string;
    createUser: string;
    updateTime: string;
    updateUser: string;
}

export interface IFlightDetailByOrder {
    carrierMarketingObj: IMultiLanguageContentByDeepTech;
    carrierOperatorObj: IMultiLanguageContentByDeepTech;
    flightNumber: string;
    cabinClass: string;
    departDate: number;
    arrivalDate: number;
    departPlaceObj: IPlaceObj;
    arrivalPlaceObj: IPlaceObj;
    isInternational: boolean;
    externalRequest: IExternalRequest;
    pricingType: number;
    adjustPrice: null;
    specificTax: null;
    lastTicketDate: string;
    serviceeFeeSettingCode: string;
    orderId: number;
    bookingId: number;
}

export interface IExternalRequest {
    tax?: number;
    discount?: number;
    amount?: number;
    orderDate?: number;
    currency?: string;
}

export interface IPassengerQuantity {
    adt: number;
    chd: number;
    inf: number;
}
export interface ISessionUser {
    id_token?: string;
    session_state: string | null;
    access_token: string;
    refresh_token?: string;
    token_type: string;
    scope?: string;
    profile: any;
    expires_at?: number;
}
