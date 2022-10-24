import { Link } from "react-router-dom";
import {
  Card,
  Button,
  Box,
  Table,
  Label,
  Badge,
  EmptyState,
  TableCell,
  TableRow,
  Text,
} from "@unioncredit/ui";
import { useGovernance } from "providers/GovernanceData";
import { percent } from "utils/numbers";
import BlockRelativeTime from "components/shared/BlockRelativeTime";

// TODO:
const statusColorMap = {
  executed: "green",
  active: "purple",
  canceled: "blue",
  defeated: "red",
};

const maxStrLength = 46;

export default function ProposalsCard() {
  const { proposals } = useGovernance();

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
            {proposals.map(
              ({ status, description, percentageFor, startBlock }) => {
                const title =
                  String(description)
                    ?.replace(/\\{1,2}n/g, "\n")
                    ?.split("\n")
                    ?.filter(Boolean)[0] || "Untitled";

                return (
                  <TableRow onClick={() => alert()}>
                    <TableCell>
                      <Text mb="4px">
                        {title.slice(0, maxStrLength)}
                        {title.length > maxStrLength && "..."}
                      </Text>
                      <Label>
                        <Badge
                          color={statusColorMap[status] || "blue"}
                          label={status}
                          mr="8px"
                        />
                        {percent(percentageFor)} yes &bull;{" "}
                        <BlockRelativeTime block={startBlock} />
                      </Label>
                    </TableCell>
                  </TableRow>
                );
              }
            )}
          </Table>
        </Box>
      )}
    </Card>
  );
}
