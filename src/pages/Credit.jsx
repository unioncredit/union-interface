import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { Box, ToggleMenu } from "@unioncredit/ui";

import CreditStats from "components/credit/CreditStats";
import ShareCard from "components/credit/ShareCard";
import VouchersCard from "components/credit/VouchersCard";
import MyTransactionHistory from "components/credit/MyTransactionHistory";
import { useModals } from "providers/ModalManager";
import { CREDIT_REQUEST_MODAL } from "components/modals/CreditRequestModal";

export default function CreditPage() {
  const { open } = useModals();

  return (
    <>
      <Helmet>
        <title>Credit | Union Credit Protocol</title>
      </Helmet>
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
      <Box fluid justify="center" direction="vertical">
        <CreditStats />
        <ShareCard
          content="Get more Union vouches to increase your total available credit."
          buttonProps={{
            label: "Get vouch link",
            onClick: () => open(CREDIT_REQUEST_MODAL),
          }}
        />
        <VouchersCard />
        <MyTransactionHistory />
      </Box>
    </>
  );
}
