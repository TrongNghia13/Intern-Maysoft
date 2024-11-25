import moment from "moment";
import { setLocale } from "yup";
import { Box, Icon } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import React, { useEffect, useMemo } from "react";

import Helpers from "@src/commons/helpers";
import CompanyLayout from "./companyLayout";
import Resources from "@src/constants/Resources";

import { RootState } from "@src/store";
import { useSelector } from "react-redux";
import { useAuth } from "@src/providers/authProvider";
import { Footer, Header, Image } from "@src/components";
import { IItemRoute, IRecordMenuDetail } from "@src/commons/interfaces";

interface IProps {
  iconUrl?: string;
  children: JSX.Element;
  requiredSettinglayout?: boolean;
}

const ToolbarSpacer = styled("div")(({ theme }) => ({ height: 74 }));

const RootContainer = styled("div")(({ theme }) => ({
  minHeight: `calc(100vh - ${theme.mixins.toolbar.minHeight}px - 1rem)`,
  display: "flex",
  flexDirection: "column",
}));

const Content = styled("div")(() => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
}));

const MainLayout: React.FC<IProps> = (props: IProps) => {
  const {
    t,
    i18n: { language },
  } = useTranslation("common");
  const auth = useAuth();
  const iconUrl = useMemo(
    () =>
      !Helpers.isNullOrEmpty(props.iconUrl)
        ? Helpers.getFileAccessUrl(props.iconUrl)
        : Resources.Icon.APP_LOGO,
    [props.iconUrl]
  );

  useEffect(() => {
    moment.locale(language);
    setLocale({
      // use constant translation keys for messages without values
      mixed: {
        required: t("message.message_required_field"),
      },
      string: {
        email: t("message.email_invalid"),
      },
    });
  }, [language]);

  if (typeof window === "undefined") {
    return null;
  }

  return (
    <Box
      sx={(theme) => ({
        display: "flex",
        // backgroundColor: (theme as any).palette.background.body,
        backgroundColor: "#f4f6f8",
      })}
    >
      <Header iconUrl={iconUrl} />
      <Box component={"main"} width={"100%"}>
        <ToolbarSpacer />
        <RootContainer>
          <Content>
            {/* <Box
                            sx={{
                                width: "100%",
                                height: "20vh",
                            }}
                        /> */}
            {props.requiredSettinglayout ? (
              <CompanyLayout menus={[]}>{props.children}</CompanyLayout>
            ) : (
              props.children
            )}
          </Content>
          <Footer iconUrl={iconUrl} />
        </RootContainer>
      </Box>
    </Box>
  );
};

export default MainLayout;
