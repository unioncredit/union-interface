import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { useNetwork } from "wagmi";
import { Box, ToggleMenu } from "@unioncredit/ui";
import { mainnet } from "wagmi/chains";

import GovernaceStats from "components/governance/GovernanceStats";
import ProposalsCard from "components/governance/ProposalsCard";
import MyGovernanceStats from "components/governance/MyGovernanceStats";
import NetworkNotice from "components/governance/NetworkNotice";

const filterActiveProposals = (proposal) => proposal.state <= 1;

export default function GovernancePage() {
  const { chain: connectedChain } = useNetwork();

  return (
    <>
      <Helmet>
        <title>Governance | Union Credit Protocol</title>
      </Helmet>
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
      <Box fluid justify="center" direction="vertical">
        <NetworkNotice />
        <GovernaceStats />
        {connectedChain?.id === mainnet.id && <MyGovernanceStats />}
        <ProposalsCard
          filter={filterActiveProposals}
          emptyLabel="There are no live proposals"
        />
      </Box>
    </>
  );
}
