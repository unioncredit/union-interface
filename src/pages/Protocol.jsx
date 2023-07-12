import { useNetwork } from "wagmi";
import { mainnet } from "wagmi/chains";
import { Helmet } from "react-helmet";

import ProtocolData from "components/dao/protocol/ProtocolData";
import GovernanceOverview from "components/dao/protocol/GovernanceOverview";

export default function ProtocolPage() {
  const { chain } = useNetwork();

  return (
    <>
      <Helmet>
        <title>Protocol | Union Credit Protocol</title>
      </Helmet>

      <ProtocolData />
      {chain?.id === mainnet.id && <GovernanceOverview />}
    </>
  );
}
