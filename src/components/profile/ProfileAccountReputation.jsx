import { Box, Divider, Heading, NumericalRows, Text } from "@unioncredit/ui";
import { ProfileReputationHistory } from "./ProfileReputationHistory";
import { useCreditData } from "../../hooks/useCreditData";

export function ProfileAccountReputation({ address, chainId }) {
  const { history } = useCreditData(address, chainId);

  return (
    <>
      <Heading m={0}>Account Reputation</Heading>
      <Text color="grey500" mb="12px" size="medium">
        132 days · $1,242.12 Volume
      </Text>

      <Divider m="24px 0" />

      <Box justify="space-between">
        <Box direction="vertical" mb="16px">
          <Text m={0} color="grey500" mb="12px" size="medium">
            Default Rate · 12 Months
          </Text>

          <Text m={0} grey={800} size="large" style={{ fontSize: "24px", lineHeight: "32px" }}>
            6.1%
          </Text>
        </Box>

        <Box direction="vertical" align="flex-end">
          <Text m={0} color="grey500" mb="12px" size="medium">
            Time in Default
          </Text>

          <Text m={0} grey={800} size="large" style={{ fontSize: "24px", lineHeight: "32px" }}>
            3 days
          </Text>
        </Box>
      </Box>

      <ProfileReputationHistory history={history} />

      <NumericalRows
        mt="16px"
        weight="regular"
        items={[
          {
            label: "Borrowed Volume",
            value: "$TODO.00",
          },
          {
            label: "Repaid Volume",
            value: "$TODO.00",
          },
          {
            label: "Defaulted Volume",
            value: "$TODO.00",
          },
        ]}
      />
    </>
  )
}