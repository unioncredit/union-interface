import "./NetworkSelect.scss";

import { goerli, optimismGoerli } from "wagmi/chains";
import { useEffect, useState } from "react";
import { Box, Button, WalletIcon } from "@unioncredit/ui";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";

import { useAppNetwork } from "providers/Network";
import useMemberSummary from "hooks/useMemberSummary";
import { NetworkSelectOption } from "./NetworkSelectOption";
import cn from "classnames";
import { supportedNetworks } from "config/networks";
import { useSupportedNetwork } from "../../hooks/useSupportedNetworks";

export default function NetworkSelect() {
  const { chain } = useNetwork();
  const { address, isConnected } = useAccount();
  const { setAppReady } = useAppNetwork();
  const { openConnectModal } = useConnectModal();
  const { connected: isSupportedNetwork } = useSupportedNetwork();
  const { switchNetworkAsync } = useSwitchNetwork({
    throwForSwitchChainNotSupported: true,
  });
  const { data: member } = useMemberSummary(address, chain?.id);

  const [selected, setSelected] = useState(null);

  const networks = supportedNetworks.filter(
    (x) => ![optimismGoerli.id, goerli.id].includes(x.chainId)
  );

  const handleChangeNetwork = async (network) => {
    if (!isConnected) return;

    const oldSelection = selected;
    setSelected(network);

    try {
      await switchNetworkAsync(network.chainId);
    } catch (e) {
      console.log("Network select error:", e.message);
      setSelected(oldSelection);
    }
  };

  useEffect(() => {
    if (!chain?.id) return;
    const found = networks.find((net) => net.chainId === chain?.id);
    setSelected(found || null);
  }, [chain?.id, networks]);

  return (
    <Box
      fluid
      direction="vertical"
      className={cn("NetworkSelect", {
        "NetworkSelect--connected": isConnected,
      })}
    >
      <Box fluid align="center" direction="vertical" mb="16px" className="NetworkSelect__networks">
        {networks.map((network) => (
          <NetworkSelectOption
            key={network.id}
            address={address}
            network={network}
            disabled={!isConnected}
            onClick={() => handleChangeNetwork(network)}
            active={isConnected && selected?.chainId === network.chainId}
          />
        ))}
      </Box>
      <Button
        w="100%"
        disabled={isConnected && (chain?.unsupported || !isSupportedNetwork)}
        size="large"
        icon={!isConnected && WalletIcon}
        iconProps={{
          style: {
            width: "16px",
            height: "16px",
          },
        }}
        label={
          isConnected
            ? chain?.unsupported
              ? "Select a Supported Network"
              : member.isMember
              ? "Open Union Dashboard"
              : "Begin membership process"
            : "Connect Wallet"
        }
        onClick={isConnected ? () => setAppReady(true) : openConnectModal}
      />

      <a
        rel="noreferrer"
        target="_blank"
        className="NetworkSelect__footerLink"
        href="https://docs.union.finance/user-guides/becoming-a-member"
      >
        Learn more about becoming a Union member
      </a>
    </Box>
  );
}
