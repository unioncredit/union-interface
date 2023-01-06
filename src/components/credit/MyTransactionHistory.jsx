import { useAccount } from "wagmi";
import { Card, Box } from "@unioncredit/ui";

import { TransactionHistory } from "components/shared/TxHistory";

export default function MyTransactionHistory() {
  const { address } = useAccount();

  return (
    <Card mt="24px">
      <Card.Header
        title="Transaction History"
        subTitle="Your credit based transaction history"
      />
      <TransactionHistory staker={address} />
    </Card>
  );
}
