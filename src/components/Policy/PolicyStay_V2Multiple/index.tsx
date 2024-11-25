import { Star } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { Box } from "@maysoft/common-component-react";

import Helpers from "@src/commons/helpers";
import ModalPolicyStay_V2Multiple from "./modalPolicyStay_V2Multiple";
import CardDetailPolicyStay_V2Multiple from "./cardDetailPolicyStay_V2Multiple";
import CardItemCriteriaDetail_V2Multiple from "./cardItemCriteriaDetail_V2Multiple";


export const BoxStar = (props: {
    number: number,
    onChange?: (value: number) => void;
}) => {
    return <Box sx={{ display: "flex", alignItems: "center" }}>
        {

            Array.from({ length: 5 }).map((el, index) => (
                <IconButton
                    key={index}
                    sx={{
                        p: "2px",
                        cursor: !Helpers.isFunction(props.onChange) ? "default" : "pointer"
                    }}
                    disabled={!Helpers.isFunction(props.onChange)}
                    onClick={() => {
                        Helpers.isFunction(props.onChange) &&
                            props.onChange(index + 1)
                    }}
                >
                    <Star htmlColor={(props.number < (index + 1)) ? "#808387" : "#FAAD14"} />
                </IconButton>
            ))
        }
    </Box>
}

export {
    ModalPolicyStay_V2Multiple,
    CardDetailPolicyStay_V2Multiple,
    CardItemCriteriaDetail_V2Multiple,
}