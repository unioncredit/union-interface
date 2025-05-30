import "./ContactList.scss";

import { useEffect, useMemo, useState } from "react";
import { Box, Card, Pagination } from "@unioncredit/ui";

import { ContactsType, SortOrder, ZERO } from "constants";
import { providingFilterFns, receivingFilterFns } from "components/contacts/FiltersPopover";
import usePagination from "hooks/usePagination";
import useContactSearch from "hooks/useContactSearch";
import { locationSearch } from "utils/location";
import { ContactsFilterControls, ContactsTypeToggle } from "components/contacts/ContactsTable";
import { useVouchees } from "providers/VoucheesData";
import { useVouchers } from "providers/VouchersData";
import { DesktopContactsTable } from "components/contacts/ContactsTable/DesktopContactsTable";
import useResponsive from "hooks/useResponsive";
import { MobileContactsTable } from "components/contacts/ContactsTable/MobileContactsTable";
import { COLUMNS as PROVIDING_COLUMNS } from "components/contacts/ContactsTable/ProvidingTableRow";
import { COLUMNS as RECEIVING_COLUMNS } from "components/contacts/ContactsTable/ReceivingTableRow";
import { compareAddresses } from "utils/compare";
import { MANAGE_CONTACT_MODAL } from "components/modals/ManageContactModal";
import { useModals } from "providers/ModalManager";
import {
  PROVIDING_FILTERS,
  PROVIDING_SORT,
  RECEIVING_FILTERS,
  RECEIVING_SORT,
  useSettings,
} from "../../providers/Settings";
import { useSearchParams } from "react-router-dom";
import { TableEmptyStates } from "./TableEmptyStates";

const score = (bools) => {
  return bools.reduce((acc, item) => acc + (item ? 1 : -1), 0);
};

const sortFns = {
  [PROVIDING_COLUMNS.TRUST_SET.id]: {
    [SortOrder.ASC]: (a, b) => Number(a.trust - b.trust),
    [SortOrder.DESC]: (a, b) => Number(b.trust - a.trust),
  },
  [PROVIDING_COLUMNS.TOTAL_VOUCH.id]: {
    [SortOrder.ASC]: (a, b) => Number(a.vouch - b.vouch),
    [SortOrder.DESC]: (a, b) => Number(b.vouch - a.vouch),
  },
  [PROVIDING_COLUMNS.STAKE_LOCKED.id]: {
    [SortOrder.ASC]: (a, b) => Number(a.locking - b.locking),
    [SortOrder.DESC]: (a, b) => Number(b.locking - a.locking),
  },
  [PROVIDING_COLUMNS.LAST_PAYMENT.id]: {
    [SortOrder.ASC]: (a, b) => Number(a.lastRepay - b.lastRepay),
    [SortOrder.DESC]: (a, b) => Number(b.lastRepay - a.lastRepay),
  },
  [PROVIDING_COLUMNS.LOAN_STATUS.id]: {
    [SortOrder.ASC]: (a, b) =>
      score([a.locking > ZERO && a.isOverdue, a.isMember, a.locking > ZERO]) -
      score([b.locking > ZERO && b.isOverdue, b.isMember, b.locking > ZERO]),
    [SortOrder.DESC]: (a, b) =>
      score([b.isOverdue && b.locking > ZERO, b.isMember, b.locking > ZERO]) -
      score([a.isOverdue && a.locking > ZERO, a.isMember, a.locking > ZERO]),
  },
  [RECEIVING_COLUMNS.REAL_VOUCH.id]: {
    [SortOrder.ASC]: (a, b) => Number(a.vouch - b.vouch),
    [SortOrder.DESC]: (a, b) => Number(b.vouch - a.vouch),
  },
  [RECEIVING_COLUMNS.LOCKING.id]: {
    [SortOrder.ASC]: (a, b) => Number((a.locking ?? a.locked) - (b.locking ?? b.locked)),
    [SortOrder.DESC]: (a, b) => Number((b.locking ?? b.locked) - (a.locking ?? a.locked)),
  },
  [RECEIVING_COLUMNS.BORROWABLE.id]: {
    [SortOrder.ASC]: (a, b) =>
      Number(a.vouch - (a.locking ?? a.locked) - (b.vouch - b.locking ?? b.locked)),
    [SortOrder.DESC]: (a, b) =>
      Number(b.vouch - (b.locking ?? b.locked) - (a.vouch - a.locking ?? a.locked)),
  },
};

