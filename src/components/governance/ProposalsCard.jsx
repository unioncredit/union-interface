import { Link } from "react-router-dom";
import {
  Card,
  Button,
  Box,
  Table,
  Label,
  Badge,
  EmptyState,
} from "@unioncredit/ui";

// TODO:
const statusColorMap = {};

export default function ProposalsCard({ count }) {
  // TODO:
  const proposals = [];

  return (
    <Card mt="24px">
      <Card.Header
        title="Recent Proposals"
        subTitle="Most recent proposals"
        action={
          <Link to="/governance/proposals">
            <Button variant="secondary" label="View all" inline />
          </Link>
        }
      />
      {proposals.length <= 0 ? (
        <Card.Body>
          <Box fluid>
            <EmptyState fluid label="There are no live proposals" />
          </Box>
        </Card.Body>
      ) : (
        <Box mt="24px">
          <Table>
            {proposals.map(({ status, title, percentageFor, start }) => (
              <TableRow onClick={() => alert()}>
                <TableCell>
                  <Text mb="4px">
                    {title.slice(0, maxStrLength)}
                    {title.length > maxStrLength && "..."}
                  </Text>
                  <Label>
                    <Badge
                      color={statusColorMap[status] || "blue"}
                      label={status.slice(0, 1).toUpperCase() + status.slice(1)}
                      mr="8px"
                    />
                    0% yes &bull; start date
                  </Label>
                </TableCell>
              </TableRow>
            ))}
          </Table>
        </Box>
      )}
    </Card>
  );
}
