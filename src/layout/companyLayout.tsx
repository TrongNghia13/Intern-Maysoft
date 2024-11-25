import { Grid, Icon, useMediaQuery } from "@mui/material";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import React, { useEffect, useMemo, useState } from "react";
import { RoleHelpers } from "@maysoft/common-component-react";

import BaseLayout from "./baseLayout";
import Constants from "@src/constants";
import Helpers from "@src/commons/helpers";
import PathName from "@src/constants/PathName";

import { RootState } from "@src/store";
import { useAuth } from "@src/providers/authProvider";
import { Card, Image, MenuBar } from "@src/components";
import { IItemRoute, IRecordMenuDetail } from "@src/commons/interfaces";
import {
  JobManageIcon,
  OrganizationManageIcon,
  PricingManganeIcon,
} from "@src/assets/svg";

interface IProps {
  menus?: IItemRoute[];
  children: JSX.Element;
}

const CompanyLayout: React.FC<IProps> = (props: IProps) => {
  const {
    t,
    i18n: { language },
  } = useTranslation(["common", "setting"]);

  const auth = useAuth();
  const router = useRouter();
  const id = router?.query?.id as string;

  const [menus, setMenus] = useState<IItemRoute[]>([]);
  const userInfo = useSelector((state: RootState) => state.userInfo);

  const pushSubmenu = (
    menuParents: IItemRoute[],
    subMenuMap: { [key: string]: IItemRoute[] }
  ) => {
    const newDataReturn = menuParents.map((el: IItemRoute) => {
      if (subMenuMap[el.gene]) {
        el.subMenu = pushSubmenu(subMenuMap[el.gene], subMenuMap);
      }
      return el;
    });

    return newDataReturn;
  };

  useEffect(() => {
    if (auth?.user == null) {
      return;
    } else {
      const menuParents: IItemRoute[] = [];

      const menuSetting = [...(userInfo?.menuDetails || [])].find(
        (el) => el.resourceURI === Constants.MenuResourceURI.SETTING
      );

      if (menuSetting) {
        [...(userInfo?.menuDetails || [])].forEach(
          (element: IRecordMenuDetail) => {
            if (element.gene.startsWith(menuSetting.gene)) {
              let iconElement: JSX.Element | undefined = undefined;

              const title = Helpers.getDefaultValueMultiLanguage(
                element.title,
                language
              );
              if (element.resourceURI === PathName.DemoPage) {
                menuParents.push({
                  title: "Demo Page",
                  isVisible: true,
                  icon: <Icon>demo_icon</Icon>,
                  screenPath: PathName.DemoPage,
                  gene: "0000100006",
                });
              }

              if (!Helpers.isNullOrEmpty(element.icon)) {
                iconElement = (
                  <Icon
                    sx={{
                      width: "24px",
                      height: "24px",
                      display: "grid",
                      marginRight: "8px",
                      placeItems: "center",
                    }}
                  >
                    {element.icon}
                  </Icon>
                );
              }

              if (!Helpers.isNullOrEmpty(element.iconUrl)) {
                iconElement = (
                  <Image
                    alt=""
                    src={element.iconUrl}
                    width={24}
                    height={24}
                    style={{ width: "24px", height: "24px" }}
                  />
                );
              }

              const newItemRoute: IItemRoute = {
                title: title,
                isVisible: true,
                icon: iconElement,
                screenPath: element.externalUrl || "",
                gene: element.gene.substring(5, element.gene.length) || "",
              };

              !Helpers.isNullOrEmpty(newItemRoute.gene) &&
                menuParents.push(newItemRoute);

              //
              if (!Helpers.isNullOrEmpty(element.extraInformation)) {
                const extraInformation = Helpers.converStringToJson(
                  element.extraInformation
                );

                if (Array.isArray(extraInformation)) {
                  extraInformation.forEach((el) => {
                    const elGene = el.Gene || el.gene;
                    const newItemSub: IItemRoute = {
                      title: "",
                      icon: undefined,
                      isVisible: false,
                      gene: elGene.substring(5, elGene.length),
                      screenPath: el.ScreenPath || el.screenPath || "",
                    };
                    menuParents.push(newItemSub);
                  });
                } else {
                  const extraGene =
                    extraInformation?.Gene || extraInformation?.gene;
                  const newItemSub: IItemRoute = {
                    title: "",
                    isVisible: false,
                    gene: extraGene.substring(5, extraGene.length),
                    screenPath:
                      extraInformation?.ScreenPath ||
                      extraInformation?.screenPath ||
                      "",
                  };
                  menuParents.push(newItemSub);
                }
              }
            }
          }
        );

        setMenus(menuParents);
      }
    }
  }, [auth.user, userInfo?.menuDetails, language]);

  const permissionAdmin = useMemo(
    () =>
      RoleHelpers.isServiceAdmin(userInfo?.userProfile?.roleType) ||
      RoleHelpers.isOrganizationOwner(userInfo?.userProfile?.roleType) ||
      RoleHelpers.isOrganizationAdmin(userInfo?.userProfile?.roleType) ||
      RoleHelpers.isSuperAdmin(
        userInfo?.userProfile?.roleType,
        Constants.SERVICE_CODE
      ),
    [userInfo?.userProfile?.roleType]
  );

  const groupByMenuOrg = [
    // Organization Management
    {
      gene: "00001",
      isVisible: true,
      icon: <OrganizationManageIcon />,
      title: t("setting:organization_management"),
    },
    // ORGANIZATION
    {
      isVisible: true,
      gene: "0000100001",
      screenPath: PathName.ORGANIZATION,
      title: t("setting:organization_title_menu"),
    },
    {
      isVisible: false,
      gene: "000010000100001",
      screenPath: PathName.ORGANIZATION_DETAIL,
      title: "",
    },
    {
      isVisible: false,
      gene: "000010000100002",
      screenPath: PathName.ORGANIZATION_DETAIL,
      title: "",
    },
    // GROUP
    {
      isVisible: true,
      gene: "0000100002",
      screenPath: PathName.GROUP,
      title: t("setting:group_title_menu"),
    },
    {
      isVisible: false,
      gene: "000010000200001",
      screenPath: PathName.GROUP_DETAIL,
      title: "",
    },
    {
      isVisible: false,
      gene: "000010000200002",
      screenPath: PathName.GROUP_DETAIL,
      title: "",
    },
    // STAFF
    {
      isVisible: true,
      gene: "0000100003",
      screenPath: PathName.STAFF,
      title: t("setting:staff_title_menu"),
    },
    {
      isVisible: false,
      gene: "000010000300001",
      screenPath: PathName.STAFF_EDIT,
      title: "",
    },
    {
      isVisible: false,
      gene: "000010000300002",
      screenPath: PathName.STAFF_CREATE,
      title: "",
    },
    {
      isVisible: false,
      gene: "000010000300003",
      screenPath: PathName.STAFF_INVITATION,
      title: "",
    },

    // // PAYMENT
    {
      isVisible: true,
      gene: "0000100004",
      screenPath: PathName.PAYMENT,
      title: t("setting:payment_title_menu"),
    },
    {
      isVisible: false,
      gene: "000010000400001",
      screenPath: PathName.PAYMENT_DETAIL.replace("[id]", id),
      title: "",
    },
    {
      isVisible: false,
      gene: "000010000400002",
      screenPath: PathName.PAYMENT_CREATE,
      title: "",
    },

    //demopage
    {
      isVisible: true,
      gene: "0000100005",
      screenPath: PathName.DemoPage,
      title: t("setting:demopage_title_menu"),
    },
    {
      isVisible: false,
      gene: "000010000500001",
      screenPath: PathName.DemoPage_EDIT,
      title: "",
    },
    {
      isVisible: false,
      gene: "000010000500002",
      screenPath: PathName.DemoPage_DETAIL,
      title: "",
    },
  ];

  const groupByMenuWorkflow = [
    // Quản lý công tác
    {
      gene: "00002",
      isVisible: true,
      title: t("setting:work_management"),
      icon: <JobManageIcon />,
      // icon: <Image style={{ filter: "brightness(0)" }} alt="job" src={Resources.Icon.FLIGHT_JOB} width={21} height={21} />,
    },

    // POLICY
    {
      isVisible: true,
      gene: "0000200001",
      screenPath: PathName.POLICY,
      title: t("setting:policy_title_menu"),
    },
    {
      isVisible: false,
      gene: "0000200001000001",
      title: t("setting:policy_title_menu"),
      screenPath: PathName.POLICY_CREATE,
    },
    {
      isVisible: false,
      gene: "0000200001000002",
      title: t("setting:policy_title_menu"),
      screenPath: PathName.POLICY_DETAIL.replace("[id]", id),
    },

    // Workflow
    {
      isVisible: true,
      gene: "0000200002",
      screenPath: PathName.WORKFLOW,
      title: t("setting:workflow_title_menu"),
    },
    {
      isVisible: false,
      gene: "000020000200001",
      screenPath: PathName.WORKFLOW_CREATE,
      title: t("setting:workflow_title_menu"),
    },
    {
      isVisible: false,
      gene: "000020000200002",
      screenPath: PathName.WORKFLOW_DETAIL.replace("[id]", id),
      title: t("setting:workflow_title_menu"),
    },
    // // ROLE
    // {
    //   isVisible: true,
    //   gene: "00003",
    //   screenPath: PathName.ROLE,
    //   title: t("setting:role_title_menu"),
    // },
    // {
    //   isVisible: false,
    //   gene: "0000300001",
    //   screenPath: PathName.ROLE_DETAIL.replace("[id]", id),
    //   title: "",
    // },
    // {
    //   isVisible: false,
    //   gene: "0000300002",
    //   screenPath: PathName.ROLE_CREATE,
    //   title: "",
    // },

    {
      isVisible: true,
      gene: "0000200003",
      screenPath: PathName.USERPAGE,
      title: t("setting:userpage_title_list_view"),
    },
    {
      isVisible: false,
      gene: "000020000300001",
      screenPath: PathName.USERPAGE_EDIT,
      title: "",
    },
    {
      isVisible: false,
      gene: "000020000300002",
      screenPath: PathName.USERPAGE_CREATE,
      title: "",
    },
  ];
  console.log(PathName.DemoPage);

  const groupByMenuCost = [
    // Quản lý chi phí
    {
      gene: "00003",
      isVisible: true,
      title: t("setting:cost_management"),
      icon: <PricingManganeIcon />,
      // icon: <Image style={{ filter: "brightness(0)" }} alt="job" src={Resources.Icon.COST} width={21} height={21} />,
    },
    // Kế hoạch ngân sách
    {
      isVisible: true,
      gene: "0000300001",
      title: t("setting:budget_title_menu"),
      screenPath: PathName.BUDGET,
    },
    {
      isVisible: false,
      gene: "0000300001000001",
      title: t("setting:budget_title_menu"),
      screenPath: PathName.BUDGET_CREATE,
    },
    {
      isVisible: false,
      gene: "0000300001000002",
      title: t("setting:budget_title_menu"),
      screenPath: PathName.BUDGET_DETAIL.replace("[id]", id),
    },
  ];

  const dataRoutes: IItemRoute[] = useMemo(() => {
    let temp: IItemRoute[] = [];
    if (permissionAdmin) {
      temp = [...temp, ...groupByMenuOrg];
    }

    temp = [...temp, ...groupByMenuWorkflow];
    temp = [...temp, ...groupByMenuCost];

    return temp;
  }, [language, id, permissionAdmin]);

  const maxWidth991 = useMediaQuery("(max-width: 991px)");
  console.log(PathName.DemoPage);

  return (
    <BaseLayout>
      <Grid container spacing={2} mt={2}>
        <Grid item xs={12} lg={3}>
          <Card sx={{ p: 0 }}>
            <MenuBar
              key={language}
              openMobile={maxWidth991}
              listPathName={[]}
              routes={dataRoutes || []}
              handleDrawerToggle={() => {}}
              pathNameCurrent={location?.pathname || ""}
              onNavigate={(pathName) => {
                router.push(pathName);
              }}
              menuItemTitleStyles={{ lineHeight: 1 }}
            />
          </Card>
        </Grid>
        <Grid item xs={12} lg={9}>
          <Card>{props.children}</Card>
        </Grid>
      </Grid>
    </BaseLayout>
  );
};

export default CompanyLayout;
