import { Link } from "react-router-dom";
import { Box, ToggleMenu } from "@unioncredit/ui";

import Header from "components/shared/Header";
import GovernaceStats from "components/governance/GovernanceStats";
import ProposalsCard from "components/governance/ProposalsCard";
import MyGovernanceStats from "components/governance/MyGovernanceStats";

const filterActiveProposals = (proposal) => proposal.state <= 1;

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
        <GovernaceStats />
        <MyGovernanceStats />
        <ProposalsCard
          filter={filterActiveProposals}
          emptyLabel="There are no live proposals"
        />
      </Box>
    </>
  );
}
