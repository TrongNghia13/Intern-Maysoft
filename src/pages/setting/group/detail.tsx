import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import {
  GroupEditContainer,
  RoleHelpers,
  useCommonComponentContext,
} from "@maysoft/common-component-react";

import Constants from "@src/constants";
import Helpers from "@src/commons/helpers";
import PathName from "@src/constants/PathName";
import CompanyLayout from "@src/layout/companyLayout";
import ModalCreateMemberByBooking from "@src/components/Staff/modalCreateMemberByBooking";
import ModalInvitationMemberByBooking from "@src/components/Staff/modalInvitationMemberByBooking";

import { RootState } from "@src/store";
import { Mode } from "@src/commons/enum";
import { NextApplicationPage } from "@src/pages/_app";
import { withSSRErrorHandling } from "@src/commons/withSSRErrorHandling";
import { getServerSideTranslationsProps } from "@src/commons/translationHelpers";

const GroupDetailPage: NextApplicationPage = () => {
  const {
    t,
    i18n: { language },
  } = useTranslation(["common", "setting"]);

  const router = useRouter();
  const { getResourcePermissions } = useCommonComponentContext();

  const id: string = router?.query?.id as string;
  const pramsMode = !Helpers.isNullOrEmpty(router?.query?.mode)
    ? Number(router?.query?.mode)
    : undefined;

  const resourcePermissions = getResourcePermissions(
    Constants.ResourceURI.GROUP
  );
  const userProfile = useSelector(
    (state: RootState) => state.userInfo.userProfile
  );

  const [model, setModel] = useState<{
    mode: Mode;
    title: string;
    route: any[];
  }>({
    mode: Mode.View,
    title: t("setting:group_title_detail_view"),
    route: [
      { title: t("setting:group_title_menu"), route: PathName.GROUP },
      { title: t("common:detail"), route: "" },
    ],
  });

  useEffect(() => {
    if (Helpers.isNullOrEmpty(id)) {
      handleOnChangeMode(Mode.Create);
    } else {
      let mode = resourcePermissions.canUpdate
        ? pramsMode || Mode.Update
        : Mode.View;
      handleOnChangeMode(mode);
    }
  }, [id, pramsMode]);

  const handleGoBack = () => {
    router.push(PathName.GROUP);
  };

  const handleOnChangeMode = (value: number) => {
    if (value === Mode.Create) {
      setModel({
        mode: value,
        title: t("setting:group_title_create_view"),
        route: [
          { title: t("setting:group_title_menu"), route: PathName.GROUP },
          { title: t("common:add_new"), route: "" },
        ],
      });
    }
    if (value === Mode.Update) {
      setModel({
        mode: value,
        title: t("setting:group_title_update_view"),
        route: [
          { title: t("setting:group_title_menu"), route: PathName.GROUP },
          {
            title: t("common:update"),
            route: "",
          },
        ],
      });
    }
    if (value === Mode.View) {
      setModel({
        mode: value,
        title: t("setting:group_title_detail_view"),
        route: [
          { title: t("setting:group_title_menu"), route: PathName.GROUP },
          { title: t("common:detail"), route: "" },
        ],
      });
    }

    if (!Helpers.isNullOrEmpty(id)) {
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
    <CompanyLayout>
      <GroupEditContainer
        lableGroup={t("setting:group_title_menu")}
        lableStaff={t("setting:staff_title_menu")}
        lableOrganization={t("setting:title_menu")}
        hidenStatus
        hidenInputSelectGroupParent
        hidenActionUpdate={!resourcePermissions.canUpdate}
        hidenActionInvitationMember
        hidenActionUpdateMember={!resourcePermissions.canUpdate}
        hidenActionDeleteMember={!resourcePermissions.canUpdate}
        modalCreateMember={(newProps) => {
          return (
            <ModalCreateMemberByBooking
              requiredRole
              groupId={newProps.groupId}
              organizationId={newProps?.organizationId}
              onCallBack={() => {
                newProps.onCallBack && newProps.onCallBack();
              }}
            />
          );
        }}
        modalInvitationMember={(newProps) => {
          return (
            <ModalInvitationMemberByBooking
              requiredRole
              groupId={newProps.groupId}
              organizationId={newProps?.organizationId}
              onCallBack={() => {
                newProps.onCallBack && newProps.onCallBack();
              }}
            />
          );
        }}
        idDetail={id}
        mode={model.mode}
        title={model.title}
        onGoBack={handleGoBack}
        onChangeMode={(value) => {
          handleOnChangeMode(value);
        }}
      />
    </CompanyLayout>
  );
};

GroupDetailPage.requiredAuth = true;
GroupDetailPage.requiredSettinglayout = true;
export default withSSRErrorHandling(GroupDetailPage);

const getStaticProps = getServerSideTranslationsProps(["setting", "common"]);
export { getStaticProps };
