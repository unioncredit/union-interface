import "./NewMemberModalHeader.scss";
import { useAccount, useNetwork } from "wagmi";
import JSConfetti from "js-confetti";
import { useEffect, useRef } from "react";
import { Text, Heading, ButtonRow, Button } from "@unioncredit/ui";
import { ReactComponent as Celebration } from "@unioncredit/ui/lib/icons/celebration.svg";
import { ReactComponent as Twitter } from "@unioncredit/ui/lib/icons/twitter-filled.svg";

import { useMember } from "providers/MemberData";
import { ZERO } from "constants";
import format from "utils/format";
import { generateTwitterLink, getProfileUrl } from "utils/generateLinks";

export default function NewMemberModalHeader() {
  const confettiRef = useRef(null);

  const { data: member = {} } = useMember();
  const { chain } = useNetwork();
  const { address } = useAccount();
  const { creditLimit = ZERO } = { member };
  const profileUrl = getProfileUrl(address, chain.id);

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
        Registration Complete
      </Heading>
      <Text
        color="blue100"
        align="center"
        m={0}
        className="NewMemberModalHeader__content"
      >
        You’re now a member of Union’s credit network on {chain.name}. You’ll
        start with a credit line of {format(creditLimit)} DAI
      </Text>
      <ButtonRow justify="center" mt="8px">
        <Button
          icon={Celebration}
          variant="pill"
          size="small"
          label="Pop Confetti"
          onClick={popConfetti}
          className="NewMemberModalHeader__button"
        />
        <Button
          icon={Twitter}
          variant="pill"
          size="small"
          label="Share on Twitter"
          className="NewMemberModalHeader__button"
          as="a"
          href={generateTwitterLink(profileUrl)}
          target="_blank"
        />
      </ButtonRow>
    </div>
  );
}
