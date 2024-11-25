import { useMemo } from "react";
import { useTranslation } from "next-i18next";

import Helpers from "@src/commons/helpers";
import useDataPaymentTrip from "./useDataPaymentTrip.hook";
import CustomCheckoutOrderBooking from "@src/components/CustomCheckoutOrderBooking";

import { BaseLayout } from "@src/layout";
import { NextApplicationPage } from "../_app";
import { BreadCrumbs } from "@src/components/BreadCrumbs";
import { PartnerPaymentMethod, PaymentType } from "@src/commons/enum";
import { withSSRErrorHandling } from "@src/commons/withSSRErrorHandling";
import { getServerSideTranslationsProps } from "@src/commons/translationHelpers";

const PaymentCheckoutTripPage: NextApplicationPage = () => {
    const {
        t,
        i18n: { language },
    } = useTranslation(["common", "tripbooking"]);

    const { dataMember, dataBooking, paymentMethod, dataOrderCheckout, listPaymentMethod, lastTicketDate, handleSubmit, handlePricing } =
        useDataPaymentTrip();

    const newListPaymentMethod = useMemo(() => {
        if (!Helpers.isNullOrEmpty(dataOrderCheckout?.[0]?.partnerPaymentMethod)) {
            if (dataOrderCheckout?.[0]?.partnerPaymentMethod === PartnerPaymentMethod.Debt) {
                return listPaymentMethod.filter((el) => el.code === PaymentType.Debt);
            } else {
                return listPaymentMethod.filter((el) => el.code !== PaymentType.Debt);
            }
        } else {
            return [];
        }
    }, [dataOrderCheckout?.[0]?.partnerPaymentMethod, listPaymentMethod]);

    return (
        <BaseLayout>
            <BreadCrumbs title={"Thanh toán"} route={["Chuyến đi", "Đặt chỗ", "Thanh toán"]} />

            <CustomCheckoutOrderBooking
                dataBooking={dataBooking}
                dataMember={dataMember || []}
                dataOrder={dataOrderCheckout}
                paymentMethod={paymentMethod}
                lastTicketDate={lastTicketDate}
                listPaymentMethod={newListPaymentMethod || []}
                handleSubmit={handleSubmit}
                handlePricing={handlePricing}
            />
        </BaseLayout>
    );
};

PaymentCheckoutTripPage.requiredAuth = true;
export default withSSRErrorHandling(PaymentCheckoutTripPage);

const getStaticProps = getServerSideTranslationsProps(["common", "tripbooking"]);
export { getStaticProps };
