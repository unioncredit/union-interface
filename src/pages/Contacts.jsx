import { Link } from "react-router-dom";
import { Box, ToggleMenu } from "@unioncredit/ui";

import Header from "components/shared/Header";
import StakeStats from "components/stake/StakeStats";
import NewVouchCard from "components/stake/NewVouchCard";
import BorrowersCard from "components/stake/BorrowersCard";
import { ContactsType } from "constants";

export default function StakePage() {
  return (
    <>
      <Header />
      <Box justify="center" fluid mb="24px">
        <ToggleMenu
          className="ToggleMenu"
          items={[
            {
              id: ContactsType.VOUCHEES,
              label: "You trust",
              to: "/contacts",
            },
            {
              id: ContactsType.VOUCHERS,
              label: "Trusts you",
              to: "/contacts/trusts-you",
            },
          ]}
          initialActive={0}
        />
      </Box>
      content
    </>
  );
}
