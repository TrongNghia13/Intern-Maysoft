import { Star } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { Box } from "@maysoft/common-component-react";

import Helpers from "@src/commons/helpers";
import ModalPolicyStay from "./modalPolicyStay";
import CardDetailPolicyStay from "./cardDetailPolicyStay";
import CardItemCriteriaDetail from "./cardItemCriteriaDetail";


export const BoxStar = (props: {
    number: number,
    onChange?: (value: number) => void;
}) => {
    return <Box sx={{ display: "flex", alignItems: "center" }}>
        {
            Helpers.isFunction(props.onChange)
                ? Array.from({ length: 5 }).map((el, index) => (
                    <IconButton sx={{ p: "2px" }} key={index} onClick={() => {
                        Helpers.isFunction(props.onChange) &&
                            props.onChange(index + 1)
                    }}>
                        <Star htmlColor={(props.number < (index + 1)) ? "#808387" : "#FAAD14"} />
                    </IconButton>
                ))
                : Array.from({ length: props.number }).map((el, index) => (
                    <Star key={index} htmlColor="#FAAD14" />
                ))
        }
    </Box>
}

export {
    ModalPolicyStay,
    CardDetailPolicyStay,
    CardItemCriteriaDetail,
}