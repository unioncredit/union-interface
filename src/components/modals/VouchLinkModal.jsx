import "./VouchLinkModal.scss";

import {
  Modal,
  ModalOverlay,
  Box,
  Button,
  ButtonRow,
  Select,
  Input,
  LinkIcon,
  TwitterIcon,
  TelegramIcon,
} from "@unioncredit/ui";
import { useState } from "react";
import { useAccount, useNetwork } from "wagmi";

import { useModals } from "providers/ModalManager";
import useCopyToClipboard from "hooks/useCopyToClipboard";
import { AddressSummary } from "components/shared";
import { generateTelegramLink, generateTwitterLink, getProfileUrl } from "utils/generateLinks";
import { supportedNetworks } from "config/networks";

export const VOUCH_LINK_MODAL = "vouch-link-modal";

export default function VouchLinkModal() {
  const { close } = useModals();
  const { address } = useAccount();
  const { chain: connectedChain } = useNetwork();

  const [copied, copy] = useCopyToClipboard();

  const [_network, setNetwork] = useState();

  const network =
    _network || supportedNetworks.find((network) => network.chainId === connectedChain.id);

  const profileUrl = `https://app.union.finance${getProfileUrl(address, network.chainId)}`;

  return (
    <ModalOverlay onClick={close}>
      <Modal>
        <Modal.Header onClose={close} title="Your vouch link" />
        <Modal.Body>
          <AddressSummary address={address} />

          <Box align="center" justify="center" direction="vertical">
            <Select
              options={supportedNetworks}
              defaultValue={network}
              onChange={(option) => setNetwork(option)}
            />

            <Box mt="8px" direction="vertical" align="center" fluid>
              <Input
                value={profileUrl}
                inputProps={{
                  onFocus: (e) => e.target.select(),
                }}
                readonly
              />
            </Box>

            <ButtonRow fluid mt="24px">
              <Button
                fluid
                size="large"
                icon={LinkIcon}
                variant="pill"
                onClick={() =>
                  navigator.share
                    ? navigator.share({
                        url: profileUrl,
                        title: "Union Finance",
                        text: "Give me a vouch on Union",
                      })
                    : copy(profileUrl)
                }
                label={navigator.share ? "Share link" : copied ? "Copied" : "Copy link"}
              />
              <Button
                size="large"
                color="secondary"
                variant="light"
                icon={TwitterIcon}
                href={generateTwitterLink(profileUrl)}
                as="a"
                target="_blank"
                rel="noopener"
                className="VouchLinkModal__social"
              />
              <Button
                size="large"
                color="secondary"
                variant="light"
                icon={TelegramIcon}
                href={generateTelegramLink(profileUrl)}
                as="a"
                target="_blank"
                rel="noopener"
                className="VouchLinkModal__social"
              />
            </ButtonRow>
          </Box>
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
}
