import "./ProtocolData.scss";

import { Card, Select } from "@unioncredit/ui";
import { networks } from "config/networks";
import { useState } from "react";
import { useNetwork } from "wagmi";
import { ProtocolBalances } from "components/dao/protocol/ProtocolBalances";
import { ProtocolLimits } from "components/dao/protocol/ProtocolLimits";
import { ProtocolFees } from "components/dao/protocol/ProtocolFees";
import { ProtocolPeriods } from "components/dao/protocol/ProtocolPeriods";
import { useProtocolData } from "providers/ProtocolData";
import { Versions } from "providers/Version";

export default function ProtocolData() {
  const { chain: connectedChain } = useNetwork();
  const [network, setNetwork] = useState(
    [...networks[Versions.V1], ...networks[Versions.V2]].find(
      (network) => network.chainId === connectedChain?.id
    ) || networks[Versions.V1][0]
  );

  const { data: protocol = {} } = useProtocolData(network.chainId);
  return (
    <Card className="ProtocolData">
      <Card.Header
        title="Protocol Data & Parameters"
        action={
          <Select
            options={[...networks[Versions.V1], ...networks[Versions.V2]]}
            defaultValue={network}
            onChange={(option) => setNetwork(option)}
          />
        }
      />

      <Card.Body>
        <ProtocolBalances protocol={protocol} />
        <ProtocolLimits mt="16px" protocol={protocol} />
        <ProtocolFees mt="16px" protocol={protocol} chainId={network.chainId} />
        <ProtocolPeriods mt="16px" protocol={protocol} chainId={network.chainId} />
      </Card.Body>
    </Card>
  );
}
