import { Grid, Link as MuiLink } from "@mui/material";
import { useTranslation } from "next-i18next";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import { Box, Typography } from "@maysoft/common-component-react";
import PathName from "@src/constants/PathName";
import Resources from "@src/constants/Resources";
import { containerStyles, logoBox, navLink } from "./styles";
import Constants from "@src/constants";
import { typographyStyles } from "@src/styles/commonStyles";
import { TextWithIcon } from "../TextWithIcon";

const LanguageSwitcher = dynamic(
  () => import("../LanguageSwitcher/LanguageSwitcher")
);

export const Footer: React.FC<{ iconUrl: string }> = ({ iconUrl }) => {
  const {
    t,
    i18n: { language },
  } = useTranslation("common");

  // const { data, isLoading } = useSWR(
  //     [
  //         "getPagedData",
  //         {
  //             pageNumber: 1,
  //             pageSize: 4,
  //             types: ItemType.Membership,
  //             organizationId: userInfo?.organizations?.[0]?.id || undefined,
  //             period: PeriodValue.Monthly || undefined,
  //         },
  //     ],
  //     ([_, query]) => {
  //         if (!query.period) {
  //             return {
  //                 currentPage: 0,
  //                 totalPages: 0,
  //                 pageSize: 0,
  //                 totalCount: 0,
  //                 hasPrevious: false,
  //                 hasNext: false,
  //                 items: [] as IProduct[],
  //             };
  //         }
  //         return ItemService.getPageTenant(query.pageNumber, query.pageSize, query.types, query.organizationId, query.period);
  //     }
  // );

  return (
    <footer>
      <Box sx={containerStyles}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={9}>
            <Box sx={logoBox}>
              <div>
                <Link
                  href={PathName.HOME}
                  style={{ display: "inline-block", width: "fit-content" }}
                >
                  <Image
                    src={Resources.Icon.APP_LOGO}
                    alt="app logo"
                    width={200}
                    height={200}
                    quality={100}
                  />
                </Link>
              </div>
              <Typography sx={{ width: "282px" }}>
                {t("footer.description", { name: "May-Booking" })}
              </Typography>
              <Box display="grid" gap={1}>
                {/* <Typography fontWeight="medium">{t("footer.contact")}</Typography> */}
                <TextWithIcon
                  iconName="phone"
                  value={"+84 8 1900 9597"}
                  color="secondary"
                />
                <TextWithIcon
                  iconName="email"
                  value={"hello@bizitrip.vn"}
                  color="secondary"
                />
                <TextWithIcon
                  iconName="place"
                  value={
                    "11A Nguyễn Văn Mại, Phường 4, Quận Tân Bình, Thành phố Hồ Chí Minh"
                  }
                  color="secondary"
                />
              </Box>

              {/* Copyright © 2024 BiziTrip | All Rights Reserved */}

              {/* <Box display="flex" alignItems="center" gap={2}>
                                <Link href={PathName.HOME}>
                                    <Image src={Resources.Icon.FACEBOOK} alt="facebook" width={30} height={30} quality={1} />
                                </Link>
                                <Link href={PathName.HOME}>
                                    <Image src={Resources.Icon.INSTAGRAM} alt="INSTAGRAM" width={30} height={30} quality={1} />
                                </Link>
                                <Link href={PathName.HOME}>
                                    <Image src={Resources.Icon.LINKEDIN} alt="LINKEDIN" width={30} height={30} quality={1} />
                                </Link>
                                <Link href={PathName.HOME}>
                                    <Image src={Resources.Icon.YOUTUBE} alt="YOUTUBE" width={30} height={30} quality={1} />
                                </Link>
                            </Box> */}
            </Box>
          </Grid>

          {/* <Grid item xs={12} md={6} lg={3}>
                        <Box sx={navLink}>
                            <Typography>{t("footer.about_us")}</Typography>
                            <Link href={PathName.HOME}>{t("footer.introduce")}</Link>
                            <Link href={PathName.HOME}>{t("footer.agent_registration")}</Link>
                            <Link href={PathName.HOME}>{t("footer.cooperate")}</Link>
                            <Link href={PathName.HOME}>{t("footer.news")}</Link>
                            <Link href={PathName.HOME}>{t("footer.recruitment")}</Link>
                        </Box>
                    </Grid> */}

          {/* <Grid item xs={12} md={6} lg={3}>
                        <Box sx={navLink}>
                            <Typography>{t("footer.support")}</Typography>
                            <Link href={PathName.HOME}>{t("footer.privacy_policy", { website: "may-booking.com" })}</Link>
                            <Link href={PathName.HOME}>{t("footer.term_condition")}</Link>
                            <Link href={PathName.HOME}>{t("footer.resolving_complaints")}</Link>
                            <Link href={PathName.HOME}>{t("footer.refund_and_ticket_exchange")}</Link>
                            <Link href={PathName.HOME}>{t("footer.payment_policy")}</Link>
                            <Link href={PathName.HOME}>{t("footer.procedure_for_buying_and_receiving_e-tickets")}</Link>
                            <Link href={PathName.HOME}>{t("footer.support_center")}</Link>
                            <Link href={PathName.HOME}>{t("footer.guaranteed_service")}</Link>
                            <Link href={PathName.HOME}>{t("footer.website_feedback")}</Link>
                        </Box>
                    </Grid> */}

          <Grid item xs={12} lg={3}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "end",
                justifyContent: "right",
                gap: 1,
              }}
            >
              <Typography
                sx={{
                  color: "#637381 !important",
                  fontWeight: "400 !important",
                  textAlign: "right",
                  fontSize: Constants.FONT_SIZE.SMALL_TEXT,
                }}
              >
                {t("Đối tác thanh toán")}
              </Typography>
              {/* <Link href={"http://maysoft.io"}>
                                <Public fontSize="large" />
                            </Link> */}
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  flexWrap: "wrap",
                  flexDirection: "row",
                  gridTemplateColumns: "repeat(3, 1fr)",
                }}
              >
                <Image
                  src={Resources.Images.VISA}
                  alt="VISA"
                  width={54}
                  height={36}
                  sizes="100vw"
                  quality={1}
                />
                <Image
                  src={Resources.Images.MASTERCARD}
                  alt="MASTERCARD"
                  width={54}
                  height={36}
                  sizes="100vw"
                  quality={1}
                />
                <Image
                  src={Resources.Images.JCB}
                  alt="JCB"
                  width={54}
                  height={36}
                  sizes="100vw"
                  quality={1}
                />
                <Image
                  src={Resources.Images.AMEX}
                  alt="AMEX"
                  width={54}
                  height={36}
                  sizes="100vw"
                  quality={1}
                />
                <Image
                  src={Resources.Images.VIET_QR}
                  alt="VIET_QR"
                  width={54}
                  height={36}
                  sizes="100vw"
                  quality={1}
                />
                {/* <Image src={Resources.Images.ATM} alt="ATM" width={64} height={40} sizes="100vw" quality={1} />
                                <Image src={Resources.Images.MOMO} alt="MOMO" width={64} height={40} sizes="100vw" quality={1} />
                                <Image src={Resources.Images.UNION_PAY} alt="UNION_PAY" width={64} height={40} sizes="100vw" quality={1} />
                                <Image src={Resources.Images.ZALO_PAY} alt="ZALO_PAY" width={64} height={40} sizes="100vw" quality={1} /> */}
              </Box>
              <LanguageSwitcher />
            </Box>
            <Box mt={1}></Box>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Box
            sx={{
              width: "100%",
              height: "1px",
              backgroundColor: "#9F9F9F",
              borderRadius: 2,
              my: 2,
            }}
          ></Box>
        </Grid>

        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography
            sx={(theme) =>
              typographyStyles(theme, {
                fontSize: Constants.FONT_SIZE.SMALL_TEXT,
              })
            }
          >
            Copyright © 2024 BiziTrip | All Rights Reserved
          </Typography>
          <Box display="flex" gap={2}>
            <Typography
              sx={(theme) =>
                typographyStyles(theme, {
                  fontSize: Constants.FONT_SIZE.SMALL_TEXT,
                })
              }
            >
              Chính sách bảo mật thông tin
            </Typography>
            <Typography
              sx={(theme) =>
                typographyStyles(theme, {
                  fontSize: Constants.FONT_SIZE.SMALL_TEXT,
                })
              }
            >
              Điều khoản sử dụng
            </Typography>
          </Box>
          {/* <Typography sx={(theme) => typographyStyles(theme, { color: "#ffffff" })}>
                        © 2023 - Powered by{" "}
                        <Link href="https://maysoft.io" target="_new">
                            Maysoft
                        </Link>
                    </Typography> */}
        </Box>
      </Box>
    </footer>
  );
};

export default Footer;
