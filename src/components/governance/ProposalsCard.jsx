import {
  Card,
  Box,
  Table,
  Badge,
  EmptyState,
  TableCell,
  TableRow,
  Text,
  TableHead,
} from "@unioncredit/ui";
import { useNavigate } from "react-router-dom";

import { StatusColorMap } from "constants";
import { useGovernance } from "providers/GovernanceData";
import { useBlockTime } from "hooks/useBlockTime";
import { useNetwork } from "wagmi";

const maxStrLength = 46;

export default function ProposalsCard({
  filter,
  title = "Proposal History",
  emptyLabel = "There are no proposals",
}) {
  const { chain } = useNetwork();
  const { proposals: allProposals } = useGovernance();

  const proposals = filter ? allProposals.filter(filter) : allProposals;

  return (
    <Card mt="24px">
      <Card.Header title={title} />
      {proposals.length <= 0 ? (
        <Card.Body>
          <Box fluid>
            <EmptyState fluid label={emptyLabel} />
          </Box>
        </Card.Body>
      ) : (
        <Box mt="24px">
          <Table>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead align="center">ID</TableHead>
              <TableHead align="right">Status</TableHead>
            </TableRow>

            {proposals.map((data) => (
              <ProposalRow key={data.hash} chainId={chain.id} {...data} />
            ))}
          </Table>
        </Box>
      )}
    </Card>
  );
}

function ProposalRow({ chainId, hash, status, description, startBlock }) {
  const navigate = useNavigate();
  const { relative: relativeProposalEndsTime } = useBlockTime(
    startBlock,
    chainId
  );

  const id = description.split(":")[0];
  const title =
    String(description)
      ?.replace(/\\{1,2}n/g, "\n")
      ?.split("\n")
      ?.filter(Boolean)[0] || "Untitled";

  return (
    <TableRow onClick={() => navigate(`/governance/proposals/${hash}`)}>
      <TableCell>
        <Text mb="4px">
          {title.slice(0, maxStrLength)}
          {title.length > maxStrLength && "..."}
        </Text>
        <Text color="grey500">
          {status === "pending" || status === "active"
            ? "Voting ends "
            : "Ended "}
          {relativeProposalEndsTime}
        </Text>
      </TableCell>
      <TableCell align="center">
        <Badge color="grey" label={id} />
      </TableCell>
      <TableCell align="right">
        <Badge
          label={status}
          className="capitalizeFirst"
          color={StatusColorMap[status] || "blue"}
        />
      </TableCell>
    </TableRow>
  );
}
