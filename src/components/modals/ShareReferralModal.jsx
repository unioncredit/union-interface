import "./ShareReferralModal.scss";

import {
  Box,
  Button,
  ButtonRow,
  ConfettiIcon,
  Input,
  LinkIcon,
  Modal,
  ModalOverlay,
  Select,
  TelegramIcon,
  Text,
  TwitterIcon,
} from "@unioncredit/ui";
import { useState } from "react";
import { useAccount, useNetwork } from "wagmi";

import { useModals } from "providers/ModalManager";
import useCopyToClipboard from "hooks/useCopyToClipboard";
import { AddressSummary } from "components/shared";
import { generateTelegramLink, generateTwitterLink, getProfileUrl } from "utils/generateLinks";
import { useSupportedNetwork } from "hooks/useSupportedNetwork";

export const SHARE_REFERRAL_MODAL = "share-referral-modal";

export default function ShareReferralModal({ address, chainId }) {
  const { close } = useModals();
  const { supportedNetworks } = useSupportedNetwork();
  const { address: connectedAddress } = useAccount();
  const { chain: connectedChain } = useNetwork();

  const [copied, copy] = useCopyToClipboard();

  const [_network, setNetwork] = useState();

  const network =
    _network ||
    supportedNetworks.find((network) => network.chainId === (chainId || connectedChain?.id));

  const profileUrl = `https://app.union.finance${getProfileUrl(address, network.chainId)}${
    connectedAddress ? `?refAddress=${connectedAddress}` : ""
  }`;

  return (
    <ModalOverlay onClick={close}>
      <Modal>
        <Modal.Header onClose={close} title="Share" />
        <Modal.Body>
          <AddressSummary address={address} chainId={chainId} />

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
                className="ShareReferralModal__social"
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
                className="ShareReferralModal__social"
              />
            </ButtonRow>
          </Box>

          <Modal.Container className="ShareReferralModal__rewards" align="center">
            <ConfettiIcon />

            <Text m={0} size="regular">
              Earn 0.00021 ETH in rewards when someone registers from your link.
            </Text>
          </Modal.Container>
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
}
