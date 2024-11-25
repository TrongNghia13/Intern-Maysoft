import { useTranslation } from "react-i18next";
import { Card, IconButton } from "@mui/material";
import { Box, Typography } from "@maysoft/common-component-react";
import { Flight, HotelOutlined, KeyboardArrowDownOutlined, KeyboardArrowUpOutlined } from "@mui/icons-material";

import DropdownActionPolicy from "./dropdownActionPolicy";

import { ItineraryType } from "@src/commons/enum";
import { CardDetailPolicyStay } from "./PolicyStay";
import { CardDetailPolicyFlight } from "./PolicyFlight";
import useDataPolicy, { IPolicyCriteria, IRecordPolicy } from "@src/hooks/useDataPolicy.hook";
import { ICodename } from "@src/commons/interfaces";
import { CardDetailPolicyFlight_V2Multiple } from "./PolicyFlight_V2Multiple";
import { CardDetailPolicyStay_V2Multiple } from "./PolicyStay_V2Multiple";



export interface IPropsItemPolicy {
    hidenUpdate?: boolean,
    hidenDelete?: boolean,
    hidenCreate?: boolean,

    listAriLines: ICodename[],
    listStaySelected: ICodename[],
    listFlightSelected: ICodename[],

    listIdOpen: string[];
    setListIdOpen: React.Dispatch<React.SetStateAction<string[]>>;

    onDelete: (id: string) => void;
    onArchive: (id: string) => void;
    onEdit: (item: IRecordPolicy) => void;
    onCoppy: (item: IRecordPolicy) => void;

    onEditPolicyStay: (data: Map<string, IPolicyCriteria>) => void;
    onEditPolicyFlight: (data: Map<string, IPolicyCriteria>) => void;
}

const CardItemPolicy = ({
    item,

    hidenDelete,
    hidenUpdate,
    hidenCreate,

    listAriLines,
    listStaySelected,
    listFlightSelected,

    hidenFlightTime,
    hidenBookingTime,

    onEditPolicyStay,
    onEditPolicyFlight,

    listIdOpen,
    setListIdOpen,

    onEdit,
    onCoppy,
    onDelete,
    onArchive,

}: IPropsItemPolicy & {
    item: IRecordPolicy;
    hidenFlightTime?: boolean;
    hidenBookingTime?: boolean;
}) => {
    const {
        t,
        i18n: { language },
    } = useTranslation(["common", "setting"]);

    const { getPolicyCriteriaByType } = useDataPolicy();

    const checkOpenById = (id: string) => {
        return (listIdOpen.findIndex(el => el === id) !== -1);
    }

    const handleOpenById = (id: string) => {
        const index = listIdOpen.findIndex(el => el === id);
        if (index === -1) {
            setListIdOpen(prev => ([...prev, id]))
        } else {
            setListIdOpen(prev => {
                const newList = [...prev || []].filter(el => el !== id);
                return newList;
            });
        }
    }

    return (
        <Card>
            <Box sx={{
                padding: 2,
                width: "100%",
            }}>
                <Box sx={{
                    padding: 2,
                    paddingTop: 0,
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}>
                    <Box sx={{ minWidth: 80 }} >
                        <Typography variant="h6">{item.name?.value?.[language]}</Typography>
                    </Box>
                    <Box sx={{ gap: 2, display: "flex", flexWrap: "wrap", alignItems: "center", marginLeft: "auto" }} >
                        <Typography variant="button">{"ID: " + item.id}</Typography>

                        {/* Button Action */}
                        <DropdownActionPolicy
                            onEdit={!hidenUpdate ? () => { onEdit(item) } : undefined}
                            onCoppy={!hidenCreate ? () => { onCoppy(item) } : undefined}
                            onDelete={!hidenDelete ? () => { onDelete(item.id) } : undefined}
                        // onArchive={!hidenUpdate ? () => { onArchive(item.id) } : undefined}
                        />
                    </Box>
                </Box>
                <Box sx={{
                    paddingTop: 2,
                    borderTop: "1px #7b809a solid",
                }}>
                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                            justifyContent: "space-between",
                            borderBottom: "1px #d9d9d9 solid",
                            "&:hover": { cursor: "pointer", },
                        }}
                        onClick={() => { handleOpenById(`${item.id}_flight`) }}
                    >
                        <Box sx={{ gap: 1, py: 2, display: "flex", flexWrap: "wrap", alignItems: "center", }} >
                            <Flight />
                            <Typography variant="button" fontWeight="bold" >{t("setting:policy.flight")}</Typography>
                        </Box>
                        <IconButton>
                            {checkOpenById(`${item.id}_flight`)
                                ? <KeyboardArrowDownOutlined />
                                : <KeyboardArrowUpOutlined />
                            }
                        </IconButton>
                    </Box>
                    {
                        checkOpenById(`${item.id}_flight`) &&
                        <Box p={2}>
                            <CardDetailPolicyFlight_V2Multiple
                                key={`${item.updateTime}_flight`}

                                hidenUpdate={hidenUpdate}
                                hidenFlightTime={hidenFlightTime}
                                hidenBookingTime={hidenBookingTime}

                                listAriLines={listAriLines}
                                listFlightSelected={listFlightSelected}

                                data={
                                    getPolicyCriteriaByType({
                                        data: item.policyCriterias,
                                        type: ItineraryType.Flight,
                                    })
                                }

                                onEditPolicyFlight={onEditPolicyFlight}
                            />
                        </Box>
                    }

                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                            justifyContent: "space-between",
                            borderBottom: "1px #d9d9d9 solid",
                            "&:hover": { cursor: "pointer", },
                        }}
                        onClick={() => { handleOpenById(`${item.id}_hotel`) }}
                    >
                        <Box sx={{ gap: 1, py: 2, display: "flex", flexWrap: "wrap", alignItems: "center", }} >
                            <HotelOutlined />
                            <Typography variant="button" fontWeight="bold" >{t("setting:policy.hotel")}</Typography>
                        </Box>
                        <IconButton>
                            {checkOpenById(`${item.id}_hotel`)
                                ? <KeyboardArrowDownOutlined />
                                : <KeyboardArrowUpOutlined />
                            }
                        </IconButton>
                    </Box>

                    {
                        checkOpenById(`${item.id}_hotel`) &&
                        <Box p={2}>
                            <CardDetailPolicyStay_V2Multiple
                                hidenUpdate={hidenUpdate}
                                hidenBookingTime={hidenBookingTime}

                                key={`${item.updateTime}_hotel`}
                                listStaySelected={listStaySelected}
                                data={
                                    getPolicyCriteriaByType({
                                        data: item.policyCriterias,
                                        type: ItineraryType.Hotel,
                                    })
                                }
                                onEditPolicyStay={onEditPolicyStay}
                            />
                        </Box>
                    }
                </Box>
            </Box>
        </Card>
    );
};

export default CardItemPolicy;