import {
  Table,
  Card,
  Pagination,
  EmptyState,
  TableRow,
  TableHead,
  Box,
} from "@unioncredit/ui";

export default function MyTransactionHistory() {
  const vouchers = [];

  return (
    <Card mt="24px">
      <Card.Header
        title="Transaction History"
        subTitle="Your credit based transaction history"
      />
      {true ? (
        <Card.Body>
          <EmptyState label="No history" />
        </Card.Body>
      ) : (
        <Table>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>Event</TableHead>
            <TableHead align="right">Value (DAI)</TableHead>
          </TableRow>
          {/* TODO: display history */}
        </Table>
      )}
      <Pagination pages={10} activePage={5} onClick={() => alert()} />
    </Card>
  );
}
