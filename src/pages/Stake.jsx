import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { Box, ToggleMenu } from "@unioncredit/ui";

import StakeStats from "components/stake/StakeStats";
import NewVouchCard from "components/stake/NewVouchCard";
import BorrowersCard from "components/stake/BorrowersCard";

export default function StakePage() {
  return (
    <>
      <Helmet>
        <title>Stake | Union Credit Protocol</title>
      </Helmet>
      <Box justify="center" fluid mb="24px">
        <ToggleMenu
          className="ToggleMenu"
          items={[
            { id: "borrow", label: "Borrow", to: "/", as: Link },
            { id: "stake", label: "Stake", to: "/stake", as: Link },
          ]}
          initialActive={1}
        />
      </Box>
      <Box fluid justify="center" direction="vertical" mb="120px">
        <StakeStats />
        <NewVouchCard />
        <BorrowersCard />
      </Box>
    </>
  );
}
