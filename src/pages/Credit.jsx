import { Box } from "@unioncredit/ui";

import Header from "components/shared/Header";
import CreditStats from "components/credit/CreditStats";
import ShareCard from "components/credit/ShareCard";

export default function CreditPage() {
  return (
    <>
      <Header />
      <Box fluid justify="center" direction="vertical">
        <CreditStats />
        <ShareCard
          content="Get more Union vouches to increase your total available credit."
          buttonProps={{ label: "Get vouch link" }}
        />
      </Box>
    </>
  );
}
