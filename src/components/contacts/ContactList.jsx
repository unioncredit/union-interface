import "./ContactList.scss";

import { useEffect, useMemo, useState } from "react";
import { Card, Pagination, EmptyState, Box } from "@unioncredit/ui";

import { ContactsType } from "constants";
import { filterFunctions } from "components/contacts/FiltersPopover";
import usePagination from "hooks/usePagination";
import useContactSearch from "hooks/useContactSearch";
import { locationSearch } from "utils/location";
import {
  ContactsFilterControls,
  ContactsTypeToggle,
} from "components/contacts/ContactsTable";
import { useVouchees } from "providers/VoucheesData";
import { useVouchers } from "providers/VouchersData";
import { DesktopContactsTable } from "components/contacts/ContactsTable/DesktopContactsTable";
import useResponsive from "hooks/useResponsive";
import { MobileContactsTable } from "components/contacts/ContactsTable/MobileContactsTable";

export default function ContactList({ contact, setContact, type, setType }) {
  const { isMobile } = useResponsive();
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
    <Card className="ContactList" overflow="visible">
      <Box className="ContactList__header" p="24px">
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
          {isMobile ? (
            <MobileContactsTable
              type={type}
              data={contactsPage}
              setContact={setContact}
            />
          ) : (
            <DesktopContactsTable
              type={type}
              data={contactsPage}
              setContact={setContact}
            />
          )}
        </div>
      )}
      <Pagination pages={maxPages} activePage={activePage} onClick={onChange} />
    </Card>
  );
}
