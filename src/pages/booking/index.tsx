import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";

import { Box, Button, Typography } from "@maysoft/common-component-react";
import { Grid } from "@mui/material";
import { BookingHelpers } from "@src/commons/bookingHelpers";
import Helpers from "@src/commons/helpers";
import { IItineraryDetail, IUser } from "@src/commons/interfaces";
import { makeServerSideTranslations } from "@src/commons/translationHelpers";
import { withSSRErrorHandling } from "@src/commons/withSSRErrorHandling";
import {
  BookingBasicInfo,
  BreadCrumbs,
  Card,
  ItineraryTimeline,
} from "@src/components";
import Constants from "@src/constants";
import PathName from "@src/constants/PathName";
import { useBookingSubmit, useValidateUsers } from "@src/hooks/booking";
import { IErrorInformation, IInformation } from "@src/hooks/booking/type";
import useNavigateOnChangingOrganization from "@src/hooks/useNavigateOnChangingOrganization";
import { BaseLayout } from "@src/layout";
import ItineraryService from "@src/services/booking/ItineraryService";
import ProfileService from "@src/services/identity/ProfileService";
import UserService from "@src/services/identity/UserService";
import { RootState } from "@src/store";
import { hideLoading, showLoading } from "@src/store/slice/common.slice";
import { storeDataUserProfile } from "@src/store/slice/userInfo.slice";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useSWR from "swr";
import { NextApplicationPage } from "../_app";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  let props = {
    ...(await makeServerSideTranslations(locale, [
      "common",
      "booking",
      "detail",
    ])),
  };

  try {
    return {
      revalidate: true,
      props: {
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

const BookingPage: NextApplicationPage = () => {
  const { t } = useTranslation(["home", "common", "booking"]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const itineraryDetailIds = useMemo(
    () => searchParams.getAll("id"),
    [searchParams]
  );
  const itineraryId = searchParams.get("itineraryId");
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const dispatch = useDispatch();

  const {
    information,
    informationError,
    onChangeInformationValue,
    setInformationError,
    updateUserProfile,
  } = useInfomation();
  const { onConfirmDetail, onSendApproval, submitting, actionStatus } =
    useBookingSubmit({
      itineraryId,
      information,
      setInformationError,
      updateUserProfile,
    });

  useNavigateOnChangingOrganization({ to: PathName.TRIPS });

  const getUsers = useCallback(
    async (selectedIds: string[]) => {
      const distinctIds = Array.from(new Set(selectedIds));
      try {
        if (
          distinctIds.length === 0 ||
          Helpers.isNullOrEmpty(userInfo?.userProfile?.id)
        )
          return [];
        const pageSize = Constants.ROW_PER_PAGE;

        const newQuery: any = {
          pageSize: pageSize,
          pageNumber: 1,

          selectedIds: distinctIds,
          searchText: undefined,
          listStatus: [1],

          clientId: Constants.CLIENT_ID,
          organizationId: userInfo?.userProfile?.organizationId || 0,
        };

        const result = await UserService.getPaged(newQuery);

        if (result && result.selectedItems) {
          return result.selectedItems;
        }
      } catch (error) {
        console.log({ error });
        // Helpers.handleException(error);
      }
      return [];
    },
    [userInfo?.userProfile?.id, userInfo?.userProfile?.organizationId]
  );

  const [currentUsers, setCurrentUsers] = useState<IUser[]>([]);
  const {
    data,
    isLoading: isItineraryDetailLoading,
    mutate,
  } = useSWR<{ itineraryDetail: IItineraryDetail[]; users: IUser[] }>(
    itineraryId && itineraryDetailIds.length > 0
      ? [
          `/api${PathName.TRIPS}/itineraryDetail`,
          itineraryDetailIds,
          itineraryId,
          dispatch,
          getUsers,
        ]
      : null,
    // @ts-ignore
    async ([, ids, itineraryId, dispatch, getUsers]: [
      string,
      string[],
      string,
      typeof dispatch,
      (userIds: string[]) => Promise<IUser[]>,
      IUser[],
    ]) => {
      const loadUsers = async (details: IItineraryDetail[]) => {
        const newUserIds = extractNewUserIds(details);
        let users: IUser[] = currentUsers;
        if (newUserIds.length > 0) {
          users = await getUsers(
            details.map((el) => el.itineraryMembers.map((m) => m.userId)).flat()
          );
        }
        return users;
      };
      const extractNewUserIds = (details: IItineraryDetail[]) => {
        const currentUsersMap = currentUsers.reduce(
          (acc, cur) => {
            acc[cur.id] = true;
            return acc;
          },
          {} as Record<string, boolean>
        );
        const itineraryMemberUserIds = details
          .map((el) => el.itineraryMembers.map((m) => m.userId))
          .flat();
        const newUserIdsList = [] as string[];
        itineraryMemberUserIds.forEach((userId) => {
          if (!currentUsersMap[userId]) {
            newUserIdsList.push(userId);
          }
        });
        return newUserIdsList;
      };

      try {
        dispatch(showLoading());
        const itineraryDetails = await ItineraryService.getListDetail({
          itineraryId,
          detailIds: ids.map((id: string) => id.trim()).filter((i) => !!i),
          checkRequest: true,
        });
        const users = await loadUsers(itineraryDetails);
        return { itineraryDetail: itineraryDetails, users };
      } catch (e) {
        Helpers.handleException(e, dispatch);
      } finally {
        dispatch(hideLoading());
      }
    },
    {
      keepPreviousData: true,
    }
  );

  useEffect(() => {
    if (!isItineraryDetailLoading && data?.users) {
      setCurrentUsers(data?.users || []);
    }
  }, [isItineraryDetailLoading, data?.users]);

  const onChangeUser = (user: IUser) => {
    setCurrentUsers((prev) => {
      const result = [...prev];
      const index = result.findIndex((el) => el.id === user.id);
      if (index !== -1) result[index] = user;
      return result;
    });
  };

  const itineraryDetailPriceMapGroupBySequence =
    BookingHelpers.getItineraryDetailPriceGroupBySequence(
      data?.itineraryDetail || []
    );
  const {
    completedData,
    expiredData,
    payableData: itineraryDetailDataReadyForPayment,
    waitForApprovalData: itineraryDetailDataWaitForApprovalResponse,
  } = useMemo(() => {
    const expiredData: IItineraryDetail[] = [];
    const completedData: IItineraryDetail[] = [];
    const payableData: IItineraryDetail[] = [];
    const waitForApprovalData: IItineraryDetail[] = [];

    data?.itineraryDetail?.forEach((item) => {
      if (
        BookingHelpers.isItineraryDetailDraft(item) ||
        BookingHelpers.isItineraryDetailWaitForApprovalResponse(item)
      ) {
        waitForApprovalData.push(item);
      } else if (
        BookingHelpers.isItineraryDetailRejected(item) ||
        BookingHelpers.isItineraryDetailStatusCanceled(item) ||
        BookingHelpers.isItineraryDetailConfirmStatusCanceled(item)
      ) {
        // do nothing
      } else if (BookingHelpers.isItineraryDetailCompleted(item)) {
        completedData.push(item);
      } else if (BookingHelpers.isItineraryDetailBookingExpired(item)) {
        expiredData.push(item);
      } else if (BookingHelpers.isItineraryDetailReadyForCheckout(item)) {
        payableData.push(item);
      }
    });

    return { payableData, waitForApprovalData, completedData, expiredData };
  }, [data?.itineraryDetail]);

  if (!itineraryId || itineraryDetailIds.length === 0) {
    router.replace("/404");
  }

  const { validateUsers, isInternationalFlight } = useValidateUsers({
    currentUsers,
  });

  const handleUpdateItineraryEstimateAmountLocal = (params?: {
    detail: IItineraryDetail;
    newEstimateAmount: number;
  }) => {
    // has price changed
    if (params) {
      const { detail, newEstimateAmount } = params;
      const sequence = detail.sequence;

      const numOfSameSequenceItineraryDetails =
        data?.itineraryDetail.filter((el) => el.sequence === sequence).length ||
        1;
      const newEstimateAmountPerDetail =
        newEstimateAmount / numOfSameSequenceItineraryDetails;

      const newDetails = (data?.itineraryDetail || []).map((el) =>
        el.sequence === sequence
          ? {
              ...el,
              amountBooking: newEstimateAmountPerDetail,
            }
          : el
      );

      mutate(
        { itineraryDetail: newDetails, users: data?.users ?? [] },
        { revalidate: false }
      );
    }
  };

  const commonTimelineProps = {
    getSequencePriceText: (sequence: number) =>
      BookingHelpers.getPriceText(
        itineraryDetailPriceMapGroupBySequence.get(sequence)
      ),
    itineraryId: itineraryId!,
    users: currentUsers,
    onChangeUser: onChangeUser,
    disabled: submitting,
  };

  return (
    <BaseLayout>
      <BreadCrumbs title={"Đặt chỗ"} route={["Chuyến đi", "Đặt chỗ"]} />

      <Grid container spacing={3} mt={0}>
        {/* <Box display="flex" justifyContent="flex-end" flexDirection="row">
                    <Button onClick={router.back} color="secondary" disabled={submitting}>
                        Trở về
                    </Button>
                </Box> */}
        <Grid item xs={12}>
          <BookingBasicInfo
            information={information}
            informationError={informationError}
            onChangeValue={onChangeInformationValue}
            disabled={submitting}
          />
        </Grid>

        {/* payable */}
        {itineraryDetailDataReadyForPayment.length >= 1 && (
          <Grid item xs={12}>
            <BookingItineraryTimeline
              title="Có thể thanh toán"
              data={itineraryDetailDataReadyForPayment}
              {...commonTimelineProps}
              renderActionChild={(item) =>
                onConfirmDetail && (
                  <ItineraryDetailItemCheckoutAction
                    item={item}
                    actionStatus={actionStatus[item.sequence]}
                    onClick={(newItem) =>
                      validateUsers(
                        isInternationalFlight(
                          itineraryDetailDataReadyForPayment
                        ),
                        (item.itineraryMembers ?? []).map((m) => m.userId)
                      ).then((value) => {
                        value &&
                          onConfirmDetail({
                            isFirstCall: true,
                            itineraryDetail: newItem,
                            totalPriceItineraryDetail:
                              itineraryDetailPriceMapGroupBySequence.get(
                                item.sequence
                              )?.value,
                            onCallBack:
                              handleUpdateItineraryEstimateAmountLocal,
                          });
                      })
                    }
                  />
                )
              }
            />
          </Grid>
        )}

        {/* send approval */}
        {itineraryDetailDataWaitForApprovalResponse.length >= 1 && (
          <Grid item xs={12}>
            <BookingItineraryTimeline
              title="Cần phê duyệt"
              {...commonTimelineProps}
              data={itineraryDetailDataWaitForApprovalResponse}
              renderActionChild={(item) =>
                onSendApproval && (
                  <ItineraryDetailItemSendApprovalAction
                    item={item}
                    actionStatus={
                      BookingHelpers.isItineraryDetailWaitForApprovalResponse(
                        item
                      )
                        ? "done"
                        : actionStatus[item.sequence]
                    }
                    onClick={(newItem) =>
                      validateUsers(
                        isInternationalFlight(
                          itineraryDetailDataWaitForApprovalResponse
                        ),
                        (item.itineraryMembers ?? []).map((m) => m.userId)
                      ).then((value) => {
                        value &&
                          onSendApproval({
                            isFirstCall: true,
                            item: newItem,
                            totalPriceItineraryDetail:
                              itineraryDetailPriceMapGroupBySequence.get(
                                item.sequence
                              )?.value,
                            onCallBack:
                              handleUpdateItineraryEstimateAmountLocal,
                          });
                      })
                    }
                  />
                )
              }
            />
          </Grid>
        )}

        {completedData.length >= 1 && (
          <Grid item xs={12}>
            <BookingItineraryTimeline
              title="Đã thanh toán"
              {...commonTimelineProps}
              data={completedData}
            />
          </Grid>
        )}

        {expiredData.length >= 1 && (
          <Grid item xs={12}>
            <BookingItineraryTimeline
              title="Quá hạn thanh toán"
              data={expiredData}
              {...commonTimelineProps}
            />
          </Grid>
        )}
      </Grid>
    </BaseLayout>
  );
};

const ItineraryDetailItemCheckoutAction = ({
  item,
  onClick: onConfirmDetail,
  actionStatus,
  disabled,
}: {
  item: IItineraryDetail;
  onClick: (item: IItineraryDetail) => Promise<void>;
  actionStatus: "idle" | "submitting" | "done";
  disabled?: boolean;
}) => {
  const isSubmitting = actionStatus === "submitting";
  const isProcessing = actionStatus === "done";

  const isDisabled = disabled || isSubmitting || isProcessing;

  const handleConfirmDetails = (item: IItineraryDetail) =>
    onConfirmDetail(item);

  const buttontext = (() => {
    if (actionStatus === "done") {
      return "Đang xử lý";
    }
    return "Thanh toán";
  })();

  return (
    <Button
      variant="contained"
      color={isDisabled ? "secondary" : "primary"}
      onClick={isDisabled ? undefined : () => handleConfirmDetails(item)}
      loading={isSubmitting}
      disabled={isDisabled}
      sx={{
        background:
          "linear-gradient(274.91deg, #166695 -0.1%, #1292DD 99.9%) !important",
        width: "max-content",
      }}
    >
      {buttontext}
    </Button>
  );
};
const ItineraryDetailItemSendApprovalAction = ({
  item,
  onClick: onSendApproval,
  actionStatus,
  disabled,
}: {
  item: IItineraryDetail;
  onClick: (item: IItineraryDetail) => Promise<void>;
  actionStatus: "idle" | "submitting" | "done";
  disabled?: boolean;
}) => {
  const handleSendApproval = () => onSendApproval(item);

  const isSubmitting = actionStatus === "submitting";
  const isSent = actionStatus === "done";
  const isDisabled = disabled || isSubmitting || isSent;

  const buttontext = (() => {
    if (actionStatus === "done") {
      return "Đã gửi yêu cầu";
    }
    if (actionStatus === "submitting") {
      return "Đang xử lý";
    }
    return "Gửi yêu cầu phê duyệt";
  })();

  return (
    <Button
      variant="contained"
      color={isDisabled ? "secondary" : "warning"}
      loading={isSubmitting}
      onClick={isDisabled ? undefined : handleSendApproval}
      disabled={isDisabled}
      sx={{
        background:
          "linear-gradient(92.49deg, #FFA149 0.05%, #F47A34 100.05%) !important",
        width: "max-content",
      }}
    >
      {buttontext}
    </Button>
  );
};

BookingPage.requiredAuth = true;

export default withSSRErrorHandling(BookingPage);

const useInfomation = () => {
  const dispatch = useDispatch();

  const userInfo = useSelector(
    (state: RootState) => state.userInfo.userProfile
  );

  const [information, setInformation] = useState<IInformation>({
    firstName: "",
    lastName: "",
    email: "",
    country: "",
    phoneNumber: "",
    sendEmail: false,
    phoneCode: "",
  });
  const [informationError, setInformationError] = useState<IErrorInformation>(
    {}
  );
  const ref = useRef<IInformation | undefined>(undefined);

  const onChangeInformationValue = useCallback(
    (value: string | boolean, key: keyof IInformation) => {
      setInformation((prev) => ({ ...prev, [key]: value }));
      setInformationError((oldError) => {
        if (!Helpers.isNullOrEmpty(oldError[key])) {
          return { ...oldError, [key]: "" };
        }
        return oldError;
      });
    },
    []
  );

  useEffect(() => {
    if (userInfo?.fullName) {
      const { firstName, lastName } = Helpers.getFirstAndLastname(
        userInfo?.fullName
      );
      setInformation((prev) => ({
        ...prev,
        firstName,
        lastName,
        email: userInfo?.email,
        phoneNumber: userInfo?.phoneNumber,
      }));
      ref.current = {
        country: "",
        sendEmail: false,
        firstName,
        lastName,
        email: userInfo?.email,
        phoneNumber: userInfo?.phoneNumber,
        phoneCode: "",
      };
    }
  }, [userInfo]);

  const updateUserProfile = async () => {
    try {
      if (JSON.stringify(ref.current) === JSON.stringify(information)) return;

      // call api update
      // Son le => not Thanh
      await ProfileService.updateOrganizationProfile([
        {
          id: userInfo?.id,
          userId: userInfo?.identityId,
          organizationId: userInfo?.organizationId,
          userType: 0,
          firstName: information.firstName,
          lastName: information.lastName,
          dateOfBirth: Number(userInfo?.birthDate || 0),
          gender: userInfo?.gender,
          employmentDate: Number(userInfo?.employmentDate || 0),
          idCardNo: userInfo?.idCardNo || "",
          idCardIssuedDate: Number(userInfo?.idCardIssuedDate || 0),
          idCardIssuedPlace: userInfo?.idCardIssuedPlace || "",
          socialInsuranceCode: userInfo?.socialInsuranceCode || "",
          extraInformation: undefined,
          email: information?.email,
          phoneNumber: information?.phoneNumber,
          passportNo: userInfo?.passportNo || "",
          passportExpiredDate: Number(userInfo?.passportExpiredDate || 0),
          passportIssuedPlace: userInfo?.passportIssuedPlace || "",
          nationality: userInfo?.nationality || "",
        },
      ]);

      // update store
      dispatch(
        storeDataUserProfile({
          ...userInfo,
          fullName: [information.lastName, information.firstName].join(" "),
          email: information?.email,
          phoneNumber: information?.phoneNumber,
        })
      );
    } catch (error) {
      console.log({ error });
    }
  };
  return {
    information,
    informationError,
    onChangeInformationValue,
    setInformationError,
    updateUserProfile,
  };
};

interface BookingItineraryTimelineProps {
  data: IItineraryDetail[];
  users: IUser[];
  itineraryId: string;
  title: string;
  onChangeUser?: any;
  disabled?: any;
  getSequencePriceText: (sequence: number) => React.ReactNode;
  renderActionChild?: (item: IItineraryDetail) => React.ReactNode;
}

const BookingItineraryTimeline = (props: BookingItineraryTimelineProps) => {
  const { data, title, itineraryId, users, disabled, onChangeUser } = props;

  return (
    <Card>
      <Box display="flex" alignItems="center" gap={1}>
        <Typography
          sx={{
            fontSize: "1.25rem",
            color: "#1C252E",
            fontWeight: 600,
          }}
        >
          {title}
        </Typography>
        <Box
          sx={{
            width: 24,
            height: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#E4EBF7",
            borderRadius: "50%",
          }}
        >
          <Typography
            sx={{
              color: "#1C252E",
              fontSize: Constants.FONT_SIZE.SMALL_TEXT,
            }}
          >
            {BookingHelpers.getNumberOfDistinctItineraryDetailSequence(data)}
          </Typography>
        </Box>
      </Box>
      <ItineraryTimeline
        id={itineraryId}
        users={users}
        data={data}
        onChangeUser={onChangeUser}
        disabled={disabled}
        hiddenSeparator
        hiddenItemPrice
        renderHeaderActions={props.renderActionChild}
        onCallBack={() => {}}
      />
    </Card>
  );
};
