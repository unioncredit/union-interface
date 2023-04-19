import { Helmet } from "react-helmet";
import { Layout } from "@unioncredit/ui";

import StakeStats from "components/stake/StakeStats";
import BorrowersCard from "components/stake/BorrowersCard";
import { CreditSegmentedControl } from "components/shared/CreditSegmentedControl";
import RewardStats from "components/stake/RewardStats";

export default function StakePage() {
  return (
    <>
      <Helmet>
        <title>Stake | Union Credit Protocol</title>
      </Helmet>
      <Layout.Columned align="center" maxw="653px">
        <CreditSegmentedControl active={1} />
        <StakeStats />
        <RewardStats />
        <BorrowersCard />
      </Layout.Columned>
    </>
  );
}
