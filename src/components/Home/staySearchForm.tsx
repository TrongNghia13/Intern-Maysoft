import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import Helpers from "@src/commons/helpers";
import { useQueryParams } from "@src/commons/useQueryParams";
import { ISearchHotelData } from "@src/hooks/searchHotel/useData";
import moment from "moment";
import SearchHotelComponent from "../SearchHotel";
import { SearchHotelComponentMode } from "@src/commons/enum";

export interface IDataSearchStays {
  userIds?: string[];
  endDate?: number;
  startDate?: number;
  valueSearch?: string;
  isApartment?: boolean;
}

interface IDataProps {
  data?: IDataSearchStays;
  hidenInputUserIds?: boolean;
  onSearch: (data?: IDataSearchStays) => void;
}

const StaySearchForm: React.FC<IDataProps> = (props: IDataProps) => {
  const {
    t,
    i18n: { language },
  } = useTranslation(["common", "tripbooking"]);

  const [searchData, setSearchData] = useState<ISearchHotelData>({
    searchText: undefined,
    startDate: moment().unix(),
    endDate: moment().add(7, "day").unix(),
    occupancy: [
      {
        adultSlot: 1,
        childrenOld: [],
      },
    ],
    isApartment: false,
  });

  const filter = useQueryParams([
    "searchText",
    "startDate",
    "endDate",
    "occupancy",
  ]);

  useEffect(() => {
    if (!Helpers.isNullOrEmpty(filter)) {
      setSearchData({
        isApartment: false,
        searchText: filter.searchText,
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
      });
    }
  }, [filter]);

  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <SearchHotelComponent
          mode={SearchHotelComponentMode.Corporate}
          hidenInputUserIds={props?.hidenInputUserIds}
          searchData={searchData}
          onSearch={(data) => {
            setSearchData(data);
          }}
        />
      </Grid>
    </Grid>
  );
};

export default StaySearchForm;
