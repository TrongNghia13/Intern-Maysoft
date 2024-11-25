import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import {
  GroupListContainer,
  RoleHelpers,
  useCommonComponentContext,
} from "@maysoft/common-component-react";

import Constants from "@src/constants";
import Helpers from "@src/commons/helpers";
import PathName from "@src/constants/PathName";
import CompanyLayout from "@src/layout/companyLayout";

import { RootState } from "@src/store";
import { NextApplicationPage } from "@src/pages/_app";
import { withSSRErrorHandling } from "@src/commons/withSSRErrorHandling";
import { getServerSideTranslationsProps } from "@src/commons/translationHelpers";

interface IRequestGetPaged {
  searchText?: string;
  pageNumber?: number;
  pageSize?: number;
  listStatus?: string[];
  orderby?: string;
  totalCount?: number;
}

const GroupPage: NextApplicationPage = () => {
  const {
    t,
    i18n: { language },
  } = useTranslation(["common", "setting"]);

  const router = useRouter();
  const { getResourcePermissions } = useCommonComponentContext();

  const resourcePermissions = getResourcePermissions(
    Constants.ResourceURI.GROUP
  );
  const userProfile = useSelector(
    (state: RootState) => state.userInfo.userProfile
  );

  const [dataRequest] = useState<IRequestGetPaged>({
    searchText: router?.query?.searchText,
    listStatus:
      !Helpers.isNullOrEmpty(router?.query?.listStatus) &&
      (Array.isArray(router?.query?.listStatus)
        ? router?.query?.listStatus
        : [router?.query?.listStatus]),
    pageNumber: Number(router?.query?.pageNumber || 1),
    pageSize: Number(router?.query?.pageSize || Constants.ROW_PER_PAGE_20),
    totalCount: 0,
  } as IRequestGetPaged);

  return (
    <CompanyLayout>
      <GroupListContainer
        title={t("setting:group_title_list_view")}
        lableGroup={t("setting:group_title_menu")}
        lableStaff={t("setting:staff_title_menu")}
        lableOrganization={t("setting:title_menu")}
        hidenInputSelectGroupParent
        requestGetPaged={dataRequest}
        hidenActionCreate={!resourcePermissions.canCreate}
        hidenActionDelete={!resourcePermissions.canDelete}
        hidenActionUpdate={!resourcePermissions.canUpdate}
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
              PathName.GROUP_DETAIL + `?id=${data?.id}&mode=${data?.mode}`
            );
          } else {
            router.push(PathName.GROUP_DETAIL);
          }
        }}
      />
    </CompanyLayout>
  );
};

GroupPage.requiredAuth = true;
GroupPage.requiredSettinglayout = true;
export default withSSRErrorHandling(GroupPage);

const getStaticProps = getServerSideTranslationsProps(["setting", "common"]);
export { getStaticProps };
