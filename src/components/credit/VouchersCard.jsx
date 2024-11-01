import {
  Table,
  Card,
  Pagination,
  EmptyState,
  TableRow,
  TableHead,
  Text,
  TableCell,
  Box,
} from "@unioncredit/ui";
import { useNavigate } from "react-router-dom";

import format from "utils/format";
import { Avatar, PrimaryLabel } from "components/shared";
import usePagination from "hooks/usePagination";
import { useVouchers } from "providers/VouchersData";
import { truncateAddress } from "utils/truncateAddress";
import { useSettings } from "providers/Settings";

export default function VouchersCard() {
  const navigate = useNavigate();
  const { data: vouchers = [] } = useVouchers();
  const {
    settings: { useToken },
  } = useSettings();

  const vouchersOrdered = vouchers.sort((a, b) => (a.vouch.gt(b.vouch) ? -1 : 1));

  const { data: vouchersPage, maxPages, activePage, onChange } = usePagination(vouchersOrdered);

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
        <>
          <Box mt="24px" />
          <Table>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Account</TableHead>
              <TableHead align="right">Vouch ({useToken})</TableHead>
            </TableRow>
            {vouchersPage.map(({ address, vouch }) => (
              <TableRow
                key={address}
                onClick={() => navigate(`/contacts/trusts-you?address=${address}`)}
              >
                <TableCell fixedSize>
                  <Avatar size={24} address={address} />
                </TableCell>
                <TableCell>
                  <Box direction="vertical">
                    <Text grey={700} m={0}>
                      <PrimaryLabel address={address} />
                    </Text>
                    <Text size="small" grey={400} m={0}>
                      {truncateAddress(address)}
                    </Text>
                  </Box>
                </TableCell>
                <TableCell align="right">{format(vouch, useToken)}</TableCell>
              </TableRow>
            ))}
          </Table>
        </>
      )}
      <Pagination pages={maxPages} activePage={activePage} onClick={onChange} />
    </Card>
  );
}
