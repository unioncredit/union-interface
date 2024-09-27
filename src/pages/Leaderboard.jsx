import { Helmet } from "react-helmet";
import { Button, Card, SegmentedControl } from "@unioncredit/ui";
import { LeaderboardTable } from "components/dao/LeaderboardTable";
import { Link } from "react-router-dom";
import { DelegatesBoard } from "components/dao/boards/DelegatesBoard";

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
  },
  SAMARITANS: {
    id: "samaritans",
    label: "Samaritans",
    to: "/leaderboard/samaritans",
    initialActive: 2,
    as: Link,
  },
};

export default function LeaderboardPage({ board }) {
  const { id, initialActive } = board;

  const BoardComponent = () => {
    return BOARDS.DELEGATES.component;
  };

  return (
    <>
      <Helmet>
        <title>Leaderboard | Union Credit Protocol</title>
      </Helmet>

      <Card>
        <Card.Header
          pb="24px"
          title="Leaderboard"
          action={
            <Button
              as="a"
              href="#"
              target="_blank"
              rel="noopener"
              size="pill"
              variant="light"
              color="secondary"
              label={<>Share Board</>}
            />
          }
        />

        <SegmentedControl
          fluid
          value={id}
          initialActive={initialActive}
          w="calc(100% - 48px)"
          m="24px"
          className="DaoSegmentedControl"
          items={[BOARDS.DELEGATES, BOARDS.MOST_TRUSTED, BOARDS.SAMARITANS].map((item) => ({
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
