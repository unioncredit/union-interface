import {
  Grid,
  Card,
  Box,
  Avatar,
  Label,
  Badge,
  Button,
  Text,
} from "@unioncredit/ui";
import { ReactComponent as Chevron } from "@unioncredit/ui/lib/icons/chevron.svg";

import { networks } from "config/networks";

import "./NetworkSelect.scss";

export default function NetworkSelect() {
  const chainId = 1;

  return (
    <Grid>
      <Grid.Row justify="center">
        <Grid.Col>
          <Box fluid align="center" direction="vertical">
            {networks.map(({ label, value, avatar, description }) => {
              const loading = false;

              return (
                <Card
                  my="6px"
                  packed
                  key={value}
                  onClick={() => alert("card click")}
                  className="NetworkSelect__innerCard"
                >
                  <Card.Body>
                    <Box align="center">
                      <Box justify="center" mr="16px">
                        <Avatar size={48} src={avatar} />
                      </Box>
                      <Box direction="vertical">
                        <Text as="h3" m={0} grey={800}>
                          {label}
                        </Text>
                        <Label as="p" m={0} pr="8px">
                          {description}
                        </Label>
                      </Box>
                      <Button
                        loading={loading}
                        variant="lite"
                        icon={Chevron}
                        ml="auto"
                      />
                    </Box>
                  </Card.Body>
                </Card>
              );
            })}
          </Box>
          <Button fluid label="Open Union Dashboard" />
        </Grid.Col>
      </Grid.Row>
    </Grid>
  );
}
