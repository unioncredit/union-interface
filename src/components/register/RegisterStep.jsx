import { Box, Card, CheckIcon, EthereumIcon, Heading, Text } from "@unioncredit/ui";

import { ZERO } from "constants";
import format from "utils/format";
import { NetworkSelect } from "components/shared";
import { EthRegisterButton } from "./EthRegisterButton";
import { WELCOME_MODAL } from "components/modals/WelcomeModal";
import { useModals } from "providers/ModalManager";
import { useToken } from "hooks/useToken";
import { useProtocol } from "providers/ProtocolData";
import { useMember } from "providers/MemberData";

export const RegisterStep = () => {
  const { open } = useModals();
  const { token } = useToken();
  const { data: protocol = {} } = useProtocol();
  const { data: member = {}, refetch: refetchMember } = useMember();

  const { creditLimit = ZERO } = member;
  const { regFee = ZERO, rebate = ZERO } = protocol;
  const ethRegisterFee = regFee + rebate;

  return (
    <Card size="fluid" className="RegisterStep">
      <span id="step-3" />
      <Card.Body>
        <Heading m="6px 0 12px" level={2} size="large" align="center" grey={700}>
          Become a Member
        </Heading>
        <Text grey={500} size="medium">
          Register your address and get access to{" "}
          {creditLimit > ZERO && `$${format(creditLimit, token)} in `} on-chain credit.
        </Text>

        <Box mt="48px" align="center" direction="vertical">
          <Box w="380px" direction="vertical" align="center">
            <Box className="Register__container" align="center">
              <Box className="Register__fee" align="center">
                <Text size="large" weight="bold">
                  Fee: {format(ethRegisterFee, "ETH", 10, false, true, false)}
                </Text>

                <Box className="Register__icon">
                  <EthereumIcon width="16px" style={{ marginLeft: "5px" }} />
                </Box>
              </Box>
              <NetworkSelect />
            </Box>

            <EthRegisterButton
              onComplete={() =>
                open(WELCOME_MODAL, {
                  onClose: refetchMember,
                })
              }
            />
          </Box>
        </Box>
      </Card.Body>
      <Card.Footer align="center" direction="vertical">
        <Heading level={2} size="small" weight="bold">
          Membership Benefits:
        </Heading>
        <ul className="Register__benefits">
          <li>
            <CheckIcon />
            Give credit to trusted friends
          </li>
          <li>
            <CheckIcon />
            Borrow without collateral
          </li>
          <li>
            <CheckIcon />
            Build credit free from middlemen
          </li>
          <li>
            <CheckIcon />
            Participate in Union Governance
          </li>
        </ul>
      </Card.Footer>
    </Card>
  );
};
