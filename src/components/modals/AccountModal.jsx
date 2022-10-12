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
import { useAccount, useDisconnect } from "wagmi";
import { ReactComponent as Success } from "@unioncredit/ui/lib/icons/success.svg";
import { ReactComponent as External } from "@unioncredit/ui/lib/icons/external.svg";

import { useModals } from "providers/ModalManager";
import Avatar from "components/shared/Avatar";
import { Link } from "react-router-dom";
import format from "utils/format";
import { useAppLogs } from "providers/AppLogs";

export const ACCOUNT_MODAL = "account-modal";

export default function AccountModal() {
  const { close } = useModals();
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { logs = [] } = useAppLogs();

  return (
    <ModalOverlay onClick={close}>
      <Modal title="Wallet & Activity" onClose={close} className="AccountModal">
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
            logs.map(() => (
              <Box align="center" justify="space-between" fluid>
                <Box align="center">
                  <div className="AccountModal__Activity__statusIcon">
                    <Success width="16px" />
                  </div>
                  <Label grey={600} m={0}>
                    Repayment
                  </Label>
                </Box>
                <Box align="center">
                  <Label m={0} grey={700}>
                    {format(0)}
                  </Label>
                  <a href="#" target="_blank">
                    <External width="24px" />
                  </a>
                </Box>
              </Box>
            ))
          )}
        </Box>
      </Modal>
    </ModalOverlay>
  );
}
