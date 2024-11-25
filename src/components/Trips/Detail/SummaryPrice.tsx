import { Box, Button, Typography } from "@maysoft/common-component-react";
import { Check } from "@mui/icons-material";
import { Divider } from "@mui/material";
import { useTranslation } from "next-i18next";

import Helpers from "@src/commons/helpers";

import { BookingHelpers } from "@src/commons/bookingHelpers";
import { FlightType, ItineraryType, OrderStatus } from "@src/commons/enum";
import { IFlightExtraInformation, IHotelExtraInformation, IItineraryDetail, IOrder } from "@src/commons/interfaces";
import Constants from "@src/constants";
import { numberOfLinesStyles, typographyStyles } from "@src/styles/commonStyles";
import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";
import Card from "@src/components/Card/Card";
import { East, TwistArrow, ValiIcon } from "@src/assets/svg";

export const SummaryPrice = ({
    itineraryDetails,
    orderData,
    selectedSequence,
    actionButton: actionButton,
}: {
    itineraryDetails: IItineraryDetail[];
    orderData: IOrder[];
    selectedSequence: number[];
    actionButton?: React.ReactNode;
}) => {
    const { t } = useTranslation(["common", "tripbooking"]);
    const router = useRouter();

    const isItineraryDetailSequenceSelected = useCallback(
        (item: IItineraryDetail) => (selectedSequence.length === 0 ? true : selectedSequence.indexOf(item.sequence) >= 0),
        [selectedSequence]
    );

    const filteredItineraryDetails = useMemo(() => {
        return itineraryDetails.filter((el) => selectedSequence.includes(el.sequence));
    }, [itineraryDetails, selectedSequence]);

    const priceDictionary = useMemo(
        () => BookingHelpers.getItineraryDetailPriceGroupBySequence(itineraryDetails.filter((d) => isItineraryDetailSequenceSelected(d))),
        [isItineraryDetailSequenceSelected, itineraryDetails]
    );

    let renderedSequences: number[] = [];

    const renderActionButton = (orderData: IOrder[], selectedSequence: number[]) => {
        if (selectedSequence.length === 0) {
            return (
                <Button
                    variant="text"
                    fullWidth
                    disabled
                    sx={{
                        border: "1px solid #F6F6F6",
                        backgroundColor: "#F6F6F6 !important",
                        color: "#9F9F9F",
                        fontWeight: 600,
                    }}
                >
                    Tiếp tục
                </Button>
            );
        }

        const completedOrder = orderData.filter((el) => el.orderStatus === OrderStatus.Completed);
        const isAllCompleted = completedOrder.length === itineraryDetails.length;
        if (isAllCompleted) {
            return (
                <Button variant="contained" fullWidth disabled>
                    Đã hoàn thành
                </Button>
            );
        }

        const selectedItineraryDetails = itineraryDetails.filter((el) => selectedSequence.includes(el.sequence));
        const itineraryIds = selectedItineraryDetails.map((el) => el.id);
        return (
            <Button
                // variant="outlined"
                fullWidth
                color="info"
                onClick={() => {
                    router.push(`/booking?${Helpers.handleFormatParams({ id: itineraryIds, itineraryId: itineraryDetails[0].itineraryId })}`);
                }}
            >
                Tiếp tục
            </Button>
        );
    };

    return (
        <Box sx={{ position: "sticky", top: 10 }}>
            <Card>
                <Box display="flex" flexDirection="column" gap={1}>
                    <Box mb={2}>
                        <Typography
                            sx={(theme) =>
                                typographyStyles(theme, {
                                    fontWeight: 600,
                                    fontSize: "1.125rem",
                                })
                            }
                        >
                            Danh sách đã chọn
                        </Typography>
                    </Box>
                    {filteredItineraryDetails.length === 0 && (
                        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" p={2.5}>
                            <ValiIcon />
                            <Typography
                                sx={(theme) =>
                                    typographyStyles(theme, {
                                        fontSize: Constants.FONT_SIZE.SMALL_TEXT,
                                        textAlign: "center",
                                    })
                                }
                            >
                                Vui lòng chọn ít nhất 1 chuyến bay hoặc khách sạn để tiếp tục
                            </Typography>
                        </Box>
                    )}

                    {filteredItineraryDetails.length > 0 &&
                        filteredItineraryDetails.map((item, index) => {
                            const key = item.sequence;
                            const extraInfo = JSON.parse(item.extraInfo);
                            const detailOrder = orderData.find((el) => el.id === item.orderId);
                            const estimateQuantity = item.estimateQuantity;

                            if (!isItineraryDetailSequenceSelected(item)) return null;

                            if (renderedSequences.includes(item.sequence)) return null;
                            renderedSequences.push(item.sequence);

                            if (item.type === ItineraryType.Hotel) {
                                const newExtra: IHotelExtraInformation = Helpers.toCamelCaseObj(extraInfo);

                                return (
                                    <Box display="flex" flexDirection="column" key={index}>
                                        <Box display="flex" flexDirection="row" alignItems="center" gap={1}>
                                            <Typography
                                                variant="caption"
                                                fontWeight="bold"
                                                sx={(theme) => ({
                                                    ...numberOfLinesStyles(1),
                                                })}
                                            >
                                                {`(${estimateQuantity}x) - `}
                                                {newExtra.roomName}
                                            </Typography>
                                            {detailOrder?.orderStatus === OrderStatus.Completed && <Check color="success" />}
                                        </Box>
                                        <Typography variant="caption">
                                            {[priceDictionary.get(key)?.currency, Helpers.formatCurrency(priceDictionary.get(key)?.value || 0)].join(
                                                " "
                                            )}
                                        </Typography>
                                    </Box>
                                );
                            }
                            if (item.type === ItineraryType.Flight) {
                                const newExtra: IFlightExtraInformation = Helpers.toCamelCaseObj(extraInfo);
                                const firstElement = newExtra;

                                const itineraryDetails = filteredItineraryDetails.filter((el) => el.sequence === item.sequence);

                                return (
                                    <Box display="flex" flexDirection="column" key={index}>
                                        <PriceItem
                                            title={<FlightName itineraryDetails={itineraryDetails} />}
                                            description={`${item.itineraryMembers.length || 0} nhân sự`}
                                            value={Helpers.formatCurrency(priceDictionary.get(key)?.value || 0)}
                                            currency={Helpers.getCurrency(priceDictionary.get(key)?.currency || "VND")}
                                        />
                                        <PriceItem
                                            title={"Phí dịch vụ"}
                                            value={Helpers.formatCurrency(priceDictionary.get(key)?.serviceFee || 0)}
                                            currency={Helpers.getCurrency(priceDictionary.get(key)?.currency || "VND")}
                                        />
                                    </Box>
                                );
                            }
                            return null;
                        })}
                    {filteredItineraryDetails.length > 0 && (
                        <>
                            <Divider />
                            <PriceItem
                                title={t("common:total")}
                                description={t("Đã bao gồm thuế & phí sân bay")}
                                value={Helpers.formatCurrency(
                                    (priceDictionary.get("total")?.value || 0) + (priceDictionary.get("total")?.serviceFee || 0)
                                )}
                                currency={Helpers.getCurrency(priceDictionary.get("total")?.currency || "VND")}
                            />
                        </>
                    )}
                </Box>

                <Box pt={2}>{actionButton === undefined ? renderActionButton(orderData, selectedSequence) : actionButton}</Box>
            </Card>
        </Box>
    );
};

