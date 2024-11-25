import { useState } from "react";
import { object, string } from "yup";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useDispatch, useSelector } from "react-redux";

import Constants from "@src/constants";
import Helpers from "@src/commons/helpers";

import { RootState } from "@src/store";
import { TripTabs } from "@src/commons/enum";
import { IErrorInformation, IInformation } from "./type";
import { showSnackbar } from "@src/store/slice/common.slice";
import { IResponseConfirmDetailItineraryError } from "@src/commons/interfaces";
import ItineraryService, { IRequestConfirmDetailItinerary, ITineraryGetListDetailResponse } from "@src/services/booking/ItineraryService";
import PathName from "@src/constants/PathName";

interface IProps {
    information: IInformation;
    setInformationError: React.Dispatch<React.SetStateAction<IErrorInformation>>;
    itineraryId: string | null;
    updateUserProfile: () => Promise<void>;
}

export const useBookingSubmit = ({ information, setInformationError, itineraryId, updateUserProfile }: IProps) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const {
        t,
        i18n: { language },
    } = useTranslation(["home", "common", "booking"]);
    const [actionStatus, setActionStatus] = useState<{ [key: string]: "idle" | "submitting" | "done" }>({});
    const userProfile = useSelector((state: RootState) => state.userInfo.userProfile);

    const requestShema = object({
        firstName: string().required(),
        lastName: string().required(),
        email: string().email().required(),
        phoneNumber: string()
            .required()
            .test("phone number invalid", t("common:message.phone_number_invalid"), (value) => {
                if (!Helpers.isNullOrEmpty(value) && value && value?.length < 8) return false;
                return true;
            }),
    });

    const handleCheckBookingResponse = ({
        response,
        onCancel,
        onContinue,
        totalPriceItineraryDetail,
    }: {
        totalPriceItineraryDetail?: number;
        response: IResponseConfirmDetailItineraryError;
        onCancel?: (params: { newEstimateAmount: number; errCode: string }) => void;
        onContinue?: (params: { newEstimateAmount: number; errCode: string }) => void;
    }) => {
        const msg400500 = "Đường truyền không ổn định trong quá trình xử lý, vui lòng kiểm tra trong Chuyến đi.";

        if ([...(response.userIdErr || [])]?.length > 0 || [...(response.result || [])].length === 0)
            return Helpers.showAlert(response.mesCode || t("common:message.common_error"), "error");

        let isHtml = false;
        let onOk: (() => void) | undefined = undefined;
        let messageTemp = t("common:message.common_error");

        const textNeedApprove = response.result?.[0]?.needApprove === 1 ? "và chuyến bay cần gửi phê duyệt" : "";

        switch (response.result?.[0]?.bookingFlightResponse?.error_code) {
            case "INVALID_PASSPORT":
                messageTemp = "Passport không hợp lệ";
                break;
            case "FLIGHT_SOLD_OUT":
                messageTemp = "Rất tiếc, vé chuyến bay bạn chọn đã bán hết";
                onOk = itineraryId
                    ? () => {
                          router.replace(`${PathName.TRIPS}/${itineraryId}`);
                      }
                    : undefined;
                break;
            case "INVALID_DATE_OF_BIRTH":
                messageTemp = "Hành khách có ngày sinh không hợp lệ, vui lòng kiểm tra lại thông tin";
                break;
            case "INVALID_DATE_FORMAT":
                messageTemp = "Ngày không hợp lệ, vui lòng kiểm tra lại thông tin";
                break;
            case "ITINERARY_ALREADY_EXIST_PASSENGER":
                messageTemp = "Tên hành khách đang được sử dụng trong một đặt chỗ khác, vui lòng kiểm tra lại thông tin.";
                break;
            case "PAX_NAME_EXISTED_IN_ANOTHER_BOOKING":
                messageTemp = "Tên hành khách đang được sử dụng trong một đặt chỗ khác, vui lòng kiểm tra lại thông tin.";
                break;
            case "FLIGHT_FEE_MISMATCH":
                isHtml = true;
                messageTemp = `Giá vé đã bị thay đổi bạn ${textNeedApprove} có muốn tiếp tục đặt vé?`;
                break;
            case "FARE_DATA_CHANGED":
                isHtml = true;
                messageTemp = `Giá vé đã bị thay đổi ${textNeedApprove} bạn có muốn tiếp tục đặt vé?`;
                break;
            case "INVALID_PASSPORT_EXPIRY_DATE":
                messageTemp = "Ngày hết hạn hộ chiếu phải từ 6 tháng trở lên. Vui lòng kiểm tra và cập nhật thông tin hộ chiếu.";
                break;
            case "PASSENGER_DUPLICATE":
                messageTemp = "Chuyến bay có từ 2 hành khách bị trùng tên, vui lòng kiểm tra lại thông tin.";
                break;
            case "DUPLICATE_NAMES":
                messageTemp = "Chuyến bay có từ 2 hành khách bị trùng tên, vui lòng kiểm tra lại thông tin.";
                break;
            case "FULL_NAME_TOO_LONG":
                messageTemp = "Tên hành khách dài quá số ký tự quy định của hãng hàng không.";
                break;
            case "BOOKING_FAILED":
                messageTemp = "Đặt vé thất bại, vui lòng chọn lại chuyến bay khác";
                break;
            case "TIMEOUT_ERROR_BOOKING":
                messageTemp = msg400500;
                break;
            case "OTHER":
                messageTemp = "Những lỗi khác không xác định. Đặt vé thất bại.";
                break;
            case "SOMETHING_ERROR":
                messageTemp = "Đặt vé thất bại, vui lòng chọn lại chuyến bay khác";
                break;
            default:
                if ([400, 500].includes(response.result?.[0]?.bookingFlightResponse?.statusCode || 0)) {
                    messageTemp = msg400500;
                } else {
                    messageTemp = "Đặt vé thất bại, vui lòng chọn lại chuyến bay khác";
                }
                break;
        }

        if (isHtml) {
            const valuePayment = parseInt(response.result?.[0]?.bookingFlightResponse?.new_fare_amount_info?.total_fare_amount || 0);
            const totalPrice = totalPriceItineraryDetail || 0;
            const valueDifference = Math.abs(valuePayment - (totalPrice || 0));

            Helpers.showConfirmAlert(
                messageTemp,
                () => {
                    onContinue && onContinue({ newEstimateAmount: valuePayment, errCode: "FLIGHT_FEE_MISMATCH" });
                },
                () => {
                    onCancel && onCancel({ newEstimateAmount: valuePayment, errCode: "FLIGHT_FEE_MISMATCH" });
                },
                "Tiếp tục",
                "Hủy bỏ",
                `<div style="padding: 16px; display: flex; flex-direction: column; gap: 8px;">
                    <div style="padding-bottom: 8px; display: flex; justify-content: center; align-items: center; font-size: 1rem">
                        <span>${messageTemp}</span>
                    </div>
                    <div style="gap:1; display: grid; margin-bottom: 16px">
                        <div style="display: flex; justify-content: space-between; align-items: center; font-weight: bold;">
                            <span style="font-weight: bold;">Giá mới (chưa bao gồm Phí dịch vụ)</span>
                            <span style="font-weight: bold; color: #FB8C00">${Helpers.formatCurrency(valuePayment)} VND</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-weight: bold;">Giá cũ (chưa bao gồm Phí dịch vụ)</span>
                            <span style="color: #1A73E8">${Helpers.formatCurrency(totalPrice)} VND</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-weight: bold;">Chênh lệch</span>
                            <span style="color: #F44335">
                                ${Helpers.formatCurrency(valueDifference)} VND
                            </span>
                        </div>
                    </div>
                </div>`
            );
        } else {
            Helpers.showAlert(messageTemp, "error", onOk);
        }
    };

    const onConfirmDetail = itineraryId
        ? async ({
              isFirstCall = true,
              itineraryDetail: item,
              totalPriceItineraryDetail,
              onCallBack,
          }: {
              isFirstCall: boolean;
              totalPriceItineraryDetail?: number;
              itineraryDetail: ITineraryGetListDetailResponse;
              onCallBack?: (params?: { detail: ITineraryGetListDetailResponse; newEstimateAmount: number }) => void;
          }) => {
              let isSuccess = false;
              setActionStatus((a) => (a[item.sequence] === "submitting" ? a : { ...a, [item.sequence]: "submitting" }));
              try {
                  await requestShema.validate(information, { abortEarly: false });
                  await updateUserProfile();

                  const requestData: IRequestConfirmDetailItinerary = {
                      itineraryId,
                      firstName: information.firstName,
                      lastName: information.lastName,
                      phoneNumber: information.phoneNumber.replace(new RegExp(`^${information.phoneCode}`), ""),
                      phoneCode: "+".concat(information.phoneCode),
                      email: information.email,
                      detailIdComfirm: [item.id],

                      isConfirmedPrice: isFirstCall ? false : true,
                  };

                  const response = await ItineraryService.confirmDetails(requestData);

                  if (response?.result?.isSuccess) {
                      isSuccess = true;
                      // window.open(`${response?.result?.value}&locales=${language}&isBooking=true&targetId=${itineraryId}&activeUser=${userProfile.identityId}`, "_blank");
                      // TODO: replace with above when possible

                      // window.location.href = `${response?.result?.value}&locales=${language}&isBooking=true&targetId=${itineraryId}&activeUser=${userProfile.identityId}&emailActiveUser=${userProfile.email}`;

                      const newValue = response?.result?.value;
                      const lengthStr = `${newValue}`.length;
                      const indexStr = `${newValue}`.indexOf("orderId=");
                      const strOrderId = `${newValue}`.substring(indexStr, lengthStr);
                      const [_, orderIdValue] = strOrderId.split("=");

                      router.push({
                          pathname: PathName.CHECKOUT,
                          query: {
                              orderId: orderIdValue,
                              targetId: itineraryId,
                          },
                      });
                  } else {
                      isSuccess = false;

                      handleCheckBookingResponse({
                          response: {
                              ...(response.result as any),
                              mesCode: response.message,
                          },
                          totalPriceItineraryDetail,
                          onContinue({ errCode, newEstimateAmount }) {
                              onCallBack && onCallBack(isItineraryUpdatePrice(errCode) ? { detail: item, newEstimateAmount } : undefined);
                              if ((response.result as any)?.result?.[0]?.needApprove === 1) {
                                  onSendApproval &&
                                      onSendApproval({
                                          item,
                                          isFirstCall: false,
                                          totalPriceItineraryDetail,
                                      });
                              }
                              if ((response.result as any)?.result?.[0]?.needApprove === 0) {
                                  onConfirmDetail &&
                                      onConfirmDetail({
                                          isFirstCall: false,
                                          itineraryDetail: item,
                                          totalPriceItineraryDetail,
                                      });
                              }
                          },
                          onCancel({ errCode, newEstimateAmount }) {
                              onCallBack && onCallBack(isItineraryUpdatePrice(errCode) ? { detail: item, newEstimateAmount } : undefined);
                          },
                      });
                  }
              } catch (error: any) {
                  isSuccess = false;
                  if (error.name === "ValidationError") {
                      const newError: IErrorInformation = Helpers.handleValidationError(error);
                      setInformationError(newError);
                  } else {
                      Helpers.handleError(error);
                  }
              } finally {
                  setActionStatus((a) => ({ ...a, [item.sequence]: isSuccess ? "done" : "idle" }));
              }
          }
        : undefined;

    const onSendApproval = itineraryId
        ? async ({
              isFirstCall = true,
              item,
              totalPriceItineraryDetail,
              onCallBack,
          }: {
              isFirstCall: boolean;
              totalPriceItineraryDetail?: number;
              item: ITineraryGetListDetailResponse;
              onCallBack?: (params?: { detail: ITineraryGetListDetailResponse; newEstimateAmount: number }) => void;
          }) => {
              const redirectUrl = `${window.location.origin}${PathName.TRIPS}?${Constants.PAGE_QUERY_KEY.ACTIVE_TAB}=${TripTabs.Approval}`;
              let isSuccess = false;
              setActionStatus((a) => (a[item.sequence] === "submitting" ? a : { ...a, [item.sequence]: "submitting" }));
              try {
                  await requestShema.validate(information, { abortEarly: false });
                  await updateUserProfile();
                  
                  const response = await ItineraryService.sendRequest({
                      detailIds: [item.id],
                      itineraryId: item.itineraryId,
                      redirectUrl,

                      email: information?.email,
                      lastName: information?.lastName,
                      firstName: information?.firstName,
                      phoneNumber: information?.phoneNumber.replace(new RegExp(`^${information?.phoneCode}`), ""),
                      phoneCode: "+".concat(information?.phoneCode),

                      isConfirmedPrice: isFirstCall ? false : true,
                  });

                  if (response?.result?.isSuccess) {
                      isSuccess = true;
                      dispatch(showSnackbar({ msg: "Gửi yêu cầu phê duyệt thành công", type: "success" }));
                  } else {
                      isSuccess = false;

                      handleCheckBookingResponse({
                          response: {
                              ...response?.result,
                              mesCode: response.message,
                          },
                          totalPriceItineraryDetail,
                          onContinue({ errCode, newEstimateAmount }) {
                              onCallBack && onCallBack(isItineraryUpdatePrice(errCode) ? { detail: item, newEstimateAmount } : undefined);

                              if (response?.result?.result?.[0]?.needApprove === 1) {
                                  onSendApproval &&
                                      onSendApproval({
                                          item,
                                          isFirstCall: false,
                                          totalPriceItineraryDetail,
                                      });
                              }
                              if (response?.result?.result?.[0]?.needApprove === 0) {
                                  onConfirmDetail &&
                                      onConfirmDetail({
                                          isFirstCall: false,
                                          itineraryDetail: item,
                                          totalPriceItineraryDetail,
                                      });
                              }
                          },
                          onCancel({ errCode, newEstimateAmount }) {
                              onCallBack && onCallBack(isItineraryUpdatePrice(errCode) ? { detail: item, newEstimateAmount } : undefined);
                          },
                      });
                  }
              } catch (error: any) {
                  if (error.name === "ValidationError") {
                      const newError: IErrorInformation = Helpers.handleValidationError(error);
                      setInformationError(newError);
                  } else {
                      Helpers.handleError(error);
                  }
              } finally {
                  setActionStatus((a) => ({ ...a, [item.sequence]: isSuccess ? "done" : "idle" }));
              }
          }
        : undefined;

    return { submitting: Object.values(actionStatus).some((v) => v === "submitting"), onConfirmDetail, onSendApproval, actionStatus };
};

export default useBookingSubmit;

const UPDATE_LOCAL_ITEM_PRICE_ERROR_CODE = "FLIGHT_FEE_MISMATCH";
const isItineraryUpdatePrice = (errCode: string) => errCode === UPDATE_LOCAL_ITEM_PRICE_ERROR_CODE;
