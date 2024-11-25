import { useEffect, useMemo, useState } from "react";
import { Box, Typography } from "@maysoft/common-component-react";
import {
  Collapse,
  Icon,
  IconButton,
  List,
  ListItem,
  Menu,
} from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";

import Helpers from "../../../commons/helpers";
import { IItemRoute } from "../../../commons/interfaces";
import { iconItemMenu, listItem, textItemMenu } from "./styles";

interface IProps {
  openMobile: boolean;
  routes: IItemRoute[];

  pathNameCurrent: string;
  onNavigate: (pathName: string) => void;

  handleDrawerToggle?: () => void;
  listPathName?: { pathName: string; query: string; totalCount: number }[];

  menuItemTitleStyles?: { lineHeight?: number };
}

export const MenuBar = (props: IProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openDropDownMenu = Boolean(anchorEl);

  const mainRoutes = useMemo(() => props.routes, [props.routes]);

  const pathNameCurrent: string = useMemo(
    () => props.pathNameCurrent || "/",
    [props.pathNameCurrent]
  );

  const [arrKeySelected, setArrKeySelected] = useState<string[]>([]);
  const [arrKeyOnClicked, setArrKeyOnClicked] = useState<string[]>([]);
  const [listItemMenuShow, setListItemMenuShow] = useState<IItemRoute[]>([]);

  useEffect(() => {
    const resultData = convertDataIItemRoute({
      data: mainRoutes,
    });

    setListItemMenuShow(resultData);

    if (mainRoutes.length > 0 && !Helpers.isNullOrEmpty(pathNameCurrent)) {
      const itemTemp = mainRoutes.find(
        (el) => el.screenPath === pathNameCurrent
      );
      if (itemTemp) {
        setArrKeySelected([itemTemp?.gene]);
        setArrKeyOnClicked([itemTemp?.gene]);
      } else {
        return;
      }
    } else {
      setArrKeySelected([]);
      setArrKeyOnClicked([]);
    }
  }, [mainRoutes, pathNameCurrent]);

  const handleClickDropDownMenu = (
    event:
      | React.MouseEvent<HTMLButtonElement>
      | React.MouseEvent<HTMLDivElement>
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseDropDownMenu = () => {
    setAnchorEl(null);
  };

  const handelOnClickItemMenu = (itemMenu: IItemRoute) => {
    console.log("Clicked on item:", itemMenu);
    if (
      [...(itemMenu?.subMenu || [])]?.findIndex(
        (el) => el.isVisible === true
      ) === -1
    ) {
      setAnchorEl(null);

      const itemPathName = [...(props.listPathName || [])].find(
        (el) => el.pathName === itemMenu?.screenPath
      );

      const pathNameNavigate = itemPathName
        ? itemPathName?.pathName + itemPathName?.query
        : itemMenu?.screenPath;
      console.log("Navigating to:", pathNameNavigate);

      Helpers.isFunction(props.handleDrawerToggle) &&
        props.handleDrawerToggle();

      if (Helpers.isNullOrEmpty(itemMenu?.target)) {
        pathNameNavigate && props.onNavigate(pathNameNavigate);
      } else {
        window.open(`${pathNameNavigate}`, `${itemMenu?.target}`);
      }
    } else {
      const arrItemTemp: string[] = [...(arrKeyOnClicked || [])];

      if (arrItemTemp.findIndex((el) => el === itemMenu?.gene) === -1) {
        setArrKeyOnClicked([itemMenu?.gene]);
      } else {
        const temp = arrItemTemp.filter((el) => el !== itemMenu?.gene);
        setArrKeyOnClicked(temp);
      }
    }
  };

  const handelKeyActiveSelected = (valueKey: string) => {
    const checked = arrKeySelected.find((el) => el.startsWith(valueKey));
    return checked ? true : false;
  };

  const handelKeyActiveOnClicked = (valueKey: string) => {
    const checked = arrKeyOnClicked.find((el) => el.startsWith(valueKey));
    return checked ? true : false;
  };

  const renderIconItemMenu = (dataMenu: IItemRoute) => {
    if (!dataMenu?.hidenIcon) {
      if (
        Helpers.isNullOrEmpty(dataMenu?.icon) &&
        Helpers.isNullOrEmpty(dataMenu?.iconName)
      ) {
        return <Box sx={iconItemMenu}></Box>;
      } else {
        if (!Helpers.isNullOrEmpty(dataMenu?.iconName)) {
          return (
            <Icon sx={{ fontWeight: "bold", marginRight: 1 }}>
              {dataMenu?.iconName}
            </Icon>
          );
        }

        if (!Helpers.isNullOrEmpty(dataMenu?.icon)) {
          return <Box sx={iconItemMenu}>{dataMenu?.icon}</Box>;
        }

        return <Box sx={iconItemMenu}></Box>;
      }
    } else {
      return <Box sx={iconItemMenu}></Box>;
    }
  };

  const renderItemMenu = (dataMenu: IItemRoute, level: number) => {
    if (
      [...(dataMenu?.subMenu || [])]?.findIndex(
        (el) => el.isVisible === true
      ) === -1
    ) {
      return (
        <ListItem
          key={dataMenu?.gene}
          sx={{
            paddingBottom: "2px",
            paddingTop: "2px",
            display: dataMenu?.isVisible ? "block" : "none",
          }}
        >
          <IconButton
            onClick={() => handelOnClickItemMenu(dataMenu)}
            sx={(theme) =>
              listItem(theme, {
                isParent: false,
                isActive: handelKeyActiveSelected(dataMenu?.gene)
                  ? true
                  : false,
              })
            }
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginLeft: level > 0 ? level : 0,
              }}
            >
              {renderIconItemMenu(dataMenu)}
              <Typography
                lineHeight={props.menuItemTitleStyles?.lineHeight ?? 0}
                variant="button"
                fontWeight="regular"
                textTransform="none"
                sx={(theme) =>
                  textItemMenu(theme, {
                    isParent: false,
                    isActive: handelKeyActiveSelected(dataMenu?.gene),
                  })
                }
              >
                {dataMenu?.title}
              </Typography>
            </Box>
          </IconButton>
        </ListItem>
      );
    } else {
      return (
        <Box
          style={{ display: dataMenu?.isVisible ? "block" : "none" }}
          key={dataMenu?.gene}
        >
          <ListItem style={{ paddingBottom: "2px", paddingTop: "2px" }}>
            <IconButton
              onClick={() => {
                handelOnClickItemMenu(dataMenu);
              }}
              sx={(theme) =>
                listItem(theme, {
                  isParent: true,
                  isActive: handelKeyActiveSelected(dataMenu?.gene)
                    ? true
                    : false,
                })
              }
            >
              <Box
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                {renderIconItemMenu(dataMenu)}
                <Typography
                  lineHeight={props.menuItemTitleStyles?.lineHeight ?? 0}
                  variant="button"
                  fontWeight="regular"
                  textTransform="none"
                  sx={(theme) =>
                    textItemMenu(theme, {
                      isParent: true,
                      isActive: handelKeyActiveSelected(dataMenu?.gene),
                    })
                  }
                >
                  {dataMenu?.title}
                </Typography>
              </Box>
              {handelKeyActiveOnClicked(dataMenu?.gene) ? (
                <ExpandLess htmlColor="#000000" />
              ) : (
                <ExpandMore htmlColor="#000000" />
              )}
            </IconButton>
          </ListItem>
          <Collapse
            in={handelKeyActiveOnClicked(dataMenu?.gene)}
            timeout="auto"
            unmountOnExit
          >
            <List component="div" disablePadding>
              {[...(dataMenu.subMenu || [])].map((itemSubMenu) =>
                renderItemMenu(itemSubMenu, level + 1)
              )}
            </List>
          </Collapse>
        </Box>
      );
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100%" }}>
      {props.openMobile ? (
        <>
          <Box
            id="itemMenuCurrent"
            aria-haspopup="true"
            aria-expanded={openDropDownMenu ? "true" : undefined}
            aria-controls={openDropDownMenu ? "moreMenuMobile" : undefined}
            onClick={handleClickDropDownMenu}
          >
            <Box
              sx={{
                padding: "16px",
                display: "flex",
                borderRadius: "8px",
                alignItems: "center",
                border: "1px solid #E8ECEE",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="button" fontWeight="bold">
                {props.routes.find(
                  (el) =>
                    el.isVisible &&
                    el.screenPath &&
                    (arrKeySelected?.[0] || "").startsWith(el.gene)
                )?.title || ""}
              </Typography>
              {!openDropDownMenu ? <KeyboardArrowDown /> : <KeyboardArrowUp />}
            </Box>
          </Box>
          <Menu
            id="moreMenuMobile"
            anchorEl={anchorEl}
            open={openDropDownMenu}
            onClose={handleCloseDropDownMenu}
            MenuListProps={{
              "aria-labelledby": "itemMenuCurrent",
            }}
          >
            <List sx={{ width: "calc(100vw - 45px)" }}>
              {listItemMenuShow.map((menuItem) => renderItemMenu(menuItem, 0))}
            </List>
          </Menu>
        </>
      ) : (
        <List>
          {listItemMenuShow.map((menuItem) => renderItemMenu(menuItem, 0))}
        </List>
      )}
    </Box>
  );
};

export default MenuBar;

const convertDataIItemRoute = (props: { data: IItemRoute[] }): IItemRoute[] => {
  const menuParents: IItemRoute[] = [];
  const subMenuMap: { [key: string]: IItemRoute[] } = {};

  props.data.forEach((element: IItemRoute) => {
    if (element.gene.length === 5) {
      menuParents.push(element);
    } else {
      const parentGene: string = element.gene.slice(0, element.gene.length - 5);

      if (!subMenuMap[parentGene]) {
        subMenuMap[parentGene] = [element];
      } else {
        subMenuMap[parentGene].push(element);
      }
    }
  });

  const newDataReturn = pushSubmenu(menuParents, subMenuMap);

  return newDataReturn;
};

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
