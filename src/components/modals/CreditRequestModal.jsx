import {
  Modal,
  ModalOverlay,
  Box,
  Card,
  Button,
  ButtonRow,
  Label,
  Select,
} from "@unioncredit/ui";
import QRCode from "qrcode.react";
import { useAccount } from "wagmi";
import { ReactComponent as Twitter } from "@unioncredit/ui/lib/icons/twitter.svg";
import { ReactComponent as Telegram } from "@unioncredit/ui/lib/icons/telegram.svg";

import { useModals } from "providers/ModalManager";
import { networks } from "config/networks";
import { truncateAddress } from "utils/truncateAddress";

export const CREDIT_REQUEST_MODAL = "credit-request-modal";

export default function CreditRequestModal() {
  const { close } = useModals();
  const { address } = useAccount();

  const url = `http://app.union.finance/profile/eth:${address}`;
  const urlDisplay = `http://app.union.finance/profile/eth:${truncateAddress(
    address
  )}...`;

  return (
    <ModalOverlay onClick={close}>
      <Modal onClose={close} title="Credit request">
        <Box align="center" justify="center" direction="vertical">
          <Select
            options={networks}
            onChange={() => alert()}
            defaultValue={networks[0]}
          />

          <Card packed mt="8px">
            <Box my="16px" fluid justify="center">
              <QRCode
                value={url}
                fgColor="#032437"
                size={120}
                renderAs="svg"
                className="QRCode"
              />
            </Box>
            <Box mb="16px" direction="vertical" align="center">
              <Label
                as="p"
                m={0}
                style={{
                  wordBreak: "break-all",
                  textAlign: "center",
                  padding: "0 10px",
                }}
              >
                {urlDisplay}
              </Label>
              <Button
                mt="8px"
                variant="pill"
                onClick={() => alert(url)}
                label="Copy link"
              />
            </Box>
          </Card>
          <ButtonRow fluid mt="8px">
            <Button
              fluid
              as="a"
              color="blue"
              variant="secondary"
              icon={Twitter}
              label="Twitter"
              href="#"
            />
            <Button
              fluid
              as="a"
              color="blue"
              variant="secondary"
              icon={Telegram}
              label="Telegram"
              href="#"
            />
          </ButtonRow>
        </Box>
      </Modal>
    </ModalOverlay>
  );
}
