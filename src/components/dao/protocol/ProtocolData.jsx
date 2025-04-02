import "./ProtocolData.scss";

import { Card, Select } from "@unioncredit/ui";
import { allNetworks } from "config/networks";
import { useState } from "react";
import { useAccount } from "wagmi";
import { ProtocolBalances } from "components/dao/protocol/ProtocolBalances";
import { ProtocolLimits } from "components/dao/protocol/ProtocolLimits";
import { ProtocolFees } from "components/dao/protocol/ProtocolFees";
import { ProtocolPeriods } from "components/dao/protocol/ProtocolPeriods";
import { useProtocolData } from "providers/ProtocolData";

export default function ProtocolData() {
  const { chain: connectedChain } = useAccount();

  const [network, setNetwork] = useState(
    allNetworks.find((network) => network.chainId === connectedChain?.id) || allNetworks[0]
  );

  const { data: protocol = {} } = useProtocolData(network.chainId);
  return (
    <Card className="ProtocolData">
      <Card.Header
        title="Protocol Data & Parameters"
        action={
          <Select
            options={allNetworks.map((n) => ({ ...n, label: n.labelWithVersion }))}
            defaultValue={network}
            onChange={(option) => setNetwork(option)}
          />
        }
      />

      <Card.Body>
        <ProtocolBalances protocol={protocol} chainId={network.chainId} />
        <ProtocolLimits mt="16px" protocol={protocol} chainId={network.chainId} />
        <ProtocolFees mt="16px" protocol={protocol} chainId={network.chainId} />
        <ProtocolPeriods mt="16px" protocol={protocol} chainId={network.chainId} />
      </Card.Body>
    </Card>
  );
}
