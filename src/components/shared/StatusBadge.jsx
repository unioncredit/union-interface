import { Badge } from "@unioncredit/ui";

import { ZERO } from "constants";

export default function StatusBadge({ address }) {
  const isOverdue = false;
  const isMember = true;
  const borrowed = ZERO;

  return (
    <>
      {borrowed.gt(0) ? (
        <Badge
          color={isOverdue ? "red" : "green"}
          label={isOverdue ? "Overdue" : "Borrowing"}
        />
      ) : isMember ? (
        <Badge color="blue" label="Member" />
      ) : (
        <Badge color="grey" label="Not a member" />
      )}
    </>
  );
}
