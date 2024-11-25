import React from "react";
import { styled } from "@mui/material/styles";
import { Pagination as MuiPagination, PaginationProps } from "@mui/material";

const StyledPagination = styled(MuiPagination)({
  ".MuiPagination-ul": {
    ".Mui-selected": {
      color: "#fff",
    },
  },
});

export const Pagination: React.FC<PaginationProps> = (
  props: PaginationProps
) => {
  return (
    <div className="d-flex justify-content-start align-items-center">
      <StyledPagination
        color="primary"
        showFirstButton
        showLastButton
        {...props}
      />
    </div>
  );
};

export default Pagination;
