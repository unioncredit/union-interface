import "./ProfileCtaButtons.scss";

import { ConnectButton } from "../shared";
import {
  Box,
  Button,
  CancelIcon,
  FarcasterIcon,
  ManageIcon,
  ShareIcon,
  SwitchIcon,
  VouchIcon,
  WalletIcon,
} from "@unioncredit/ui";
import cn from "classnames";
import { useAccount, useSwitchChain } from "wagmi";
import { Link, useNavigate } from "react-router-dom";
import { useMemo } from "react";

import { PUBLIC_WRITE_OFF_DEBT_MODAL } from "components/modals/PublicWriteOffDebtModal";
import { VOUCH_MODAL } from "components/modals/VouchModal";
import { useModals } from "providers/ModalManager";
import { getVersion, Versions } from "providers/Version";
import { useVersionBlockNumber } from "hooks/useVersionBlockNumber";
import { useProtocol } from "providers/ProtocolData";
import { useMember, useMemberData } from "providers/MemberData";
import { compareAddresses } from "utils/compare";
import { supportedNetworks } from "config/networks";
import { useSupportedNetwork } from "hooks/useSupportedNetwork";
import { SHARE_REFERRAL_MODAL } from "components/modals/ShareReferralModal";
import { ZERO } from "constants";

export const ProfileCtaButtons = ({ address, chainId, className }) => {
  const navigate = useNavigate();
  const { open: openModal } = useModals();
  const { isConnected } = useAccount();
  const { isSupported } = useSupportedNetwork();
  const { switchChainAsync } = useSwitchChain();
  const { data: connectedMember = {} } = useMember();
  const { chain: connectedChain, address: connectedAddress } = useAccount();
  const { data: protocol } = useProtocol();
  const { data: member } = useMemberData(address, chainId, getVersion(chainId));
  const { data: blockNumber } = useVersionBlockNumber({
    chainId,
  });

  const networks = supportedNetworks.filter((n) => isSupported(n.chainId));

  const network = useMemo(() => {
    return networks.find((network) => network.chainId === chainId) || networks[0];
  }, [chainId, networks]);

  const { isOverdue = false, lastRepay = ZERO } = member;
  const { overdueTime = ZERO, overdueBlocks = ZERO, maxOverdueTime = ZERO } = protocol;
  const { borrowerAddresses: connectedMemberBorrowerAddresses = [] } = connectedMember;

  const alreadyVouching = connectedMemberBorrowerAddresses.some((borrower) =>
    compareAddresses(borrower, address)
  );

  const maxOverdueTotal = (overdueTime || overdueBlocks) + maxOverdueTime;
  const isMaxOverdue =
    blockNumber &&
    isOverdue &&
    lastRepay &&
    getVersion(chainId) === Versions.V2 &&
    BigInt(blockNumber) >= lastRepay + maxOverdueTotal;

  return (
    <Box
      className={cn("ProfileCtaButtons", className)}
      direction="vertical"
      justify="space-between"
      minw="200px"
    >
      {!isConnected ? (
        <ConnectButton
          buttonProps={{
            icon: WalletIcon,
            style: {
              borderRadius: "12px",
              backgroundColor: "transparent",
            },
          }}
        />
      ) : connectedChain?.id !== Number(chainId) ? (
        <Button
          color="secondary"
          variant="light"
          icon={SwitchIcon}
          label={`Switch to ${network?.label}`}
          onClick={() =>
            switchChainAsync({
              chainId: network?.chainId,
            })
          }
        />
      ) : isMaxOverdue ? (
        <Button
          icon={CancelIcon}
          color="red"
          label="Write-off debt"
          onClick={() =>
            openModal(PUBLIC_WRITE_OFF_DEBT_MODAL, {
              address,
            })
          }
        />
      ) : alreadyVouching ? (
        <Button
          color="secondary"
          variant="light"
          icon={ManageIcon}
          label="Manage Contact"
          onClick={() => navigate(`/contacts/providing?address=${address}`)}
        />
      ) : !connectedMember.isMember ? (
        <Button
          color="secondary"
          variant="light"
          to="/"
          as={Link}
          icon={VouchIcon}
          label="Join to Back"
        />
      ) : connectedAddress === address ? (
        <Button
          color="secondary"
          variant="light"
          icon={FarcasterIcon}
          label="Edit on Farcaster"
          onClick={() => open("https://warpcast.com/~/settings")}
          style={{
            opacity: 1,
          }}
        />
      ) : (
        <Button
          color="primary"
          icon={VouchIcon}
          onClick={() => {
            openModal(VOUCH_MODAL, { address });
          }}
          label="Back this account"
        />
      )}

      <Button
        icon={ShareIcon}
        mt="6px"
        variant="light"
        color="secondary"
        label={"Share profile"}
        onClick={() =>
          openModal(SHARE_REFERRAL_MODAL, {
            address,
            chainId,
          })
        }
      />
    </Box>
  );
};
