import { Box, FormField, Typography } from "@maysoft/common-component-react";
import { Search } from "@mui/icons-material";
import { useTranslation } from "next-i18next";

import Card from "@src/components/Card/Card";
import Constants from "@src/constants";

import { TripTabs } from "@src/commons/enum";
import { IRequestGetPagedItinerary } from "@src/services/booking/ItineraryService";

export const SearchTripForm = ({
    requestData,
    isLoading,
    activeTab,
    onSearch,
    onChangeTab,
    showApprovalTab,
    countByTimeline,
}: {
    isLoading: boolean;
    activeTab: TripTabs;
    requestData: IRequestGetPagedItinerary;
    onChangeTab: (newTab: TripTabs) => void;
    onSearch: (s: string) => void;
    showApprovalTab: boolean;
    countByTimeline: { [key in TripTabs]: number };
}) => {
    const { t } = useTranslation(["common", "tripbooking"]);

    const handleSearch = (newSearchValue: string) => {
        const isSearchValueChanged = requestData.searchText?.trim().toLowerCase() !== newSearchValue.trim().toLowerCase();
        if (!isSearchValueChanged) {
            return;
        }
        onSearch(newSearchValue);
    };

    const handleEnterToSearch = (e: any) => {
        if (e.key === "Enter") {
            handleSearch(e.target.value);
        }
    };

    return (
        <Card>
            <Box display="grid" gap={1}>
                <Box display="flex"  gap={2} alignItems="center" style={{ borderBottom: "1px solid #E4EBF7 " }}>
                    <FilterItem
                        activeTab={activeTab}
                        value={TripTabs.Draft}
                        count={countByTimeline?.[TripTabs.Draft]}
                        onChangeTab={onChangeTab}
                        title={`Nháp`}
                        disabled={isLoading}
                    />
                    <FilterItem
                        activeTab={activeTab}
                        value={TripTabs.Now}
                        count={countByTimeline?.[TripTabs.Now]}
                        onChangeTab={onChangeTab}
                        title={`Hiện tại`}
                        disabled={isLoading}
                    />
                    <FilterItem
                        activeTab={activeTab}
                        value={TripTabs.Future}
                        count={countByTimeline?.[TripTabs.Future]}
                        onChangeTab={onChangeTab}
                        title={`Sắp tới`}
                        disabled={isLoading}
                    />
                    <FilterItem
                        activeTab={activeTab}
                        value={TripTabs.Past}
                        count={countByTimeline?.[TripTabs.Past]}
                        onChangeTab={onChangeTab}
                        title={`Quá khứ`}
                        disabled={isLoading}
                    />
                    <FilterItem
                        activeTab={activeTab}
                        value={TripTabs.Rejected}
                        count={countByTimeline?.[TripTabs.Rejected]}
                        onChangeTab={onChangeTab}
                        title={`Đã hủy`}
                        disabled={isLoading}
                    />
                    <Box marginLeft="auto" minWidth="fit-content">
                        {showApprovalTab && (
                            <FilterItem
                                activeTab={activeTab}
                                value={TripTabs.Approval}
                                count={undefined}
                                onChangeTab={onChangeTab}
                                title={`Cần bạn phê duyệt`}
                                disabled={isLoading}
                            />
                        )}
                    </Box>
                </Box>
                <Box>
                    <FormField
                        variant="outlined"
                        placeholder={t("tripbooking:search_trips")}
                        defaultValue={requestData.searchText}
                        onBlur={handleSearch}
                        onKeyDown={handleEnterToSearch}
                        InputProps={{ startAdornment: <Search color="secondary" /> }}
                    />
                </Box>
            </Box>
        </Card>
    );
};

const getColor = (value: TripTabs) => {
    if (value === TripTabs.Approval)
        return {
            color: "#ffffff",
            backgroundColor: "#1E97DE",
        };
    if (value === TripTabs.Now)
        return {
            color: "#ffffff",
            backgroundColor: "#0F8D57",
        };
    if (value === TripTabs.Future)
        return {
            color: "#ffffff",
            backgroundColor: "#FBA400",
        };
    if (value === TripTabs.Past)
        return {
            color: "#ffffff",
            backgroundColor: "#9F9F9F",
        };
    if (value === TripTabs.Rejected)
        return {
            color: "#E50000",
            backgroundColor: "#FFE3E3",
        };
    return {
        color: "#ffffff",
        backgroundColor: "#637381",
    };
};

const FilterItem = ({
    onChangeTab,
    value,
    title,
    activeTab,
    disabled,
    count,
}: {
    onChangeTab: (newTab: TripTabs) => void;
    value: TripTabs;
    activeTab: TripTabs;
    title: string;
    count?: number;
    disabled?: boolean;
}) => {
    const isDisabled = disabled;
    const selected = value === activeTab;
    const { color, backgroundColor } = getColor(value);
    return (
        <Box
            onClick={() => {
                if (isDisabled) return;
                onChangeTab(value)
            }}
            sx={(theme) => {
                const {
                    palette: { info, secondary },
                    functions: { rgba },
                } = theme;
                return {
                    px: 1.5,
                    py: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    minWidth: 107,
                    borderBottom: `2px solid transparent`,
                    transition: "border-color .3s ease-out",
                    "&:hover": isDisabled
                        ? { cursor: "wait" }
                        : {
                              borderBottom: `2px solid ${info.main}`,
                              cursor: "pointer",
                          },
                    ...(selected && {
                        borderBottomColor: info.main,
                    }),
                };
            }}
        >
            <Typography
                variant="button"
                sx={(theme) => {
                    const {
                        palette: { info, secondary },
                        functions: { rgba },
                    } = theme;
                    return {
                        minWidth: "fit-content",
                        fontSize: Constants.FONT_SIZE.SMALL_TEXT,
                        fontWeight: 600,
                        color: "#637381",
                        ...(selected && {
                            color: info.main,
                        }),
                    };
                }}
            >
                {title}
            </Typography>
            {typeof count === "number" && (
                <Typography
                    sx={{
                        py: 0.25,
                        px: 0.5,
                        textAlign: "center",
                        fontSize: "0.8125rem",
                        color,
                        backgroundColor,
                        borderRadius: 1,
                    }}
                >
                    {count}
                </Typography>
            )}
        </Box>
    );
};

export default SearchTripForm;
