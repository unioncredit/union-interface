import {
  Table,
  Card,
  Pagination,
  EmptyState,
  TableRow,
  TableHead,
  Label,
  TableCell,
  Box,
} from "@unioncredit/ui";
import Avatar from "components/shared/Avatar";
import PrimaryLabel from "components/shared/PrimaryLabel";
import { useVouchers } from "providers/VouchersData";
import format from "utils/format";
import { truncateAddress } from "utils/truncateAddress";

export default function VouchersCard() {
  const { data: vouchers = {} } = useVouchers();

  const voucherCount = Object.keys(vouchers).length;

  return (
    <Card mt="24px">
      <Card.Header
        title={`Your Vouchers · ${voucherCount}`}
        subTitle="Accounts providing you with credit"
      />
      {voucherCount <= 0 ? (
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
          {Object.keys(vouchers).map((address) => (
            <TableRow key={address}>
              <TableCell fixedSize>
                <Avatar size={24} address={address} />
              </TableCell>
              <TableCell>
                <Box direction="vertical">
                  <Label grey={700} m={0}>
                    <PrimaryLabel address={address} />
                  </Label>
                  <Label size="small" grey={400} m={0}>
                    {truncateAddress(address)}
                  </Label>
                </Box>
              </TableCell>
              <TableCell align="right">
                {format(vouchers[address].trust)}
              </TableCell>
            </TableRow>
          ))}
        </Table>
      )}
      <Pagination pages={10} activePage={5} onClick={() => alert()} />
    </Card>
  );
}
