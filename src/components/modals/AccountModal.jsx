import { useAccount, useDisconnect } from "wagmi";
import { Modal, ModalOverlay, Label, Box, Button, Text } from "@unioncredit/ui";

import MiniProfileCard from "components/shared/MiniProfileCard";
import { useModals } from "providers/ModalManager";

export const ACCOUNT_MODAL = "account-modal";

export default function AccountModal() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { close } = useModals();

  return (
    <ModalOverlay onClick={close}>
      <Modal title="Account" onClose={close}>
        <Box align="center" justify="space-between" mb="20px">
          <Label as="p" size="small" grey={400}>
            Connected with walletName
          </Label>
          <Button
            variant="pill"
            onClick={() => {
              disconnect();
              close();
            }}
            label="Disconnect"
          />
        </Box>
        <MiniProfileCard address={address} />
      </Modal>
    </ModalOverlay>
  );
}
