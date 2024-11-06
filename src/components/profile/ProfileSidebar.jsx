import "./ProfileSidebar.scss";

import { Box, Card, Divider } from "@unioncredit/ui";
import ProfileGovernanceStats from "./ProfileGovernanceStats";
import { ProfileVoucherStats } from "./ProfileVoucherStats";
import { useVoucheesData } from "providers/VoucheesData";
import { useVouchersData } from "providers/VouchersData";
import { getVersion } from "providers/Version";
import { ProfileAccountReputation } from "./ProfileAccountReputation";
import React, { useEffect } from "react";
import { ZERO } from "constants";
import { reduceBnSum } from "../../utils/reduce";

export function ProfileSidebar({ address, member, chainId }) {
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

  const { creditLimit = ZERO, owed = ZERO } = member;

  const vouch = vouchers.map(({ vouch }) => vouch).reduce(reduceBnSum, ZERO);

  const unavailableBalance = vouch.sub(creditLimit).sub(owed);

  useEffect(() => {
    refetchVouchers();
    refetchVouchees();
  }, [address, chainId]);

  return (
    <Box className="ProfileSidebar" direction="vertical" fluid>
      <Card>
        <Card.Body>
          <ProfileAccountReputation address={address} chainId={chainId} />

          {vouchers.length > 0 && (
            <>
              <Divider m="24px 0" />
              <ProfileVoucherStats vouchers={vouchers} vouchees={vouchees} chainId={chainId} />
            </>
          )}

          <Divider m="24px 0" />

          <ProfileGovernanceStats address={address} chainId={chainId} />
        </Card.Body>
      </Card>
    </Box>
  );
}
