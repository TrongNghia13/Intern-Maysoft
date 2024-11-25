import { Box, Typography } from "@maysoft/common-component-react";
import Helpers from "@src/commons/helpers";

import { IFreeBaggage } from "@src/commons/interfaces";
import Constants from "@src/constants";

export const FreeBaggage = ({ freeBaggage, isColumns, px}: { freeBaggage: IFreeBaggage[], isColumns?: boolean, px?: number}) => {
    return (
        <Box
            display={isColumns ? "grid" : "flex"}
            gap={isColumns ? 1 : 2}
            px={Helpers.isNullOrEmpty(px) ? 2: px}
        >
            {freeBaggage.length === 0 && (
                <>
                    <Box display="flex" alignItems="center" gap={0.5}>
                        <HandBaggage />
                        <Typography
                            sx={{
                                color: "#1C252E",
                                fontWeight: 400,
                                fontSize: Constants.FONT_SIZE.SMALL_TEXT,
                            }}
                        >
                            Hành lý xách tay:
                        </Typography>
                        <Typography
                            sx={{
                                color: "#1C252E",
                                fontWeight: 500,
                                fontSize: Constants.FONT_SIZE.SMALL_TEXT,
                            }}
                        >
                            {"Chưa bao gồm"}
                        </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={0.5}>
                        <SignedBaggage />
                        <Typography
                            sx={{
                                color: "#1C252E",
                                fontWeight: 400,
                                fontSize: Constants.FONT_SIZE.SMALL_TEXT,
                            }}
                        >
                            Hành lý xách tay:
                        </Typography>
                        <Typography
                            sx={{
                                color: "#1C252E",
                                fontWeight: 500,
                                fontSize: Constants.FONT_SIZE.SMALL_TEXT,
                            }}
                        >
                            {"Chưa bao gồm"}
                        </Typography>
                    </Box>
                </>
            )}
            {freeBaggage.map((item, index) => {
                if (item.isHandBaggage)
                    return (
                        <Box key={index} display="flex" alignItems="center" gap={0.5}>
                            <HandBaggage />
                            <Typography
                                sx={{
                                    color: "#1C252E",
                                    fontWeight: 400,
                                    fontSize: Constants.FONT_SIZE.SMALL_TEXT,
                                }}
                            >
                                Hành lý xách tay:
                            </Typography>
                            <Typography
                                sx={{
                                    color: "#1C252E",
                                    fontWeight: 500,
                                    fontSize: Constants.FONT_SIZE.SMALL_TEXT,
                                }}
                            >
                                {item.name || "Chưa bao gồm"}
                            </Typography>
                        </Box>
                    );
                return (
                    <Box key={index} display="flex" alignItems="center" gap={0.5}>
                        <SignedBaggage />
                        <Typography
                            sx={{
                                color: "#1C252E",
                                fontWeight: 400,
                                fontSize: Constants.FONT_SIZE.SMALL_TEXT,
                            }}
                        >
                            Hành lý xách tay:
                        </Typography>
                        <Typography
                            sx={{
                                color: "#1C252E",
                                fontWeight: 500,
                                fontSize: Constants.FONT_SIZE.SMALL_TEXT,
                            }}
                        >
                            {item.name || "Chưa bao gồm"}
                        </Typography>
                    </Box>
                );
            })}
        </Box>
    );
};

const HandBaggage = () => (
    <svg width="10" height="13" viewBox="0 0 10 13" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M8.33333 12.1112H7.222V11.5552H2.778V12.1112H1.66667V11.5552H1.11133C0.497333 11.5552 0 11.0579 0 10.4446V3.22191C0 2.60858 0.497333 2.11125 1.11133 2.11125H2.778V0.999913C2.778 0.693247 3.02667 0.44458 3.33333 0.44458H6.66667C6.97333 0.44458 7.222 0.693247 7.222 0.999913V2.11125H8.88867C9.50267 2.11125 10 2.60791 10 3.22191V10.4446C10 11.0579 9.50267 11.5552 8.88867 11.5552H8.33333V12.1112ZM8.88867 3.22191H1.11133V10.4439H8.88867V3.22191ZM3.88867 4.33325V9.33325H2.778V4.33325H3.88867ZM7.222 4.33325V9.33325H6.11133V4.33325H7.222ZM6.11133 1.55525H3.88867V2.11058H6.11133V1.55525Z"
            fill="#1E97DE"
        />
    </svg>
);

const SignedBaggage = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask id="mask0_728_20329" maskUnits="userSpaceOnUse" x="1" y="1" width="14" height="14">
            <path d="M1.33331 1.33325H14.6666V14.6666H1.33331V1.33325Z" fill="white" />
        </mask>
        <g mask="url(#mask0_728_20329)">
            <path
                d="M9.66664 3C9.97331 3 10.2226 3.24867 10.2226 3.55533V4.66667H13C13.3066 4.66667 13.556 4.91533 13.556 5.222V12.4447C13.556 12.7513 13.3066 13 13 13H2.99997C2.85274 12.9998 2.7116 12.9413 2.60749 12.8372C2.50338 12.733 2.44482 12.5919 2.44464 12.4447V5.222C2.44464 4.91533 2.69331 4.66667 2.99997 4.66667H5.77797V3.55533C5.77797 3.24867 6.02664 3 6.33331 3H9.66664ZM10.2226 5.778H5.77797V11.8887H10.2226V5.778ZM3.55597 5.778V11.8887H4.66664V5.778H3.55597ZM9.11131 4.11133H6.88931V4.66667H9.11131V4.11133ZM11.3333 5.778V11.8887H12.4446V5.778H11.3333Z"
                fill="#1E97DE"
            />
        </g>
    </svg>
);

export default FreeBaggage;
