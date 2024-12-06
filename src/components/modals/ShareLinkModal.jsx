import "./ShareReferralModal.scss";

import {
  Box,
  Button,
  ButtonRow,
  Input,
  LinkIcon,
  Modal,
  ModalOverlay,
  ShareIcon,
  TelegramIcon,
  TwitterIcon,
} from "@unioncredit/ui";

import { useModals } from "providers/ModalManager";
import useCopyToClipboard from "hooks/useCopyToClipboard";
import { generateTelegramLink, generateTwitterLink } from "utils/generateLinks";
import { useNativeShare } from "hooks/useNativeShare";

export const SHARE_LINK_MODAL = "share-link-modal";

export default function ShareLinkModal({ url, title, text }) {
  const [copied, copy] = useCopyToClipboard();

  const { close } = useModals();
  const { share, enabled: nativeShareEnabled } = useNativeShare();

  return (
    <ModalOverlay onClick={close}>
      <Modal>
        <Modal.Header onClose={close} title="Share Link" />
        <Modal.Body>
          <Box align="center" justify="center" direction="vertical">
            <Box mt="8px" direction="vertical" align="center" fluid>
              <Input
                value={url}
                inputProps={{
                  onFocus: (e) => {
                    copy(url);
                    e.target.select();
                  },
                }}
                readonly
              />
            </Box>

            <ButtonRow fluid mt="24px">
              <Button
                fluid
                size="large"
                icon={nativeShareEnabled ? ShareIcon : LinkIcon}
                variant="pill"
                onClick={() =>
                  nativeShareEnabled
                    ? share({
                        url,
                        title,
                        text,
                      })
                    : copy(url)
                }
                label={nativeShareEnabled ? "Share link" : copied ? "Copied" : "Copy link"}
              />
              <Button
                size="large"
                color="secondary"
                variant="light"
                icon={TwitterIcon}
                href={generateTwitterLink(url, "Check out the highest ranking users on Union")}
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
                href={generateTelegramLink(url, "Check out the highest ranking users on Union")}
                as="a"
                target="_blank"
                rel="noopener"
                className="ShareReferralModal__social"
              />
            </ButtonRow>
          </Box>
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
}
