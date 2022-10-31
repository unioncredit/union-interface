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

export default function BorrowersCard() {
  const navigate = useNavigate();
  const { data: vouchees = [] } = useVouchees();

  const {
    data: voucheesPage,
    maxPages,
    activePage,
    onChange,
  } = usePagination(vouchees);

  return (
    <Card mt="24px">
      <Card.Header
        title={`Active borrowers · ${vouchees.length}`}
        subTitle="Contacts actively borrowing against your stake"
      />
      {vouchees.length <= 0 ? (
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
          {voucheesPage.map(({ address }) => (
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
              <TableCell align="right">{format(0)}</TableCell>
            </TableRow>
          ))}
        </Table>
      )}
      <Pagination pages={maxPages} activePage={activePage} onClick={onChange} />
    </Card>
  );
}
