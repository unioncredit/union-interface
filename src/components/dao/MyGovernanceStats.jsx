import "./MyGovernanceStats.scss";

import {
  Box,
  Card,
  Button,
  Text,
  NumericalBlock,
  WarningIcon,
  SwitchIcon,
  ArbitrumIcon,
  IconBadge,
  SetupIcon,
  InfoBanner,
} from "@unioncredit/ui";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { mainnet, arbitrum } from "wagmi/chains";

import { AddressLabelBox } from "components/shared";
import format from "utils/format";
import { useMember } from "providers/MemberData";
import { ZERO } from "constants";
import { ZERO_ADDRESS } from "constants";
import { useModals } from "providers/ModalManager";
import { DELEGATE_MODAL } from "components/modals/DelegateModal";
import { useBalance } from "hooks/useBalance";

export default function MyGovernanceStats() {
  const { open } = useModals();
  const { address } = useAccount();
  const { switchNetwork } = useSwitchNetwork();
  const { chain: connectedChain } = useNetwork();
  const { data: member = {} } = useMember();
  const { data: arbUnionBalance = ZERO } = useBalance(
    address,
    "bridgedToken",
    arbitrum.id
  );

  const {
    unionBalance = ZERO,
    votes = ZERO,
    delegate = ZERO_ADDRESS,
    rewards,
  } = member;
  const { unclaimed = ZERO } = rewards || {};

  const votesDelegated = votes.sub(unionBalance);

  const isMainnet = connectedChain.id === mainnet.id;
  const isVotingConfigured = delegate && delegate !== ZERO_ADDRESS;
  const isDelegatingToSelf = delegate === address;

  const governanceStats = [
    {
      title: "Your voting power",
      value: isMainnet ? format(votes) : "--",
      subtitleTooltip: {
        shrink: true,
        content: "TODO",
      },
      subtitle: isVotingConfigured
        ? isDelegatingToSelf
          ? "Wallet + Delegation"
          : "Delegated to 3rd part"
        : "Not delegated",
      className: !isVotingConfigured && "MyGovernanceStats__block--dimmed",
    },
    {
      token: "union",
      title: "Wallet balance",
      value: format(unionBalance),
      subtitle: `${format(unclaimed)} unclaimed`,
    },
    {
      title: "Delegated to you",
      value: isMainnet ? format(votesDelegated) : "--",
      subtitle: "From other addresses",
      className: !isVotingConfigured && "MyGovernanceStats__block--dimmed",
    },
  ];

  const buttonProps = !isMainnet
    ? {
        icon: SwitchIcon,
        label: "Switch to Ethereum",
        onClick: () => switchNetwork(mainnet.id),
      }
    : isVotingConfigured
    ? {
        color: "secondary",
        variant: "light",
        icon: SwitchIcon,
        label: "Change voting delegate",
        onClick: () => open(DELEGATE_MODAL),
      }
    : {
        icon: SetupIcon,
        label: "Setup voting",
        onClick: () => open(DELEGATE_MODAL),
      };

  const balances = [
    {
      icon: ArbitrumIcon,
      label: "Arbitrum Balance",
      balance: arbUnionBalance,
      token: "arbUNION",
    },
  ];

  return (
    <Card>
      <Card.Body>
        <Box className="MyGovernanceStats__top" justify="space-between">
          {governanceStats.map((stat) => (
            <NumericalBlock
              fluid
              key={stat.title}
              align="left"
              size="regular"
              {...stat}
            />
          ))}
        </Box>

        {isVotingConfigured ? (
          <AddressLabelBox
            mt="16px"
            label={
              isDelegatingToSelf
                ? "Your votes are self delegated"
                : "You're voting via a third party delegate"
            }
            address={delegate}
          />
        ) : (
          <InfoBanner
            mt="16px"
            justify="space-between"
            align="left"
            icon={WarningIcon}
            iconPosition="right"
            variant="warning"
            label={
              isMainnet
                ? "Your votes have not been delegated"
                : "Switch to Ethereum Mainnet to manage your votes"
            }
          />
        )}

        <Button fluid mt="8px" size="large" {...buttonProps} />
      </Card.Body>

      <Card.Footer>
        {balances.map(({ icon, label, balance, token }) => (
          <Box key={token} align="center" justify="space-between" fluid>
            <Box align="center">
              <IconBadge
                mr="4px"
                size="large"
                iconSize="large"
                borderColor="#BFDBFE"
                backgroundColor="white"
                icon={icon}
              />

              <Text m={0} grey={500} size="medium" weight="medium">
                {label}
              </Text>
            </Box>

            <Text m={0} grey={700} size="medium" weight="medium">
              {`${format(balance)} ${token}`}
            </Text>
          </Box>
        ))}
      </Card.Footer>
    </Card>
  );
}
