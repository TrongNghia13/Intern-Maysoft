import { Gender } from "@src/commons/enum";
import Helpers from "@src/commons/helpers";
import { ICodename, IOrganizationUserProfile, IUser } from "@src/commons/interfaces";
import AdministrativeDivisionService from "@src/services/common/AdministrativeDivisionService";
import ProfileService, { IRequestUpdateOrganizationProfile } from "@src/services/identity/ProfileService";
import { hideLoading, showLoading } from "@src/store/slice/common.slice";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { number, object, string } from "yup";
import { LoadingModal } from "../../Loading";
import Modal from "../Modal";
import CorporateForm from "./CorporateForm";

export type FormMode = "default" | "corporate";

export type IUpdateOrganizationProfileError = { [k in keyof IRequestUpdateOrganizationProfile]?: string };

export const ModalEditOrganizationProfile = ({
    visibled,

    titleModal,
    fromMode = "default",

    isInternational,

    setVisibled,
    user,
    onAction,
}: {
    visibled: boolean;

    titleModal?: string;
    user: IUser;

    isInternational?: boolean;
    fromMode?: FormMode;
    setVisibled: React.Dispatch<React.SetStateAction<boolean>>;
    onAction: (data: IUser) => void;
}) => {
    const { t } = useTranslation("common");
    const dispatch = useDispatch();

    const [countryList, setCountryList] = useState<ICodename[]>([]);

    const genderList: ICodename[] = useMemo(
        () => [
            { code: Gender.Male, name: "Nam" },
            { code: Gender.Female, name: "Nữ" },
            // { code: Gender.Other, name: "Khác" },
        ],
        []
    );

    const requestSchema = object({
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
        phoneNumber: string()
            .nullable()
            .test("phone number invalid", t("message.phone_number_invalid"), (value) => {
                if (!Helpers.isNullOrEmpty(value) && value && value?.length < 8) return false;
                return true;
            }),
        passportNo: isInternational
            ? string()
                  .nullable()
                  .required()
                  .test("passport invalid", t("Số hộ chiếu không hợp lệ"), (value) => {
                      if (value && value.length < 5) return false;
                      if (value && value.length > 15) return false;
                      return true;
                  })
            : string()
                  .nullable()
                  .test("passport invalid", t("Số hộ chiếu không hợp lệ"), (value) => {
                      if (value && value.length < 5) return false;
                      if (value && value.length > 15) return false;
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
    });

    const [error, setError] = useState<IUpdateOrganizationProfileError>({});
    const [loading, setLoading] = useState<boolean>(true);

    const [data, setData] = useState<IRequestUpdateOrganizationProfile>({
        // userId: "583569919904321536",
        // organizationId: "583734371404484608",
        // userType: 0,
        // firstName: "Thái",
        // lastName: "Lê",
        // dateOfBirth: 331318800,
        // gender: 1,
        // employmentDate: 0,
        // idCardNo: "923472394892",
        // idCardIssuedDate: moment().add(-3, "years").unix() * 1000,
        // idCardIssuedPlace: "Việt Nam",
        // socialInsuranceCode: "3423432432",
        // email: "thaile@maysoft.io",
        // phoneNumber: "0915518211",
        // passportNo: "23432423",
        // passportExpiredDate: 1704128400,
        // passportIssuedPlace: "VN",
        // id: "583734372524363776",
        // extraInformation: undefined,
    } as IRequestUpdateOrganizationProfile);

    useEffect(() => {
        if (user.organizationUserProfile) {
            const getData = async () => {
                try {
                    setLoading(true);
                    const getCountry = async () => {
                        const result = await AdministrativeDivisionService.getAll({ type: 1 });
                        setCountryList(
                            result.map((item) => {
                                return {
                                    code: item.code,
                                    name: item.name,
                                };
                            })
                        );
                    };

                    setData(JSON.parse(JSON.stringify(user.organizationUserProfile)));
                    await getCountry();
                } catch (error) {
                } finally {
                    setLoading(false);
                }
            };
            getData();
        }
    }, [user.organizationUserProfile, visibled]);

    const onChangeValue = (key: keyof IRequestUpdateOrganizationProfile) => (value: string | number | undefined) => {
        setData((prev) => ({ ...prev, [key]: value }));
        if (error[key]) setError((prev) => ({ ...prev, [key]: "" }));
    };

    const onSubmit = async () => {
        try {
            dispatch(showLoading());
            await requestSchema.validate(data, { abortEarly: false });
            const newData = {
                ...data,
                passportExpiredDate: Helpers.isNullOrEmpty(data.passportExpiredDate) ? 0 : data.passportExpiredDate,
                dateOfBirth: Helpers.isNullOrEmpty(data.dateOfBirth) ? 0 : data.dateOfBirth,
                idCardIssuedDate: Helpers.isNullOrEmpty(data.idCardIssuedDate) ? 0 : data.idCardIssuedDate,
            };
            await ProfileService.updateOrganizationProfile([
                {
                    ...newData,
                    extraInformation: undefined,
                },
            ]);
            await onAction({ ...user, organizationUserProfile: { ...user.organizationUserProfile, ...data } as IOrganizationUserProfile });
        } catch (error: any) {
            if (error.name === "ValidationError") {
                const newError: IUpdateOrganizationProfileError = Helpers.handleValidationError(error);
                setError(newError);
            } else {
                Helpers.handleError(error);
            }
        } finally {
            dispatch(hideLoading());
        }
    };

    const onClose = async () => {
        try {
            if (loading) return setVisibled(false);
            await requestSchema.validate(data, { abortEarly: false });
            setVisibled(false);
        } catch (error: any) {
            if (error.name === "ValidationError") {
                const newError: IUpdateOrganizationProfileError = Helpers.handleValidationError(error);
                setError(newError);
            } else {
                Helpers.handleError(error);
            }
        }
    };

    return (
        <Modal
            fullWidth
            maxWidth="md"
            visible={visibled}
            hasActionButton
            // buttonAction={textButtonAction}
            title={"Thông tin hành khách" || titleModal}
            onClose={onClose}
            onAction={onSubmit}
            // disabledActionButton={!disabled
        >
            {loading && <LoadingModal />}
            {!loading && <CorporateForm {...{ countryList, data, error, genderList, isInternational, onChangeValue }} />}
        </Modal>
    );
};

export default ModalEditOrganizationProfile;
