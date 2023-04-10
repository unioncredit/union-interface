import { ContactsTableHead } from "components/contacts/ContactsTable/ContactsTableHead";
import { ContactsType } from "constants";
import { ProvidingTableRow } from "components/contacts/ContactsTable/ProvidingTableRow";
import { ReceivingTableRow } from "components/contacts/ContactsTable/ReceivingTableRow";
import { Table } from "@unioncredit/ui";
import { useVouchees } from "providers/VoucheesData";
import { useVouchers } from "providers/VouchersData";

export function DesktopContactsTable({ type, data, setContact }) {
  const { data: vouchees = [] } = useVouchees();
  const { data: vouchers = [] } = useVouchers();

  return (
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
