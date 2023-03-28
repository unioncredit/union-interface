import "./NetworkSelect.scss";

import { useEffect, useState } from "react";
import { Grid, Box, Button } from "@unioncredit/ui";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";

import useNetworks from "hooks/useNetworks";
import { useAppNetwork } from "providers/Network";
import useMemberSummary from "hooks/useMemberSummary";
import { NetworkSelectOption } from "./NetworkSelectOption";

export default function NetworkSelect() {
  const { chain } = useNetwork();
  const { address, isConnected } = useAccount();
  const { setAppReady } = useAppNetwork();
  const { openConnectModal } = useConnectModal();
  const { switchNetworkAsync } = useSwitchNetwork({
    throwForSwitchChainNotSupported: true,
  });
  const { data: member } = useMemberSummary(address, chain?.id);

  const [selected, setSelected] = useState(null);

  const networks = useNetworks();

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
    const found = networks.find((net) => net.chainId === chain.id);
    setSelected(found || null);
  }, [chain?.id, JSON.stringify(networks)]);

  return (
    <Grid>
      <Grid.Row justify="center">
        <Grid.Col>
          <Box fluid align="center" direction="vertical" mb="6px">
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
            fluid
            disabled={chain?.unsupported || (!selected && isConnected)}
            label={
              isConnected
                ? chain?.unsupported || !selected
                  ? "Select a Supported Network"
                  : member.isMember
                  ? "Open Union Dashboard"
                  : "Begin Membership Process"
                : "Connect Wallet"
            }
            onClick={() => {
              if (isConnected) {
                setAppReady(true);
              } else {
                openConnectModal();
              }
            }}
          />

          <a
            rel="noopener"
            target="_blank"
            className="NetworkSelect__footerLink"
            href="https://docs.union.finance/user-guides/becoming-a-member"
          >
            Learn more about becoming a Union member
          </a>
        </Grid.Col>
      </Grid.Row>
    </Grid>
  );
}
