import "./Leaderboard.scss";

import { Helmet } from "react-helmet";
import { Button, Card, CheckIcon, SegmentedControl, WithdrawIcon } from "@unioncredit/ui";
import { Link } from "react-router-dom";
import { DelegatesBoard } from "components/dao/boards/DelegatesBoard";
import { useCallback } from "react";
import { MostTrustedBoard } from "../components/dao/boards/MostTrustedBoard";
import { TopCreditLimitsBoard } from "../components/dao/boards/TopCreditLimitsBoard";
import { NovicesBoard } from "../components/dao/boards/NovicesBoard";
import { DelinquentsBoard } from "../components/dao/boards/DelinquentsBoard";
import { SamaritansBoard } from "../components/dao/boards/SamaritansBoard";
import useCopyToClipboard from "../hooks/useCopyToClipboard";

export const BOARDS = {
  DELEGATES: {
    id: "delegates",
    label: "Delegates",
    to: "/leaderboard/delegates",
    initialActive: 0,
    as: Link,
    component: <DelegatesBoard />,
  },
  MOST_TRUSTED: {
    id: "most-trusted",
    label: "Most Trusted",
    to: "/leaderboard/most-trusted",
    initialActive: 1,
    as: Link,
    component: <MostTrustedBoard />,
  },
  CREDIT_LIMITS: {
    id: "top-credit-limits",
    label: "Top Credit Limits",
    to: "/leaderboard/top-credit-limits",
    initialActive: 2,
    as: Link,
    component: <TopCreditLimitsBoard />,
  },
  NOOBS: {
    id: "novices",
    label: "Novices",
    to: "/leaderboard/novices",
    initialActive: 3,
    as: Link,
    component: <NovicesBoard />,
  },
  WORST: {
    id: "worst",
    label: "Delinquents",
    to: "/leaderboard/delinquents",
    initialActive: 4,
    as: Link,
    component: <DelinquentsBoard />,
  },
  SAMARITANS: {
    id: "samaritans",
    label: "Samaritans",
    to: "/leaderboard/samaritans",
    initialActive: 5,
    as: Link,
    component: <SamaritansBoard />,
  },
};

export default function LeaderboardPage({ board }) {
  const [copied, copy] = useCopyToClipboard();

  const { id, initialActive } = board;

  const BoardComponent = useCallback(() => {
    return board.component;
  }, [board]);

  return (
    <>
      <Helmet>
        <title>Leaderboard | Union Credit Protocol</title>
      </Helmet>

      <Card className="Leaderboard">
        <Card.Header
          pb="24px"
          title="Leaderboard"
          action={
            <Button
              target="_blank"
              rel="noopener"
              size="pill"
              variant="light"
              color="secondary"
              icon={copied ? CheckIcon : WithdrawIcon}
              label={copied ? <>Link copied!</> : <>Share Board</>}
              onClick={() => copy(`https://app.union.finance${board.to}`)}
            />
          }
        />

        <SegmentedControl
          fluid
          value={id}
          initialActive={initialActive}
          w="calc(100% - 48px)"
          m="24px"
          className="Leaderboard__TabControl"
          items={Object.values(BOARDS).map((item) => ({
            id: item.id,
            to: item.to,
            as: item.as,
            label: item.label,
          }))}
        />

        <BoardComponent />
      </Card>
    </>
  );
}
