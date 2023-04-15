import {
  COLUMNS as PROVIDING_COLUMNS,
  ProvidingTableRow,
} from "components/contacts/ContactsTable/ProvidingTableRow";
import { Table, TableHead, TableRow } from "@unioncredit/ui";
import { useEffect, useState } from "react";
import MobileColumnToggle from "components/contacts/ContactsTable/MobileColumnToggle";
import { ContactsType } from "constants";
import {
  COLUMNS as RECEIVING_COLUMNS,
  ReceivingTableRow,
} from "components/contacts/ContactsTable/ReceivingTableRow";
import { useVouchees } from "providers/VoucheesData";
import { useVouchers } from "providers/VouchersData";

export function MobileContactsTable({ type, data, setContact, sort, setSort }) {
  const { data: vouchees = [] } = useVouchees();
  const { data: vouchers = [] } = useVouchers();

  const [selectedColumn, setSelectedColumn] = useState(
    type === ContactsType.VOUCHEES
      ? PROVIDING_COLUMNS.LOAN_STATUS
      : RECEIVING_COLUMNS.TRUST_SET
  );

  useEffect(() => {
    setSelectedColumn(
      type === ContactsType.VOUCHEES
        ? PROVIDING_COLUMNS.LOAN_STATUS
        : RECEIVING_COLUMNS.TRUST_SET
    );
  }, [type]);

  return (
    <Table>
      <TableRow>
        <TableHead></TableHead>
        <TableHead>Account</TableHead>

        <TableHead align="right">
          <MobileColumnToggle
            sort={sort}
            setSort={setSort}
            columns={Object.values(
              type === ContactsType.VOUCHEES
                ? PROVIDING_COLUMNS
                : RECEIVING_COLUMNS
            )}
            active={selectedColumn}
            setSelectedColumn={setSelectedColumn}
          />
        </TableHead>
      </TableRow>

      {data.map((row) =>
        type === ContactsType.VOUCHEES ? (
          <ProvidingTableRow
            key={`${selectedColumn}_${row.address}`}
            active={selectedColumn}
            data={row}
            setContact={setContact}
            receiving={vouchers.find((v) => v.address === row.address)}
          />
        ) : (
          <ReceivingTableRow
            key={`${selectedColumn}_${row.address}`}
            active={selectedColumn}
            data={row}
            setContact={setContact}
            providing={vouchees.find((v) => v.address === row.address)}
          />
        )
      )}
    </Table>
  );
}
