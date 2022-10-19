import "./NewMemberModalHeader.scss";

import { Text, Heading, ButtonRow, Button } from "@unioncredit/ui";

export default function NewMemberModalHeader({ confettiAction }) {
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
          onClick={confettiAction}
        />
        <Button variant="pill" size="small" label="Share on Twitter" />
      </ButtonRow>
    </div>
  );
}
