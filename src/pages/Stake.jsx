import { Helmet } from "react-helmet";

import StakeStats from "components/stake/StakeStats";
import BorrowersCard from "components/stake/BorrowersCard";
import RewardStats from "components/stake/RewardStats";

export default function StakePage() {
  return (
    <>
      <Helmet>
        <title>Stake | Union Credit Protocol</title>
      </Helmet>

      <StakeStats />
      <RewardStats />
      <BorrowersCard />
    </>
  );
}
