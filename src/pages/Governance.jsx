import { Helmet } from "react-helmet";
import { Layout } from "@unioncredit/ui";

import ProposalsCard from "components/governance/ProposalsCard";
import MyGovernanceStats from "components/governance/MyGovernanceStats";
import { DaoSegmentedControl } from "components/shared/DaoSegmentedControl";

export default function GovernancePage() {
  return (
    <>
      <Helmet>
        <title>Governance | Union Credit Protocol</title>
      </Helmet>

      <Layout.Columned align="center" maxw="652px">
        <DaoSegmentedControl active={0} />

        <MyGovernanceStats />

        <ProposalsCard emptyLabel="There are no live proposals" />
      </Layout.Columned>
    </>
  );
}
