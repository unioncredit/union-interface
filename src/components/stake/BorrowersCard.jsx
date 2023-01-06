import {
  Table,
  Card,
  Pagination,
  EmptyState,
  TableRow,
  TableCell,
  TableHead,
  Box,
  Label,
} from "@unioncredit/ui";
import { useNavigate } from "react-router-dom";

import format from "utils/format";
import Avatar from "components/shared/Avatar";
import usePagination from "hooks/usePagination";
import { useVouchees } from "providers/VoucheesData";
import { truncateAddress } from "utils/truncateAddress";
import StatusBadge from "components/shared/StatusBadge";
import PrimaryLabel from "components/shared/PrimaryLabel";
import { ZERO } from "constants";

export default function BorrowersCard() {
  const navigate = useNavigate();
  const { data: vouchees = [] } = useVouchees();

  const borrowers = vouchees
    .filter((vouchee) => vouchee.locking.gt(ZERO))
    .sort((a, b) => {
      if (a.isOverdue && b.isOverdue) {
        return a.locking.gt(b.locking) ? -1 : 1;
      } else if (!a.isOverdue && !b.isOverdue) {
        return a.locking.gt(b.locking) ? -1 : 1;
      } else {
        return a.isOverdue ? -1 : 1;
      }
    });

  const {
    data: borrowersPage,
    maxPages,
    activePage,
    onChange,
  } = usePagination(borrowers);

  return (
    <Card mt="24px">
      <Card.Header
        title={`Active borrowers · ${borrowers.length}`}
        subTitle="Contacts actively borrowing against your stake"
      />
      {vouchees.length <= 0 ? (
        <Card.Body>
          <EmptyState label="No borrowers" />
        </Card.Body>
      ) : (
        <>
          <Box mt="16px" />
          <Table>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Account</TableHead>
              <TableHead align="center">Status</TableHead>
              <TableHead align="right">Balance owed (DAI)</TableHead>
            </TableRow>
            {borrowersPage.map(({ address, locking }) => (
              <TableRow
                key={address}
                onClick={() => navigate(`/contacts?address=${address}`)}
              >
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
                <TableCell align="center">
                  <StatusBadge address={address} />
                </TableCell>
                <TableCell align="right">{format(locking)}</TableCell>
              </TableRow>
            ))}
          </Table>
        </>
      )}
      <Pagination pages={maxPages} activePage={activePage} onClick={onChange} />
    </Card>
  );
}
