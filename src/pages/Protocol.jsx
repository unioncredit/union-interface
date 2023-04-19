import { Helmet } from "react-helmet";
import { Layout } from "@unioncredit/ui";
import { DaoSegmentedControl } from "components/shared/DaoSegmentedControl";
import ProtocolData from "components/dao/protocol/ProtocolData";
import GovernanceOverview from "components/dao/protocol/GovernanceOverview";

export default function ProtocolPage() {
  return (
    <>
      <Helmet>
        <title>Protocol | Union Credit Protocol</title>
      </Helmet>

      <Layout.Columned maxw="653px">
        <DaoSegmentedControl active={1} />

        <ProtocolData />
        <GovernanceOverview />
      </Layout.Columned>
    </>
  );
}
