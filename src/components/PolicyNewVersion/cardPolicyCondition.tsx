import { useMemo } from "react";
import { useTranslation } from "next-i18next";
import { AddOutlined, DeleteForever, Edit, InfoOutlined } from "@mui/icons-material";
import { Box, Button, DataTableBodyCell, Typography } from "@maysoft/common-component-react";
import { IconButton, Table, TableBody, TableContainer, TableRow, Tooltip } from "@mui/material";

import Helpers from "@src/commons/helpers";
import { ICodename } from "@src/commons/interfaces";
import { ItineraryType, Mode, PolicyCriteriaCode } from "@src/commons/enum";
import { ICriterum, IPolicyCriteriaDetail } from "@src/hooks/useDataPolicy.hook";



interface IPolicyConditionProps {
    mode: Mode,
    type: ItineraryType,
    listAddress: ICodename[];
    listAirport: ICodename[];
    listAriLines: ICodename[];
    listCabinClass: ICodename[];
    listBookingType: ICodename[];
    onDetail?: (data: {
        mode: Mode,
        idCriteria: string,
        idCriteriaDetail: string,
    }) => void;
    onDelete?: (data: {
        idCriteria: string,
        idCriteriaDetail: string,
    }) => void;
}

const CardPolicyCondition = (props: {
    isDomestic: boolean;
    policyCriterias: ICriterum[];
    onCreate?: (data: {
        type: ItineraryType,
        settingCode: string,
    }) => void;
} & IPolicyConditionProps) => {
    const {
        t,
        i18n: { language },
    } = useTranslation(["common", "setting"]);

    const settingCode = useMemo(() => (
        props.isDomestic ? PolicyCriteriaCode.Domestic : PolicyCriteriaCode.International
    ), [props.isDomestic]);

    const newDataRows: IPolicyCriteriaDetail[] = useMemo(() => {
        let listRows: IPolicyCriteriaDetail[] = [];

        props.policyCriterias?.forEach((item, index) => {
            if ((item.settingCode === settingCode)
                && (item.policyCriteriaType === props.type)) {
                listRows = [...listRows || [], ...item.policyCriteriaDetail || []];
            }
        });

        return listRows;
    }, [props.policyCriterias, props.type, settingCode]);

    let textTitle = useMemo(() => {
        let text = "";

        if (props.type === ItineraryType.Flight) {
            text = props.isDomestic
                ? t("setting:policy.flight_domestic")
                : t("setting:policy.flight_international");
        }

        if (props.type === ItineraryType.Hotel) {
            text = props.isDomestic
                ? t("setting:policy.hotel_domestic")
                : t("setting:policy.hotel_international");
        }

        return text;
    }, [props.isDomestic, props.type]);

    return (
        <>
            <Box paddingBottom={2}>
                <Box sx={{
                    gap: 2,
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}>
                    <Typography variant="button" fontWeight="bold">
                        {textTitle}
                    </Typography>
                    {
                        (newDataRows.length > 0) &&
                        (props.mode !== Mode.View) &&
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
                                    }
                                }
                            }}
                            onClick={() => {
                                props.onCreate
                                    && props.onCreate({
                                        type: props.type,
                                        settingCode: settingCode,
                                    });
                            }}
                        >
                            <AddOutlined />
                            <Typography variant="button" color="info" >{t("common:add")}</Typography>
                        </Box>
                    }
                </Box>

                {(newDataRows.length > 0) &&
                    <RenderTableCondition
                        newDataRows={newDataRows}
                        {...props}
                    />
                }

                {(newDataRows.length === 0) &&
                    <Box sx={{
                        gap: 2,
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        flexDirection: "column",
                        justifyContent: "center",
                    }}>
                        <Typography variant="button">
                            {t("setting:policy.no_conditions_policy")}
                        </Typography>
                        {(props.mode !== Mode.View) &&
                            <Button
                                color="info"
                                variant="outlined"
                                onClick={() => {
                                    props.onCreate
                                        && props.onCreate({
                                            type: props.type,
                                            settingCode: settingCode,
                                        });
                                }}
                            >
                                {t("setting:policy.add_condition")}
                            </Button>
                        }
                    </Box>
                }
            </Box>
        </>
    );
};

