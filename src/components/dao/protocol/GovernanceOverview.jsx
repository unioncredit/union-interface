import "./ProtocolData.scss";

import { Card } from "@unioncredit/ui";
import { chain } from "wagmi";
import { useProtocolData } from "providers/ProtocolData";
import { ProposalData } from "components/dao/protocol/ProposalData";
import { ProposalStages } from "components/dao/protocol/ProposalStages";

export default function GovernanceOverview() {
  const { data: protocol = {} } = useProtocolData(chain.mainnet.id);

  return (
    <Card mt="24px" className="ProtocolData">
      <Card.Header title="DAO Governance Overview" />

      <Card.Body>
        <ProposalData protocol={protocol} />
        <ProposalStages mt="24px" protocol={protocol} />
      </Card.Body>
    </Card>
  );
}
