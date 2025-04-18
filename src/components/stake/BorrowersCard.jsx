import "./BorrowersCard.scss";

import {
  Box,
  Card,
  EmptyState,
  Pagination,
  Table,
  TableCell,
  TableHead,
  TableRow,
  Text,
} from "@unioncredit/ui";
import { useNavigate } from "react-router-dom";

import format from "utils/format";
import { Avatar, PrimaryLabel, StatusBadge } from "components/shared";
import usePagination from "hooks/usePagination";
import { useVouchees } from "providers/VoucheesData";
import { truncateAddress } from "utils/truncateAddress";
import { ZERO } from "constants";
import useResponsive from "hooks/useResponsive";
import { useToken } from "hooks/useToken";

export default function BorrowersCard() {
  const navigate = useNavigate();
  const { isMicro } = useResponsive();
  const { token } = useToken();

  const { data: vouchees = [] } = useVouchees();

  const borrowers = vouchees
    .filter((vouchee) => vouchee.locking > ZERO)
    .sort((a, b) => {
      if (a.isOverdue && b.isOverdue) {
        return a.locking > b.locking ? -1 : 1;
      } else if (!a.isOverdue && !b.isOverdue) {
        return a.locking > b.locking ? -1 : 1;
      } else {
        return a.isOverdue ? -1 : 1;
      }
    });

  const { data: borrowersPage, maxPages, activePage, onChange } = usePagination(borrowers);

  return (
    <Card mt="24px" className="BorrowersCard">
      <Card.Header
        title="Active borrowers"
        subTitle="Contacts actively borrowing against your stake"
      />
      <Box mt="16px" />
      {borrowers.length <= 0 ? (
        <Card.Body>
          <EmptyState label="No borrowers" />
        </Card.Body>
      ) : (
        <Table className="BorrowersCard__table">
          <TableRow>
            <TableHead></TableHead>
            <TableHead>Account</TableHead>
            <TableHead align="center">Status</TableHead>
            <TableHead align="right">
              {isMicro ? `Owed (${token})` : `Balance owed (${token})`}
            </TableHead>
          </TableRow>
          {borrowersPage.map(({ address, locking }) => (
            <TableRow
              key={address}
              onClick={() => navigate(`/contacts/providing?address=${address}`)}
            >
              <TableCell fixedSize>
                <Avatar size={24} address={address} />
              </TableCell>
              <TableCell>
                <Box direction="vertical">
                  <Text grey={800} m={0} size="medium" weight="medium">
                    <PrimaryLabel address={address} />
                  </Text>
                  <Text grey={500} m={0} size="small" weight="medium">
                    {truncateAddress(address)}
                  </Text>
                </Box>
              </TableCell>
              <TableCell align="center">
                <StatusBadge address={address} />
              </TableCell>
              <TableCell align="right">{format(locking, token)}</TableCell>
            </TableRow>
          ))}
        </Table>
      )}
      <Pagination pages={maxPages} activePage={activePage} onClick={onChange} />
    </Card>
  );
}