export default CardPolicyCondition;

export const RenderTableCondition = (props: { newDataRows: IPolicyCriteriaDetail[]; } & IPolicyConditionProps) => {
    const {
        t,
        i18n: { language },
    } = useTranslation(["common", "setting"]);

    let columnsHeader: JSX.Element[] = useMemo(() => {
        let columnsTemp: JSX.Element[] = [
            <DataTableBodyCell key={"h_bookingBudget"} borderColor="#9F9F9F" >
                <Typography variant="caption" color="secondary"> {t("setting:budget.budget")} </Typography>
            </DataTableBodyCell>,

            <DataTableBodyCell key={"h_action"} borderColor="#9F9F9F" >
                <Typography variant="caption" color="secondary"> {t("common:action")} </Typography>
            </DataTableBodyCell>,
        ];

        if (props.type === ItineraryType.Flight) {
            columnsTemp = [
                <DataTableBodyCell key={"h_bookingType"} borderColor="#9F9F9F">
                    <Typography variant="caption" color="secondary"> {t("setting:policy.flight")} </Typography>
                </DataTableBodyCell>,
                <DataTableBodyCell key={"h_flightTime"} borderColor="#9F9F9F" >
                    <Typography variant="caption" color="secondary"> {t("setting:policy.flight_time_below")} </Typography>
                </DataTableBodyCell>,
                <DataTableBodyCell key={"h_carrier"} borderColor="#9F9F9F" >
                    <Typography variant="caption" color="secondary"> {t("setting:policy.flight_class")} </Typography>
                </DataTableBodyCell>,
                <DataTableBodyCell key={"h_cabinClass"} borderColor="#9F9F9F" >
                    <Typography variant="caption" color="secondary"> {t("setting:policy.cabin_class")} </Typography>
                </DataTableBodyCell>,
                ...columnsTemp || [],
            ];
        };

        if (props.type === ItineraryType.Hotel) {
            columnsTemp = [
                <DataTableBodyCell key={"h_from"} borderColor="#9F9F9F">
                    <Typography variant="caption" color="secondary"> {t("setting:policy.point")} </Typography>
                </DataTableBodyCell>,
                <DataTableBodyCell key={"h_starRating"} borderColor="#9F9F9F" >
                    <Typography variant="caption" color="secondary"> {t("setting:policy.maximum_star_rating")} </Typography>
                </DataTableBodyCell>,
                ...columnsTemp || [],
            ];
        };

        return columnsTemp;
    }, [props.type]);

    return (
        <>
            <TableContainer sx={{ boxShadow: "none" }}>
                <Table>
                    <Box component="thead">
                        <TableRow>
                            {columnsHeader}
                        </TableRow>
                    </Box>
                    <TableBody>
                        {props.newDataRows.map(item => (
                            <RenderItemCondition
                                key={item.id}
                                newItemRows={item}
                                {...props}
                            />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
};

export const RenderItemCondition = ({
    mode, type,
    newItemRows,
    listAddress,
    listAirport,
    listAriLines,
    listCabinClass,
    listBookingType,
    onDelete, onDetail,
}: {
    newItemRows: IPolicyCriteriaDetail;
} & IPolicyConditionProps) => {
    const {
        t,
        i18n: { language },
    } = useTranslation(["common", "setting"]);

    let columnsBody = useMemo(() => {
        let columnsTemp = [
            <DataTableBodyCell key={"b_bookingBudget"} borderColor="#E4EBF7">
                <Typography variant="caption">
                    {`${Helpers.formatCurrency(newItemRows.bookingBudget || 0)}`}
                </Typography>
            </DataTableBodyCell>,
            <DataTableBodyCell key={"b_action"} borderColor="#E4EBF7">
                {(mode !== Mode.View) &&
                    <Box sx={{
                        display: "flex",
                        alignItems: "center",
                    }}>
                        <Tooltip title={t("common:edit")}>
                            <IconButton onClick={() => {
                                onDetail &&
                                    onDetail({
                                        mode: mode,
                                        idCriteria: newItemRows.criteriaId || "",
                                        idCriteriaDetail: newItemRows.id || "",
                                    })
                            }}>
                                <Edit />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={t("common:delete")}>
                            <IconButton onClick={() => {
                                onDelete &&
                                    onDelete({
                                        idCriteria: newItemRows.criteriaId || "",
                                        idCriteriaDetail: newItemRows.id || "",
                                    })
                            }}>
                                <DeleteForever color="error" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                }
                {(mode === Mode.View) &&
                    <Tooltip title={t("common:detail")}>
                        <IconButton onClick={() => {
                            onDetail &&
                                onDetail({
                                    mode: mode,
                                    idCriteria: newItemRows.criteriaId || "",
                                    idCriteriaDetail: newItemRows.id || "",
                                });
                        }}>
                            <InfoOutlined />
                        </IconButton>
                    </Tooltip>
                }
            </DataTableBodyCell>
        ];

        if (type === ItineraryType.Flight) {
            columnsTemp = [
                <DataTableBodyCell key={"b_bookingType"} borderColor="#E4EBF7">
                    <Typography variant="caption">
                        {listBookingType.find(el => el.code === newItemRows?.bookingType)?.name || ""}
                    </Typography>
                </DataTableBodyCell>,
                <DataTableBodyCell key={"b_flightTime"} borderColor="#E4EBF7">
                    <Typography variant="caption">
                        {`${newItemRows.compareNumber || 0} ${t("setting:policy.hourt")}`}
                    </Typography>
                </DataTableBodyCell>,
                <DataTableBodyCell key={"b_carrier"} borderColor="#E4EBF7">
                    <Box width={"110px"} sx={{
                        width: "110px",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                    }}>
                        <Typography variant="caption">
                            {
                                newItemRows.carrier
                                    ? listAriLines
                                        .filter(el => (newItemRows.carrier?.split(",")?.findIndex(c => c === (el.code as string)) !== -1))
                                        .map(val => val.name)
                                        .join(", ")
                                    : listAriLines?.[0]?.name
                            }
                        </Typography>
                    </Box>
                </DataTableBodyCell>,
                <DataTableBodyCell key={"b_cabinClass"} borderColor="#E4EBF7">
                    <Typography variant="caption">
                        {listCabinClass.find(el => el.code === newItemRows.cabinClass)?.name || ""}
                    </Typography>
                </DataTableBodyCell>,
                ...columnsTemp || [],
            ];
        };

        if (type === ItineraryType.Hotel) {
            columnsTemp = [
                <DataTableBodyCell key={"b_from"} borderColor="#E4EBF7">
                    <Box width={"250px"} sx={{
                        width: "250px",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                    }}>
                        <Typography variant="caption">
                            {
                                newItemRows.from
                                    ? listAddress
                                        .filter(el => (newItemRows.from?.split(",")?.findIndex(c => c === (el.code as string)) !== -1))
                                        .map(val => val.name)
                                        .join(", ")
                                    : listAddress?.[0]?.name
                            }
                        </Typography>
                    </Box>
                </DataTableBodyCell>,
                <DataTableBodyCell key={"b_starRating"} borderColor="#E4EBF7">
                    <Typography variant="caption">
                        {`${newItemRows.starRating || 0} sao`}
                    </Typography>
                </DataTableBodyCell>,
                ...columnsTemp || [],
            ];
        };

        return columnsTemp;
    }, [
        mode, type, newItemRows,
        listAddress,
        listAriLines,
        listCabinClass,
        listBookingType,
    ]);

    return (<TableRow>{columnsBody}</TableRow>);
};