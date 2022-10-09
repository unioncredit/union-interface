import {
  Modal,
  ModalOverlay,
  Box,
  Button,
  Heading,
  Badge,
  ButtonRow,
} from "@unioncredit/ui";
import { useAccount, useDisconnect } from "wagmi";

import { useModals } from "providers/ModalManager";
import Avatar from "components/shared/Avatar";
import { Link } from "react-router-dom";

export const ACCOUNT_MODAL = "account-modal";

export default function AccountModal() {
  const { close } = useModals();
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <ModalOverlay onClick={close}>
      <Modal title="Wallet & Activity" onClose={close}>
        <Box align="center" justify="center" direction="vertical">
          <Link to={`/profile/${address}`}>
            <Avatar size={56} address={address} />
          </Link>
          <Heading level={2} mb="4px">
            Primary
          </Heading>
          <Badge label="0x0000...0000" color="grey" />
        </Box>
        <ButtonRow mt="24px">
          <Button size="small" fluid label="View Profile" />
          <Button
            size="small"
            fluid
            label="Disconnect Wallet"
            onClick={() => {
              disconnect();
              close();
            }}
          />
        </ButtonRow>
      </Modal>
    </ModalOverlay>
  );
}
