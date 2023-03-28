import { TableHead, TableRow } from "@unioncredit/ui";

export function ContactsTableHead({ items }) {
  return (
    <TableRow>
      <TableHead></TableHead>
      <TableHead>Account</TableHead>

      {items.map((text) => (
        <TableHead align="right">{text}</TableHead>
      ))}
    </TableRow>
  );
}
