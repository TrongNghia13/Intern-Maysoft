import { Box } from "@maysoft/common-component-react";

import { Container } from "@src/components";

const BaseLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Container
      maxWidth={false}
      sx={{
        // my: 10,
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Box sx={{ minHeight: "50vh", pb: 3 }}>
        <Box width={"1200px"} p={3}>
          {children}
        </Box>
      </Box>
    </Container>
  );
};

export default BaseLayout;
