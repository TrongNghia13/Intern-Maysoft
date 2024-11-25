import { Typography } from "@maysoft/common-component-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import Constants from "@src/constants";

import { ICodename } from "@src/commons/interfaces";
import { CheckBoxWithLabel } from "../CheckBoxWithLabel";
import { FilterBox } from "./fragment";

const MultipleSelect = (props: { title: string; data: ICodename[]; idsSelected: string[]; onSelect: (item: ICodename) => void }) => {
    const { t } = useTranslation("common");

    const [expanded, setExpanded] = useState<boolean>(false);

    return (
        <FilterBox title={props.title}>
            <>
                {(expanded ? props.data : [...props.data].splice(0, 3)).map((item, index) => (
                    <CheckBoxWithLabel
                        key={index}
                        label={item.name}
                        description={item.detail?.description}
                        checked={props.idsSelected.includes(item.code.toString())}
                        onClick={() => {
                            props.onSelect(item);
                        }}
                    />
                ))}
                {props.data.length > 3 && (
                    <Typography
                        sx={(theme) => ({
                            fontSize: Constants.FONT_SIZE.TEXT,
                            color: theme.palette.primary.main,
                            "&:hover": {
                                textDecoration: "underline",
                                cursor: "pointer",
                            },
                        })}
                        onClick={() => setExpanded((prev) => !prev)}
                    >
                        {expanded ? t("see_less") : t("see_more")}
                    </Typography>
                )}
            </>
        </FilterBox>
    );
};

export default MultipleSelect;
