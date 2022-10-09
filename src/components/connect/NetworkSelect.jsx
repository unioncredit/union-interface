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
import { useSwitchNetwork } from "wagmi";

import { networks } from "config/networks";

import "./NetworkSelect.scss";

export default function NetworkSelect({ disabled }) {
  const { switchNetwork } = useSwitchNetwork();
  const [selected, setSelected] = useState(networks[0]);

  return (
    <Grid>
      <Grid.Row justify="center">
        <Grid.Col>
          <Box fluid align="center" direction="vertical" mb="6px">
            {networks.map((props) => {
              const { label, value, avatar, description, chainId } = props;

              const active = !disabled && selected.chainId === chainId;

              return (
                <Card
                  my="6px"
                  packed
                  key={value}
                  onClick={() => setSelected(props)}
                  className={cn("NetworkSelect__innerCard", {
                    "NetworkSelect__innerCard--active": active,
                    "NetworkSelect__innerCard--disabled": disabled,
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
            disabled={disabled}
            label="Open Union Dashboard"
            onClick={() => {
              switchNetwork(selected.chainId);
            }}
          />
        </Grid.Col>
      </Grid.Row>
    </Grid>
  );
}
