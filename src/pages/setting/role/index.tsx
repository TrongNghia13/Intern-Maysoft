import { useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  RoleContainer,
  RoleTab,
  useCommonComponentContext,
} from "@maysoft/common-component-react";

import Constants from "@src/constants";
import Helpers from "@src/commons/helpers";
import PathName from "@src/constants/PathName";

import { RootState } from "@src/store";
import { Mode } from "@src/commons/enum";
import { NextApplicationPage } from "../../_app";
import { useQueryParams } from "@src/commons/useQueryParams";
import { withSSRErrorHandling } from "@src/commons/withSSRErrorHandling";
import { getServerSideTranslationsProps } from "@src/commons/translationHelpers";
import CompanyLayout from "@src/layout/companyLayout";

interface IRequestGetPage {
  organizationId?: string;
  clientId?: string;
  serviceCode?: string;
  roleLevel?: number;
  status?: number;
  type?: number;

  searchText?: string;
  pageNumber: number;
  pageSize?: number;
  orderBy?: string;
  totalCount?: number;
}

const RolePage: NextApplicationPage = () => {
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

  const filter: any | undefined = useQueryParams([
    "searchText",
    "tab",
    "serviceCode",
    "type",
    "status",
    "pageNumber",
    "pageSize",
    "totalCount",
  ]);

  const [requestData] = useState<IRequestGetPage>({
    searchText: filter.searchText,
    tab: filter.tab || RoleTab.Role,
    serviceCode: filter.serviceCode || Constants.SERVICE_CODE,
    type: Helpers.isNullOrEmpty(filter.type) ? undefined : Number(filter.type),
    status: Helpers.isNullOrEmpty(filter.status)
      ? undefined
      : Number(filter?.status),
    pageNumber: Number(filter.pageNumber || 1),
    pageSize: Number(filter.pageSize || Constants.ROW_PER_PAGE),
    totalCount: filter?.totalCount,
  } as IRequestGetPage);

  return (
    <CompanyLayout>
      <RoleContainer
        hiddenTab
        hidenActionDelete={!resourcePermissions.canDelete}
        hidenActionCreate={!resourcePermissions.canCreate}
        hidenActionUpdate={!resourcePermissions.canUpdate}
        requestGetPaged={requestData}
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
            router.push({
              pathname: PathName.ROLE_DETAIL,
              query: { id: data?.id, mode: data?.mode },
            });
          } else {
            router.push({
              pathname: PathName.ROLE_CREATE,
              query: { mode: Mode.Create },
            });
          }
        }}
      />
    </CompanyLayout>
  );
};

RolePage.requiredAuth = true;
RolePage.requiredSettinglayout = true;
export default withSSRErrorHandling(RolePage);

const getStaticProps = getServerSideTranslationsProps(["setting", "common"]);
export { getStaticProps };
