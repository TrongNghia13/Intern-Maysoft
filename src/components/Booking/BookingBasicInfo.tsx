import { FormField, PhoneNumberInput, Typography } from "@maysoft/common-component-react";
import { Grid } from "@mui/material";
import { useTranslation } from "react-i18next";

import { IErrorInformation, IInformation } from "@src/hooks/booking/type";
import { useEffect, useRef } from "react";
import Card from "../Card/Card";

export const BookingBasicInfo = ({
    information,
    informationError,
    onChangeValue,
    disabled,
}: {
    information: IInformation;
    informationError: IErrorInformation;
    onChangeValue: (value: string | boolean, key: keyof IInformation) => void;
    disabled?: boolean;
}) => {
    const { t } = useTranslation("booking");
    const phoneNumberContainerRef = useRef<HTMLDivElement>(null);

    // Case: phone number already filled (can not get dialCode)
    // extract phone code value (not included in userInfo)
    useEffect(() => {
        if (!information.phoneNumber) return;
        const input = phoneNumberContainerRef.current?.querySelector("input");
        if (input) {
            const phoneCode = input.value.split(" ")[0].substring(1);
            onChangeValue(phoneCode, "phoneCode");
        }
    }, [onChangeValue, information.phoneNumber]);

    return (
        <Card>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Typography
                        sx={{
                            fontSize: "1.125rem",
                            color: "#1C252E",
                            fontWeight: 600,
                        }}
                    >
                        {t("enter_your_details")}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography
                        sx={{
                            fontSize: "0.875rem",
                            color: "#637381",
                            fontWeight: 500,
                            mb: 1,
                        }}
                    >
                        {t("Thông tin được sử dụng để gửi đến hãng hàng không & và khách sạn cho việc đặt chỗ")}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                    <FormField
                        required
                        disabled={disabled}
                        variant="outlined"
                        label={t("last_name")}
                        placeholder={t("fill_your_last_name")}
                        defaultValue={information.lastName}
                        errorMessage={informationError.lastName}
                        onBlur={(value) => onChangeValue(value, "lastName")}
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <FormField
                        required
                        disabled={disabled}
                        variant="outlined"
                        label={t("first_name")}
                        placeholder={t("fill_your_first_name")}
                        defaultValue={information.firstName}
                        errorMessage={informationError.firstName}
                        onBlur={(value) => onChangeValue(value, "firstName")}
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <FormField
                        required
                        disabled={disabled}
                        variant="outlined"
                        label={t("Email")}
                        placeholder={t("fill_your_email")}
                        defaultValue={information.email}
                        errorMessage={informationError.email}
                        onBlur={(value) => onChangeValue(value, "email")}
                    />
                </Grid>
                <Grid item xs={12} md={3} ref={phoneNumberContainerRef}>
                    {/* call to emit phone number input once at the beginning */}
                    <PhoneNumberInput
                        required
                        disabled={disabled}
                        variant="outlined"
                        defaultValue={information.phoneNumber}
                        onChangeValue={(value, countryData) => {
                            onChangeValue(value, "phoneNumber");
                            onChangeValue(countryData.dialCode, "phoneCode");
                        }}
                        country="vn"
                        errorMessage={informationError.phoneNumber}
                    />
                </Grid>
                {/* <Grid item xs={12}>
                        <CheckBoxWithLabel
                            checked={information.sendEmail}
                            label={t("please_send_me_name_emails_with_travel_deals_special_offers_and_other_information", { name: "Trip-booking" })}
                            onClick={() => onChangeValue(!information.sendEmail, "sendEmail")}
                        />
                    </Grid> */}
            </Grid>
        </Card>
    );
};

export default BookingBasicInfo;
