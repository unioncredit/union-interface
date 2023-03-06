import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { Box, SegmentedControl } from "@unioncredit/ui";

import ProposalsCard from "components/governance/ProposalsCard";
import NetworkNotice from "components/governance/NetworkNotice";

export default function ProposalsPage() {
  return (
    <>
      <Helmet>
        <title>Proposals | Union Credit Protocol</title>
      </Helmet>
      <Box justify="center" fluid mb="24px">
        <SegmentedControl
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
          initialActive={1}
        />
      </Box>
      <Box fluid justify="center" direction="vertical">
        <NetworkNotice />
        <ProposalsCard
          showAction={false}
          title="All Proposals"
          subTitle={false}
        />
      </Box>
    </>
  );
}
