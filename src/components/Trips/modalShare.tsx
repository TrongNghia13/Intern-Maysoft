import { Box, Button, Modal, Typography } from "@maysoft/common-component-react";
import { EventOutlined, InsertLinkOutlined, LanguageOutlined, RoomOutlined } from "@mui/icons-material";
import { Grid } from "@mui/material";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import theme from "@src/assets/theme";
import Helpers from "@src/commons/helpers";
import { Avatar } from "@src/components/Avatar";

import Constants from "@src/constants";
import { ITripDetail } from "@src/store/slice/trips.slice";

const ShareModal: React.FC<{
    visibled: boolean;
    setVisibled: React.Dispatch<React.SetStateAction<boolean>>;
    data: ITripDetail;
}> = ({ visibled, setVisibled, data }) => {
    const {
        t,
        i18n: { language },
    } = useTranslation(["common", "tripbooking"]);

    const newImages = useMemo(() => {
        const images1000px = data?.detail?.photos.filter((image) => image.pixels === Constants.IMAGE_PIXELS_RANGE[2]);
        if (images1000px.length > 0) return images1000px;
        const images350px = data?.detail?.photos.filter((image) => image.pixels === Constants.IMAGE_PIXELS_RANGE[1]);
        if (images350px.length > 0) return images350px;
        const images70px = data?.detail?.photos.filter((image) => image.pixels === Constants.IMAGE_PIXELS_RANGE[0]);
        return images70px || [];
    }, [data?.detail?.photos]);

    return (
        <Modal fullWidth key={"share"} visible={visibled} onClose={() => setVisibled(false)}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Box display={"grid"}>
                        <Typography variant="h6">{t("tripbooking:share_this_hotel")}</Typography>
                        <Typography variant="button">{t("tripbooking:anyone_with_this_link_can_check_availability_and_book_this_hotel")}</Typography>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            [theme.breakpoints.between(768, 1024)]: {
                                flexDirection: "column",
                            },
                            [theme.breakpoints.between(0, 660)]: {
                                flexDirection: "column",
                            },
                        }}
                    >
                        <Box
                            sx={{
                                width: "30%",
                                [theme.breakpoints.between(768, 1024)]: {
                                    width: "100%",
                                    height: "180px",
                                },
                                [theme.breakpoints.between(0, 660)]: {
                                    width: "100%",
                                    height: "180px",
                                },
                            }}
                        >
                            <Avatar
                                src={newImages?.[0]?.photoUrl}
                                sx={{
                                    width: "100%",
                                    height: "100%",
                                    borderRadius: "8px 0px 0px 8px",
                                    [theme.breakpoints.between(768, 1024)]: {
                                        borderRadius: "8px 8px 0px 0px",
                                    },
                                    [theme.breakpoints.between(0, 660)]: {
                                        borderRadius: "8px 8px 0px 0px",
                                    },
                                }}
                            />
                        </Box>
                        <Box
                            sx={{
                                pl: 3,
                                width: "70%",
                                display: "flex",
                                flexDirection: "column",
                                [theme.breakpoints.between(768, 1024)]: {
                                    pl: 0,
                                    width: "100%",
                                },
                                [theme.breakpoints.between(0, 660)]: {
                                    pl: 0,
                                    width: "100%",
                                },
                            }}
                        >
                            <Typography variant="h6" sx={{ paddingBottom: "8px", paddingTop: "8px" }}>
                                {data?.detail?.name}
                            </Typography>
                            <Box
                                sx={{
                                    display: "flex",
                                    paddingBottom: "4px",
                                }}
                            >
                                <RoomOutlined sx={{ fontSize: "18px", color: "#7b809a" }} />
                                &nbsp;
                                <Typography variant="caption" color="secondary">
                                    {/* {data.addressName} */}
                                    {Helpers.getAddressInfo(data?.detail?.address)}
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    paddingBottom: "4px",
                                }}
                            >
                                <EventOutlined sx={{ fontSize: "18px", color: "#7b809a" }} />
                                &nbsp;
                                <Typography variant="caption" color="secondary">
                                    {`${Helpers.formatMothName(Number(data.requestBooking?.startTime) * 1000, language)} ${Helpers.formatDate(
                                        Number(data.requestBooking?.startTime) * 1000,
                                        "DD"
                                    )}
                                     - 
                                     ${Helpers.formatMothName(Number(data.requestBooking?.endTime) * 1000, language)} ${Helpers.formatDate(
                                        Number(data.requestBooking?.endTime) * 1000,
                                        "DD"
                                    )}`}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Box
                        sx={{
                            pl: 3,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <LanguageOutlined color="info" />
                        <Button
                            color="info"
                            variant="outlined"
                            sx={{ width: "85%" }}
                            onClick={() => {
                                navigator.clipboard.writeText(window.location.origin + `/hotel/${data.detail.propertyId}`);
                            }}
                        >
                            <InsertLinkOutlined color="info" />
                            &nbsp;
                            {t("tripbooking:get_link")}
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Modal>
    );
};

export default ShareModal;
