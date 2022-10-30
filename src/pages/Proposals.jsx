import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { Box, ToggleMenu } from "@unioncredit/ui";

import Header from "components/shared/Header";
import ProposalsCard from "components/governance/ProposalsCard";
import NetworkNotice from "components/governance/NetworkNotice";

export default function ProposalsPage() {
  return (
    <>
      <Helmet>
        <title>Proposals | Union Credit Protocol</title>
      </Helmet>
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
          initialActive={1}
        />
      </Box>
      <Box fluid justify="center" direction="vertical" mb="120px">
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
