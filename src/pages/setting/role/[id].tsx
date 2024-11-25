import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import {
  RoleEditContainer,
  RoleHelpers,
  useCommonComponentContext,
} from "@maysoft/common-component-react";

import Helpers from "@src/commons/helpers";
import Constants from "@src/constants";
import PathName from "@src/constants/PathName";

import { RootState } from "@src/store";
import { Mode } from "@src/commons/enum";
import { NextApplicationPage } from "@src/pages/_app";
import { GetStaticPaths, GetStaticProps } from "next";
import { withSSRErrorHandling } from "@src/commons/withSSRErrorHandling";
import { makeServerSideTranslations } from "@src/commons/translationHelpers";

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  let props = {
    ...(await makeServerSideTranslations(locale, ["common", "setting"])),
  };

  const id = params?.id?.toString() || "";

  try {
    return {
      revalidate: true,
      props: {
        id,
        ...props,
      },
    };
  } catch (error) {
    return {
      revalidate: true,
      props: {
        error,
        ...props,
      },
    };
  }
};

interface IProps {
  id: string;
}

const RoleDetailPage: NextApplicationPage<IProps> = ({ id }) => {
  const {
    t,
    i18n: { language },
  } = useTranslation(["common", "setting"]);

  const router = useRouter();
  const { getResourcePermissions } = useCommonComponentContext();

  const resourcePermissions = getResourcePermissions(
    Constants.ResourceURI.ROLE
  );

  const userProfile = useSelector(
    (state: RootState) => state.userInfo?.userProfile
  );

  const pramsMode = !Helpers.isNullOrEmpty(router?.query?.mode)
    ? Number(router?.query?.mode)
    : undefined;

  const [model, setModel] = useState<{
    mode: number;
    title: string;
    route: any[];
  }>({
    mode: Mode.View,
    title: t("setting:role_title_detail_view"),
    route: [
      { title: t("setting:role_title_menu"), route: PathName.ROLE },
      { title: t("common:detail"), route: "" },
    ],
  });

  useEffect(() => {
    if (!Helpers.isNullOrEmpty(id) && id !== "create") {
      let mode: number = pramsMode || Mode.Update;
      handleOnChangeMode(mode);
    } else {
      handleOnChangeMode(Mode.Create);
    }
  }, [id, pramsMode]);

  const handleGoBack = () => {
    router.push(PathName.ROLE);
  };

  const handleOnChangeMode = (value: number) => {
    if (value === Mode.View) {
      setModel({
        mode: value,
        title: t("setting:role_title_detail_view"),
        route: [
          { title: t("setting:role_title_menu"), route: PathName.ROLE },
          { title: t("common:detail"), route: "" },
        ],
      });
    }
    if (value === Mode.Update) {
      setModel({
        mode: value,
        title: t("setting:role_title_update_view"),
        route: [
          { title: t("setting:role_title_menu"), route: PathName.ROLE },
          { title: t("common:update"), route: "" },
        ],
      });
    }
    if (value === Mode.Create) {
      setModel({
        mode: value,
        title: t("setting:role_title_create_view"),
        route: [
          { title: t("setting:role_title_menu"), route: PathName.ROLE },
          { title: t("common:add_new"), route: "" },
        ],
      });
    }

    if (!Helpers.isNullOrEmpty(id) && id !== "create") {
      router.push(
        {
          query: {
            id: id,
            mode: value,
          },
        },
        undefined,
        { shallow: true }
      );
    }
  };

  return (
    <>
      <RoleEditContainer
        mode={model.mode}
        idDetail={
          !Helpers.isNullOrEmpty(id) && id !== "create" ? id : undefined
        }
        hiddenTab
        hidenActionCreate={!resourcePermissions.canCreate}
        hidenActionUpdate={!resourcePermissions.canUpdate}
        onGoBack={handleGoBack}
        onChangeMode={(value) => {
          handleOnChangeMode(value);
        }}
      />
    </>
  );
};

RoleDetailPage.requiredAuth = true;
RoleDetailPage.requiredSettinglayout = true;
export default withSSRErrorHandling(RoleDetailPage);
