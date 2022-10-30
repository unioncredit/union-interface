import { chain, useNetwork, useSwitchNetwork } from "wagmi";
import { Heading, Card, Text, Button, Label } from "@unioncredit/ui";
import { ReactComponent as Switch } from "@unioncredit/ui/lib/icons/switch.svg";

export default function NetworkNotice({ lite }) {
  const { chain: connectedChain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  if (connectedChain.id == chain.mainnet.id) {
    return null;
  }

  return (
    <Card variant="blue" mb="24px" packed={lite}>
      <Card.Body>
        {lite ? (
          <Label as="p" align="center" mb="8px">
            Voting only on Ethereum mainnet
          </Label>
        ) : (
          <>
            <Heading align="center" mb={0}>
              Union Governance on Ethereum
            </Heading>
            <Text align="center" mb="24px">
              Voting on proposals isn’t supported on Arbitrum. Switch to
              Ethereum’s Mainnet in order to take part in Union Governance.
            </Text>
          </>
        )}
        <Button
          fluid
          icon={Switch}
          onClick={() => switchNetwork(chain.mainnet.id)}
          label={lite ? "Switch network" : "Switch Network to Ethereum"}
        />
      </Card.Body>
    </Card>
  );
}
