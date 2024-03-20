import "./WelcomeModal.scss";
import {
  Text,
  Modal,
  Box,
  Button,
  ModalOverlay,
  Heading,
  TwitterIcon,
  ConfettiIcon,
} from "@unioncredit/ui";
import React, { useEffect, useRef } from "react";
import JSConfetti from "js-confetti";
import { generateTwitterLink, getProfileUrl } from "utils/generateLinks";
import { useAccount, useNetwork } from "wagmi";
import { useModals } from "providers/ModalManager";
import { useMember } from "providers/MemberData";
import { ZERO } from "constants";
import format from "utils/format";
import { VOUCH_MODAL } from "components/modals/VouchModal";
import { useSettings } from "providers/Settings";

export const WELCOME_MODAL = "welcome-modal";

// eslint-disable-next-line react/display-name
const ConfettiCanvas = React.memo(() => (
  <canvas
    id="confettiCanvas"
    style={{
      position: "fixed",
      top: "0px",
      left: "0px",
      width: "100%",
      height: "100%",
      pointerEvents: "none",
    }}
  />
));

export default function WelcomeModal() {
  const { chain } = useNetwork();
  const { address } = useAccount();
  const { open, close } = useModals();
  const { data: member = {}, refetch: refetchMember } = useMember();
  const {
    settings: { useToken },
  } = useSettings();

  const { creditLimit = ZERO } = member;

  const confettiRef = useRef(null);
  const popConfetti = () => confettiRef.current.addConfetti();

  const profileUrl = getProfileUrl(address, chain.id);
  const twitterUrl = generateTwitterLink(profileUrl);

  useEffect(() => {
    const el = document.getElementById("confettiCanvas");
    const confetti = new JSConfetti({ canvas: el });

    const intervalId = setInterval(() => {
      confetti.addConfetti();
    }, 1000);

    const timerId = setTimeout(() => {
      clearInterval(intervalId);
    }, 5000);

    confettiRef.current = confetti;

    return () => {
      clearTimeout(timerId);
      clearInterval(intervalId);
    };
  }, []);

  return (
    <ModalOverlay onClick={close}>
      <ConfettiCanvas />
      <Modal className="WelcomeModal">
        <Modal.Body>
          <Box p="24px" className="WelcomeModal__content" direction="vertical" align="center">
            <Heading color="white" size="xlarge">
              Welcome to Union
            </Heading>
            <Text m={0} size="medium" color="blue100">
              You just joined Union's credit network on {chain.name} with a starting credit line of{" "}
              {format(creditLimit)} {useToken}
            </Text>

            <Box fluid mt="24px">
              <Button
                fluid
                as="a"
                href={twitterUrl}
                target="_blank"
                rel="noopener"
                icon={TwitterIcon}
                size="small"
                color="primary"
                label="Share on Twitter"
                className="WelcomeModal__button"
              />

              <Button
                fluid
                size="small"
                color="primary"
                label="Pop Confetti"
                icon={ConfettiIcon}
                onClick={popConfetti}
                className="WelcomeModal__button"
              />
            </Box>
          </Box>

          <Button
            fluid
            size="large"
            color="secondary"
            variant="light"
            label="Continue"
            onClick={() => {
              open(VOUCH_MODAL, {
                title: "Welcome a friend to Union",
                subTitle: "Send your first vouch",
                newMember: true,
                onClose: () => refetchMember(),
              });
            }}
          />
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
}