export default function ContactList({ initialType }) {
  const { open } = useModals();
  const { isMobile } = useResponsive();
  const { data: vouchees = [] } = useVouchees();
  const { data: vouchers = [] } = useVouchers();
  const { settings, setSetting } = useSettings();

  const [searchParams, setSearchParams] = useSearchParams();
  const [contactIndex, setContactIndex] = useState(null);
  const [query, setQuery] = useState(null);
  const [type, setType] = useState(initialType);

  const [sort, setSort] = useState(() => {
    const storedSort = settings[type === ContactsType.VOUCHEES ? PROVIDING_SORT : RECEIVING_SORT];
    if (storedSort && storedSort.order !== null) {
      return storedSort;
    }

    return type === ContactsType.VOUCHEES
      ? {
          type: PROVIDING_COLUMNS.LOAN_STATUS.id,
          order: SortOrder.DESC,
        }
      : {
          type: null,
          order: null,
        };
  });

  const [filters, setFilters] = useState(() => {
    const urlSearchParams = locationSearch();
    if (urlSearchParams.has("filters")) {
      return urlSearchParams.getAll("filters");
    }

    const storedFilters =
      settings[type === ContactsType.VOUCHEES ? PROVIDING_FILTERS : RECEIVING_FILTERS];
    if (storedFilters) {
      return storedFilters;
    }

    return [];
  });

  const typeFilters = filters.filter((f) =>
    type === ContactsType.VOUCHEES
      ? Object.keys(providingFilterFns).includes(f)
      : Object.keys(receivingFilterFns).includes(f)
  );

  const setContact = (contact) => {
    setContactIndex(
      filteredAndSorted.findIndex((c) => compareAddresses(contact.address, c.address))
    );
  };

  const nextContact = () => {
    if (contactIndex + 1 < filteredAndSorted.length) {
      setContactIndex((index) => index + 1);
    }
  };

  const prevContact = () => {
    if (contactIndex > 0) {
      setContactIndex((index) => index - 1);
    }
  };

  const handleSetFilters = (newFilters) => {
    const newSearchParams = new URLSearchParams();
    newFilters.forEach((filter) => newSearchParams.append("filters", filter));
    setSearchParams(newSearchParams);
    setFilters(newFilters);
    setSetting(type === ContactsType.VOUCHEES ? PROVIDING_FILTERS : RECEIVING_FILTERS, newFilters);
  };

  useEffect(() => {
    const urlSearchParams = locationSearch();
    if (urlSearchParams.has("address")) {
      const searchAddress = urlSearchParams.get("address");

      setContactIndex(
        filteredAndSorted.findIndex((v) => compareAddresses(v.address, searchAddress))
      );
    }
  }, []);

  useEffect(() => {
    const storedFilters =
      settings[type === ContactsType.VOUCHEES ? PROVIDING_FILTERS : RECEIVING_FILTERS];
    const storedSort = settings[type === ContactsType.VOUCHEES ? PROVIDING_SORT : RECEIVING_SORT];

    if (storedFilters && storedFilters.length > 0 && !searchParams.has("filters")) {
      handleSetFilters(storedFilters);
    }
    if (storedSort && storedSort.order !== null) {
      setSort(storedSort);
    }
  }, [searchParams, settings, type]);

  useEffect(() => {
    const contact = filteredAndSorted[contactIndex];

    if (contact) {
      open(MANAGE_CONTACT_MODAL, {
        nextContact,
        prevContact,
        contactIndex,
        contactsCount: filteredAndSorted.length,
        address: contact.address,
        clearContact: () => setContactIndex(null),
      });
    }
  }, [contactIndex]);

  const contacts = type === ContactsType.VOUCHEES ? vouchees : vouchers;

  /*--------------------------------------------------------------
    Search, Filter, Paginate 
  *--------------------------------------------------------------*/

  const searched = useContactSearch(contacts, query);

  const filteredAndSorted = useMemo(() => {
    const filtered =
      typeFilters.length > 0
        ? searched.filter((item) =>
            typeFilters
              .map((filter) => (providingFilterFns[filter] || receivingFilterFns[filter])(item))
              .some((x) => x === true)
          )
        : searched;

    return sort.type ? filtered.sort(sortFns[sort.type][sort.order]) : filtered;
  }, [typeFilters, searched, sort.type, sort.order]);

  const handleSortType = (sortType) => {
    if (sort.type !== sortType) {
      const newSort = {
        type: sortType,
        order: SortOrder.DESC,
      };
      setSetting(type === ContactsType.VOUCHEES ? PROVIDING_SORT : RECEIVING_SORT, newSort);
      setSort(newSort);
      return;
    }

    const newSort = {
      ...sort,
      order: !sort.order ? SortOrder.DESC : sort.order === SortOrder.DESC ? SortOrder.ASC : null,
    };
    setSetting(type === ContactsType.VOUCHEES ? PROVIDING_SORT : RECEIVING_SORT, newSort);
    setSort(newSort);
  };

  const handleSortOrder = (order) => {
    setSort((s) => ({
      ...s,
      order,
    }));
  };

  const { data: contactsPage, maxPages, activePage, onChange } = usePagination(filteredAndSorted);

  return (
    <Card className="ContactList" overflow="visible">
      <Box className="ContactList__header" p="24px" align="center">
        <ContactsTypeToggle type={type} setType={setType} />
        <ContactsFilterControls
          type={type}
          filters={typeFilters}
          setQuery={setQuery}
          setFilers={handleSetFilters}
        />
      </Box>

      {/*--------------------------------------------------------------
        Contacts Table 
      *--------------------------------------------------------------*/}
      {filteredAndSorted.length <= 0 ? (
        <Card.Body>
          <TableEmptyStates type={type} filters={filters} />
        </Card.Body>
      ) : (
        <div className="TableContainer">
          {isMobile ? (
            <MobileContactsTable
              type={type}
              data={contactsPage}
              setContact={setContact}
              sort={sort}
              setSortType={handleSortType}
              setSortOrder={handleSortOrder}
            />
          ) : (
            <DesktopContactsTable
              type={type}
              data={contactsPage}
              setContact={setContact}
              sort={sort}
              setSortType={handleSortType}
            />
          )}
        </div>
      )}
      <Pagination pages={maxPages} activePage={activePage} onClick={onChange} />
    </Card>
  );
}
