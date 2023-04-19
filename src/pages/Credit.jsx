import { Helmet } from "react-helmet";
import { Layout } from "@unioncredit/ui";

import CreditStats from "components/credit/CreditStats";
import ActivityTable from "components/credit/ActivityTable";
import VouchersOverview from "components/credit/VouchersOverview";
import { useVouchers } from "providers/VouchersData";
import { CreditSegmentedControl } from "components/shared/CreditSegmentedControl";

export default function CreditPage() {
  const { data: vouchers = [] } = useVouchers();

  return (
    <>
      <Helmet>
        <title>Credit | Union Credit Protocol</title>
      </Helmet>
      <Layout.Columned align="center" maxw="653px">
        <CreditSegmentedControl active={0} />
        <CreditStats vouchers={vouchers} />
        <VouchersOverview vouchers={vouchers} displayCount={6} />
        <ActivityTable />
      </Layout.Columned>
    </>
  );
}
