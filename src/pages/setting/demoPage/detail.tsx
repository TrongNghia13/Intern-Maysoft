import {
  ModalCreateUpdateStaff,
  OrganizationEditContainer,
  useCommonComponentContext,
} from "@maysoft/common-component-react";
import { Mode } from "@src/commons/enum";
import Helpers from "@src/commons/helpers";
import { getServerSideTranslationsProps } from "@src/commons/translationHelpers";
import { withSSRErrorHandling } from "@src/commons/withSSRErrorHandling";
import ModalCreateMemberByBooking from "@src/components/Staff/modalCreateMemberByBooking";
import ModalInvitationMemberByBooking from "@src/components/Staff/modalInvitationMemberByBooking";
import Constants from "@src/constants";
import PathName from "@src/constants/PathName";
import { NextApplicationPage } from "@src/pages/_app";
import { RootState } from "@src/store";
import {
  fetchUserInfo,
  storeListOrganization,
} from "@src/store/slice/userInfo.slice";
import { Router, useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
// import { number } from "yup";

const DemoPageDetailPage: NextApplicationPage = () => {
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
    Constants.ResourceURI.DEMOPAGE
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
    title: t("setting: title_detail_view"),
    route: [
      { title: t("setting:title_menu"), route: PathName.DemoPage },
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
    router.push(PathName.DemoPage);
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
            route: PathName.DemoPage,
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
    <>
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
    </>
  );
};

DemoPageDetailPage.requiredAuth = true;
DemoPageDetailPage.requiredSettinglayout = true;

export default withSSRErrorHandling(DemoPageDetailPage);
const getStaticProps = getServerSideTranslationsProps(["common", "setting"]);
export { getStaticProps };
