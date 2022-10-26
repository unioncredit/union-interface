import { Card, Steps } from "@unioncredit/ui";
import { chain } from "wagmi";

import { blockExplorerTx } from "utils/blockExplorer";

function getStepItems(data) {
  if (!data) return [];

  return data.map((item) => {
    const date = new Date(Number(item.timestamp * 1000));
    const subTitle = `${date.toDateString()} ${date.getHours()}:${date.getMinutes()}`;
    const hash = item.id ? item.id.split("-")?.[0] : false;
    const href = hash && blockExplorerTx(chain.mainnet.id, hash);

    if (item.action === "queued") {
      return { title: "Queued for Execution", subTitle, color: "blue", href };
    } else if (item.action === "proposed") {
      return { title: "Proposed", subTitle, color: "blue", href };
    } else if (item.action === "executed") {
      return { title: "Executed", subTitle, color: "green", href };
    } else if (item.action === "votingStarted") {
      return { title: "Queued For Voting", subTitle, color: "purple", href };
    } else {
      return {};
    }
  });
}

export default function ProposalHistoryCard({ data = [] }) {
  return (
    <Card>
      <Card.Header title="History" />
      <Card.Body>
        {data.length > 0 ? <Steps items={getStepItems(data)} /> : "No history"}
      </Card.Body>
    </Card>
  );
}
