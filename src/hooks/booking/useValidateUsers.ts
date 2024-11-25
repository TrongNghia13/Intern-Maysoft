import { Gender } from "@src/commons/enum";
import Helpers from "@src/commons/helpers";
import { IFlightExtraInformation, IUser } from "@src/commons/interfaces";
import { ITineraryGetListDetailResponse } from "@src/services/booking/ItineraryService";
import moment from "moment";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { array, number, object, string } from "yup";

export const useValidateUsers = ({ currentUsers }: { currentUsers: IUser[] }) => {
    const { t } = useTranslation();

    const requestSchema = array().of(
        object({
            firstName: string()
                .nullable()
                .required()
                .test(
                    "the name is too long",
                    t("Tên hành khách dài quá số ký tự quy định của hãng hàng không, vui lòng liên hệ CSKH để được hỗ trợ"),
                    (value, context) => {
                        if ([value, context.parent?.lastName].join(" ").length > 29) return false;
                        return true;
                    }
                ),
            lastName: string()
                .nullable()
                .required()
                .test(
                    "the name is too long",
                    t("Tên hành khách dài quá số ký tự quy định của hãng hàng không, vui lòng liên hệ CSKH để được hỗ trợ"),
                    (value, context) => {
                        if ([context.parent?.firstName, value].join(" ").length > 29) return false;
                        return true;
                    }
                ),
            dateOfBirth: string()
                .nullable()
                .required()
                .test("required date of birth", t("message.message_required_field"), (value) => {
                    if (Helpers.isNullOrEmpty(value) || String(value) === "0") return false;
                    return true;
                }),
            gender: number()
                .nullable()
                .required()
                .test("required gender", t("message.message_required_field"), (value) => {
                    if (Helpers.isNullOrEmpty(value) || ![Gender.Female, Gender.Male].includes(value || 0)) return false;
                    return true;
                }),
            passportNo: string()
                .nullable()
                .test("passport invalid", t("Số hộ chiếu không hợp lệ"), (value) => {
                    if (value && value.length < 5) return false;
                    if (value && value.length > 15) return false;
                    return true;
                }),
            phoneNumber: string()
                .nullable()
                .test("phone number invalid", t("message.phone_number_invalid"), (value) => {
                    if (!Helpers.isNullOrEmpty(value) && value && value?.length < 8) return false;
                    return true;
                }),
            passportExpiredDate: string()
                .nullable()
                .test("required passpost expired date", t("message.message_required_field"), (value, context) => {
                    if (!Helpers.isNullOrEmpty(context.parent?.passportNo)) return !Helpers.isNullOrEmpty(value);
                    return true;
                })
                .test("must be greater than the current 6 months", t("Ngày hết hạn phải lớn hơn so với hiện tại 6 tháng"), (value, context) => {
                    if (
                        !Helpers.isNullOrEmpty(context.parent?.passportNo) &&
                        moment(Number(value) * 1000).unix() < moment().add(6, "month").startOf("day").unix()
                    )
                        return false;
                    return true;
                }),
            passportIssuedPlace: string()
                .nullable()
                .test("required passpost issued place", t("message.message_required_field"), (value, context) => {
                    if (!Helpers.isNullOrEmpty(context.parent?.passportNo)) return !Helpers.isNullOrEmpty(value);
                    return true;
                }),
            nationality: string().nullable().required(),
        })
    );

    const requestSchemaInternational = array().of(
        object({
            firstName: string()
                .nullable()
                .required()
                .test(
                    "the name is too long",
                    t("Tên hành khách dài quá số ký tự quy định của hãng hàng không, vui lòng liên hệ CSKH để được hỗ trợ"),
                    (value, context) => {
                        if ([value, context.parent?.lastName].join(" ").length > 29) return false;
                        return true;
                    }
                ),
            lastName: string()
                .nullable()
                .required()
                .test(
                    "the name is too long",
                    t("Tên hành khách dài quá số ký tự quy định của hãng hàng không, vui lòng liên hệ CSKH để được hỗ trợ"),
                    (value, context) => {
                        if ([context.parent?.firstName, value].join(" ").length > 29) return false;
                        return true;
                    }
                ),
            dateOfBirth: string()
                .nullable()
                .required()
                .test("required date of birth", t("message.message_required_field"), (value) => {
                    if (Helpers.isNullOrEmpty(value) || String(value) === "0") return false;
                    return true;
                }),
            gender: number()
                .nullable()
                .required()
                .test("required gender", t("message.message_required_field"), (value) => {
                    if (Helpers.isNullOrEmpty(value) || ![Gender.Female, Gender.Male].includes(value || 0)) return false;
                    return true;
                }),
            passportNo: string()
                .nullable()
                .required()
                .test("passport invalid", t("Số hộ chiếu không hợp lệ"), (value) => {
                    if (value && value.length < 5) return false;
                    if (value && value.length > 15) return false;
                    return true;
                }),
            phoneNumber: string()
                .nullable()
                .test("phone number invalid", t("message.phone_number_invalid"), (value) => {
                    if (!Helpers.isNullOrEmpty(value) && value && value?.length < 8) return false;
                    return true;
                }),
            passportExpiredDate: string()
                .nullable()
                .test("required passpost expired date", t("message.message_required_field"), (value, context) => {
                    if (!Helpers.isNullOrEmpty(context.parent?.passportNo)) return !Helpers.isNullOrEmpty(value);
                    return true;
                })
                .test("must be greater than the current 6 months", t("Ngày hết hạn phải lớn hơn so với hiện tại 6 tháng"), (value, context) => {
                    if (
                        !Helpers.isNullOrEmpty(context.parent?.passportNo) &&
                        moment(Number(value) * 1000).unix() < moment().add(6, "month").startOf("day").unix()
                    )
                        return false;
                    return true;
                }),
            passportIssuedPlace: string()
                .nullable()
                .test("required passpost issued place", t("message.message_required_field"), (value, context) => {
                    if (!Helpers.isNullOrEmpty(context.parent?.passportNo)) return !Helpers.isNullOrEmpty(value);
                    return true;
                }),
            nationality: string().nullable().required(),
        })
    );

    const validateUsers = async (isInternationalFlight: boolean, userIds: string[]) => {
        const userIdMap = userIds.reduce((acc, el) => {
            acc[el] = true;
            return acc;
        }, {} as Record<string, boolean>);
        const users = currentUsers.filter((el) => userIdMap[el.id]);
        try {
            if (isInternationalFlight) {
                await requestSchemaInternational.validate(
                    users.map((el) => el.organizationUserProfile),
                    { abortEarly: false }
                );
                return true;
            }
            await requestSchema.validate(
                users.map((el) => el.organizationUserProfile),
                { abortEarly: false }
            );
            return true;
        } catch (error: any) {
            if (error.name === "ValidationError") {
                Helpers.showAlert(t("Bạn vui lòng nhập đầy đủ thông tin hành khách"), "error");
            }
            return false;
        }
    };

    const isInternationalFlight = useCallback((data: ITineraryGetListDetailResponse[]) => {
        if (data.length === 0) return false;

        const extraData: IFlightExtraInformation[] = data.map((el) => {
            const extraInfo = el.extraInfo ? JSON.parse(el.extraInfo) : {};
            return Helpers.toCamelCaseObj(extraInfo);
        });

        const isInternationalFlight = extraData.some((el) => el?.isInternational === true);

        return isInternationalFlight;
    }, []);

    return {
        validateUsers,
        isInternationalFlight,
    };
};

export default useValidateUsers;
