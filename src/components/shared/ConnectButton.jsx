import { Button, Wallet } from "@unioncredit/ui";
import { ConnectKitButton } from "connectkit";

import Avatar from "components/shared/Avatar";
import { useModals } from "providers/ModalManager";
import { truncateAddress } from "utils/truncateAddress";
import { ACCOUNT_MODAL } from "components/modals/AccountModal";

export default function ConnectButton({ connectedElement, buttonProps }) {
  const { open } = useModals();

  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, address, ensName }) => {
        if (isConnected) {
          return (
            connectedElement || (
              <Wallet
                avatar={<Avatar address={address} />}
                name={ensName || truncateAddress(address)}
                onClick={() => open(ACCOUNT_MODAL)}
              />
            )
          );
        }

        return (
          <Button
            onClick={show}
            label="Connect"
            className="ConnectButton"
            {...buttonProps}
          />
        );
      }}
    </ConnectKitButton.Custom>
  );
}
