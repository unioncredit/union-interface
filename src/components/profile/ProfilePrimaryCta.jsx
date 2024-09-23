import "./ProfilePrimaryCta.scss";

import { ConnectButton } from "../shared";
import { Box, Button, CancelIcon, ManageIcon, SwitchIcon, VouchIcon } from "@unioncredit/ui";
import { PUBLIC_WRITE_OFF_DEBT_MODAL } from "../modals/PublicWriteOffDebtModal";
import { Link, useNavigate } from "react-router-dom";
import { VOUCH_MODAL } from "../modals/VouchModal";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { useModals } from "../../providers/ModalManager";
import { getVersion, Versions } from "../../providers/Version";
import { BigNumber } from "ethers";
import { ZERO } from "constants";
import { useVersionBlockNumber } from "../../hooks/useVersionBlockNumber";
import { useProtocol } from "../../providers/ProtocolData";
import { useMember, useMemberData } from "../../providers/MemberData";
import { compareAddresses } from "../../utils/compare";
import { supportedNetworks } from "../../config/networks";
import { useMemo } from "react";
import { useSupportedNetwork } from "../../hooks/useSupportedNetwork";

export const ProfilePrimaryCta = ({ address, chainId }) => {
  const navigate = useNavigate();
  const { open: openModal } = useModals();
  const { isConnected } = useAccount();
  const { isSupported } = useSupportedNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();
  const { data: connectedMember = {} } = useMember();
  const { address: connectedAddress } = useAccount();
  const { chain: connectedChain } = useNetwork();
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

  const maxOverdueTotal = (overdueTime || overdueBlocks).add(maxOverdueTime);
  const isMaxOverdue =
    blockNumber &&
    isOverdue &&
    lastRepay &&
    getVersion(chainId) === Versions.V2 &&
    BigNumber.from(blockNumber).gte(lastRepay.add(maxOverdueTotal));

  return (
    <Box className="ProfilePrimaryCta" direction="vertical" justify="space-between" minw="200px">
      {!isConnected ? (
        <ConnectButton
          buttonProps={{
            style: {
              borderRadius: "12px",
              height: "64px",
              fontSize: "18px",
              backgroundColor: "transparent",
            },
          }}
        />
      ) : connectedChain?.id !== Number(chainId) ? (
        <Button
          size="large"
          color="secondary"
          variant="light"
          icon={SwitchIcon}
          label={`Switch to ${network?.label}`}
          onClick={() => switchNetworkAsync(network?.chainId)}
        />
      ) : isMaxOverdue ? (
        <Button
          size="large"
          icon={CancelIcon}
          label="Write-off debt"
          onClick={() =>
            openModal(PUBLIC_WRITE_OFF_DEBT_MODAL, {
              address,
            })
          }
        />
      ) : alreadyVouching ? (
        <Button
          size="large"
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
          label="Register to vouch"
          size="large"
        />
      ) : connectedAddress === address ? (
        <Button
          color="secondary"
          variant="light"
          icon={ManageIcon}
          label="Edit on Farcaster"
          size="large"
          onClick={() => open("https://warpcast.com/~/settings")}
          style={{
            opacity: 1,
          }}
        />
      ) : (
        <Button
          size="large"
          color="primary"
          icon={VouchIcon}
          onClick={() => {
            openModal(VOUCH_MODAL, { address });
          }}
          label={network ? `Vouch on ${network.label}` : "Vouch"}
        />
      )}
    </Box>
  );
};
