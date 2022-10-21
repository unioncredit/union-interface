import { Card } from "@unioncredit/ui";

import AddressSummary from "components/shared/AddressSummary";

export default function ContactDetails({ address }) {
  return (
    <Card>
      <Card.Body>
        <AddressSummary address={address} />
      </Card.Body>
    </Card>
  );
}