const Title = ({ value }: { value: string }) => (
    <Typography
        sx={(theme) =>
            typographyStyles(theme, {
                fontSize: Constants.FONT_SIZE.SMALL_TEXT,
            })
        }
    >
        {value}
    </Typography>
);

const FlightName = ({ itineraryDetails }: { itineraryDetails: IItineraryDetail[] }) => {
    const data: IFlightExtraInformation = Helpers.toCamelCaseObj(JSON.parse(itineraryDetails[0]?.extraInfo));

    const isOneWay = data.flightType === FlightType.OneWay;
    const isRoundTrip = data.flightType === FlightType.RoundTrip;
    const isMultiCity = data.flightType === FlightType.MultiCity;

    if (isOneWay) {
        return (
            <Box display="flex" flexDirection="row" alignItems="center" gap={1}>
                <Title value={`Chuyến bay ${data?.departPlaceObj?.code}`} />
                <East />
                <Title value={data?.arrivalPlaceObj?.code} />
            </Box>
        );
    }

    if (isRoundTrip) {
        return (
            <Box display="flex" flexDirection="row" alignItems="center" gap={1}>
                <Title value={`Chuyến bay ${data?.departPlaceObj?.code}`} />
                <TwistArrow />
                <Title value={data?.arrivalPlaceObj?.code} />
            </Box>
        );
    }

    if (isMultiCity) {
        const firstFlight: IFlightExtraInformation = Helpers.toCamelCaseObj(JSON.parse(itineraryDetails[0]?.extraInfo));
        const endFlight: IFlightExtraInformation = Helpers.toCamelCaseObj(JSON.parse(itineraryDetails[itineraryDetails.length - 1]?.extraInfo));

        return (
            <Box display="flex" flexDirection="row" alignItems="center" gap={1}>
                <Title value={`Chuyến bay ${firstFlight?.departPlaceObj?.code}`} />
                <East />
                <Title value={endFlight?.arrivalPlaceObj?.code} />
            </Box>
        );
    }

    return <></>;
};

const PriceItem = ({
    title,
    value,
    currency,
    description,
}: {
    title: string | JSX.Element;
    value: string;
    currency: string;
    description?: string;
}) => {
    return (
        <Box>
            <Box display="flex" justifyContent="space-between">
                <Box gap={1} display="flex" flexDirection="column">
                    {typeof title === "string" && (
                        <Typography
                            sx={(theme) =>
                                typographyStyles(theme, {
                                    fontSize: Constants.FONT_SIZE.SMALL_TEXT,
                                })
                            }
                        >
                            {title}
                        </Typography>
                    )}
                    {typeof title !== "string" && title}
                </Box>
                <Box sx={{ display: "flex", justifyContent: "end" }}>
                    <Typography
                        sx={(theme) =>
                            typographyStyles(theme, {
                                fontSize: Constants.FONT_SIZE.SMALL_TEXT,
                                fontWeight: 600,
                            })
                        }
                    >
                        {[Helpers.formatCurrency(value ?? 0), Helpers.getCurrency(currency || "VND")].join(" ")}
                    </Typography>
                </Box>
            </Box>
            {description && (
                <Typography
                    sx={(theme) =>
                        typographyStyles(theme, {
                            fontSize: Constants.FONT_SIZE.SMALL_TEXT,
                            color: "#637381",
                        })
                    }
                >
                    {description}
                </Typography>
            )}
        </Box>
    );
};

export default SummaryPrice;
