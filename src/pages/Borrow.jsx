import { Helmet } from "react-helmet";

import CreditStats from "components/credit/CreditStats";
import ActivityTable from "components/credit/ActivityTable";
import VouchersOverview from "components/credit/VouchersOverview";
import { useVouchers } from "providers/VouchersData";

export default function BorrowPage() {
  const { data: vouchers = [] } = useVouchers();

  return (
    <>
      <Helmet>
        <title>Credit | Union Credit Protocol</title>
      </Helmet>

      <CreditStats vouchers={vouchers} />
      <VouchersOverview vouchers={vouchers} displayCount={6} />
      <ActivityTable />
    </>
  );
}
