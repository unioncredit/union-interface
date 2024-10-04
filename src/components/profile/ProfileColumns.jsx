import "./ProfileColumns.scss";

import { Box } from "@unioncredit/ui";

import { ProfileCurrentBalances } from "./ProfileCurrentBalances";
import React from "react";
import { ProfileVoucherStats } from "./ProfileVoucherStats";

export const ProfileColumns = ({ vouchees, vouchers, address, chainId }) => {
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
