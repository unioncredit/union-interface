import { Helmet } from "react-helmet";
import { Layout } from "@unioncredit/ui";
import { DaoSegmentedControl } from "components/shared/DaoSegmentedControl";
import ProtocolData from "components/dao/protocol/ProtocolData";
import GovernanceOverview from "components/dao/protocol/GovernanceOverview";
import { useNetwork } from "wagmi";
import { mainnet } from "wagmi/chains";

export default function ProtocolPage() {
  const { chain } = useNetwork();

  return (
    <>
      <Helmet>
        <title>Protocol | Union Credit Protocol</title>
      </Helmet>

      <Layout.Columned maxw="653px">
        <DaoSegmentedControl active={1} />

        <ProtocolData />

        {chain.id === mainnet.id && (
          <GovernanceOverview />
        )}
      </Layout.Columned>
    </>
  );
}
