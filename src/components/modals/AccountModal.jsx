import "./AccountModal.scss";

import {
  Modal,
  ModalOverlay,
  Box,
  Button,
  Heading,
  Badge,
  ButtonRow,
  Divider,
  Text,
  ExternalIcon,
  DisconnectWalletIcon,
  IdentityIcon,
  SuccessIcon,
  FailedIcon,
} from "@unioncredit/ui";
import { useAccount, useDisconnect, useNetwork } from "wagmi";

import { useModals } from "providers/ModalManager";
import Avatar from "components/shared/Avatar";
import { Link } from "react-router-dom";
import format from "utils/format";
import { useAppLogs } from "providers/AppLogs";
import { Status } from "constants";
import { truncateAddress } from "utils/truncateAddress";
import PrimaryLabel from "components/shared/PrimaryLabel";
import { EIP3770 } from "constants";
import useCopyToClipboard from "hooks/useCopyToClipboard";
import { blockExplorerAddress } from "utils/blockExplorer";

export const ACCOUNT_MODAL = "account-modal";

export default function AccountModal() {
  const { close } = useModals();
  const { chain } = useNetwork();
  const { address } = useAccount();
  const { logs = [], clearLogs } = useAppLogs();
  const { disconnect } = useDisconnect();
  const [copied, copy] = useCopyToClipboard();
  const blockExplorerLink = blockExplorerAddress(chain.id, address);

  return (
    <ModalOverlay onClick={close}>
      <Modal className="AccountModal">
        <Modal.Header title="Wallet & Activity" onClose={close} />
        <Modal.Body>
          <Box align="center" justify="center" direction="vertical">
            <Link
              onClick={close}
              to={`/profile/${EIP3770[chain.id]}:${address}`}
            >
              <Avatar size={56} address={address} />
            </Link>
            <Heading level={2} my="4px">
              <PrimaryLabel address={address} />
            </Heading>

            <Box align="center">
              <Badge
                mr="5px"
                color="grey"
                onClick={() => copy(address)}
                label={copied ? "Copied!" : truncateAddress(address)}
              />

              <a href={blockExplorerLink} target="_blank" rel="noreferrer">
                <ExternalIcon width="12px" />
              </a>
            </Box>
          </Box>
          <ButtonRow mt="24px" className="AccountModal__Buttons">
            <Link
              onClick={close}
              to={`/profile/${EIP3770[chain.id]}:${address}`}
            >
              <Button
                fluid
                size="small"
                variant="light"
                color="secondary"
                label="View Profile"
                icon={IdentityIcon}
              />
            </Link>

            <Button
              fluid
              size="small"
              variant="light"
              color="secondary"
              label="Disconnect Wallet"
              icon={DisconnectWalletIcon}
              onClick={() => {
                disconnect();
                close();
              }}
            />
          </ButtonRow>
          <Divider my="24px" />
          <Box justify="space-between" align="center" mb="12px">
            <Text size="medium" weight="medium" grey={700}>
              Wallet Activity
            </Text>
            <Button
              size="pill"
              color="secondary"
              variant="light"
              label="Clear activity"
              onClick={clearLogs}
            />
          </Box>

          <Box direction="vertical">
            {logs.length <= 0 ? (
              <Text grey={400} size="small" m={0}>
                No activity logs
              </Text>
            ) : (
              logs.map(({ txHash, status, label, value }) => (
                <Box key={txHash} align="center" justify="space-between" fluid>
                  <Box align="center">
                    <div className="AccountModal__Activity__statusIcon">
                      {status === Status.SUCCESS ? (
                        <SuccessIcon width="20px" />
                      ) : (
                        <FailedIcon width="20px" />
                      )}
                    </div>
                    <Text size="medium" weight="medium" grey={500} m={0}>
                      {label}
                    </Text>
                  </Box>
                  <Box align="center">
                    <Text
                      size="medium"
                      weight="medium"
                      m={0}
                      mr="5px"
                      grey={700}
                    >
                      {format(value)}
                    </Text>
                    <a href="#" target="_blank">
                      <ExternalIcon width="16px" />
                    </a>
                  </Box>
                </Box>
              ))
            )}
          </Box>
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
}
