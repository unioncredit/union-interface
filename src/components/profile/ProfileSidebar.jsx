import "./ProfileSidebar.scss";

import { Box, Card, DistributionBar, Divider, Heading, NumericalBlock } from "@unioncredit/ui";
import ProfileGovernanceStats from "./ProfileGovernanceStats";
import { ProfileVoucherStats } from "./ProfileVoucherStats";
import { useVoucheesData } from "providers/VoucheesData";
import { useVouchersData } from "providers/VouchersData";
import { getVersion } from "providers/Version";
import { ProfileAccountReputation } from "./ProfileAccountReputation";
import React, { useEffect } from "react";
import format, { formattedNumber } from "../../utils/format";
import { ZERO } from "constants";
import { reduceBnSum } from "../../utils/reduce";
import { useToken } from "hooks/useToken";

export function ProfileSidebar({ address, member, chainId }) {
  const { token } = useToken(chainId);
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

  const unavailableBalance = vouch - creditLimit - owed;

  useEffect(() => {
    refetchVouchers();
    refetchVouchees();
  }, [address, chainId]);

  return (
    <Box className="ProfileSidebar" direction="vertical" fluid>
      <Card mb="24px" className="ProfileSidebar__Balances">
        <Card.Body>
          <Heading m={0}>Current Balances</Heading>

          <DistributionBar
            m="24px 0"
            items={[
              {
                value: formattedNumber(owed),
                color: "blue900",
              },
              {
                value: formattedNumber(creditLimit, 2, false),
                color: "blue100",
              },
              {
                value: formattedNumber(unavailableBalance),
                color: "amber500",
              },
            ]}
          />

          <Box className="Stats" align="center" justify="space-between">
            <NumericalBlock
              fluid
              align="left"
              token="dai"
              size="regular"
              title="Borrowed"
              dotColor="blue900"
              value={format(owed, token)}
              titleTooltip={{
                content: "The amount of DAI you are currently borrowing",
              }}
            />

            <NumericalBlock
              fluid
              align="left"
              token="dai"
              size="regular"
              title="Available"
              dotColor="blue100"
              value={format(creditLimit, token, 2, false)}
              titleTooltip={{
                content: "The amount of token currently available to borrow",
              }}
            />

            <NumericalBlock
              fluid
              align="left"
              token="dai"
              size="regular"
              title="Unavailable"
              dotColor="amber500"
              value={format(unavailableBalance, token)}
              titleTooltip={{
                content:
                  "Credit normally available to you which is tied up elsewhere and unavailable to borrow at this time",
              }}
            />
          </Box>
        </Card.Body>
      </Card>

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
