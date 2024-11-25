import { Grid } from "@mui/material";
import { GetStaticPaths, GetStaticProps } from "next";
import { useEffect, useMemo, useState } from "react";

import Helpers from "@src/commons/helpers";

import { makeServerSideTranslations } from "@src/commons/translationHelpers";
import { withSSRErrorHandling } from "@src/commons/withSSRErrorHandling";
import useTrips from "@src/hooks/trips/useTrips";
import { NextApplicationPage } from "../_app";

import { Box, Typography } from "@maysoft/common-component-react";
import { BookingHelpers } from "@src/commons/bookingHelpers";
import { ActionForm, AddForm, BreadCrumbs, Card, Container, ItineraryTimeline, PageLoader, SummaryPrice, TripBasicInfo } from "@src/components";
import Constants from "@src/constants";
import { typographyStyles } from "@src/styles/commonStyles";
import { useRouter } from "next/router";
import { TripTabs } from "@src/commons/enum";

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: "blocking",
    };
};

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
    let props = { ...(await makeServerSideTranslations(locale, ["common", "tripbooking", "home", "search_hotel", "search", "detail"])) };

    const id = params?.id?.toString() || "";

    try {
        return {
            revalidate: true,
            props: {
                id,
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

interface IProps {
    id: string;
}

const TripDetailPage: NextApplicationPage<IProps> = ({ id }) => {
    const {
        data: _data,
        orderData,
        error,
        loading,
        users,
        selectedSequence,
        onChangeUsers,
        onRemoveUser,
        onChangeValue,
        onSubmit,
        onRefreshData,
        getDetail,
        onDeleteItineraryDetail,
        onUpdateMemberDetail,
        onSelectItineraryDetail,
        onChangeUser,
    } = useTrips({
        id,
    });

    const router = useRouter();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [typeForm, setTypeForm] = useState<number | undefined>(undefined);
    const [addForm, setAddForm] = useState<boolean>(false);

    // Filter data by tab
    const fromTabQuery = router.query[Constants.PAGE_QUERY_KEY.TRIP_DETAIL.FROM_TAB];
    const isCorrectTab = fromTabQuery ? Object.values(TripTabs).includes(fromTabQuery as TripTabs) : true;
    const fromTab = useMemo(() => {
        if (router.isReady && isCorrectTab) {
            return fromTabQuery as TripTabs;
        }
        return undefined;
    }, [fromTabQuery, isCorrectTab, router.isReady]);
    const data = useMemo(() => {
        if (fromTab !== undefined) {
            return BookingHelpers.getProcessedTrips([_data], fromTab)[0];
        }
        return _data;
    }, [_data, fromTab]);

    // remove select item booking
    useEffect(() => {
        Helpers.removeSessionStorage(Constants.PAGE_LOCALSTORAGE_KEY.TRIP_DETAIL.RESELECT);
    }, []);

    const handleCancelAddTrips = () => {
        setAddForm(false);
        setTypeForm(undefined);
        Helpers.removeSessionStorage(Constants.PAGE_LOCALSTORAGE_KEY.TRIP_DETAIL.RESELECT);
    };

    if (!isCorrectTab) {
        const newRouterQuery = { ...router.query };
        delete newRouterQuery[Constants.PAGE_QUERY_KEY.TRIP_DETAIL.FROM_TAB];
        router.replace({
            ...router,
            query: newRouterQuery,
        }, undefined, { shallow: true });
    }
    if (loading || Helpers.isNullOrEmpty(data?.id)) return <PageLoader />;

    const isTripHasAnyDetail = (data.itineraryDetails || [])?.length > 0;
    const isPastTab = (fromTab === TripTabs.Past);
    return (
        <BaseLayoutRemoveFixWidth>
            <BreadCrumbs title={"Thông tin chuyến đi"} route={["Chuyến đi", "Thông tin chuyến đi"]} />

            <Grid container spacing={3} mt={0}>
                {/* Basic Information */}
                <Grid item xs={12}>
                    <TripBasicInfo
                        data={data}
                        error={error}
                        users={users}
                        loading={loading}
                        onChangeValue={onChangeValue}
                        onSubmit={onSubmit}
                        onChangeUsers={onChangeUsers}
                        onRemoveUser={onRemoveUser}
                        onRefreshData={onRefreshData}
                    />
                </Grid>

                {/* Button Add Booking */}
                {BookingHelpers.isItineraryEditable(data) && addForm && (
                    <Grid item xs={12}>
                        <Card sx={{ p: 0 }}>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Box px={3} pt={3} pb={1}>
                                        <ActionForm
                                            {...{
                                                status: data.status,
                                                addForm,
                                                anchorEl,
                                                setAnchorEl,
                                                setTypeForm,
                                                setAddForm,
                                                handleCancelAddTrips,
                                            }}
                                        />
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    {/* Step Search Stay */}
                                    {
                                        <AddForm
                                            {...{
                                                typeForm,
                                                data,
                                                getDetail,
                                                handleCancelAddTrips,
                                            }}
                                        />
                                    }
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>
                )}

                {/* list booking */}
                {!addForm && (
                    <Grid item xs={12} xl={isTripHasAnyDetail ? 8 : 12}>
                        <Card>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Typography sx={(theme) => typographyStyles(theme, { fontWeight: 600, fontSize: "1.5rem" })}>
                                    Chuyến bay & khách sạn
                                </Typography>

                                {!isPastTab && BookingHelpers.isItineraryEditable(data) && (
                                    <ActionForm
                                        {...{
                                            status: data.status,
                                            addForm,
                                            anchorEl,
                                            setAnchorEl,
                                            setTypeForm,
                                            setAddForm,
                                            handleCancelAddTrips,
                                        }}
                                    />
                                )}
                            </Box>

                            {isTripHasAnyDetail ? (
                                <ItineraryTimeline
                                    id={id}
                                    users={users}
                                    status={data.status}
                                    data={data.itineraryDetails || []}
                                    selectedSequence={selectedSequence}
                                    onDeleteItemBooking={onDeleteItineraryDetail}
                                    onUpdateMemberDetail={onUpdateMemberDetail}
                                    onSelectItineraryDetail={onSelectItineraryDetail}
                                    onReselectDetail={(itemBooking) => {
                                        Helpers.removeSessionStorage(Constants.PAGE_LOCALSTORAGE_KEY.TRIP_DETAIL.RESELECT);
                                        Helpers.setSessionStorage(Constants.PAGE_LOCALSTORAGE_KEY.TRIP_DETAIL.RESELECT, itemBooking);
                                        setTypeForm(itemBooking.type);
                                        setAddForm(true);
                                    }}
                                    onCallBack={() => {
                                        getDetail(data.id);
                                    }}
                                />
                            ): (
                                <Box p={2} display="flex" justifyContent="center">
                                    <Typography variant="h6" component="span" fontWeight="regular">Không có dữ liệu</Typography>
                                </Box>
                            )}
                        </Card>
                    </Grid>
                )}

                {/* summary trip */}
                {!addForm && isTripHasAnyDetail && (
                    <Grid item xs={12} xl={4}>
                        <SummaryPrice
                            itineraryDetails={data?.itineraryDetails || []}
                            orderData={orderData}
                            selectedSequence={selectedSequence}
                            // actionButton={BookingHelpers.isItineraryCompletedAllPayment(data) ? undefined : null}
                        />
                    </Grid>
                )}
            </Grid>
        </BaseLayoutRemoveFixWidth>
    );
};

TripDetailPage.requiredAuth = true;
export default withSSRErrorHandling(TripDetailPage);

const BaseLayoutRemoveFixWidth = ({ children }: { children: React.ReactNode }) => {
    return (
        <Container
            maxWidth={false}
            sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                justifyContent: "center",
                pb: 3,
            }}
        >
            <Box sx={{ minHeight: "50vh" }}>
                <Box maxWidth={"1200px"} py={3} width={"100vw"}>
                    {children}
                </Box>
            </Box>
        </Container>
    );
};
