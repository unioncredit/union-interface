import { chain, useNetwork } from "wagmi";
import { useEffect, useMemo, useState } from "react";
import {
  Card,
  Table,
  Pagination,
  EmptyState,
  Box,
  Collapse,
} from "@unioncredit/ui";

import { ZERO, ContactsType, BlockSpeed } from "constants";
import { useVouchees } from "providers/VoucheesData";
import { useVouchers } from "providers/VouchersData";
import Filters, { filterFns, sortFns } from "./Filters";
import usePagination from "hooks/usePagination";
import useContactSearch from "hooks/useContactSearch";
import useIsMobile from "hooks/useIsMobile";
import { locationSearch } from "utils/location";
import { useProtocol } from "providers/ProtocolData";
import {
  ContactsFilterControls,
  ContactsTableHead,
  ContactsTypeToggle,
  ProvidingTableRow,
  ReceivingTableRow,
} from "components/contacts/ContactsTable";

export default function ContactList({ contact, setContact, type, setType }) {
  const isMobile = useIsMobile();

  const { data: protocol } = useProtocol();
  const { data: vouchees = [] } = useVouchees();
  const { data: vouchers = [] } = useVouchers();
  const { chain: connectedChain } = useNetwork();

  const [query, setQuery] = useState(null);
  const [filters, setFilters] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const { overdueBlocks = ZERO } = protocol;
  const overdueInMilliseconds = overdueBlocks
    .mul(
      BlockSpeed[
        connectedChain.id === chain.arbitrum.id
          ? chain.mainnet.id
          : connectedChain.id
      ]
    )
    .toNumber();

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
    <Card w="100%" maxw="none">
      <Box p="24px 24px 0">
        <ContactsTypeToggle type={type} setType={setType} />
        <ContactsFilterControls
          setQuery={setQuery}
          setShowFilters={setShowFilters}
        />
      </Box>

      {/*-------------------------------------------------------------
        Search and Filters
      *--------------------------------------------------------------*/}
      <Box fluid p="12px"></Box>
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
            <ContactsTableHead
              items={
                type === ContactsType.VOUCHEES
                  ? [
                      "Trust set",
                      "Total vouch",
                      "Stake locked",
                      "Last payment",
                      "Loan status",
                    ]
                  : [
                      "Trust set",
                      "Total vouch",
                      "Real vouch",
                      "You're locking",
                      "Borrowable",
                    ]
              }
            />

            {contactsPage.map((row) =>
              type === ContactsType.VOUCHEES ? (
                <ProvidingTableRow
                  key={row.address}
                  data={row}
                  setContact={setContact}
                  chainId={connectedChain.id}
                  overdueInMilliseconds={overdueInMilliseconds}
                  receiving={vouchers.find((v) => v.address === row.address)}
                />
              ) : (
                <ReceivingTableRow
                  key={row.address}
                  data={row}
                  setContact={setContact}
                  providing={vouchees.find((v) => v.address === row.address)}
                />
              )
            )}
          </Table>
        </div>
      )}
      <Pagination pages={maxPages} activePage={activePage} onClick={onChange} />
    </Card>
  );
}
