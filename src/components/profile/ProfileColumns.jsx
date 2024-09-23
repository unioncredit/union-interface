import "./ProfileColumns.scss";

import { Box } from "@unioncredit/ui";

import { ProfileCurrentBalances } from "./ProfileCurrentBalances";
import React from "react";
import { ProfileVoucherStats } from "./ProfileVoucherStats";
import { useVoucheesData } from "../../providers/VoucheesData";
import { getVersion } from "../../providers/Version";
import { useVouchersData } from "../../providers/VouchersData";

export const ProfileColumns = ({ address, chainId }) => {
  const { data: vouchees = [] } = useVoucheesData(address, chainId, getVersion(chainId));
  const { data: vouchers = [] } = useVouchersData(address, chainId, getVersion(chainId));

  return (
    <Box className="ProfileColumns" fluid>
      <Box className="ProfileColumns__column">
        <ProfileCurrentBalances
          vouchees={vouchees}
          vouchers={vouchers}
          address={address}
          chainId={chainId}
        />
      </Box>
      <Box className="ProfileColumns__column">
        <ProfileVoucherStats vouchers={vouchers} vouchees={vouchees} chainId={chainId} />
      </Box>
    </Box>
  );
};
