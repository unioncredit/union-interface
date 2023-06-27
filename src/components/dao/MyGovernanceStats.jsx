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
  OptimismIcon,
} from "@unioncredit/ui";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { mainnet } from "wagmi/chains";

import { AddressLabelBox } from "components/shared";
import format from "utils/format";
import { useMember } from "providers/MemberData";
import { ZERO, ZERO_ADDRESS } from "constants";
import { useModals } from "providers/ModalManager";
import { DELEGATE_MODAL } from "components/modals/DelegateModal";
import { useGovernanceStats } from "hooks/useGovernanceStats";

export default function MyGovernanceStats() {
  const { open } = useModals();
  const { address } = useAccount();
  const { chain: connectedChain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const { data: member = {} } = useMember();
  const { data: governance = {} } = useGovernanceStats({ address });

  const { delegate = ZERO_ADDRESS } = member;

  const {
    mainnetVotes = ZERO,
    mainnetBalance = ZERO,
    mainnetUnclaimed = ZERO,
    arbitrumBalance = ZERO,
    optimismBalance = ZERO,
  } = governance;

  const votesDelegated = mainnetVotes.sub(mainnetBalance);

  const isMainnet = connectedChain?.id === mainnet.id;
  const isVotingConfigured = delegate && delegate !== ZERO_ADDRESS;
  const isDelegatingToSelf = delegate === address;

  const governanceStats = [
    {
      title: "Your voting power",
      value: format(mainnetVotes),
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
      value: format(mainnetBalance),
      subtitle: `${format(mainnetUnclaimed)} unclaimed`,
    },
    {
      title: "Delegated to you",
      value: format(votesDelegated),
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
      balance: arbitrumBalance,
      token: "arbUNION",
    },
    {
      icon: OptimismIcon,
      label: "Optimism Balance",
      balance: optimismBalance,
      token: "opUNION",
    },
  ];

  return (
    <Card>
      <Card.Body>
        <Box className="MyGovernanceStats__top" justify="space-between">
          {governanceStats.map((stat) => (
            <NumericalBlock fluid key={stat.title} align="left" size="regular" {...stat} />
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

      <Card.Footer direction="vertical" mb="-12px">
        {balances.map(({ icon, label, balance, token }) => (
          <Box mb="12px" key={token} align="center" justify="space-between" fluid>
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
