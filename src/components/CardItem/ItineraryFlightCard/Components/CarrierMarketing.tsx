import { Box, Typography } from "@maysoft/common-component-react";
import { Dot } from "@src/assets/svg";


import { IFlightDetail } from "@src/commons/interfaces";
import Constants from "@src/constants";

export const CarrierMarketing = ({ data, language }: { data: IFlightDetail; language: string }) => {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
            }}
        >
            <Box
                component={"img"}
                src={data?.carrierMarketingObj?.logoUrl}
                sx={{
                    display: data?.carrierMarketingObj?.logoUrl ? "block" : "none",
                    borderRadius: 2,
                    objectFit: "contain",
                    width: "46px",
                    height: "46px",
                }}
            ></Box>

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Typography
                    sx={{
                        fontSize: "1rem",
                        fontWeight: 600,
                    }}
                >
                    {(data?.carrierMarketingObj?.name as any)?.[language] || ""}
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                    <Typography
                        sx={({ palette: { secondary } }) => ({
                            fontWeight: 400,
                            fontSize: Constants.FONT_SIZE.SMALL_TEXT,
                            color: secondary.main,
                        })}
                    >
                        {[data?.carrierOperatorObj?.code, data?.flightNumber].join("")}
                    </Typography>
                    <Dot />
                    <Typography
                        sx={({ palette: { secondary } }) => ({
                            fontWeight: 400,
                            fontSize: Constants.FONT_SIZE.SMALL_TEXT,
                            color: secondary.main,
                        })}
                    >
                        {data?.cabinClass}
                    </Typography>
                    {/* <Typography
                        sx={({ palette: { secondary } }) => ({
                            fontWeight: 400,
                            fontSize: Constants.FONT_SIZE.SMALL_TEXT,
                            color: secondary.main,
                        })}
                    >
                        {[Helpers.formatDate(data.departDate * 1000), Helpers.formatDate(data.arrivalDate * 1000)].join(" - ")}
                    </Typography> */}
                </Box>
            </Box>
        </Box>
    );
};

export default CarrierMarketing;
