import { Card, Heading, Button, Text } from "@unioncredit/ui";
import { VOUCH_MODAL } from "components/modals/VouchModal";
import { useModals } from "providers/ModalManager";

export default function NewVouchCard() {
  const { open } = useModals();

  return (
    <Card variant="blue" mt="24px">
      <Card.Body>
        <Heading align="center">Vouch for a new contact</Heading>
        <Text align="center" mb="24px">
          Vouch for a friend or trusted contact by using your staked assets.
          Make sure it’s someone you really trust.
        </Text>
        <Button
          fluid
          label="Vouch for someone"
          onClick={() => open(VOUCH_MODAL)}
        />
      </Card.Body>
    </Card>
  );
}
