import { Policy as PolicyIcon } from "@mui/icons-material";
import { Chip } from "@mui/material";

export const PolicyComplianceText = ({ isInPolicy }: { isInPolicy?: boolean }) => {
    const inPolicyLabel = <><PolicyIcon />&nbsp;Trong chính sách</>
    const outPolicyLabel = <><PolicyIcon />&nbsp;Ngoài chính sách</>
    return (<Chip color={isInPolicy ? "info" : "warning"} label={isInPolicy ? inPolicyLabel : outPolicyLabel} style={{ color: "white" }}/>);
}

export default PolicyComplianceText;