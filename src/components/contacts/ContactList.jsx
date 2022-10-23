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

import format from "utils/format";
import { useVouchees } from "providers/VoucheesData";
import { useVouchers } from "providers/VouchersData";
import { truncateAddress } from "utils/truncateAddress";
import { useEffect } from "react";
import { ZERO } from "constants";
import usePagination from "hooks/usePagination";

export default function ContactList({
  contact,
  setContact,
  type = ContactsType.VOUCHEES,
}) {
  const { data: vouchees } = useVouchees();
  const { data: vouchers } = useVouchers();

  const contacts = (type === ContactsType.VOUCHEES ? vouchees : vouchers) || [];

  const contactsCount = contacts.length;

  useEffect(() => {
    if (
      !contact &&
      !contacts.find(({ address }) => address === contact?.address)
    ) {
      setContact(contacts[0]);
    }
  }, [contact, contacts[0]]);

  const {
    data: contactsPage,
    maxPages,
    activePage,
    onChange,
  } = usePagination(vouchers);

  return (
    <Card>
      <Card.Header
        title={`Accounts you trust · ${contactsCount}`}
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
          {contactsPage.map((row) => {
            const { address, locking = ZERO } = row;

            return (
              <TableRow
                key={address}
                active={address === contact?.address}
                onClick={() => setContact(row)}
              >
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
                <TableCell align="right">{format(locking)}</TableCell>
              </TableRow>
            );
          })}
        </Table>
      )}
      <Pagination pages={maxPages} activePage={activePage} onClick={onChange} />
    </Card>
  );
}
