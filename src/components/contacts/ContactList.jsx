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
  Input,
  Button,
} from "@unioncredit/ui";
import { useEffect, useState } from "react";
import { ReactComponent as Search } from "@unioncredit/ui/lib/icons/search.svg";
import { ReactComponent as Vouch } from "@unioncredit/ui/lib/icons/vouch.svg";
import { ReactComponent as Filter } from "@unioncredit/ui/lib/icons/filter.svg";

import format from "utils/format";
import { ZERO, ContactsType } from "constants";
import Avatar from "components/shared/Avatar";
import PrimaryLabel from "components/shared/PrimaryLabel";
import StatusBadge from "components/shared/StatusBadge";
import { useVouchees } from "providers/VoucheesData";
import { useVouchers } from "providers/VouchersData";
import usePagination from "hooks/usePagination";
import { truncateAddress } from "utils/truncateAddress";
import { VOUCH_MODAL } from "components/modals/VouchModal";
import { useModals } from "providers/ModalManager";
import useContactSearch from "hooks/useContactSearch";

export default function ContactList({
  contact,
  setContact,
  type = ContactsType.VOUCHEES,
}) {
  const { open } = useModals();
  const { data: vouchees } = useVouchees();
  const { data: vouchers } = useVouchers();

  const [query, setQuery] = useState(null);

  const contacts = (type === ContactsType.VOUCHEES ? vouchees : vouchers) || [];

  useEffect(() => {
    !contact &&
      !contacts.find(({ address }) => address === contact?.address) &&
      setContact(contacts[0]);
  }, [contact, contacts[0]]);

  const searched = useContactSearch(contacts, query);

  const {
    data: contactsPage,
    maxPages,
    activePage,
    onChange,
  } = usePagination(searched);

  return (
    <Card>
      <Card.Header
        title={`Accounts you trust · ${contacts.length}`}
        subTitle="Addresses you’re currently vouching for"
      />
      <Box fluid p="12px">
        <Input
          prefix={<Search />}
          placeholder="Search"
          onChange={(event) => {
            setQuery(event.target.value);
          }}
        />
        <Button
          ml="8px"
          fluid
          icon={Filter}
          variant="secondary"
          onClick={() => alert()}
        />
        {type === ContactsType.VOUCHEES && (
          <Button
            fluid
            ml="8px"
            label="New vouch"
            icon={Vouch}
            onClick={() => open(VOUCH_MODAL)}
          />
        )}
      </Box>
      {contacts.length <= 0 ? (
        <Card.Body>
          <EmptyState label="No contacts" />
        </Card.Body>
      ) : (
        <Table>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>Account</TableHead>
            {type === ContactsType.VOUCHEES ? (
              <>
                <TableHead align="center">Status</TableHead>
                <TableHead align="right">Balance owed (DAI)</TableHead>
              </>
            ) : (
              <TableHead align="right">Trust Limit (DAI)</TableHead>
            )}
          </TableRow>
          {contactsPage.map((row) => {
            const { address, locking = ZERO, trust = ZERO } = row;

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
                {type === ContactsType.VOUCHEES ? (
                  <>
                    <TableCell align="center">
                      <StatusBadge address={address} />
                    </TableCell>
                    <TableCell align="right">{format(locking)}</TableCell>
                  </>
                ) : (
                  <TableCell align="right">{format(trust)}</TableCell>
                )}
              </TableRow>
            );
          })}
        </Table>
      )}
      <Pagination pages={maxPages} activePage={activePage} onClick={onChange} />
    </Card>
  );
}
