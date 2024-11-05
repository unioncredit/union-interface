import React, { useState } from "react";
import { Box, Divider, Heading, NumericalRows, Text } from "@unioncredit/ui";
import { ProfileReputationHistory } from "./ProfileReputationHistory";
import { useCreditData } from "../../hooks/useCreditData";
import format from "../../utils/format";
import { useToken } from "hooks/useToken";

export function ProfileAccountReputation({ address, chainId }) {
  const [year, setYear] = useState(new Date().getFullYear());

  const { token } = useToken();
  const {
    history,
    daysInDefault,
    daysSinceMembership,
    defaultRate,
    borrowedVolume,
    repaidVolume,
    defaultedVolume,
  } = useCreditData(address, chainId);

  return (
    <>
      <Heading m={0}>Account Reputation</Heading>
      <Text color="grey500" mb="12px" size="medium" weight="medium">
        Account Age: {daysSinceMembership || 0} days
      </Text>

      <Divider m="24px 0" />

      <Box justify="space-between">
        <Box direction="vertical" mb="16px">
          <Text m={0} color="grey500" mb="12px" size="medium" weight="medium">
            Default Rate
          </Text>

          <Text m={0} grey={800} size="large" style={{ fontSize: "24px", lineHeight: "32px" }}>
            {defaultRate.toFixed(1)}%
          </Text>
        </Box>

        <Box direction="vertical" align="flex-end">
          <Text m={0} color="grey500" mb="12px" size="medium" weight="medium">
            Time in Default
          </Text>

          <Text m={0} grey={800} size="large" style={{ fontSize: "24px", lineHeight: "32px" }}>
            {daysInDefault} days
          </Text>
        </Box>
      </Box>

      <ProfileReputationHistory year={year} setYear={setYear} history={history} />

      <NumericalRows
        mt="16px"
        items={[
          {
            label: "Borrowed Volume",
            value: `$${format(borrowedVolume, token)}`,
          },
          {
            label: "Repaid Volume",
            value: `$${format(repaidVolume, token)}`,
          },
          {
            label: "Defaulted Volume",
            value: `$${format(defaultedVolume, token)}`,
          },
        ]}
      />
    </>
  );
}
