import {
  Table,
  Card,
  Pagination,
  EmptyState,
  TableRow,
  TableHead,
  Box,
} from "@unioncredit/ui";

export default function VouchersCard() {
  const vouchers = [];

  return (
    <Card mt="24px">
      <Card.Header
        title="Your Vouchers"
        subTitle="Accounts providing you with credit"
      />
      {true ? (
        <Card.Body>
          <EmptyState label="No vouchers" />
        </Card.Body>
      ) : (
        <Table>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>Account</TableHead>
            <TableHead align="right">Trust Amount (DAI)</TableHead>
          </TableRow>
          {/* TODO: display vouchers */}
        </Table>
      )}
      <Pagination pages={10} activePage={5} onClick={() => alert()} />
    </Card>
  );
}
