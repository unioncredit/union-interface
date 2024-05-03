import "./Register.scss";

import { Helmet } from "react-helmet";
import { Box, Card, CheckIcon, EthereumIcon, Heading, Text } from "@unioncredit/ui";

import { ZERO } from "constants";
import format from "utils/format";
import { useMember } from "providers/MemberData";
import { useProtocol } from "providers/ProtocolData";
import { useModals } from "providers/ModalManager";
import { WELCOME_MODAL } from "components/modals/WelcomeModal";
import { EthRegisterButton } from "../components/register/EthRegisterButton";
import { NetworkSelect } from "components/shared";
import { TextSeparator } from "components/shared/TextSeparator";

export default function RegisterPage() {
  const { open } = useModals();
  const { data: protocol = {} } = useProtocol();
  const { data: member = {} } = useMember();

  const { creditLimit = ZERO } = member;
  const { regFee = ZERO, rebate = ZERO } = protocol;
  const ethRegisterFee = regFee.add(rebate);

  return (
    <>
      <Helmet>
        <title>Register | Union Credit Protocol</title>
      </Helmet>
      <Card size="fluid" className="Register">
        <Card.Body>
          <Heading m="6px 0 16px" level={2} size="large" grey={700} align="center">
            Become a Member
          </Heading>
          <Text grey={500} size="medium" align="center">
            Register your address in order to access{" "}
            {creditLimit.gt(ZERO) && `your $${format(creditLimit)} in credit and`} all the benefits
            of being a member of the union credit network.
          </Text>

          <Box mt="16px" align="center" direction="vertical">
            <Box w="380px" direction="vertical" align="center">
              <Box className="Register__container" align="center">
                <Box className="Register__fee" align="center">
                  <Text size="large" weight="bold">
                    Fee: {format(ethRegisterFee, 10, false, true, false)}
                  </Text>

                  <Box className="Register__icon">
                    <EthereumIcon width="16px" style={{ marginLeft: "5px" }} />
                  </Box>
                </Box>
                <NetworkSelect />
              </Box>

              <EthRegisterButton onComplete={() => open(WELCOME_MODAL)} />
            </Box>
            <TextSeparator m="12px 0" w="90%" maxw="350px">
              or
            </TextSeparator>
            <a
              rel="noreferrer"
              target="_blank"
              className="Register__mogo"
              href="https://zora.co/collect/oeth:0xa73be24fb5df82f45c5848f099451b5bea427474/2?referrer=0x729dF3924822C9a2CA1995c05Eb801A395329F35"
            >
              Mint One, Gift One -&gt;
            </a>
            <Text mt="16px" color="grey400" align="center" maxw="300px">
              For a limited time, you can mint an NFT that will automatically register you, that you
              can then send to a friend to Gift them a membership.
            </Text>
          </Box>
        </Card.Body>
        <Card.Footer align="center" direction="vertical">
          <Heading level={2} size="small" weight="bold">
            Membership Benefits:
          </Heading>
          <ul className="Register__benefits">
            <li>
              <CheckIcon />
              Give credit to your trusted friends
            </li>
            <li>
              <CheckIcon />
              Borrow without collateral
            </li>
            <li>
              <CheckIcon />
              Build a credit system free from bankers
            </li>
            <li>
              <CheckIcon />
              Participate in Union Governance
            </li>
          </ul>
        </Card.Footer>
      </Card>
    </>
  );
}
