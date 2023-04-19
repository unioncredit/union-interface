import { ContactsTableHead } from "components/contacts/ContactsTable/ContactsTableHead";
import { ContactsType } from "constants";
import {
  ProvidingTableRow,
  COLUMNS as PROVIDING_COLUMNS,
} from "components/contacts/ContactsTable/ProvidingTableRow";
import {
  ReceivingTableRow,
  COLUMNS as RECEIVING_COLUMNS,
} from "components/contacts/ContactsTable/ReceivingTableRow";
import { Table } from "@unioncredit/ui";
import { useVouchees } from "providers/VoucheesData";
import { useVouchers } from "providers/VouchersData";

export function DesktopContactsTable({
  type,
  data,
  setContact,
  sort,
  setSortType,
}) {
  const { data: vouchees = [] } = useVouchees();
  const { data: vouchers = [] } = useVouchers();

  return (
    <Table>
      <ContactsTableHead
        sort={sort}
        setSortType={setSortType}
        items={
          type === ContactsType.VOUCHEES
            ? [
                PROVIDING_COLUMNS.TRUST_SET,
                PROVIDING_COLUMNS.TOTAL_VOUCH,
                PROVIDING_COLUMNS.STAKE_LOCKED,
                PROVIDING_COLUMNS.LAST_PAYMENT,
                PROVIDING_COLUMNS.LOAN_STATUS,
              ]
            : [
                RECEIVING_COLUMNS.TRUST_SET,
                RECEIVING_COLUMNS.TOTAL_VOUCH,
                RECEIVING_COLUMNS.REAL_VOUCH,
                RECEIVING_COLUMNS.LOCKING,
                RECEIVING_COLUMNS.BORROWABLE,
              ]
        }
      />

      {data.map((row) =>
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
  );
}
