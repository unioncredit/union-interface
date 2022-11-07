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
import { useState } from "react";
import { useAccount, useSwitchNetwork } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";

import { networks } from "config/networks";
import { useAppNetwork } from "providers/Network";

import "./NetworkSelect.scss";

export default function NetworkSelect() {
  const { isConnected } = useAccount();
  const { initialChain, setInitialChain } = useAppNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const { openConnectModal } = useConnectModal();

  const [selected, setSelected] = useState(networks[0]);

  return (
    <Grid>
      <Grid.Row justify="center">
        <Grid.Col>
          <Box fluid align="center" direction="vertical" mb="6px">
            {networks.map((props) => {
              const { label, value, avatar, description, chainId } = props;

              const active = selected.chainId === chainId;

              return (
                <Card
                  my="6px"
                  packed
                  maxw="100%"
                  key={value}
                  onClick={() => setSelected(props)}
                  className={cn("NetworkSelect__innerCard", {
                    "NetworkSelect__innerCard--active": active,
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
            label="Open Union Dashboard"
            disabled={!!initialChain}
            onClick={() => {
              if (isConnected) {
                switchNetwork(selected.chainId);
              } else {
                setInitialChain(selected.chainId);
                openConnectModal();
              }
            }}
          />
        </Grid.Col>
      </Grid.Row>
    </Grid>
  );
}
