import "./NewMemberModalHeader.scss";

import JSConfetti from "js-confetti";
import { useEffect, useRef } from "react";
import { Text, Heading, ButtonRow, Button } from "@unioncredit/ui";

export default function NewMemberModalHeader() {
  const confettiRef = useRef(null);

  const popConfetti = () => confettiRef.current.addConfetti();

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
    <div className="NewMemberModalHeader">
      <Heading align="center" color="white" size="large" m={0}>
        New Union Member
      </Heading>
      <Text color="blue100" align="center" m={0}>
        You’re now a member of Union’s credit network on Arbitrum. You’ll start
        with a credit line of 248.33 DAI
      </Text>
      <ButtonRow justify="center" mt="8px">
        <Button
          variant="pill"
          size="small"
          label="Pop Confetti"
          onClick={popConfetti}
        />
        <Button variant="pill" size="small" label="Share on Twitter" />
      </ButtonRow>
    </div>
  );
}
