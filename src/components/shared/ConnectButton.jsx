import { Button, Wallet } from "@unioncredit/ui";
import { ConnectButton as RainbowKitConnectButton } from "@rainbow-me/rainbowkit";

import { Avatar } from "components/shared";
import { useModals } from "providers/ModalManager";
import { truncateAddress } from "utils/truncateAddress";
import { ACCOUNT_MODAL } from "components/modals/AccountModal";

export function ConnectButton({ connectedElement, buttonProps }) {
  const { open } = useModals();

  return (
    <RainbowKitConnectButton.Custom>
      {({ account, chain, openConnectModal, mounted }) => {
        const { displayName, address } = account || {};

        const isConnected = mounted && account && chain;

        if (isConnected) {
          return (
            connectedElement || (
              <Wallet
                avatar={<Avatar address={address} />}
                name={displayName || truncateAddress(address)}
                onClick={() => open(ACCOUNT_MODAL)}
              />
            )
          );
        }

        return (
          <Button
            size="thin"
            color="secondary"
            variant="light"
            label="Connect Wallet"
            className="ConnectButton"
            onClick={openConnectModal}
            style={{ height: "40px", fontSize: "16px" }}
            {...buttonProps}
          />
        );
      }}
    </RainbowKitConnectButton.Custom>
  );
}
