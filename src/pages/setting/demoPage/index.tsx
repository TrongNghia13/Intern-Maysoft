import {
  OrganizationListContainer,
  useCommonComponentContext,
} from "@maysoft/common-component-react";
import { useQueryParams } from "@src/commons/useQueryParams";
import Constants from "@src/constants";
import { NextApplicationPage } from "@src/pages/_app";
import { RootState } from "@src/store";
import { useRouter } from "next/router";
import { use, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
// import { connect } from "react-redux";
import organization from "../organization";
import CompanyLayout from "@src/layout/companyLayout";
import PathName from "@src/constants/PathName";
import { withSSRErrorHandling } from "@src/commons/withSSRErrorHandling";
import { getServerSideTranslationsProps } from "@src/commons/translationHelpers";
import {
  fetchUserInfo,
  storeListOrganization,
} from "@src/store/slice/userInfo.slice";
import Helpers from "@src/commons/helpers";

interface IRequestGetPage {
  orderby?: string;
  pageSize?: number;
  pageNumber?: number;
  totalCount?: number;
  searchText?: string;
  status?: string[];
  organizationCode?: string;
}

const DemoPage: NextApplicationPage = () => {
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

  const filter: any | undefined = useQueryParams([
    "status",
    "searchText",
    "organizationCode",
  ]);

  const [requestData] = useState<IRequestGetPage>({
    status: filter.status,
    searchText: filter.searchText,
    organizationCode: filter.organizationCode,
    pageNumber: Number(router?.query?.pageNumber || 1),
    pageSize: Number(router?.query?.pageSize || Constants.ROW_PER_PAGE_20),
    totalCount: 0,
  } as IRequestGetPage);

  return (
    <CompanyLayout>
      <OrganizationListContainer
        title={t("setting:demopage_title_list_view")}
        lableGroup={t("setting:demopage_title_menu")}
        lableStaff={t("setting:staff_title_menu")}
        lableOrganization={t("setting:organization_title_menu")}
        lableDemoPage={t("setting:demopage_title_menu")}
        hidenActionDeleteAllService
        hidenActionCreate={!resourcePermissions.canCreate}
        // hidenActionDelete={!resourcePermissions.canDelete}
        hidenActionUpdate={!resourcePermissions.canUpdate}
        requestGetPaged={requestData}
        onUpdateListOrganization={async (data) => {
          if (data.isFetchUserInfo) {
            Helpers.setLocalStorage(Constants.StorageKeys.ORGANIZATION_ID, "");
            dispatch(fetchUserInfo());
          }
          dispatch(storeListOrganization(data.data));
        }}
        onGetPaged={({ query, totalCount }) => {
          router.push(
            {
              query: query.replace("?", ""),
            },
            undefined,
            { shallow: true }
          );
        }}
        onNavigate={(data) => {
          if (data?.id) {
            router.push(
              PathName.ORGANIZATION_DETAIL +
                `?id=${data?.id}&mode=${data?.mode}`
            );
          } else {
            router.push(PathName.ORGANIZATION_DETAIL);
          }
        }}
      />
    </CompanyLayout>
  );
};

DemoPage.requiredAuth = true;
DemoPage.requiredSettinglayout = true;
export default withSSRErrorHandling(DemoPage);

const getStaticProps = getServerSideTranslationsProps(["setting", "common"]);
export { getStaticProps };
