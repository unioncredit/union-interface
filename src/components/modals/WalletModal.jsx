import {
  Modal,
  ModalOverlay,
  Box,
  Union,
  Heading,
  Text,
  Divider,
  Button,
  LinkOutIcon,
} from "@unioncredit/ui";

import format from "utils/format";
import { useMember } from "providers/MemberData";
import { useModals } from "providers/ModalManager";
import useWrite from "hooks/useWrite";
import { ZERO } from "constants";

export const WALLET_MODAL = "wallet-modal";

export default function WalletModal() {
  const { close } = useModals();
  const { data: member = {} } = useMember();

  const { unclaimedRewards = ZERO, unionBalance = ZERO } = member;

  /*--------------------------------------------------------------
    Contract Functions
   --------------------------------------------------------------*/

  const buttonProps = useWrite({
    contract: "userManager",
    method: "withdrawRewards",
    enabled: unclaimedRewards.gt(0),
  });

  /*--------------------------------------------------------------
    Render Component 
   --------------------------------------------------------------*/

  return (
    <ModalOverlay onClick={close}>
      <Modal className="WalletModal">
        <Modal.Header title="UNION Balance" onClose={close} />
        <Modal.Body>
          <Box align="center" justify="center" direction="vertical">
            <Heading grey={800} size="xlarge" m={0}>
              {format(unionBalance.add(unclaimedRewards), 4)}
              <Union />
            </Heading>
            <Text m={0} grey={400}>
              Total Balance
            </Text>
          </Box>

          <Box justify="space-between" mt="8px">
            <Text grey={400}>Wallet</Text>
            <Text grey={700} m={0}>
              <Union value={format(unionBalance)} />
            </Text>
          </Box>
          <Divider mb="8px" />
          <Box justify="space-between" mb="18px">
            <Text grey={400}>Unclaimed</Text>
            <Text grey={700} m={0}>
              <Union value={format(unclaimedRewards)} />
            </Text>
          </Box>

          <Button
            fluid
            label={
              buttonProps.disabled
                ? "No tokens to claim"
                : `Claim ${format(unclaimedRewards)} UNION`
            }
            {...buttonProps}
          />
          <Button
            fluid
            as="a"
            mt="4px"
            target="_blank"
            color="secondary"
            // variant="light"
            label="Union Governance"
            href="#"
            icon={LinkOutIcon}
            iconPosition="end"
            iconProps={{
              style: {
                width: "12px",
                height: "12px",
              },
            }}
          />
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
}
