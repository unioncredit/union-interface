import "./NetworkSelect.scss";

import cn from "classnames";
import { mainnet } from "wagmi/chains";
import { useEffect, useState } from "react";
import { Box, Button, WalletIcon } from "@unioncredit/ui";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount, useSwitchChain } from "wagmi";

import { NetworkSelectOption } from "./NetworkSelectOption";
import useMemberSummary from "hooks/useMemberSummary";
import { useAppNetwork } from "providers/Network";
import { supportedNetworks } from "config/networks";
import { useSupportedNetwork } from "../../hooks/useSupportedNetwork";
import { InstallAppDrawer } from "../shared/InstallAppDrawer";
import { BnStringify } from "../../utils/json";

export default function NetworkSelect() {
  const { chain, address, isConnected } = useAccount();
  const { setForceAppReady } = useAppNetwork();
  const { openConnectModal } = useConnectModal();
  const { connected: isSupportedNetwork } = useSupportedNetwork();
  const { switchChainAsync } = useSwitchChain();
  const { data: member } = useMemberSummary(address, chain?.id);

  const [selected, setSelected] = useState(null);

  const isMainnet = chain?.id === mainnet.id;
  const availableNetworks = supportedNetworks.filter((x) => ![mainnet.id].includes(x.chainId));
  const networks = availableNetworks;

  const handleChangeNetwork = async (network) => {
    if (!isConnected) return;

    const oldSelection = selected;
    setSelected(network);

    try {
      await switchChainAsync({
        chainId: network.chainId,
      });
    } catch (e) {
      console.log("Network select error:", e.message);
      setSelected(oldSelection);
    }
  };

  useEffect(() => {
    if (!chain?.id) return;
    const found = networks.find((net) => net.chainId === chain.id);
    setSelected(found || null);
  }, [chain?.id, BnStringify(networks)]);

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
            token={network.token}
            disabled={!isConnected}
            onClick={() => handleChangeNetwork(network)}
            active={isConnected && selected?.chainId === network.chainId}
          />
        ))}
      </Box>

      <InstallAppDrawer />

      <Button
        w="100%"
        disabled={isConnected && (chain?.unsupported || isMainnet || !isSupportedNetwork)}
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
            ? chain?.unsupported || isMainnet
              ? "Select a Supported Network"
              : member.isMember
              ? "Open Union Dashboard"
              : "Begin membership process"
            : "Connect Wallet"
        }
        onClick={isConnected ? () => setForceAppReady(true) : openConnectModal}
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
