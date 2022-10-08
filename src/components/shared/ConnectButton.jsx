import { Button, Wallet } from "@unioncredit/ui";
import { ConnectKitButton } from "connectkit";

import Avatar from "components/shared/Avatar";
import { useModals } from "providers/ModalManager";
import { ACCOUNT_MODAL } from "components/modals/AccountModal";

export default function ConnectButton() {
  const { open } = useModals();

  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, address, ensName }) => {
        if (isConnected) {
          return (
            <Wallet
              avatar={<Avatar address={address} />}
              name={ensName}
              onClick={() => open(ACCOUNT_MODAL)}
            />
          );
        }

        return <Button onClick={show} label="Connect" />;
      }}
    </ConnectKitButton.Custom>
  );
}
