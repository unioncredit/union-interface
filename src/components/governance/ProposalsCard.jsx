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
import { percent } from "utils/numbers";
import { StatusColorMap } from "constants";
import { useGovernance } from "providers/GovernanceData";
import BlockRelativeTime from "components/shared/BlockRelativeTime";

const maxStrLength = 46;

export default function ProposalsCard({
  filter,
  title = "Recent Proposals",
  subTitle = "Most recent proposals",
  emptyLabel = "There are no proposals",
  showAction = true,
}) {
  const { proposals: allProposals } = useGovernance();

  const proposals = filter ? allProposals.filter(filter) : allProposals;

  return (
    <Card mt="24px">
      <Card.Header
        title={title}
        subTitle={subTitle}
        action={
          showAction && (
            <Link to="/governance/proposals">
              <Button variant="secondary" label="View all" inline />
            </Link>
          )
        }
      />
      {proposals.length <= 0 ? (
        <Card.Body>
          <Box fluid>
            <EmptyState fluid label={emptyLabel} />
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
                          color={StatusColorMap[status] || "blue"}
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
