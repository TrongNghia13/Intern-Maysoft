import { Box, Typography } from "@maysoft/common-component-react";
import { Divider } from "@mui/material";
import React, { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";

import Helpers from "@src/commons/helpers";

import { IItineraryPrice } from "@src/commons/bookingHelpers";
import { IFlightDetail, IUser } from "@src/commons/interfaces";
import { OrganizationUserTable, UserList } from "@src/components";
import { DashedDivider } from "@src/components/DashedDivider";
import Constants from "@src/constants";
import { typographyStyles } from "@src/styles/commonStyles";
import { CarrierMarketing, FlightInfoDuration, FreeBaggage, ReservationCode } from "./Components";
import { cardContainer } from "./styles";

interface IProps {
    datas: IFlightDetail[];

    users: IUser[];
    inPolicyUserIds: string[];
    outPolicyUserIds: string[];

    isSelected: boolean;
    onClick?: () => void;
    disabled?: boolean;
    hiddenUserList?: boolean;
    isInPolicy?: boolean;
    isInternational?: boolean;
    hiddenItemPrice?: boolean;
    showDate?: boolean;
    itineraryPrice: IItineraryPrice;
}

export const ItineraryFlightCard: React.FC<IProps> = ({
    isInPolicy,
    datas,
    inPolicyUserIds,
    outPolicyUserIds,
    users,
    isSelected,
    onClick,
    disabled = false,
    hiddenUserList,
    isInternational,
    hiddenItemPrice,
    showDate,
    itineraryPrice,
}) => {
    const {
        t,
        i18n: { language },
    } = useTranslation(["common", "tripbooking"]);

    const inPolicyUserList = users.filter((user) => inPolicyUserIds.includes(user.id));
    const outPolicyUserList = users.filter((user) => outPolicyUserIds.includes(user.id));

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
            }}
        >
            <Box
                width={"100%"}
                sx={(theme) => cardContainer(theme, { isSelected, disabled })}
                onClick={(e) => {
                    e.stopPropagation();
                    disabled ? undefined : onClick && onClick();
                }}
            >
                {datas.map((data, index) => (
                    <Fragment key={data?.flightId}>
                        <Box
                            sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                alignItems: "center",
                                flexDirection: "row",
                                borderRadius: 2,
                                overflow: "hidden",
                                p: 2,
                            }}
                        >
                            <Box
                                sx={{
                                    width: "40%",
                                }}
                            >
                                <CarrierMarketing {...{ data, language }} />
                            </Box>
                            <Box
                                sx={{
                                    width: "60%",
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Box width={!hiddenItemPrice ? "60%" : "100%"}>
                                    <FlightInfoDuration {...{ data, language, showDate }} />
                                </Box>

                                {!hiddenItemPrice && index === 0 && (
                                    <Box display="flex" flexDirection="column" justifyContent="right" textAlign="right">
                                        <Typography
                                            sx={(theme) =>
                                                typographyStyles(theme, {
                                                    color: "#637381",
                                                    fontSize: Constants.FONT_SIZE.SMALL_TEXT,
                                                })
                                            }
                                        >
                                            Tổng tiền
                                        </Typography>
                                        <Box display="flex" gap={0.5} textAlign="right">
                                            <Typography
                                                sx={(theme) =>
                                                    typographyStyles(theme, {
                                                        fontWeight: 600,
                                                    })
                                                }
                                            >
                                                {Helpers.formatCurrency(itineraryPrice.value ?? 0)}
                                            </Typography>
                                            <Typography
                                                sx={(theme) =>
                                                    typographyStyles(theme, {
                                                        fontSize: "0.75rem",
                                                        fontWeight: 600,
                                                        textDecoration: "underline",
                                                    })
                                                }
                                            >
                                                {Helpers.getCurrency(itineraryPrice.currency)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                )}
                            </Box>
                        </Box>
                        <Box px={2}>
                            <ReservationCode />
                        </Box>

                        <Box px={2}>
                            <Divider />
                        </Box>
                        <FreeBaggage freeBaggage={data?.freeBaggage || []} />
                    </Fragment>
                ))}

                <DashedDivider />
                <Box px={2} pb={2}>
                    {!hiddenUserList && (
                        <Box display="grid" gap={1}>
                            {inPolicyUserList.length > 0 && <UserList users={inPolicyUserList} />}
                            {outPolicyUserList.length > 0 && (
                                <>
                                    <Typography
                                        sx={(theme) =>
                                            typographyStyles(theme, {
                                                color: "#637381",
                                                fontSize: Constants.FONT_SIZE.SMALL_TEXT,
                                            })
                                        }
                                    >
                                        Ngoài chính sách
                                    </Typography>
                                    <UserList users={outPolicyUserList} isOutPolicy />
                                </>
                            )}
                        </Box>
                    )}

                    <Box>
                        <OrganizationUserTable users={[...inPolicyUserList, ...outPolicyUserList]} isInternational={isInternational} />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default ItineraryFlightCard;
