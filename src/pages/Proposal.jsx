import { Helmet } from "react-helmet";
import ReactMarkdown from "react-markdown";
import { Link, useParams } from "react-router-dom";
import { ArrowRightIcon, Box, Button, Grid, Heading, Text } from "@unioncredit/ui";

import { ZERO_ADDRESS } from "constants";
import { Avatar, PrimaryLabel } from "components/shared";
import { useGovernance } from "providers/GovernanceData";
import ProposalHistoryCard from "components/dao/ProposalHistoryCard";
import ProposalVotes from "components/dao/ProposalVotes";
import { defaultAbiCoder } from "ethers/lib/utils";

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
            <Box m="30px 0">
              <Link to="/governance">
                <Button
                  size="pill"
                  color="secondary"
                  variant="light"
                  label={
                    <>
                      <ArrowRightIcon
                        width="24px"
                        height="24px"
                        className="flip"
                        style={{
                          marginRight: "4px",
                        }}
                      />
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
                <Button size="pill" label="View bytecode" />
              </a>
            </Box>
            <Box direction="vertical" mt="24px" mb="24px">
              <Heading level={3}>Details</Heading>
              <ol>
                {targets.map((target, i) => {
                  const signature = signatures[i];
                  const calldata = calldatas[i];

                  const args = signature
                    .match(/\((.*?)\)/)?.[0]
                    .replace("(", "")
                    .replace(")", "")
                    .split(",");

                  const decoded = args && calldata && defaultAbiCoder.decode(args, calldata);
                  const argumentString =
                    decoded && decoded.map((item) => item.toString()).join(",");

                  return (
                    <li
                      style={{ listStyle: "decimal", marginLeft: "20px" }}
                      key={`${target}${signature}${calldata}`}
                    >
                      <Text w="100%" m={0} style={{ wordWrap: "break-word" }}>
                        Contract: {target}
                      </Text>
                      <Text grey={500} w="100%" weight="medium" style={{ wordWrap: "break-word" }}>
                        Function: {signature.replace(/(\(=?)(.*)$/, "")}({argumentString})
                      </Text>
                    </li>
                  );
                })}
              </ol>
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
                    <Text size="large" weight="medium" grey={800} {...props} mb="8px" mt="24px" />
                  ),
                  paragraph: (props) => <Text grey={500} {...props} mb="8px" />,
                  listItem: (props) => <Text grey={500} as="li" {...props} />,
                }}
              >
                {description}
              </ReactMarkdown>
            </Box>
          </Grid.Col>
          <Grid.Col md={4}>
            <ProposalVotes data={proposal} />
            <ProposalHistoryCard data={history} />
          </Grid.Col>
        </Grid.Row>
      </Grid>
    </>
  );
}
