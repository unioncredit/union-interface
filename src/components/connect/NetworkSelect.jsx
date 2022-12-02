import {
  Grid,
  Card,
  Box,
  Avatar,
  Label,
  Button,
  Text,
} from "@unioncredit/ui";
import cn from "classnames";
import { useEffect, useState } from "react";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";

import { networks } from "config/networks";
import { useAppNetwork } from "providers/Network";
import { EIP3770Map } from "constants";

import "./NetworkSelect.scss";
import { locationSearch } from "utils/location";
import { useMemberSummary } from "providers/MemberData";
import format from "utils/format";

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
            {networks.map((props) => {
              const { label, value, avatar, description, chainId } = props;
              const { data } = useMemberSummary(address, chainId);
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
                    <Box fluid p="12px" className="NetworkSelect__contentBox">
                      <Box justify="center" mr="16px">
                        <Avatar size={40} src={avatar} />
                      </Box>
                      <Box direction="vertical">
                        <Text as="h3" m={0} grey={800}>
                          {label}
                        </Text>

                        <Label as="p" m={0} pr="8px" size="small">
                          {address
                            ? data.isMember
                              ? `Member · ${format(data.creditLimit)} DAI available`
                              : "Not a member"
                            : description
                          }
                        </Label>
                      </Box>
                    </Box>
                    <Box p="0 12px" className="NetworkSelect__controlBox">
                      {active ? (
                        <Button variant="pill" label="Selected" color="blue" />
                      ) : (
                        <Button variant="pill" label="Switch" />
                      )}
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
