import { Box, Typography } from "@maysoft/common-component-react";
import { Dot } from "@src/assets/svg";
import Constants from "@src/constants";
import { typographyStyles } from "@src/styles/commonStyles";
import { Fragment } from "react";

export const BreadCrumbs = ({ title, route }: { title: string; route: string[] }) => {
    return (
        <Box>
            <Box display="flex" alignItems="center" gap={1} py={2.5}>
                {route.map((el, index) => (
                    <Fragment key={index}>
                        <Typography
                            sx={(theme) =>
                                typographyStyles(theme, {
                                    fontSize: Constants.FONT_SIZE.SMALL_TEXT,
                                    color: index === route.length - 1 ? "#637381" : "#1C252E",
                                })
                            }
                        >
                            {el}
                        </Typography>
                        {index !== route.length - 1 && <Dot />}
                    </Fragment>
                ))}
                {/* <Typography
                    sx={{
                        fontSize: Constants.FONT_SIZE.SMALL_TEXT,
                        fontWeight: 400,
                        color: "#1C252E",
                    }}
                >
                    {route[0]}
                </Typography>
                <Dot />
                <Typography sx={{ fontSize: Constants.FONT_SIZE.SMALL_TEXT, fontWeight: 400, color: "#637381" }}>{route[1]}</Typography> */}
            </Box>
            <Typography
                sx={(theme) =>
                    typographyStyles(theme, {
                        fontSize: "1.5rem",
                        fontWeight: 500,
                        color: "#000000",
                    })
                }
            >
                {title}
            </Typography>
        </Box>
    );
};

export default BreadCrumbs;
