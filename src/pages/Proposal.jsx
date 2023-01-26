import { Fragment } from "react";
import { Helmet } from "react-helmet";
import ReactMarkdown from "react-markdown";
import { Link, useParams } from "react-router-dom";
import { Box, Button, Grid, Heading, Text } from "@unioncredit/ui";
import { ReactComponent as ArrowRight } from "@unioncredit/ui/lib/icons/arrowRight.svg";

import { ZERO_ADDRESS } from "constants";
import Avatar from "components/shared/Avatar";
import { useGovernance } from "providers/GovernanceData";
import PrimaryLabel from "components/shared/PrimaryLabel";
import ProposalHistoryCard from "components/governance/ProposalHistoryCard";
import VotingCard from "components/governance/VotingCard";
import NetworkNotice from "components/governance/NetworkNotice";

export default function ProposalPage() {
  const { hash } = useParams();
  const { proposals } = useGovernance();

  const proposal = proposals.find((p) => p.hash === hash) || {};

  const {
    description,
    proposer = ZERO_ADDRESS,
    targets = [],
    signatures = [],
    calldatas = [],
    history = [],
  } = proposal;

  const title =
    String(description)
      ?.replace(/\\{1,2}n/g, "\n")
      ?.split("\n")
      ?.filter(Boolean)[0] || "Untitled";

  if (!proposal) {
    // TODO: skeleton
    return null;
  }

  return (
    <>
      <Helmet>
        <title>{title} | Union Credit Protocol</title>
      </Helmet>
      <Grid>
        {/* ----------------------------------------------
         * Breadcrumbs
         * ---------------------------------------------- */}
        <Grid.Row>
          <Grid.Col>
            <Box mb="30px">
              <Link to="/governance/proposals">
                <Button
                  variant="lite"
                  label={
                    <>
                      <ArrowRight className="flip" width="24px" height="24px" />
                      Back to proposals
                    </>
                  }
                />
              </Link>
            </Box>
          </Grid.Col>
        </Grid.Row>
        {/* ----------------------------------------------
         * Proposal
         * ---------------------------------------------- */}
        <Grid.Row>
          <Grid.Col md={8}>
            <Heading size="xlarge" mb="12px" grey={800}>
              {title}
            </Heading>
            <Text size="small" grey={400}>
              PROPOSED BY
            </Text>
            <Box>
              <Avatar address={proposer} size={24} />
              <Text mb="0" mx="8px">
                <PrimaryLabel address={proposer} />
              </Text>
            </Box>
            <Box mt="16px">
              <a href="#" target="_blank" rel="noreferrer">
                <Button variant="pill" label="View bytecode" />
              </a>
            </Box>
            <Box direction="vertical" mt="24px">
              <Heading level={3}>Description</Heading>
              <ReactMarkdown
                renderers={{
                  link: (props) => (
                    <Link to={props.href}>
                      <Text as="a" {...props} color="blue600" />
                    </Link>
                  ),
                  heading: (props) => (
                    <Text
                      size="large"
                      grey={800}
                      {...props}
                      mb="8px"
                      mt="24px"
                    />
                  ),
                  paragraph: (props) => <Text {...props} mb="8px" />,
                  listItem: (props) => <Text as="li" {...props} />,
                }}
              >
                {description}
              </ReactMarkdown>
            </Box>

            <Box direction="vertical" mt="24px" mb="24px">
              <Heading level={3}>Details</Heading>
              {targets.map((target, i) => {
                const signature = signatures[i];
                const calldata = calldatas[i];

                const args = signature
                  .match(/\((.*?)\)/)?.[0]
                  .replace("(", "")
                  .replace(")", "")
                  .split(",");

                const decoded =
                  args && calldata && defaultAbiCoder.decode(args, calldata);
                const argumentString =
                  decoded && decoded.map((item) => item.toString()).join(",");

                return (
                  <Fragment key={`${target}${signature}${calldata}`}>
                    <Text
                      as="a"
                      w="100%"
                      m={0}
                      grey={800}
                      href={"#"}
                      target="_blank"
                      rel="noreferrer"
                      style={{ wordWrap: "break-word" }}
                    >
                      Contract: {target}
                    </Text>
                    <Text w="100%" style={{ wordWrap: "break-word" }}>
                      Function: {signature.replace(/(\(=?)(.*)$/, "")}(
                      {argumentString})
                    </Text>
                  </Fragment>
                );
              })}
            </Box>
          </Grid.Col>
          <Grid.Col md={4}>
            <VotingCard data={proposal} />
            <NetworkNotice lite />
            <ProposalHistoryCard data={history} />
          </Grid.Col>
        </Grid.Row>
      </Grid>
    </>
  );
}
