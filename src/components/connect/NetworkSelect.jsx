import {
  Grid,
  Card,
  Box,
  Avatar,
  Label,
  Button,
  Text,
  Control,
} from "@unioncredit/ui";
import cn from "classnames";
import { useEffect, useState } from "react";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";

import { networks } from "config/networks";
import { useAppNetwork } from "providers/Network";
import { EIP3770Map } from "constants";

import "./NetworkSelect.scss";

export default function NetworkSelect() {
  const { chain } = useNetwork();
  const { isConnected } = useAccount();
  const { setAppReady } = useAppNetwork();
  const { openConnectModal } = useConnectModal();
  const { switchNetworkAsync } = useSwitchNetwork();

  const [selected, setSelected] = useState(null);

  const urlSearchParams = new URLSearchParams(
    window.location.hash.split("?")[1]
  );

  const targetChain = urlSearchParams.has("chain")
    ? EIP3770Map[urlSearchParams.get("chain")]
    : chain?.id;

  useEffect(() => {
    if (isConnected && targetChain && !chain?.unsupported) {
      const toSelect = networks.find(
        (network) => network.chainId === targetChain
      );
      if (toSelect?.chainId !== selected?.chainId) {
        return setSelected(toSelect);
      }
    }
  }, [isConnected, targetChain]);

  return (
    <Grid>
      <Grid.Row justify="center">
        <Grid.Col>
          <Box fluid align="center" direction="vertical" mb="6px">
            {networks.map((props) => {
              const { label, value, avatar, description, chainId } = props;

              const active = isConnected && selected?.chainId === chainId;

              return (
                <Card
                  my="6px"
                  packed
                  maxw="100%"
                  key={value}
                  onClick={async () => {
                    if (!isConnected) return;

                    const oldSelection = selected;
                    setSelected(props);

                    try {
                      await switchNetworkAsync(chainId);
                    } catch (e) {
                      console.log("Network select error:", e.message);
                      setSelected(oldSelection);
                    }
                  }}
                  className={cn("NetworkSelect__innerCard", {
                    "NetworkSelect__innerCard--active": active,
                    "NetworkSelect__innerCard--disabled": !isConnected,
                  })}
                >
                  <Box align="center">
                    <Box p="0 12px" className="NetworkSelect__controlBox">
                      <Control type="radio" checked={active} />
                    </Box>
                    <Box fluid p="12px" className="NetworkSelect__contentBox">
                      <Box justify="center" mr="16px">
                        <Avatar size={40} src={avatar} />
                      </Box>
                      <Box direction="vertical">
                        <Text as="h3" m={0} grey={800}>
                          {label}
                        </Text>
                        <Label as="p" m={0} pr="8px">
                          {description}
                        </Label>
                      </Box>
                    </Box>
                  </Box>
                </Card>
              );
            })}
          </Box>
          <Button
            fluid
            disabled={chain?.unsupported}
            label={
              isConnected
                ? chain?.unsupported
                  ? "Select a Supported Network"
                  : "Open Union Dashboard"
                : "Connect Wallet"
            }
            onClick={isConnected ? () => setAppReady(true) : openConnectModal}
          />
        </Grid.Col>
      </Grid.Row>
    </Grid>
  );
}
