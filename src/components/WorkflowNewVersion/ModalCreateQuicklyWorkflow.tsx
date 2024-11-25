import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import { AddOutlined, Close, DeleteForever, Search } from "@mui/icons-material";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import {
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableContainer,
  TableRow,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import {
  Avatar,
  Box,
  Button,
  CheckBox,
  CustomPagination,
  DataTableBodyCell,
  FormField,
  Modal,
  RoleHelpers,
  RoleType,
  Typography,
  useCommonComponentContext,
} from "@maysoft/common-component-react";

import Constants from "@src/constants";
import Helpers from "@src/commons/helpers";
import UserService from "@src/services/identity/UserService";
import useDataWorkflow from "@src/hooks/useDataWorkflow.hook";

import { LoadingModal } from "../Loading";
import { Status } from "@src/commons/enum";
import { IUser } from "@src/commons/interfaces";
import { IDataWorkflow } from "@src/hooks/useDataWorkflow.hook";
import {
  IOrganization,
  IOrgUserProfile,
} from "@src/services/identity/Organization.service";

export const ModalCreateQuicklyWorkflow = ({
  onSubmit,
  caseCode,
  organizationId,

  visibled,
  setVisibled,
}: {
  caseCode: string;
  organizationId: string;
  onSubmit: (data: IDataWorkflow) => void;
  visibled: boolean;
  setVisibled: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const {
    t,
    i18n: { language },
  } = useTranslation(["common", "setting"]);

  const { userInfo } = useCommonComponentContext();

  const [modeModal, setModeModal] = useState<
    "WF" | "MemberApplie" | "Approver"
  >("WF");

  const {
    listCriteria,
    dataWorkFlow,
    errorWorkFlow,
    dataDetailOrganization,
    listApprovers,
    setListApprovers,
    listMemberApplies,
    setListMemberApplies,

    getDataDetail,
    handleOnChangeValue,
    handleCreateUpdateWorkFlow,
  } = useDataWorkflow();

  useEffect(() => {
    setModeModal("WF");

    getDataDetail({
      id: "",
      organizationId: organizationId,
    });
  }, []);

  const maxWidth630 = useMediaQuery("(max-width: 630px)");

  const [loadingModal, setLoadingModal] = useState<boolean>(false);

  // #region Approvers
  const [loadingUserApprove, setLoadingUserApprove] = useState<boolean>(false);
  const [dataRowsUserApprove, setDataRowsUserApprove] = useState<IUser[]>([]);
  const [dataSelectUserApprove, setDataSelectUserApprove] = useState<IUser[]>(
    []
  );

  const [requestGetPagedUserApprove, setRequestGetPagedUserApprove] = useState<{
    searchText?: string;
    pageNumber?: number;
    totalCount?: number;
  }>({
    pageNumber: 1,
    totalCount: 0,
  });

  useEffect(() => {
    if (modeModal === "Approver") {
      getPagedUserApprove(requestGetPagedUserApprove);
    }
    if (modeModal === "MemberApplie") {
      getDetailOrgAddMember();
    }
    return () => {
      setSearchTextAddMember("");
      setIsSearchTextAddMember(false);
      setDataRowsBySearchTextAddMember(new Map());

      setDataSelectAddMember([]);
      setDataRowsAddMember(new Map());

      setDataRowsUserApprove([]);
      setDataSelectUserApprove([]);
      setRequestGetPagedUserApprove({
        pageNumber: 1,
        totalCount: 0,
      });
    };
  }, [modeModal]);

  const roleTypeByOrg = useMemo(() => {
    const item = [...(userInfo?.listOrganization || [])].find(
      (el) => el.code === organizationId
    );
    if (item?.detail?.type === 1) {
      return RoleType.TenantOrMembership | RoleType.Member;
    } else {
      return RoleType.Normal | RoleType.Member;
    }
  }, [userInfo?.listOrganization, organizationId]);

  const textButtonActionUserApprove = useMemo(() => {
    const val =
      dataSelectUserApprove.length > 0 ? dataSelectUserApprove.length : "";
    return `${t("common:select")} ${val} ${t("setting:workflow.approver").toLowerCase()}`;
  }, [dataSelectUserApprove.length]);

  const getPagedUserApprove = async (newReq?: any) => {
    try {
      setLoadingUserApprove(true);

      const userIds = listApprovers.map((el) => el.id);

      const pageSize = Constants.ROW_PER_PAGE_20;
      const pageNumber =
        Helpers.getPageNumber(
          newReq?.pageNumber || 1,
          pageSize,
          newReq?.totalCount || 0
        ) || 1;

      const newQuery = {
        pageSize: pageSize,
        pageNumber: pageNumber,
        listStatus: [1],
        selectedIds: userIds,
        roleNotIncludes: [roleTypeByOrg],
        searchText: newReq?.searchText || undefined,
        organizationId: organizationId || "0",
      };

      if (!Helpers.isNullOrEmpty(userIds) && userIds.length > 0)
        newQuery.selectedIds = userIds;

      const result = await UserService.getPaged(newQuery);

      setDataRowsUserApprove(result.items || []);
      setDataSelectUserApprove(result.selectedItems || []);

      setRequestGetPagedUserApprove({
        totalCount: result?.totalCount,
        pageNumber: result?.currentPage,
        searchText: newQuery?.searchText,
      });
    } catch (error) {
      console.log({ error });
    } finally {
      setLoadingUserApprove(false);
    }
  };

  const handleSelectedByIdUserApprove = (item: any) => {
    let newData = [...(dataSelectUserApprove || [])];

    const indexTemp = dataSelectUserApprove?.findIndex(
      (el) => el.id === item.id
    );

    if (indexTemp === -1) {
      newData.push(item);
    } else {
      newData.splice(indexTemp, 1);
    }

    setDataSelectUserApprove(newData);
  };
  // #endregion Approvers

  // #region MemberApplies
  const [loadingAddMember, setLoadingAddMember] = useState<boolean>(false);

  const [searchTextAddMember, setSearchTextAddMember] = useState<string>("");
  const [isSearchTextAddMember, setIsSearchTextAddMember] =
    useState<boolean>(false);
  const [dataRowsBySearchTextAddMember, setDataRowsBySearchTextAddMember] =
    useState<Map<string, IOrgUserProfile[]>>(new Map());

  const [dataSelectAddMember, setDataSelectAddMember] = useState<
    IOrgUserProfile[]
  >([]);
  const [dataRowsAddMember, setDataRowsAddMember] = useState<
    Map<string, IOrgUserProfile[]>
  >(new Map());

  const textButtonActionAddMember = useMemo(() => {
    const val =
      dataSelectAddMember.length > 0 ? dataSelectAddMember.length : "";
    return `${t("common:select")} ${val} ${t("setting:staff_title_menu").toLowerCase()}`;
  }, [dataSelectAddMember.length]);

  const getDetailOrgAddMember = async () => {
    setLoadingAddMember(true);

    const userIds = listMemberApplies.map((el) => el.userId);

    const newItemSelected: IOrgUserProfile[] = [];
    const newMapGroupUser: Map<string, IOrgUserProfile[]> = new Map();

    for (const itemGroup of [
      ...(dataDetailOrganization?.organizationProfiles || []),
    ]) {
      if (itemGroup.groupStatus === Status.Active) {
        newMapGroupUser.set(itemGroup.groupId, []);
      }
    }
    newMapGroupUser.set("notGroup", []);

    for (const itemUser of [
      ...(dataDetailOrganization?.organizationUserProfiles || []),
    ]) {
      if (itemUser.status === Status.Active) {
        if (userIds.includes(itemUser?.userId)) {
          newItemSelected.push(itemUser);
        }

        if (itemUser?.groups?.[0]?.id) {
          if (newMapGroupUser.has(itemUser?.groups?.[0]?.id)) {
            const listTemp =
              newMapGroupUser.get(itemUser?.groups?.[0]?.id) || [];
            listTemp.push(itemUser);
            newMapGroupUser.set(itemUser?.groups?.[0]?.id, [
              ...(listTemp || []),
            ]);
          }
        } else {
          const listTemp = newMapGroupUser.get("notGroup") || [];
          listTemp.push(itemUser);
          newMapGroupUser.set("notGroup", [...(listTemp || [])]);
        }
      }
    }

    setDataRowsAddMember(newMapGroupUser);
    setDataSelectAddMember(newItemSelected);

    setLoadingAddMember(false);
  };

  const handleSearchTextMember = (value: string) => {
    setLoadingAddMember(true);

    setSearchTextAddMember(value);

    setIsSearchTextAddMember(true);

    const newMapGroupUser: Map<string, IOrgUserProfile[]> = new Map();

    dataRowsAddMember.forEach((values, key) => {
      const newValue = Helpers.removeVietnameseTones(value).toLocaleLowerCase();

      const listFilter = values.filter(
        (e) =>
          Helpers.removeVietnameseTones(e.email || "")
            .toLocaleLowerCase()
            .includes(newValue) ||
          Helpers.removeVietnameseTones(e.lastName || "")
            .toLocaleLowerCase()
            .includes(newValue) ||
          Helpers.removeVietnameseTones(e.firstName || "")
            .toLocaleLowerCase()
            .includes(newValue)
      );

      if (listFilter.length > 0) {
        newMapGroupUser.set(key, listFilter);
      }
    });

    setDataRowsBySearchTextAddMember(newMapGroupUser);

    setLoadingAddMember(false);
  };

  const handleSelectedByIdMember = (item: any) => {
    let newData = [...(dataSelectAddMember || [])];

    const indexTemp = dataSelectAddMember?.findIndex(
      (el) => el.userId === item.userId
    );

    if (indexTemp === -1) {
      newData.push(item);
    } else {
      newData.splice(indexTemp, 1);
    }

    setDataSelectAddMember(newData);
  };

  const handleSelectedByGroupIdMember = (groupId: string) => {
    let newData = [...(dataSelectAddMember || [])];

    const arrays = dataRowsAddMember.get(groupId);

    for (const item of [...(arrays || [])]) {
      if (checkAllByGroupIdMember(groupId)) {
        newData = newData?.filter((el) => el.userId !== item.userId);
      } else {
        const indexTemp = dataSelectAddMember?.findIndex(
          (el) => el.userId === item.userId
        );
        if (indexTemp === -1) {
          newData.push(item);
        } else {
        }
      }
    }

    setDataSelectAddMember(newData);
  };

  const checkAllByGroupIdMember = (groupId: string) => {
    let count = 0;

    const arrays = dataRowsAddMember.get(groupId)?.map((el) => el.userId);

    for (const id of [...(arrays || [])]) {
      if (dataSelectAddMember?.findIndex((el) => el.userId === id) !== -1) {
        count = count + 1;
      }
    }

    return count === arrays?.length;
  };

  const newDataRowsAddMember = useMemo(() => {
    if (isSearchTextAddMember) {
      return dataRowsBySearchTextAddMember;
    } else {
      return dataRowsAddMember;
    }
  }, [isSearchTextAddMember, dataRowsAddMember, dataRowsBySearchTextAddMember]);
  // #endregion MemberApplies

  return (
    <Modal
      fullWidth
      maxWidth="md"
      hasActionButton
      visible={visibled}
      buttonAction={
        modeModal === "WF"
          ? t("common:select")
          : modeModal === "Approver"
            ? textButtonActionUserApprove
            : textButtonActionAddMember
      }
      title={
        modeModal === "WF"
          ? t("setting:workflow.select_approver")
          : modeModal === "Approver"
            ? t("setting:workflow.select_approver")
            : t("setting:workflow.select_member_applies")
      }
      onClose={() => {
        if (modeModal === "WF") {
          setVisibled(false);
          setModeModal("WF");
        }

        //
        if (modeModal === "Approver") {
          setDataRowsUserApprove([]);
          setDataSelectUserApprove([]);
          setModeModal("WF");
        }

        //
        if (modeModal === "MemberApplie") {
          setDataSelectAddMember([]);
          setDataRowsAddMember(new Map());
          setModeModal("WF");
        }
      }}
      onAction={() => {
        if (modeModal === "WF") {
          handleCreateUpdateWorkFlow({
            id: "",
            onCallBack(data) {
              data && onSubmit(data);
            },
          });
          setVisibled(false);
          setModeModal("WF");
        }

        //
        if (modeModal === "Approver") {
          setModeModal("WF");
          setListApprovers(dataSelectUserApprove);
        }

        //
        if (modeModal === "MemberApplie") {
          setModeModal("WF");
          setListMemberApplies(dataSelectAddMember);
        }
      }}
    >
      <Box sx={{ height: "60vh" }}>
        {/*  */}
        {loadingModal && <LoadingModal height="60vh" />}

        {!loadingModal && (
          <>
            {modeModal === "WF" && (
              <Box>
                <Grid container spacing={3} pt={2}>
                  <Grid item xs={12}>
                    <FormField
                      required
                      maxLength={255}
                      variant={"outlined"}
                      value={dataWorkFlow?.name}
                      errorMessage={errorWorkFlow.name}
                      label={t("setting:workflow.name_workflow")}
                      placeholder={t("setting:workflow.enter_name_workflow")}
                      onChangeValue={(value) => {
                        handleOnChangeValue("name", value);
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <CardMemberApplies
                      listMemberApplies={listMemberApplies}
                      setListMemberApplies={setListMemberApplies}
                      setOpenModalAddMembers={() => {
                        setLoadingModal(true);

                        setTimeout(async (text?: string) => {
                          try {
                            setModeModal("MemberApplie");

                            setLoadingModal(false);
                          } catch (error) {
                          } finally {
                          }
                        }, 500);
                      }}
                      dataDetailOrganization={dataDetailOrganization}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <CardApprovers
                      listApprovers={listApprovers}
                      setListApprovers={setListApprovers}
                      setOpenModalAddApprover={() => {
                        setLoadingModal(true);

                        setTimeout(async (text?: string) => {
                          try {
                            setModeModal("Approver");

                            setLoadingModal(false);
                          } catch (error) {
                          } finally {
                          }
                        }, 500);
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Box display="grid">
                      <Typography variant="button" fontWeight="bold">
                        {t("setting:workflow.common_setting_workflow")}
                      </Typography>

                      <Box gap={1} p={2} display="grid">
                        <Typography variant="button" fontWeight="medium">
                          {t("setting:workflow.criteria")}
                        </Typography>
                        <FormControl
                          sx={{
                            ".MuiFormControlLabel-label": {
                              fontWeight: "400 !important",
                            },
                          }}
                        >
                          <RadioGroup
                            row={!maxWidth630}
                            name="radio-buttons-group"
                            aria-labelledby="radio-buttons-group-label"
                            key={dataWorkFlow?.settingCommon?.criteriaId}
                            value={
                              Helpers.isNullOrEmpty(
                                dataWorkFlow?.settingCommon?.criteriaId
                              )
                                ? (listCriteria?.[0]?.code as string)
                                : dataWorkFlow?.settingCommon?.criteriaId
                            }
                            onChange={(event, value) => {
                              handleOnChangeValue("criteriaId", value);
                            }}
                          >
                            {listCriteria?.map((item) => (
                              <FormControlLabel
                                key={item.code}
                                value={item.code}
                                label={item.name}
                                sx={{ mb: 0, mt: 0, ml: 0, p: 0 }}
                                control={<Radio sx={{ p: 0 }} color="info" />}
                              />
                            ))}
                          </RadioGroup>
                        </FormControl>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* #region Approvers */}
            {modeModal === "Approver" && (
              <Box>
                <Box>
                  {/* input search text by getpage */}
                  <FormField
                    maxLength={255}
                    variant="outlined"
                    defaultValue={requestGetPagedUserApprove?.searchText || ""}
                    placeholder={t("setting:workflow.search_name_member")}
                    onBlur={(value: any) => {
                      getPagedUserApprove({
                        ...requestGetPagedUserApprove,
                        searchText: value,
                      });
                    }}
                    onKeyPress={(e: any) => {
                      if (e.key === "Enter") {
                        getPagedUserApprove({
                          ...requestGetPagedUserApprove,
                          searchText: e?.target?.value,
                        });
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <IconButton
                          color="info"
                          onClick={() => {
                            getPagedUserApprove({
                              ...requestGetPagedUserApprove,
                            });
                          }}
                        >
                          <Search />
                        </IconButton>
                      ),
                      endAdornment: requestGetPagedUserApprove?.searchText && (
                        <IconButton
                          color="secondary"
                          onClick={() => {
                            getPagedUserApprove({
                              searchText: "",
                              pageNumber: 1,
                            });
                          }}
                        >
                          <Close />
                        </IconButton>
                      ),
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    marginTop: 2,
                    overflow: "auto",
                  }}
                >
                  {loadingUserApprove ? (
                    <LoadingModal height="50vh" />
                  ) : dataRowsUserApprove.length === 0 ? (
                    <Box sx={{ textAlign: "center" }}>
                      <Typography variant="button" color="secondary">
                        {t("common:no_data")}
                      </Typography>
                    </Box>
                  ) : (
                    <Box>
                      <Box>
                        {dataRowsUserApprove.map((item) => (
                          <Box
                            key={item.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectedByIdUserApprove(item);
                            }}
                            sx={{
                              padding: "8px",
                              display: "grid",
                              borderRadius: "8px",
                              marginBottom: "8px",
                              alignItems: "center",
                              border: "1px #dddddd solid",
                              justifyContent: "space-between",
                              gridTemplateColumns: "repeat(2, 1fr) 50px",
                              ":hover": {
                                cursor: "pointer",
                                backgroundColor: "#dddddd",
                              },
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                alignItems: "center",
                              }}
                            >
                              <Avatar
                                text={item?.organizationUserProfile?.firstName}
                                src={item.avatarUrl}
                                sx={{
                                  marginLeft: "16px",
                                  marginRight: "16px",
                                  border: "1px #dddddd solid",
                                  display: {
                                    xs: "none",
                                    sm: "none",
                                    md: "flex",
                                  },
                                }}
                              />
                              <Box display="inline-grid">
                                <Typography
                                  variant="button"
                                  sx={{
                                    overflow: "hidden",
                                    whiteSpace: "nowrap",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {`${item?.organizationUserProfile?.lastName || ""} ${item?.organizationUserProfile?.firstName || ""}`.trim() ||
                                    item?.fullName ||
                                    item?.userName ||
                                    "No Name"}
                                </Typography>
                                {item?.organizationUserProfile?.email && (
                                  <Typography
                                    variant="caption"
                                    color="secondary"
                                    sx={{
                                      overflow: "hidden",
                                      whiteSpace: "nowrap",
                                      textOverflow: "ellipsis",
                                    }}
                                  >
                                    {item?.organizationUserProfile?.email}
                                  </Typography>
                                )}
                              </Box>
                            </Box>

                            <Box paddingLeft={2}>
                              <Typography
                                variant="button"
                                sx={{
                                  overflow: "hidden",
                                  whiteSpace: "nowrap",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {item?.groupUsers?.[0]?.groupName?.value?.[
                                  language
                                ] || ""}
                              </Typography>
                            </Box>

                            <Box
                              sx={{ display: "flex", justifyContent: "end" }}
                            >
                              <CheckBox
                                checked={
                                  dataSelectUserApprove?.findIndex(
                                    (el) => el.id === item.id
                                  ) !== -1
                                }
                              />
                            </Box>
                          </Box>
                        ))}
                      </Box>
                      <Box mt={2}>
                        <CustomPagination
                          rowsPerPageOptions={[20]}
                          pageSize={Constants.ROW_PER_PAGE_20}
                          page={requestGetPagedUserApprove?.pageNumber || 1}
                          total={requestGetPagedUserApprove?.totalCount || 0}
                          onChangePage={(value) => {
                            getPagedUserApprove({
                              ...requestGetPagedUserApprove,
                              pageNumber: value,
                            });
                          }}
                        />
                      </Box>
                    </Box>
                  )}
                </Box>
              </Box>
            )}
            {/* #endregion Approvers */}

            {/* #region MemberApplies */}
            {modeModal === "MemberApplie" && (
              <Box>
                <Box>
                  {/* input search text by getpage */}
                  <FormField
                    maxLength={255}
                    variant="outlined"
                    defaultValue={searchTextAddMember || ""}
                    placeholder={t("setting:workflow.search_name_member")}
                    onBlur={(value: any) => {
                      handleSearchTextMember(value);
                    }}
                    onKeyPress={(e: any) => {
                      if (e.key === "Enter") {
                        handleSearchTextMember(e?.target?.value);
                      }
                    }}
                    InputProps={{
                      startAdornment: (
                        <IconButton
                          color="info"
                          onClick={() => {
                            handleSearchTextMember(searchTextAddMember);
                          }}
                        >
                          <Search />
                        </IconButton>
                      ),
                      endAdornment: searchTextAddMember && (
                        <IconButton
                          color="secondary"
                          onClick={() => {
                            setSearchTextAddMember("");
                            setIsSearchTextAddMember(false);
                            setDataRowsBySearchTextAddMember(new Map());
                          }}
                        >
                          <Close />
                        </IconButton>
                      ),
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    marginTop: 2,
                    overflow: "auto",
                  }}
                >
                  {loadingAddMember ? (
                    <LoadingModal height="50vh" />
                  ) : newDataRowsAddMember.size === 0 ? (
                    <Box sx={{ textAlign: "center" }}>
                      <Typography variant="button" color="secondary">
                        {t("common:no_data")}
                      </Typography>
                    </Box>
                  ) : (
                    <Box>
                      <Box>
                        {Array.from(newDataRowsAddMember.keys()).map(
                          (key, index) => {
                            const arrays = [
                              ...(newDataRowsAddMember.get(key) || []),
                            ];

                            return arrays.length === 0 ? null : (
                              <Box key={key}>
                                <Box
                                  sx={{
                                    padding: "8px",
                                    display: "flex",
                                    flexWrap: "wrap",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    marginTop: index !== 0 ? "16px" : "0px",
                                  }}
                                >
                                  {key === "notGroup" ? (
                                    <Typography>{""}</Typography>
                                  ) : (
                                    <Typography
                                      variant="button"
                                      fontWeight="bold"
                                    >
                                      {arrays?.[0]?.groups?.[0]?.name?.value?.[
                                        language
                                      ] || ""}
                                      {` (${arrays.length || 0})`}
                                    </Typography>
                                  )}
                                  <Button
                                    variant="text"
                                    onClick={() => {
                                      handleSelectedByGroupIdMember(key);
                                    }}
                                  >
                                    <Typography variant="button" color="info">
                                      {checkAllByGroupIdMember(key)
                                        ? t("common:deselect_all")
                                        : t("common:select_all")}
                                    </Typography>
                                  </Button>
                                </Box>
                                <Box>
                                  {arrays.map((item) => {
                                    const roleName = getRoleNameByUserRoles([
                                      ...(item.userRoles || []),
                                    ]);
                                    return (
                                      <Box
                                        key={item.id}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleSelectedByIdMember(item);
                                        }}
                                        sx={{
                                          padding: "8px",
                                          display: "flex",
                                          flexWrap: "wrap",
                                          borderRadius: "8px",
                                          marginBottom: "8px",
                                          alignItems: "center",
                                          border: "1px #dddddd solid",
                                          justifyContent: "space-between",
                                          ":hover": {
                                            cursor: "pointer",
                                            backgroundColor: "#dddddd",
                                          },
                                        }}
                                      >
                                        <Box
                                          sx={{
                                            display: "flex",
                                            flexWrap: "wrap",
                                            alignItems: "center",
                                            width: "calc(100% - 50px)",
                                          }}
                                        >
                                          <Avatar
                                            src={item.avatarUrl}
                                            text={item?.firstName}
                                            sx={{
                                              marginLeft: "16px",
                                              marginRight: "16px",
                                              border: "1px #dddddd solid",
                                              display: {
                                                xs: "none",
                                                sm: "flex",
                                              },
                                            }}
                                          />
                                          <Box display="inline-grid">
                                            <Typography
                                              variant="button"
                                              sx={{
                                                overflow: "hidden",
                                                whiteSpace: "nowrap",
                                                textOverflow: "ellipsis",
                                              }}
                                            >
                                              {`${item?.lastName || ""} ${item?.firstName || ""}`.trim() ||
                                                item?.email ||
                                                "No Name"}
                                              {!Helpers.isNullOrEmpty(
                                                roleName
                                              ) && (
                                                <Typography
                                                  color="white"
                                                  variant="caption"
                                                  sx={{
                                                    marginLeft: "8px",
                                                    padding: "2px 6px",
                                                    borderRadius: "4px",
                                                    backgroundColor: "#1E97DE",
                                                    // display: { xs: "none", sm: "inline-block" }
                                                  }}
                                                >
                                                  {roleName}
                                                </Typography>
                                              )}
                                            </Typography>
                                            {item?.email && (
                                              <Typography
                                                variant="caption"
                                                color="secondary"
                                                sx={{
                                                  overflow: "hidden",
                                                  whiteSpace: "nowrap",
                                                  textOverflow: "ellipsis",
                                                }}
                                              >
                                                {item?.email}
                                              </Typography>
                                            )}
                                          </Box>
                                        </Box>
                                        <CheckBox
                                          sx={{ width: "50px" }}
                                          checked={
                                            dataSelectAddMember?.findIndex(
                                              (el) => el.userId === item.userId
                                            ) !== -1
                                          }
                                        />
                                      </Box>
                                    );
                                  })}
                                </Box>
                              </Box>
                            );
                          }
                        )}
                      </Box>
                    </Box>
                  )}
                </Box>
              </Box>
            )}
            {/* #endregion MemberApplies */}
          </>
        )}
      </Box>
    </Modal>
  );
};

export default ModalCreateQuicklyWorkflow;

// #region Approvers

const CardApprovers = (props: {
  listApprovers: IUser[];
  setOpenModalAddApprover: () => void;
  setListApprovers: React.Dispatch<React.SetStateAction<IUser[]>>;
}) => {
  const {
    t,
    i18n: { language },
  } = useTranslation(["common", "setting"]);

  const handleDeleteItemApprover = (userId: string) => {
    props.setListApprovers((prev) => {
      let newList = [...(prev || [])];

      newList = newList.filter((el) => el.id !== userId);

      return newList;
    });
  };

  return (
    <>
      <Box paddingBottom={2}>
        <Box
          sx={{
            gap: 2,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="button" fontWeight="bold">
            {t("setting:workflow.approver")}
          </Typography>
          {props.listApprovers.length > 0 && (
            <Box
              color="info"
              sx={{
                gap: 1,
                display: "flex",
                flexWrap: "wrap",
                padding: "6px 12px",
                borderRadius: "8px",
                alignItems: "center",
                backgroundColor: "#E4EBF7",
                ".MuiSvgIcon-root": {
                  fontSize: "1rem",
                },
                "&:hover": {
                  cursor: "pointer",
                  ".MuiSvgIcon-root": {
                    fontSize: "1.5rem",
                  },
                  ".MuiTypography-root": {
                    fontWeight: "bold",
                  },
                },
              }}
              onClick={() => {
                props.setOpenModalAddApprover();
              }}
            >
              <AddOutlined />
              <Typography variant="button" color="info">
                {t("setting:workflow.add_approver")}
              </Typography>
            </Box>
          )}
        </Box>

        {props.listApprovers.length > 0 && (
          <RenderTableApprovers
            listApprovers={props.listApprovers}
            onDelete={handleDeleteItemApprover}
            onUpdateSequence={(newData) => {
              props.setListApprovers(newData);
            }}
          />
        )}

        {props.listApprovers.length === 0 && (
          <Box
            sx={{
              gap: 2,
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography variant="button">
              {t("setting:workflow.no_approver_in_workflow")}
            </Typography>
            <Button
              color="info"
              variant="outlined"
              onClick={() => {
                props.setOpenModalAddApprover();
              }}
            >
              {t("setting:workflow.add_approver")}
            </Button>
          </Box>
        )}
      </Box>
    </>
  );
};
const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);

  const [removed] = result.splice(startIndex, 1);

  result.splice(endIndex, 0, removed);

  return result;
};

const RenderTableApprovers = (props: {
  listApprovers: IUser[];

  hidenActionDelete?: boolean;
  hidenActionUpdateSequence?: boolean;

  onDelete: (userId: string) => void;
  onUpdateSequence: (data: IUser[]) => void;
}) => {
  const {
    t,
    i18n: { language },
  } = useTranslation(["common", "setting"]);

  let columnsHeader = [
    <DataTableBodyCell key={"h_index"} borderColor="#9F9F9F">
      <Typography variant="caption" color="secondary">
        {" "}
        {t("setting:workflow.level_approve")}{" "}
      </Typography>
    </DataTableBodyCell>,

    <DataTableBodyCell key={"h_name_member"} borderColor="#9F9F9F">
      <Typography variant="caption" color="secondary">
        {" "}
        {t("setting:workflow.approver")}{" "}
      </Typography>
    </DataTableBodyCell>,
    <DataTableBodyCell key={"h_action"} borderColor="#9F9F9F">
      <Typography variant="caption" color="secondary">
        {" "}
        {t("common:action")}{" "}
      </Typography>
    </DataTableBodyCell>,
  ];

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    } else {
      if (result.source?.index !== result.destination?.index) {
        const dataTemp = reorder(
          [...(props.listApprovers || [])],
          result.source?.index,
          result.destination?.index
        );

        props.onUpdateSequence(dataTemp);
      }
    }
  };

  return (
    <>
      <TableContainer sx={{ boxShadow: "none" }}>
        <Table>
          <Box component="thead">
            <TableRow>{columnsHeader}</TableRow>
          </Box>
          <>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable
                droppableId="droppable"
                isDropDisabled={props.hidenActionUpdateSequence}
              >
                {(provided) => (
                  <TableBody
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {[...(props.listApprovers || [])].map((item, index) => (
                      <Draggable
                        key={item.id}
                        index={index}
                        draggableId={item.id}
                        isDragDisabled={props.hidenActionUpdateSequence}
                      >
                        {(provided) => (
                          <TableRow
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <RenderItemApprover
                              index={index}
                              itemUser={item}
                              onDelete={props.onDelete}
                              lengthArray={props.listApprovers.length}
                            />
                          </TableRow>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </TableBody>
                )}
              </Droppable>
            </DragDropContext>
          </>
        </Table>
      </TableContainer>
    </>
  );
};

const RenderItemApprover = (props: {
  index: number;
  itemUser: IUser;
  lengthArray: number;
  onDelete: (userId: string) => void;
}) => {
  const {
    t,
    i18n: { language },
  } = useTranslation(["common", "setting"]);

  const textSequence = useMemo(() => {
    let text = `Cấp duyệt thứ ${props.index + 1}`;

    if (props.index === 0) {
      text = "Cấp duyệt đầu tiên";
    }

    if (props.index + 1 === props.lengthArray) {
      text = "Cấp duyệt cuối";
    }

    return text;
  }, [props.index, props.lengthArray]);

  let columnsBody = useMemo(() => {
    return [
      <DataTableBodyCell key={"b_index"} borderColor="#E4EBF7">
        <Typography variant="caption">{textSequence}</Typography>
      </DataTableBodyCell>,
      <DataTableBodyCell key={"b_name_member"} borderColor="#E4EBF7">
        <Box display={"grid"}>
          <Typography variant="caption">
            {`${props.itemUser?.organizationUserProfile?.lastName || ""} ${props.itemUser?.organizationUserProfile?.firstName || ""}`.trim()}
          </Typography>
          {props.itemUser?.organizationUserProfile?.email && (
            <Typography variant="caption" color="secondary">
              {props.itemUser?.organizationUserProfile?.email}
            </Typography>
          )}
        </Box>
      </DataTableBodyCell>,
      <DataTableBodyCell key={"b_action"} borderColor="#E4EBF7" width={"50px"}>
        <Tooltip title={t("common:delete")}>
          <IconButton
            onClick={() => {
              props.onDelete(props.itemUser?.id);
            }}
          >
            <DeleteForever color="error" />
          </IconButton>
        </Tooltip>
      </DataTableBodyCell>,
    ];
  }, [textSequence, props.itemUser]);

  return <>{columnsBody}</>;
};

// #endregion Approvers

// #region MemberApplies
const CardMemberApplies = (props: {
  setOpenModalAddMembers: () => void;
  listMemberApplies: IOrgUserProfile[];
  dataDetailOrganization?: IOrganization;
  setListMemberApplies: React.Dispatch<React.SetStateAction<IOrgUserProfile[]>>;
}) => {
  const {
    t,
    i18n: { language },
  } = useTranslation(["common", "setting"]);

  const handleDeleteItemUser = (userId: string) => {
    props.setListMemberApplies((prev) => {
      let newList = [...(prev || [])];

      newList = newList.filter((el) => el.userId !== userId);

      return newList;
    });
  };

  return (
    <>
      <Box paddingBottom={2} gap="20px">
        <Box
          sx={{
            gap: "20px",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="button" fontWeight="bold">
            {t("setting:workflow.member_applies")}
          </Typography>
          {props.listMemberApplies.length > 0 && (
            <Box
              color="info"
              sx={{
                gap: 1,
                display: "flex",
                flexWrap: "wrap",
                padding: "6px 12px",
                borderRadius: "8px",
                alignItems: "center",
                backgroundColor: "#E4EBF7",
                ".MuiSvgIcon-root": {
                  fontSize: "1rem",
                },
                "&:hover": {
                  cursor: "pointer",
                  ".MuiSvgIcon-root": {
                    fontSize: "1.5rem",
                  },
                  ".MuiTypography-root": {
                    fontWeight: "bold",
                  },
                },
              }}
              onClick={() => {
                props.setOpenModalAddMembers();
              }}
            >
              <AddOutlined />
              <Typography variant="button" color="info">
                {t("setting:workflow.add_member_applies")}
              </Typography>
            </Box>
          )}
        </Box>

        {props.listMemberApplies.length > 0 && (
          <RenderTableMemberApplies
            onDelete={handleDeleteItemUser}
            listMemberApplies={props.listMemberApplies}
          />
        )}

        {props.listMemberApplies.length === 0 && (
          <Box
            sx={{
              gap: "20px",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography variant="button">
              {t("setting:workflow.no_member_appliesin_workflow")}
            </Typography>
            <Button
              color="info"
              variant="outlined"
              onClick={() => {
                props.setOpenModalAddMembers();
              }}
            >
              {t("setting:workflow.add_member_applies")}
            </Button>
          </Box>
        )}
      </Box>
    </>
  );
};

const RenderTableMemberApplies = (props: {
  listMemberApplies: IOrgUserProfile[];
  onDelete: (userId: string) => void;
}) => {
  const {
    t,
    i18n: { language },
  } = useTranslation(["common", "setting"]);

  let columnsHeader = [
    <DataTableBodyCell key={"h_name"} borderColor="#9F9F9F">
      <Typography variant="caption" color="secondary">
        {" "}
        {t("setting:invitation.first_name")}{" "}
      </Typography>
    </DataTableBodyCell>,

    <DataTableBodyCell key={"h_group"} borderColor="#9F9F9F">
      <Typography variant="caption" color="secondary">
        {" "}
        {t("setting:group_title_menu")}{" "}
      </Typography>
    </DataTableBodyCell>,
    <DataTableBodyCell key={"h_action"} borderColor="#9F9F9F">
      <Typography variant="caption" color="secondary">
        {" "}
        {t("common:action")}{" "}
      </Typography>
    </DataTableBodyCell>,
  ];

  return (
    <>
      <TableContainer sx={{ boxShadow: "none" }}>
        <Table>
          <Box component="thead">
            <TableRow>{columnsHeader}</TableRow>
          </Box>
          <TableBody>
            {props.listMemberApplies.map((item) => (
              <RenderItemMemberApplie
                key={item.id}
                itemMember={item}
                onDelete={props.onDelete}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

const RenderItemMemberApplie = (props: {
  itemMember: IOrgUserProfile;
  onDelete: (userId: string) => void;
}) => {
  const {
    t,
    i18n: { language },
  } = useTranslation(["common", "setting"]);

  let columnsBody = useMemo(() => {
    return [
      <DataTableBodyCell key={"b_name"} borderColor="#E4EBF7">
        <Box display={"grid"}>
          <Typography variant="caption">
            {`${props.itemMember?.lastName || ""} ${props.itemMember?.firstName || ""}`.trim()}
          </Typography>
          {props.itemMember?.email && (
            <Typography variant="caption" color="secondary">
              {props.itemMember?.email}
            </Typography>
          )}
        </Box>
      </DataTableBodyCell>,
      <DataTableBodyCell key={"b_group"} borderColor="#E4EBF7">
        <Typography variant="caption">
          {props.itemMember?.groups?.[0]?.name?.value?.[language] || ""}
        </Typography>
      </DataTableBodyCell>,
      <DataTableBodyCell key={"b_action"} borderColor="#E4EBF7" width={"50px"}>
        <Tooltip title={t("common:delete")}>
          <IconButton
            onClick={() => {
              props.onDelete(props.itemMember?.userId);
            }}
          >
            <DeleteForever color="error" />
          </IconButton>
        </Tooltip>
      </DataTableBodyCell>,
    ];
  }, [props.itemMember]);

  return <TableRow>{columnsBody}</TableRow>;
};

const getRoleNameByUserRoles = (userRoles: any[]) => {
  const itemOwner = [...(userRoles || [])].find((el) =>
    RoleHelpers.isOrganizationOwner(el.roleType)
  );

  const itemAdmin = [...(userRoles || [])].find((el) =>
    RoleHelpers.isOrganizationAdmin(el.roleType)
  );

  const itemManager = [...(userRoles || [])].find((el) =>
    RoleHelpers.isOrganizationGroupAdmin(el.roleType)
  );

  if (itemOwner) {
    return itemOwner?.roleName || "";
  }

  if (itemAdmin) {
    return itemAdmin?.roleName || "";
  }

  if (itemManager) {
    return itemManager?.roleName || "";
  }

  return "";
};
// #endregion MemberApplies
