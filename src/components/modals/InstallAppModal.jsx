import "./InstallAppModal.scss";

import { Box, Heading, Modal, ModalOverlay, Text } from "@unioncredit/ui";
import React from "react";
import { useModals } from "providers/ModalManager";

export const INSTALL_APP_MODAL = "install-app-modal";

export const InstallAppModal = () => {
  const { close } = useModals();

  return (
    <ModalOverlay onClick={close}>
      <Modal className="InstallAppModal max-w-[350px]">
        <Modal.Header onClose={close}></Modal.Header>
        <Modal.Body>
          <Box direction="vertical" align="center" className="pt-2">
            <img src="/logo192.png" alt="Union Logo" className="m-auto mb-5 w-[70px] h-[70px]" />
            <Heading m={0} level={2}>
              Install Union
            </Heading>
            <Text grey={500}>Add the app to your home screen</Text>
            <img src="/unionqr.png" alt="https://app.union.finance/" />
          </Box>
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
};
