import { Helmet } from "react-helmet";

import ProposalsCard from "components/dao/ProposalsCard";
import MyGovernanceStats from "components/dao/MyGovernanceStats";

export default function GovernancePage() {
  return (
    <>
      <Helmet>
        <title>Governance | Union Credit Protocol</title>
      </Helmet>

      <MyGovernanceStats />
      <ProposalsCard emptyLabel="There are no live proposals" />
    </>
  );
}
