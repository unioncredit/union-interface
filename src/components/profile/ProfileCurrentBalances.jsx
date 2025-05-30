import "./ProfileCurrentBalances.scss";

import {
  Box,
  Card,
  DistributionBar,
  Dot,
  Heading,
  NumericalRows,
  Text,
  UnionIcon,
} from "@unioncredit/ui";
import format, { formattedNumber } from "../../utils/format";
import React from "react";
import { getVersion } from "providers/Version";
import { ZERO } from "constants";
import { reduceBnSum } from "utils/reduce";
import { useMemberData } from "providers/MemberData";
import { ProfileStatusBadge } from "components/profile/ProfileStatusBadge";
import { useCreditData } from "hooks/useCreditData";
import { useToken } from "hooks/useToken";

export const ProfileCurrentBalances = ({ address, chainId, vouchees, vouchers }) => {
  const { token } = useToken(chainId);
  const { data: member = {} } = useMemberData(address, chainId, getVersion(chainId));
  const { joinDate, borrowedVolume, repaidVolume, defaultedVolume } = useCreditData(
    address,
    chainId
  );

  const { owed = ZERO } = member;

  const vouch = vouchers.map(({ vouch = ZERO }) => vouch).reduce(reduceBnSum, ZERO);

  const voucheesAddresses = vouchees.map((obj) => obj.address);
  const vouchersAddresses = vouchers.map((obj) => obj.address);
  const voucheesSet = new Set(voucheesAddresses);
  const mutualAddresses = vouchersAddresses.filter((address) => voucheesSet.has(address));

  return (
    <Card mb="24px" className="ProfileCurrentBalances">
      <Card.Body>
        <Box justify="space-between">
          <Box align="center">
            <UnionIcon width={24} height={24} />
            <Heading m="0 6px" level={2}>
              Current Balances
            </Heading>
          </Box>

          <ProfileStatusBadge member={member} chainId={chainId} />
        </Box>

        <Box mt="16px" justify="space-between">
          <Box direction="vertical">
            <Heading mb="2px" size="large" level={3}>
              ${format(vouch, token, 0)}
            </Heading>
            <Text m={0} grey={500} size="medium">
              Credit limit
            </Text>
          </Box>
          <Box direction="vertical" align="flex-end">
            <Heading mb="2px" size="large" level={3}>
              ${format(owed, token, 0)}
            </Heading>
            <Text m={0} grey={500} size="medium">
              <Dot color="blue900" mr="4px" mb="1px" />
              Balance owed
            </Text>
          </Box>
        </Box>

        <DistributionBar
          m="18px 0"
          items={[
            {
              value: formattedNumber(owed),
              color: "blue900",
            },
            {
              value: formattedNumber(vouch - owed, 2, false),
              color: "blue50",
            },
          ]}
        />

        <Box className="ProfileCurrentBalances__vouches" align="center" justify="space-between">
          <Text className="ProfileCurrentBalances__vouch" size="medium">
            {mutualAddresses.length} <span>Mutual vouches</span>
          </Text>
          <Text className="ProfileCurrentBalances__vouch" size="medium">
            {vouchees.length} <span>Vouches given</span>
          </Text>
          <Text className="ProfileCurrentBalances__vouch" size="medium">
            {vouchers.length} <span>Vouches received</span>
          </Text>
        </Box>

        <NumericalRows
          m="12px 0 0"
          weight="regular"
          items={[
            {
              label: "Became member",
              value: joinDate || "N/A",
            },
            {
              label: "Borrowed Volume",
              value: `$${format(borrowedVolume)}`,
            },
            {
              label: "Repaid Volume",
              value: `$${format(repaidVolume)}`,
            },
            {
              label: "Defaulted Volume",
              value: `$${format(defaultedVolume)}`,
            },
          ]}
        />
      </Card.Body>
    </Card>
  );
};
