import { useAccount } from "wagmi";
import { Card } from "@unioncredit/ui";

import { TransactionHistory } from "components/shared";

export default function ActivityTable() {
  const { address } = useAccount();

  return (
    <Card w="100%" maxw="none" mt="24px">
      <Card.Header mb="24px" title="Your Activity" />

      <TransactionHistory staker={address} />
    </Card>
  );
}
