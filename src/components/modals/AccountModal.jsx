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
  Label,
} from "@unioncredit/ui";
import { useAccount, useDisconnect, useNetwork } from "wagmi";
import { ReactComponent as Success } from "@unioncredit/ui/lib/icons/success.svg";
import { ReactComponent as Failed } from "@unioncredit/ui/lib/icons/failed.svg";
import { ReactComponent as External } from "@unioncredit/ui/lib/icons/external.svg";

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
  const { logs = [] } = useAppLogs();
  const { disconnect } = useDisconnect();
  const [copied, copy] = useCopyToClipboard();
  const blockExplorerLink = blockExplorerAddress(chain.id, address);

  return (
    <ModalOverlay onClick={close}>
      <Modal className="AccountModal">
        <Modal.Header title="Wallet & Activity" onClose={close} />
        <Modal.Body>
          <Box align="center" justify="center" direction="vertical">
            <Link to={`/profile/${EIP3770[chain.id]}:${address}`}>
              <Avatar size={56} address={address} />
            </Link>
            <Heading level={2} my="4px">
              <PrimaryLabel address={address} />
            </Heading>

            <Box>
              <Badge
                color="grey"
                onClick={() => copy(address)}
                label={copied ? "Copied!" : truncateAddress(address)}
              />

              <a href={blockExplorerLink} target="_blank" rel="noreferrer">
                <External width="24px" />
              </a>
            </Box>
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
          <Divider my="24px" />
          <Box justify="space-between" align="center" mb="12px">
            <Label grey={600}>Wallet Activity</Label>
            <Button size="small" variant="pill" label="Clear activity" />
          </Box>

          <Box direction="vertical">
            {logs.length <= 0 ? (
              <Label grey={400} size="small" m={0}>
                No activity logs
              </Label>
            ) : (
              logs.map(({ txHash, status, label, value }) => (
                <Box key={txHash} align="center" justify="space-between" fluid>
                  <Box align="center">
                    <div className="AccountModal__Activity__statusIcon">
                      {status === Status.SUCCESS ? (
                        <Success width="16px" />
                      ) : (
                        <Failed width="16px" />
                      )}
                    </div>
                    <Label grey={600} m={0}>
                      {label}
                    </Label>
                  </Box>
                  <Box align="center">
                    <Label m={0} grey={700}>
                      {format(value)}
                    </Label>
                    <a href="#" target="_blank">
                      <External width="24px" />
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
