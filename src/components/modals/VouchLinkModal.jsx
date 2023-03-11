import {
  Modal,
  ModalOverlay,
  Box,
  Card,
  Button,
  ButtonRow,
  Text,
  Select,
  Input,
  LinkIcon,
  TwitterFilledIcon,
  TelegramFilledIcon,
  CheckAlternativeIcon,
  CheckIcon,
  CheckFilledIcon,
} from "@unioncredit/ui";
import { useState } from "react";
import { useAccount, useNetwork } from "wagmi";

import { networks } from "config/networks";
import { useModals } from "providers/ModalManager";
import useCopyToClipboard from "hooks/useCopyToClipboard";
import links from "config/links";
import AddressSummary from "components/shared/AddressSummary";
import {
  generateTelegramLink,
  generateTwitterLink,
  getProfileUrl,
} from "utils/generateLinks";

export const VOUCH_LINK_MODAL = "vouch-link-modal";

export default function VouchLinkModal() {
  const { close } = useModals();
  const { address } = useAccount();
  const { chain: connectedChain } = useNetwork();

  const [copied, copy] = useCopyToClipboard();
  const [network, setNetwork] = useState(
    networks.find((network) => network.chainId === connectedChain.id)
  );

  const profileUrl = getProfileUrl(address, network.chainId);

  return (
    <ModalOverlay onClick={close}>
      <Modal>
        <Modal.Header onClose={close} title="Your vouch link" />
        <Modal.Body>
          <AddressSummary address={address} />

          <Box align="center" justify="center" direction="vertical">
            <Select
              options={networks}
              defaultValue={network}
              onChange={(option) => setNetwork(option)}
            />

            <Box mt="8px" direction="vertical" align="center" fluid>
              <Input value={profileUrl} readonly />
            </Box>

            <ButtonRow fluid mt="24px">
              <Button
                fluid
                size="large"
                icon={LinkIcon}
                variant="pill"
                onClick={() => copy(profileUrl)}
                label={copied ? "Copied" : "Copy link"}
              />
              <Button
                size="large"
                color="secondary"
                variant="light"
                icon={TwitterFilledIcon}
                href={generateTwitterLink(profileUrl)}
                as="a"
                target="_blank"
                rel="noopener"
              />
              <Button
                size="large"
                color="secondary"
                variant="light"
                icon={TelegramFilledIcon}
                href={generateTelegramLink(profileUrl)}
                as="a"
                target="_blank"
                rel="noopener"
              />
            </ButtonRow>
          </Box>
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
}
