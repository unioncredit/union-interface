import "./ProfileSidebar.scss";

import { Card, Divider } from "@unioncredit/ui";
import ProfileGovernanceStats from "./ProfileGovernanceStats";
import { ProfileVoucherStats } from "./ProfileVoucherStats";
import { useVoucheesData } from "providers/VoucheesData";
import { useVouchersData } from "providers/VouchersData";
import { getVersion } from "providers/Version";
import { ProfileAccountReputation } from "./ProfileAccountReputation";
import { useEffect } from "react";

export function ProfileSidebar({ address, chainId }) {
  const { data: vouchees = [], refetch: refetchVouchees } = useVoucheesData(
    address,
    chainId,
    getVersion(chainId)
  );
  const { data: vouchers = [], refetch: refetchVouchers } = useVouchersData(
    address,
    chainId,
    getVersion(chainId)
  );

  useEffect(() => {
    refetchVouchers();
    refetchVouchees();
  }, [address, chainId]);

  return (
    <Card className="ProfileSidebar">
      <Card.Body>
        <ProfileAccountReputation address={address} chainId={chainId} />

        {vouchers.length > 0 && (
          <>
            <Divider m="24px 0" />
            <ProfileVoucherStats vouchers={vouchers} vouchees={vouchees} />
          </>
        )}

        <Divider m="24px 0" />

        <ProfileGovernanceStats address={address} chainId={chainId} />
      </Card.Body>
    </Card>
  );
}
