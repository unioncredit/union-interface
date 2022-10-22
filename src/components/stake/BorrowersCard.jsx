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

import format from "utils/format";
import Avatar from "components/shared/Avatar";
import { useVouchees } from "providers/VoucheesData";
import { truncateAddress } from "utils/truncateAddress";
import PrimaryLabel from "components/shared/PrimaryLabel";
import StatusBadge from "components/shared/StatusBadge";

export default function BorrowersCard() {
  const { data: vouchees = [] } = useVouchees();

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
          {vouchees.map(({ address }) => (
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
              <TableCell align="center">
                <StatusBadge address={address} />
              </TableCell>
              <TableCell align="right">{format(0)}</TableCell>
            </TableRow>
          ))}
        </Table>
      )}
      <Pagination pages={10} activePage={5} onClick={() => alert()} />
    </Card>
  );
}
