import moment from "moment";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { makeServerSideTranslations } from "@src/commons/translationHelpers";
import { useQueryParams } from "@src/commons/useQueryParams";
import HotelDetail from "@src/components/Hotel";

import useReverseHotel from "@src/hooks/reverse/useReverseHotel";
import { ISearchHotelData } from "@src/hooks/searchHotel/useData";
import { BaseLayout } from "@src/layout";
import { useAuth } from "@src/providers/authProvider";
import { RootState } from "@src/store";
import { NextApplicationPage } from "../_app";

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: "blocking",
    };
};

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
    let props = { ...(await makeServerSideTranslations(locale, ["common", "detail", "search_hotel", "search"])) };
    const id = params?.id?.toString() || "";

    try {
        return {
            revalidate: true,
            props: {
                // post: post || null,
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

const RoomDetail: NextApplicationPage<IProps> = ({ id }) => {
    const router = useRouter();
    const auth = useAuth();

    const {
        i18n: { language },
    } = useTranslation("common");

    const dispatch = useDispatch();
    const userInfo = useSelector((state: RootState) => state.userInfo.userProfile);

    const filter = useQueryParams(["searchText", "startDate", "endDate", "occupancy"]);

    const searchData = useMemo<ISearchHotelData>(
        () => ({
            isApartment: filter?.isApartment === "true",
            userIds: [],
            searchText: filter?.searchText || "",
            startDate: Number(filter?.startDate || moment().unix()),
            endDate: Number(filter?.endDate || moment().add(7, "day").unix()),
            occupancy: filter?.occupancy
                ? JSON.parse(filter?.occupancy)
                : [
                      {
                          adultSlot: 1,
                          childrenOld: [],
                      },
                  ],
        }),
        [filter?.searchText, filter?.startDate, filter?.endDate, filter?.occupancy, filter?.isApartment]
    );

    const { handleReverse } = useReverseHotel();

    return (
        <BaseLayout>
            <HotelDetail
                id={id}
                searchData={searchData}
                onFilter={(submitData) =>
                    router.replace({
                        query: { ...router.query, ...submitData, occupancy: JSON.stringify(submitData.occupancy) },
                    })
                }
                onReverse={async (room, detail) => await handleReverse(room, detail, searchData)}
            />
        </BaseLayout>
    );
};

RoomDetail.requiredAuth = true;

export default RoomDetail;
