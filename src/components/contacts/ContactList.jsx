import {
  Card,
  Table,
  Pagination,
  EmptyState,
  TableRow,
  TableCell,
  TableHead,
  Box,
  Text,
  Input,
  Button,
  Collapse,
  FilterIcon,
  SearchIcon,
} from "@unioncredit/ui";
import { useEffect, useMemo, useState } from "react";
import { ReactComponent as Vouch } from "@unioncredit/ui/lib/icons/vouch.svg";

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
import Filters, { filterFns, sortFns } from "./Filters";
import useIsMobile from "hooks/useIsMobile";
import { locationSearch } from "utils/location";

export default function ContactList({
  contact,
  setContact,
  type = ContactsType.VOUCHEES,
}) {
  const isMobile = useIsMobile();

  const { open } = useModals();
  const { data: vouchees } = useVouchees();
  const { data: vouchers } = useVouchers();

  const [query, setQuery] = useState(null);
  const [filters, setFilters] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const contacts = (type === ContactsType.VOUCHEES ? vouchees : vouchers) || [];

  useEffect(() => {
    // Get the fake search params from the end of the hash fragment
    const urlSearchParams = locationSearch();

    // If a search param has been provided in the hash URL
    // #/contacts?address=ADDRESS then we try and find that
    // address in our contacts array. If we find it we set
    // it as the active address in the list
    if (!contact && urlSearchParams.has("address")) {
      const searchAddress = urlSearchParams.get("address");
      const searchContact = contacts.find(
        ({ address }) => address === searchAddress
      );

      if (searchContact) {
        window.history.pushState(
          history.state,
          document.title,
          window.location.href.split("?")[0]
        );
        setContact(searchContact);
        return;
      }
    }

    // On mobile we don't want to select the first item as default
    // so we just early return to prevent that
    if (isMobile) return;

    // If there are no contacts or the current contact does not exist
    // in the current list of contact (we switched from trust you to you
    // trust) then we need to reset the contact to the first one on the list
    !contact &&
      !contacts.find(({ address }) => address === contact?.address) &&
      setContact(contacts[0]);
  }, [contact, contacts[0], isMobile]);

  /*--------------------------------------------------------------
    Search, Filter, Paginate 
  *--------------------------------------------------------------*/

  const searched = useContactSearch(contacts, query);

  const filtered = useMemo(() => {
    const filterFn = filterFns[filters?.status];
    const sortFn = sortFns[filters?.sort];

    // Filter then sort
    const d1 = filterFn ? searched.filter(filterFn) : searched;
    return sortFn ? d1.sort(sortFn) : d1;
  }, [filters?.sort, filters?.status, JSON.stringify(searched)]);

  const {
    data: contactsPage,
    maxPages,
    activePage,
    onChange,
  } = usePagination(filtered);

  return (
    <Card>
      {type === ContactsType.VOUCHERS ? (
        <Card.Header
          title={`Accounts that trust you · ${contacts.length}`}
          subTitle="Accounts providing you with credit"
        />
      ) : (
        <Card.Header
          title={`Accounts you trust · ${contacts.length}`}
          subTitle="Addresses you’re currently vouching for"
        />
      )}

      {/*--------------------------------------------------------------
        Search and Filters 
      *--------------------------------------------------------------*/}
      <Box fluid p="12px">
        <Input
          prefix={<SearchIcon width="15px" />}
          placeholder="Search"
          onChange={(event) => {
            setQuery(event.target.value);
          }}
        />
        <Button
          ml="8px"
          fluid
          icon={FilterIcon}
          color="secondary"
          variant="light"
          onClick={() => setShowFilters((x) => !x)}
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
      <Collapse active={showFilters}>
        <Filters type={type} onChange={setFilters} />
      </Collapse>
      {/*--------------------------------------------------------------
        Contacts Table 
      *--------------------------------------------------------------*/}
      {filtered.length <= 0 ? (
        <Card.Body>
          <EmptyState label="No contacts" />
        </Card.Body>
      ) : (
        <div className="TableContainer">
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
                      <Text grey={700} m={0}>
                        <PrimaryLabel address={address} />
                      </Text>
                      <Text size="small" grey={400} m={0}>
                        {truncateAddress(address)}
                      </Text>
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
        </div>
      )}
      <Pagination pages={maxPages} activePage={activePage} onClick={onChange} />
    </Card>
  );
}
