import { useEffect, useMemo, useState } from "react";
import { Card, Table, Pagination, EmptyState, Box } from "@unioncredit/ui";

import { ContactsType } from "constants";
import { filterFunctions } from "components/contacts/FiltersPopover";
import usePagination from "hooks/usePagination";
import useContactSearch from "hooks/useContactSearch";
import { locationSearch } from "utils/location";
import {
  ContactsFilterControls,
  ContactsTableHead,
  ContactsTypeToggle,
  ProvidingTableRow,
  ReceivingTableRow,
} from "components/contacts/ContactsTable";
import { useVouchees } from "providers/VoucheesData";
import { useVouchers } from "providers/VouchersData";

export default function ContactList({ contact, setContact, type, setType }) {
  const { data: vouchees = [] } = useVouchees();
  const { data: vouchers = [] } = useVouchers();

  const [query, setQuery] = useState(null);
  const [filters, setFilters] = useState([]);

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
      }
    }
  }, [contact, contacts[0]]);

  /*--------------------------------------------------------------
    Search, Filter, Paginate 
  *--------------------------------------------------------------*/

  const searched = useContactSearch(contacts, query);

  console.log(searched);

  const filtered = useMemo(() => {
    return filters
      ? searched.filter((item) =>
          filters
            .map((filter) => filterFunctions[filter](item))
            .every((x) => x === true)
        )
      : searched;
  }, [filters, JSON.stringify(searched)]);

  const {
    data: contactsPage,
    maxPages,
    activePage,
    onChange,
  } = usePagination(filtered);

  return (
    <Card w="100%" maxw="none" overflow="visible">
      <Box p="24px">
        <ContactsTypeToggle type={type} setType={setType} />
        <ContactsFilterControls
          type={type}
          filters={filters}
          setQuery={setQuery}
          setFilers={setFilters}
        />
      </Box>

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
