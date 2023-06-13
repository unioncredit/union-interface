import "./ProtocolData.scss";

import {
  ArrowRightIcon,
  Box,
  Button,
  Card,
  Text,
  UnionIcon,
} from "@unioncredit/ui";
import { mainnet } from "wagmi/chains";
import { useProtocolData } from "providers/ProtocolData";
import { ProposalData } from "components/dao/protocol/ProposalData";
import { ProposalStages } from "components/dao/protocol/ProposalStages";

export default function GovernanceOverview() {
  const { data: protocol = {} } = useProtocolData(mainnet.id);

  return (
    <Card mt="24px" className="ProtocolData">
      <Card.Header title="DAO Governance Overview" />

      <Card.Body>
        <ProposalData protocol={protocol} />
        <ProposalStages mt="24px" protocol={protocol} />

        <Box
          mt="24px"
          className="ProtocolData__TokenCard"
          justify="space-between"
          align="center"
        >
          <Box>
            <UnionIcon className="ProtocolData__TokenCard__union" />

            <Box direction="vertical">
              <Text m={0} grey={800} size="medium" weight="medium">
                $UNION
              </Text>

              <Text m={0} grey={500} weight="medium">
                Governance Token
              </Text>
            </Box>
          </Box>

          <Button
            as="a"
            href="https://etherscan.io/address/0x5Dfe42eEA70a3e6f93EE54eD9C321aF07A85535C"
            target="_blank"
            rel="noopener"
            size="pill"
            variant="light"
            color="secondary"
            label={
              <>
                Etherscan
                <ArrowRightIcon
                  width="16px"
                  height="16px"
                  style={{
                    marginLeft: "4px",
                  }}
                />
              </>
            }
          />
        </Box>
      </Card.Body>
    </Card>
  );
}
