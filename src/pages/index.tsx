import { Box, Typography } from "@maysoft/common-component-react";
import { Flight } from "@mui/icons-material";
import { Card } from "@mui/material";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";

import {
  IFlight,
  IItinerary,
  ISiteConfig,
  IUser,
} from "@src/commons/interfaces";
import { getServerSideTranslationsProps } from "@src/commons/translationHelpers";
import { withSSRErrorHandling } from "@src/commons/withSSRErrorHandling";
import Resources from "@src/constants/Resources";
import { RootState } from "@src/store";
import { NextApplicationPage } from "./_app";

// DeepTech
import { SearchComponent } from "@deeptech/flight-components";
import { BookingHelpers } from "@src/commons/bookingHelpers";
import { ModalSearchUserByOrganization } from "@src/components";
import Constants from "@src/constants";
import useReverseFlight from "@src/hooks/reverse/useReverseFlight";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

// Create a client
const queryClient = new QueryClient();

// End DeepTech
interface IProps {
  siteConfig: ISiteConfig;
}

export interface ITabFilter {
  title: string;
  Icon: JSX.Element;
  container: React.ReactNode;
}

const PAGE_SIZE = 3;

const HomePage: NextApplicationPage<IProps> = ({ siteConfig }) => {
  const {
    t,
    i18n: { language },
  } = useTranslation("tripbooking");

  const dispatch = useDispatch();

  const authRoot = useSelector((state: RootState) => state.authRoot.authInfo);
  const userInfo = useSelector(
    (state: RootState) => state.userInfo.userProfile
  );

  const router = useRouter();

  const { handleReverseFlight } = useReverseFlight();

  const [indexBtn, setIndexBtn] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(true);
  const [dataItinerary, setDataItinerary] = useState<IItinerary[]>([]);
  const [listSelectedUser, setListSelectedUser] = useState<IUser[]>([]);
  const employees = useMemo(() => {
    return BookingHelpers.convertUsersToIEmployees(listSelectedUser);
  }, [listSelectedUser]);
  const [openModalSearchUser, setOpenModalSearchUser] =
    useState<boolean>(false);

  const currentOrganizationIdRef = React.useRef<string | null>(
    userInfo?.organizationId
  );
  if (currentOrganizationIdRef.current !== userInfo?.organizationId) {
    setListSelectedUser([]);
    currentOrganizationIdRef.current = userInfo?.organizationId;
  }
  // useEffect(() => {
  //     if (userInfo?.organizationId) {
  //         const getPagedTrip = async () => {
  //             try {
  //                 setLoading(true);

  //                 const result = await ItineraryService.getPaged({
  //                     pageSize: PAGE_SIZE,
  //                     pageNumber: 1,
  //                     organizationId: userInfo?.organizationId,
  //                     orderby: "`itinerary`.createTime DESC",
  //                 });

  //                 setDataItinerary(result?.items);
  //             } catch (error) {
  //                 Helpers.handleError(error, router, dispatch);
  //             } finally {
  //                 setLoading(false);
  //             }
  //         };

  //         getPagedTrip();
  //     }
  // }, [userInfo?.organizationId]);

  const arrBtn: ITabFilter[] = [
    // * DeepTech - SearchFlight
    {
      title: "Chuyến bay",
      Icon: <Flight sx={{ transform: "rotate(90deg)" }} />,
      container: (
        <QueryClientProvider client={queryClient}>
          <SearchComponent
            authKey={authRoot?.access_token || ""}
            organizationId={userInfo?.organizationId}
            onAddUsers={() => {
              setOpenModalSearchUser(true);
            }}
            users={employees || []}
            // showFixedSearchForm
            onComplete={async (data) => {
              await handleReverseFlight(data as IFlight, listSelectedUser);
            }}
          />
        </QueryClientProvider>
      ),
    },

    // SearchHotel
    // {
    //     title: t("stays"),
    //     Icon: <HotelIcon />,
    //     container: (
    //         <Box
    //             sx={{
    //                 padding: { xs: "16px", sm: "32px" },
    //                 width: "75vw",
    //             }}
    //         >
    //             <SearchHotelComponent
    //                 mode={SearchHotelComponentMode.Corporate}
    //                 hidenInputUserIds={Helpers.isNullOrEmpty(userInfo?.identityId)}
    //                 searchData={{
    //                     searchText: "",
    //                     isApartment: false,
    //                     startDate: moment().unix(),
    //                     endDate: moment().add(7, "days").unix(),
    //                     occupancy: [
    //                         {
    //                             adultSlot: 1,
    //                             childrenOld: [],
    //                         },
    //                     ],
    //                 }}
    //                 onSearch={(data) => {
    //                     const newQuery: any = {
    //                         endDate: data.endDate,
    //                         startDate: data.startDate,
    //                         searchText: data.searchText,
    //                         isApartment: data.isApartment,
    //                         occupancy: JSON.stringify(data.occupancy),
    //                     };

    //                     router.push({
    //                         // id: id,
    //                         pathname: PathName.SEARCH,
    //                         query: newQuery,
    //                     });
    //                 }}
    //             />
    //         </Box>
    //     ),
    // },
  ];

  return (
    <Box
      sx={{
        position: "relative",
        backgroundColor: "#FBA400",
      }}
    >
      {/* <Box sx={{ height: 144, width: "100%", backgroundColor: "#ffffff" }} /> */}
      <Box
        sx={(theme) => ({
          position: "relative",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          // justifyContent: "space-between",
          backgroundImage: `url(${Resources.Images.BACKGROUND})`,
          backgroundSize: "100%",
          backgroundRepeat: "no-repeat",
          // pt: "calc(144px + 78px)",
          minHeight: "100vh",
        })}
      >
        <Box
          sx={{
            // my: 7.5,
            // width: "75vw",
            maxWidth: "1200px",
            width: "min(90vw, 1200px)",
            my: {
              xs: 2.5,
              lg: 17.5,
            },
            // alignSelf: "center",
          }}
        >
          <Card
            sx={{
              boxShadow: "0px 2px 40px 0px #00000026",
              borderRadius: 3,
              // my: height > 400 ? "calc(144px + 78px)" : 0,
            }}
          >
            {/* <Box display="flex" p={2}>
                            {arrBtn.map((item, index) => (
                                <TabItem item={item} key={index} isActive={index === indexBtn} onClick={() => setIndexBtn(index)} />
                            ))}
                        </Box> */}
            <Box>{arrBtn[indexBtn].container}</Box>
          </Card>
        </Box>
        {/* {dataItinerary?.length > 0 && (
                    <Box
                        sx={{
                            display: "grid",
                            gap: 1,
                            width: "75vw",
                            maxWidth: "1200px",
                        }}
                    >
                        <Typography sx={{ paddingBottom: 2, fontSize: 24, color: "#ffffff" }} variant="h5">
                            {"Chuyến đi gần đây"}
                        </Typography>
                        <CardList
                            loading={loading}
                            cardItem={TripCard}
                            numberOfSkeleton={PAGE_SIZE}
                            data={dataItinerary || []}
                            skeletonComponent={SkeletonTripCard}
                            cardItemProps={{
                                item: {} as any,
                                hidePrice: true,
                                hidenStatus: true,
                                hidenAction: true,
                                onClick: (item) => {
                                    router.push({
                                        pathname: PathName.TRIPS_DETAIL,
                                        query: {
                                            id: item.id,
                                        },
                                    });
                                },
                            }}
                        />
                        <Box display="flex" alignItems="center" justifyContent="center" mt={5} mb={10}>
                            <Box
                                display="flex"
                                gap={1}
                                alignItems="center"
                                sx={{
                                    ":hover": {
                                        cursor: "pointer",
                                    },
                                }}
                                onClick={() => router.push(PathName.TRIPS)}
                            >
                                <Typography
                                    sx={{
                                        color: "#ffffff",
                                    }}
                                >
                                    Xem tất cả chuyến đi
                                </Typography>
                                <East sx={{ color: "#ffffff" }} />
                            </Box>
                        </Box>
                    </Box>
                )} */}
      </Box>
      {openModalSearchUser && (
        <ModalSearchUserByOrganization
          visibled={openModalSearchUser}
          setVisibled={setOpenModalSearchUser}
          userIds={listSelectedUser.map((el) => el.id)}
          onAction={(data) => {
            setListSelectedUser(data);

            setOpenModalSearchUser(false);
          }}
        />
      )}
    </Box>
  );
};

const HotelIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14.1665 15.8333H15.8332V9.16667H10.8332V15.8333H12.4998V10.8333H14.1665V15.8333ZM2.49984 15.8333V3.33333C2.49984 3.11232 2.58763 2.90036 2.74391 2.74408C2.9002 2.5878 3.11216 2.5 3.33317 2.5H14.9998C15.2209 2.5 15.4328 2.5878 15.5891 2.74408C15.7454 2.90036 15.8332 3.11232 15.8332 3.33333V7.5H17.4998V15.8333H18.3332V17.5H1.6665V15.8333H2.49984ZM5.83317 9.16667V10.8333H7.49984V9.16667H5.83317ZM5.83317 12.5V14.1667H7.49984V12.5H5.83317ZM5.83317 5.83333V7.5H7.49984V5.83333H5.83317Z"
      fill="#637381"
    />
  </svg>
);

const TabItem = ({
  item,
  isActive,
  onClick,
}: {
  item: ITabFilter;
  isActive: boolean;
  onClick: () => void;
}) => {
  const Icon = item.Icon;
  return (
    <Box display="flex">
      <Box
        display="flex"
        alignItems="center"
        gap={1}
        py={1.5}
        px={2}
        sx={({ palette: { info } }) => ({
          ...(isActive && {
            borderBottom: `2px solid ${info.main}`,
            "& svg": {
              fill: info.main,
            },
            "& span": {
              color: info.main,
            },
          }),
          ...(!isActive && {
            "& svg": {
              fill: "#637381",
            },
            "& span": {
              color: "#637381",
            },
          }),
          "&:hover": {
            cursor: "pointer",
          },
        })}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        {Icon}
        <Typography
          variant="caption"
          fontWeight="bold"
          sx={{
            fontSize: Constants.FONT_SIZE.SMALL_TEXT,
          }}
        >
          {item.title}
        </Typography>
      </Box>
    </Box>
  );
};

HomePage.requiredAuth = true;
export default withSSRErrorHandling(HomePage);

export { getStaticProps };
const getStaticProps = getServerSideTranslationsProps([
  "tripbooking",
  "search_hotel",
]);
