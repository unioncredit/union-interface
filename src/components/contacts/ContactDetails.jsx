import { Card } from "@unioncredit/ui";

import AddressSummary from "components/shared/AddressSummary";

export default function ContactDetails({ contact = {} }) {
  if (!contact) {
    return "loading";
  }

  const { address } = contact;

  return (
    <Card>
      <Card.Body>
        <AddressSummary address={address} />
      </Card.Body>
    </Card>
  );
}
