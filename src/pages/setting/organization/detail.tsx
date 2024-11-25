import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import {
  ModalCreateUpdateStaff,
  OrganizationEditContainer,
  RoleHelpers,
  useCommonComponentContext,
} from "@maysoft/common-component-react";

import Constants from "@src/constants";
import Helpers from "@src/commons/helpers";
import PathName from "@src/constants/PathName";
import CompanyLayout from "@src/layout/companyLayout";
import RoleService from "@src/services/identity/RoleSerice";
import GroupService from "@src/services/identity/GroupService";
import ModalCreateMemberByBooking from "@src/components/Staff/modalCreateMemberByBooking";
import ModalInvitationMemberByBooking from "@src/components/Staff/modalInvitationMemberByBooking";

import { RootState } from "@src/store";
import { ICodename } from "@src/commons/interfaces";
import { GroupType, Mode } from "@src/commons/enum";
import { NextApplicationPage } from "@src/pages/_app";
import { withSSRErrorHandling } from "@src/commons/withSSRErrorHandling";
import { getServerSideTranslationsProps } from "@src/commons/translationHelpers";
import {
  fetchUserInfo,
  storeListOrganization,
} from "@src/store/slice/userInfo.slice";

const OrganizationDetailPage: NextApplicationPage = () => {
  const {
    t,
    i18n: { language },
  } = useTranslation(["common", "setting"]);

  const router = useRouter();
  const dispatch = useDispatch();
  const { getResourcePermissions } = useCommonComponentContext();

  const userProfile = useSelector(
    (state: RootState) => state.userInfo?.userProfile
  );
  const resourcePermissions = getResourcePermissions(
    Constants.ResourceURI.ORGANIZATION
  );

  const id: string = router?.query?.id as string;
  const pramsMode = !Helpers.isNullOrEmpty(router?.query?.mode)
    ? Number(router?.query?.mode)
    : undefined;

  const [model, setModel] = useState<{
    mode: number;
    title: string;
    route: any[];
  }>({
    mode: Mode.View,
    title: t("setting:title_detail_view"),
    route: [
      { title: t("setting:title_menu"), route: PathName.ORGANIZATION },
      { title: t("common:detail"), route: "" },
    ],
  });

  useEffect(() => {
    if (!Helpers.isNullOrEmpty(id)) {
      let mode: number = resourcePermissions.canUpdate
        ? pramsMode || Mode.Update
        : Mode.View;
      handleOnChangeMode(mode);
    } else {
      handleOnChangeMode(Mode.Create);
    }
  }, [id, pramsMode]);

  const handleGoBack = () => {
    router.push(PathName.ORGANIZATION);
  };

  const handleOnChangeMode = (value: number) => {
    if (value === Mode.View) {
      setModel({
        mode: value,
        title: t("setting:organization_title_detail_view"),
        route: [
          {
            title: t("setting:organization_title_menu"),
            route: PathName.ORGANIZATION,
          },
          { title: t("common:detail"), route: "" },
        ],
      });
    }
    if (value === Mode.Update) {
      setModel({
        mode: value,
        title: t("setting:organization_title_update_view"),
        route: [
          {
            title: t("setting:organization_title_menu"),
            route: PathName.ORGANIZATION,
          },
          { title: t("common:update"), route: "" },
        ],
      });
    }
    if (value === Mode.Create) {
      setModel({
        mode: value,
        title: t("setting:organization_title_create_view"),
        route: [
          {
            title: t("setting:organization_title_menu"),
            route: PathName.ORGANIZATION,
          },
          { title: t("common:add_new"), route: "" },
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
      <OrganizationEditContainer
        idDetail={id}
        mode={model.mode}
        title={model.title}
        lableGroup={t("setting:group_title_menu")}
        lableStaff={t("setting:staff_title_menu")}
        lableOrganization={t("setting:organization_title_menu")}
        hidenStatus
        hidenInputSelectGroupParent
        hidenActionDeleteStaffAllService
        hidenActionCreate={!resourcePermissions.canCreate}
        hidenActionUpdate={!resourcePermissions.canUpdate}
        hidenActionInvationStaff
        modalUpdateMember={(newProps) => {
          return (
            <ModalCreateUpdateStaff
              requiredRole
              dataUserTitle={[]}
              dataRoles={[...(newProps.dataRoles || [])]}
              dataGroups={[...(newProps.dataGroups || [])]}
              lableGroup={t("setting:group_title_menu")}
              lableStaff={t("setting:staff_title_menu")}
              lableOrganization={t("setting:organization_title_menu")}
              groupIdDefault={newProps.groupId}
              idDetailStaff={newProps.idDetailStaff}
              organizationId={newProps.organizationId}
              visibleModal={newProps.visibleModal}
              setVisibleModal={newProps.setVisibleModal}
              onClose={() => {}}
              onCallBack={() => {
                newProps.onCallBack && newProps.onCallBack();
              }}
            />
          );
        }}
        modalCreateMember={(newProps) => {
          return (
            <ModalCreateMemberByBooking
              requiredRole
              groupId={undefined}
              organizationId={newProps.organizationId}
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
              groupId={undefined}
              organizationId={newProps.organizationId}
              onCallBack={() => {
                newProps.onCallBack && newProps.onCallBack();
              }}
            />
          );
        }}
        onGoBack={handleGoBack}
        onChangeMode={(value) => {
          handleOnChangeMode(value);
        }}
        onUpdateListOrganization={async (data) => {
          if (data.isFetchUserInfo) {
            Helpers.setLocalStorage(Constants.StorageKeys.ORGANIZATION_ID, "");
            dispatch(fetchUserInfo());
          }
          dispatch(storeListOrganization(data.data));
        }}
      />
    </CompanyLayout>
  );
};

OrganizationDetailPage.requiredAuth = true;
OrganizationDetailPage.requiredSettinglayout = true;
export default withSSRErrorHandling(OrganizationDetailPage);

const getStaticProps = getServerSideTranslationsProps(["setting", "common"]);
export { getStaticProps };
