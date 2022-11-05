import {
  Modal,
  ModalOverlay,
  Box,
  Union,
  Heading,
  Label,
  Divider,
  Button,
} from "@unioncredit/ui";
import { ReactComponent as External } from "@unioncredit/ui/lib/icons/external.svg";

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
              {format(unionBalance.add(unclaimedRewards))}
              <Union />
            </Heading>
            <Label m={0} grey={400}>
              Total Balance
            </Label>
          </Box>

          <Box justify="space-between" mt="8px">
            <Label as="p" grey={400}>
              Wallet
            </Label>
            <Label as="p" grey={700} m={0}>
              <Union value={format(unionBalance)} />
            </Label>
          </Box>
          <Divider mb="8px" />
          <Box justify="space-between" mb="18px">
            <Label as="p" grey={400}>
              Unclaimed
            </Label>
            <Label as="p" grey={700} m={0}>
              <Union value={format(unclaimedRewards)} />
            </Label>
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
            variant="secondary"
            label="Union Governance"
            href="#"
            icon={External}
          />
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
}
