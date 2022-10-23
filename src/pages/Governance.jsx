import { Link } from "react-router-dom";
import { Box, ToggleMenu } from "@unioncredit/ui";

import Header from "components/shared/Header";

export default function GovernancePage() {
  return (
    <>
      <Header />
      <Box justify="center" fluid mb="24px">
        <ToggleMenu
          className="ToggleMenu"
          items={[
            { id: "overview", label: "Overview", to: "/governance", as: Link },
            {
              id: "proposal",
              label: "Proposal",
              to: "/governance/proposals",
              as: Link,
            },
          ]}
          initialActive={0}
        />
      </Box>
      <Box fluid justify="center" direction="vertical" mb="120px">
        ...
      </Box>
    </>
  );
}
