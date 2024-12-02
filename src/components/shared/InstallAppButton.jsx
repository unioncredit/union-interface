import "./InstallAppButton.scss";

import { Box, Button, ConfettiIcon } from "@unioncredit/ui";

import { INSTALL_APP_MODAL } from "../modals/InstallAppModal";
import { useModals } from "providers/ModalManager";

export const InstallAppButton = () => {
  const { open } = useModals();

  return (
    <Box className="InstallAppButton">
      <Button
        icon={ConfettiIcon}
        label="Install App"
        color="secondary"
        variant="light"
        onClick={() => open(INSTALL_APP_MODAL)}
      />
    </Box>
  );
};
