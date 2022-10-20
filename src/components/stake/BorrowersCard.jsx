import {
  Table,
  Card,
  Pagination,
  EmptyState,
  TableRow,
  TableHead,
  Box,
} from "@unioncredit/ui";

export default function BorrowersCard() {
  const borrowers = [];

  return (
    <Card mt="24px">
      <Card.Header
        title={`Active borrowers · ${borrowers.length}`}
        subTitle="Contacts actively borrowing against your stake"
      />
      {true ? (
        <Card.Body>
          <EmptyState label="No borrowers" />
        </Card.Body>
      ) : (
        <Table>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>Account</TableHead>
            <TableHead align="center">Status</TableHead>
            <TableHead align="right">Balance owed (DAI)</TableHead>
          </TableRow>
          {/* TODO: display borrowers */}
        </Table>
      )}
      <Pagination pages={10} activePage={5} onClick={() => alert()} />
    </Card>
  );
}
