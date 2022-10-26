import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { Box, ToggleMenu } from "@unioncredit/ui";

import Header from "components/shared/Header";
import CreditStats from "components/credit/CreditStats";
import ShareCard from "components/credit/ShareCard";
import VouchersCard from "components/credit/VouchersCard";
import MyTransactionHistory from "components/credit/MyTransactionHistory";

export default function CreditPage() {
  return (
    <>
      <Helmet>
        <title>Credit | Union Credit Protocol</title>
      </Helmet>
      <Header />
      <Box justify="center" fluid mb="24px">
        <ToggleMenu
          className="ToggleMenu"
          items={[
            { id: "borrow", label: "Borrow", to: "/", as: Link },
            { id: "stake", label: "Stake", to: "/stake", as: Link },
          ]}
          initialActive={0}
        />
      </Box>
      <Box fluid justify="center" direction="vertical" mb="120px">
        <CreditStats />
        <ShareCard
          content="Get more Union vouches to increase your total available credit."
          buttonProps={{ label: "Get vouch link" }}
        />
        <VouchersCard />
        <MyTransactionHistory />
      </Box>
    </>
  );
}
