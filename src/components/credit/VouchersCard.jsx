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
import usePagination from "hooks/usePagination";
import { useVouchers } from "providers/VouchersData";
import format from "utils/format";
import { truncateAddress } from "utils/truncateAddress";

export default function VouchersCard() {
  const { data: vouchers = {} } = useVouchers();

  const {
    data: vouchersPage,
    maxPages,
    activePage,
    onChange,
  } = usePagination(vouchers);

  const voucherCount = vouchers.length;

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
          {vouchersPage.map(({ address, trust }) => (
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
              <TableCell align="right">{format(trust)}</TableCell>
            </TableRow>
          ))}
        </Table>
      )}
      <Pagination pages={maxPages} activePage={activePage} onClick={onChange} />
    </Card>
  );
}
