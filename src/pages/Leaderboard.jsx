import "./Leaderboard.scss";

import { Helmet } from "react-helmet";
import { Button, Card, CheckIcon, SegmentedControl, ShareIcon } from "@unioncredit/ui";
import { Link } from "react-router-dom";
import { DelegatesBoard } from "components/dao/boards/DelegatesBoard";
import { useCallback } from "react";
import { MostTrustedBoard } from "../components/dao/boards/MostTrustedBoard";
import { TopCreditLimitsBoard } from "../components/dao/boards/TopCreditLimitsBoard";
import { NovicesBoard } from "../components/dao/boards/NovicesBoard";
import { DelinquentsBoard } from "../components/dao/boards/DelinquentsBoard";
import { SamaritansBoard } from "../components/dao/boards/SamaritansBoard";
import useCopyToClipboard from "../hooks/useCopyToClipboard";
import { useModals } from "../providers/ModalManager";
import { SHARE_LINK_MODAL } from "../components/modals/ShareLinkModal";

export const BOARDS = {
  DELEGATES: {
    id: "delegates",
    title: "🗳️ Delegates",
    label: (
      <p>
        🗳️<span>Delegates</span>
      </p>
    ),
    to: "/leaderboard/delegates",
    initialActive: 0,
    as: Link,
    component: <DelegatesBoard />,
  },
  MOST_TRUSTED: {
    id: "most-trusted",
    title: "🤝🏻 Most Trusted",
    label: (
      <p>
        🤝🏻<span>Most Trusted</span>
      </p>
    ),
    to: "/leaderboard/most-trusted",
    initialActive: 1,
    as: Link,
    component: <MostTrustedBoard />,
  },
  CREDIT_LIMITS: {
    id: "top-credit-limits",
    title: "💳 Top Credit Limits",
    label: (
      <p>
        💳<span>Top Credit Limits</span>
      </p>
    ),
    to: "/leaderboard/top-credit-limits",
    initialActive: 2,
    as: Link,
    component: <TopCreditLimitsBoard />,
  },
  NOOBS: {
    id: "novices",
    title: "🐣 Novices",
    label: (
      <p>
        🐣<span>Novices</span>
      </p>
    ),
    to: "/leaderboard/novices",
    initialActive: 3,
    as: Link,
    component: <NovicesBoard />,
  },
  WORST: {
    id: "worst",
    title: "🏺 Delinquents",
    label: (
      <p>
        🏺<span>Delinquents</span>
      </p>
    ),
    to: "/leaderboard/delinquents",
    initialActive: 4,
    as: Link,
    component: <DelinquentsBoard />,
  },
  SAMARITANS: {
    id: "samaritans",
    title: "💸 Samaritans",
    label: (
      <p>
        💸<span>Samaritans</span>
      </p>
    ),
    to: "/leaderboard/samaritans",
    initialActive: 5,
    as: Link,
    component: <SamaritansBoard />,
  },
};

export default function LeaderboardPage({ board }) {
  const [copied] = useCopyToClipboard();

  const { open } = useModals();

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
          title={
            <>
              {board.title} <span>Leaderboard</span>
            </>
          }
          action={
            <Button
              target="_blank"
              rel="noopener"
              size="pill"
              variant="light"
              color="secondary"
              icon={copied ? CheckIcon : ShareIcon}
              label={copied ? <>Link copied!</> : <>Share Board</>}
              onClick={() =>
                open(SHARE_LINK_MODAL, {
                  url: `https://app.union.finance${board.to}`,
                  title: board.title,
                  text: "Check out the top ranking users and track your progress on our leaderboard.",
                })
              }
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
