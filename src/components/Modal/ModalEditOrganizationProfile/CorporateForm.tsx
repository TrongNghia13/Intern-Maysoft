import { Autocomplete, DatePicker, FormField, PhoneNumberInput } from "@maysoft/common-component-react";
import { Grid } from "@mui/material";
import Helpers from "@src/commons/helpers";
import { IRequestUpdateOrganizationProfile } from "@src/services/identity/ProfileService";
import moment from "moment";
import { IUpdateOrganizationProfileError } from ".";
import { ICodename } from "@src/commons/interfaces";

interface IProps {
    genderList: ICodename[];
    countryList: ICodename[];
    data: IRequestUpdateOrganizationProfile;
    error: IUpdateOrganizationProfileError;
    isInternational?: boolean;
    onChangeValue: (key: keyof IRequestUpdateOrganizationProfile) => (value: string | number | undefined) => void;
}

export const CorporateForm = ({ data, error, genderList, isInternational, countryList, onChangeValue }: IProps) => {
    return (
        <Grid container spacing={3} p={2}>
            <Grid item xs={12} md={6}>
                <FormField
                    required
                    maxLength={255}
                    label="Họ"
                    placeholder="Nhập vào họ"
                    // label={Strings.Staff.LAST_NAME}
                    // placeholder={Strings.Staff.ENTER_LAST_NAME}

                    defaultValue={data?.lastName}
                    errorMessage={error?.lastName}
                    onBlur={(value) => onChangeValue("lastName")(Helpers.removeVietnameseTones(value).toLocaleUpperCase())}
                />
            </Grid>

            <Grid item xs={12} md={6}>
                <FormField
                    required
                    maxLength={255}
                    label="Tên"
                    placeholder="Nhập vào tên"
                    // label={Strings.Staff.FIRST_NAME}
                    // placeholder={Strings.Staff.ENTER_FIRST_NAME}
                    defaultValue={data?.firstName}
                    errorMessage={error?.firstName}
                    onBlur={(value) => onChangeValue("firstName")(Helpers.removeVietnameseTones(value).toLocaleUpperCase())}

                    // onBlur={onChangeValue("firstName")}
                />
            </Grid>

            <Grid item xs={12} md={6}>
                <PhoneNumberInput
                    country={"vn"}
                    defaultValue={data.phoneNumber}
                    errorMessage={error?.phoneNumber}
                    onChangeValue={onChangeValue("phoneNumber")}
                />
            </Grid>

            <Grid item xs={12} md={6}>
                <FormField
                    disabled
                    maxLength={255}
                    // label={Strings.Staff.EMAIL}
                    // placeholder={Strings.Staff.ENTER_EMAIL}
                    defaultValue={data?.email}
                    label="Email"
                    placeholder="Nhập Email"
                    errorMessage={error?.email}
                    onBlur={onChangeValue("email")}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <Autocomplete
                    required
                    isSelectedBox
                    data={genderList || []}
                    label="Giới tính"
                    placeholder="Chọn giới tính"
                    // label={Strings.Staff.GENDER}
                    // placeholder={Strings.Staff.SELECT_GENDER}
                    defaultValue={data?.gender}
                    errorMessage={error?.gender}
                    onChange={onChangeValue("gender")}
                />
            </Grid>

            <Grid item xs={12} md={6}>
                <DatePicker
                    required
                    label="Ngày sinh"
                    placeholder="Nhập ngày sinh"
                    // label={Strings.Staff.BIRTHDAY}
                    // placeholder={Strings.Staff.SELECT_BIRTHDAY}
                    // errorMessage={errorUserProfileByOrganization?.birthDdateOfBirthate}
                    // value={handleValueDate(dataUserProfile?.birthDate)}
                    value={Helpers.getDateValue(data.dateOfBirth)}
                    errorMessage={error?.dateOfBirth}
                    onChangeValue={(value) => onChangeValue("dateOfBirth")(value ? moment(value).unix() : undefined)}
                />
            </Grid>

            {/* <Grid item xs={12} md={6}>
    <FormField
        maxLength={12}
        type={"number"}
        label="Căn cước công dân"
        // label={Strings.Staff.ID_CARD_NO}
        // placeholder={Strings.Staff.ENTER_ID_CARD_NO}
        defaultValue={data?.idCardNo}
        errorMessage={error?.idCardNo}
        onBlur={onChangeValue("idCardNo")}
    />
</Grid>

<Grid item xs={12} md={6}>
    <DatePicker
        label="Ngày cấp"
        // label={Strings.Staff.ID_CARD_ISSUED_DATE}
        // placeholder={Strings.Staff.ID_CARD_ISSUED_DATE}
        errorMessage={error?.idCardIssuedDate}
        value={data?.idCardIssuedDate * 1000}
        onChangeValue={(value) => onChangeValue("idCardIssuedDate")(value ? moment(value).unix() : undefined)}
    />
</Grid>

<Grid item xs={12} md={6}>
    <FormField
        maxLength={255}
        label="Nơi cấp"
        // label={Strings.Staff.ID_CARD_ISSUED_PLACE}
        // placeholder={Strings.Staff.ENTER_ID_CARD_ISSUED_PLACE}
        defaultValue={data?.idCardIssuedPlace}
        errorMessage={error?.idCardIssuedPlace}
        onBlur={onChangeValue("idCardIssuedPlace")}
    />
</Grid>

<Grid item xs={12} md={6}>
    <FormField
        maxLength={10}
        type={"number"}
        label="Số bảo hiểm"
        // label={Strings.Staff.SOCIAL_INSURANCE_CODE}
        // placeholder={Strings.Staff.ENTER_SOCIAL_INSURANCE_CODE}
        defaultValue={data?.socialInsuranceCode}
        errorMessage={error?.socialInsuranceCode}
        onBlur={onChangeValue("socialInsuranceCode")}
    />
</Grid> */}

            <Grid item xs={12} md={6}>
                <FormField
                    required={isInternational}
                    maxLength={15}
                    label="Số hộ chiếu"
                    placeholder="Nhập số hộ chiếu"
                    // label={Strings.Staff.PASSPORT_NUMBER}
                    // placeholder={Strings.Staff.PASSPORT_NUMBER}
                    defaultValue={data?.passportNo}
                    errorMessage={error?.passportNo}
                    onBlur={onChangeValue("passportNo")}
                />
            </Grid>

            <Grid item xs={12} md={6}>
                <DatePicker
                    disabled={Helpers.isNullOrEmpty(data?.passportNo)}
                    required={!Helpers.isNullOrEmpty(data?.passportNo)}
                    // views={["month", "year"]}
                    label="Ngày hết hạn"
                    placeholder="Nhập ngày hết hạn"
                    // label={Strings.Staff.PASSPORT_EXPDATE}
                    // placeholder={Strings.Staff.PASSPORT_EXPDATE}
                    errorMessage={error?.passportExpiredDate}
                    value={Helpers.getDateValue(data.passportExpiredDate)}
                    onChangeValue={(value) => onChangeValue("passportExpiredDate")(value ? moment(value).unix() : undefined)}
                />
            </Grid>

            <Grid item xs={12} md={6}>
                <Autocomplete
                    disabled={Helpers.isNullOrEmpty(data?.passportNo)}
                    required={!Helpers.isNullOrEmpty(data?.passportNo)}
                    key={countryList as any}
                    data={countryList || []}
                    label="Nơi cấp hộ chiếu"
                    placeholder="Chọn nơi cấp hộ chiếu"
                    // label={Strings.Staff.PASSPORT_ISSUING_COUNTRY}
                    // placeholder={Strings.Staff.PASSPORT_ISSUING_COUNTRY}
                    defaultValue={data?.passportIssuedPlace}
                    errorMessage={error?.passportIssuedPlace}
                    onChange={onChangeValue("passportIssuedPlace")}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <Autocomplete
                    required
                    key={countryList as any}
                    data={countryList || []}
                    label="Quốc tịch"
                    placeholder="Chọn quốc tịch"
                    // label={Strings.Staff.PASSPORT_ISSUING_COUNTRY}
                    // placeholder={Strings.Staff.PASSPORT_ISSUING_COUNTRY}
                    defaultValue={data?.nationality}
                    errorMessage={error?.nationality}
                    onChange={onChangeValue("nationality")}
                />
            </Grid>
        </Grid>
    );
};

export default CorporateForm;
