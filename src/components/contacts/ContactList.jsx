import {
  Card,
  Table,
  Pagination,
  EmptyState,
  TableRow,
  TableCell,
  TableHead,
  Box,
  Label,
} from "@unioncredit/ui";
import Avatar from "components/shared/Avatar";
import PrimaryLabel from "components/shared/PrimaryLabel";
import StatusBadge from "components/shared/StatusBadge";
import { ContactsType } from "constants";

import { useVouchees } from "providers/VoucheesData";
import { useVouchers } from "providers/VouchersData";
import format from "utils/format";
import { truncateAddress } from "utils/truncateAddress";

export default function ContactList({ type = ContactsType.VOUCHEES }) {
  const { data: vouchees } = useVouchees();
  const { data: vouchers } = useVouchers();

  const contacts = (type === ContactsType.VOUCHEES ? vouchees : vouchers) || {};

  const contactsCount = Object.keys(contacts);

  return (
    <Card>
      <Card.Header
        title={`Accounts you trust · ${Object.keys(contacts).length}`}
        subTitle="Addresses you’re currently vouching for"
      />
      {contactsCount <= 0 ? (
        <Card.Body>
          <EmptyState label="No contacts" />
        </Card.Body>
      ) : (
        <Table>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>Account</TableHead>
            <TableHead align="center">Status</TableHead>
            <TableHead align="right">Balance owed (DAI)</TableHead>
          </TableRow>
          {Object.keys(contacts).map((address) => (
            <TableRow key={address}>
              <TableCell fixedSize>
                <Avatar size={24} address={address} />
              </TableCell>
              <TableCell>
                <Box direction="vertical">
                  <Label grey={700} m={0}>
                    <PrimaryLabel address={address} />
                  </Label>
                  <Label size="small" grey={400} m={0}>
                    {truncateAddress(address)}
                  </Label>
                </Box>
              </TableCell>
              <TableCell align="center">
                <StatusBadge address={address} />
              </TableCell>
              <TableCell align="right">{format(0)}</TableCell>
            </TableRow>
          ))}
        </Table>
      )}
      <Pagination pages={10} activePage={5} onClick={() => alert()} />
    </Card>
  );
}
