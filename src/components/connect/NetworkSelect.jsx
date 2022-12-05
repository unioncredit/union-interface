import {
  Grid,
  Box,
  Button,
} from "@unioncredit/ui";
import { useEffect, useState } from "react";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";

import { networks } from "config/networks";
import { useAppNetwork } from "providers/Network";
import { EIP3770Map } from "constants";

import "./NetworkSelect.scss";
import { locationSearch } from "utils/location";
import useMemberSummary from "hooks/useMemberSummary";
import { NetworkSelectOption } from "./NetworkSelectOption";

export default function NetworkSelect() {
  const { chain } = useNetwork();
  const { address } = useAccount();
  const { isConnected } = useAccount();
  const { setAppReady } = useAppNetwork();
  const { openConnectModal } = useConnectModal();
  const { switchNetworkAsync } = useSwitchNetwork();
  const { data: member } = useMemberSummary(address, chain?.id);

  const [selected, setSelected] = useState(null);

  const urlSearchParams = locationSearch();

  const targetChain = urlSearchParams.has("chain")
    ? EIP3770Map[urlSearchParams.get("chain")]
    : chain?.id;

  const handleChangeNetwork = async (network, chainId) => {
    if (!isConnected) return;

    const oldSelection = selected;
    setSelected(network);

    try {
      await switchNetworkAsync(chainId);
    } catch (e) {
      console.log("Network select error:", e.message);
      setSelected(oldSelection);
    }
  }

  useEffect(() => {
    (async function () {
      if (
        switchNetworkAsync &&
        isConnected &&
        targetChain &&
        !chain?.unsupported
      ) {
        const toSelect = networks.find(
          (network) => network.chainId === targetChain
        );
        if (toSelect?.chainId !== selected?.chainId) {
          setSelected(toSelect);

          // If the current network is not he same as the selected network
          // fire off a chain network request. This is to support the ?chain
          // URL search param
          if (toSelect.chainId !== chain.id) {
            await switchNetworkAsync(toSelect.chainId);
          }
        }
      }
    })();
  }, [isConnected, targetChain, switchNetworkAsync]);

  return (
    <Grid>
      <Grid.Row justify="center">
        <Grid.Col>
          <Box fluid align="center" direction="vertical" mb="6px">
            {networks.map((network) => (
              <NetworkSelectOption
                address={address}
                network={network}
                disabled={!isConnected}
                changeNetwork={handleChangeNetwork}
                active={isConnected && selected?.chainId === network.chainId}
              />
            ))}
          </Box>
          <Button
            fluid
            disabled={chain?.unsupported}
            label={
              isConnected
                ? chain?.unsupported
                  ? "Select a Supported Network"
                  : member.isMember
                    ? "Open Union Dashboard"
                    : "Begin Membership Process"
                : "Connect Wallet"
            }
            onClick={isConnected ? () => setAppReady(true) : openConnectModal}
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
