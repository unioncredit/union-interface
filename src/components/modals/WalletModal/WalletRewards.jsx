import { Badge, Box, EthereumIcon, NewMemberIcon, Text } from "@unioncredit/ui";
import { useAccount } from "wagmi";
import { useFunionPoints } from "../../../hooks/useFunionPoints";
import { useEthEarned } from "../../../hooks/useEthEarned";
import format from "utils/format";

export const WalletRewards = () => {
  const { address } = useAccount();

  const { data: points, loading: pointsLoading } = useFunionPoints(address);
  const { data: ethEarned, loading: ethEarnedLoading } = useEthEarned(address);

  return (
    <Box direction="vertical" fluid>
      <Box m="24px 0 12px" justify="space-between" align="center" fluid>
        <Text m={0} grey={500} size="medium" weight="medium">
          Referral Rewards
        </Text>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://union.mirror.xyz/xXmgVkG3usy0b8x2kfRmtY27zl7qLnrAQmQcMUwz68c"
          style={{ fontSize: "14px", textDecoration: "underline", marginLeft: "4px" }}
        >
          Learn more -&gt;
        </a>
      </Box>

      <Box justify="space-between" align="center" fluid>
        <Box align="center">
          <NewMemberIcon width={24} height={24} />
          <Text m="0 4px" size="medium" grey={600}>
            FUNION
          </Text>
        </Box>

        <Badge label={`${points} points`} color="grey" />
      </Box>

      <Box mt="12px" justify="space-between" align="center" fluid>
        <Box align="center">
          <EthereumIcon width={22} height={22} />
          <Text m="0 5px" size="medium" grey={600}>
            ETH Earned
          </Text>
        </Box>

        <Badge label={`${format(ethEarned, "DAI", 4, false, false, false)} ETH`} color="grey" />
      </Box>
    </Box>
  );
};
