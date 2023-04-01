import { Link } from "react-router-dom";
import {
  LeaderboardIcon,
  ProtocolIcon,
  SegmentedControl,
  VotingIcon,
} from "@unioncredit/ui";
import { Links } from "constants";

export const DaoSegmentedControl = ({ active }) => (
  <SegmentedControl
    m="24px auto"
    size="large"
    variant="rounded"
    initialActive={active}
    items={[
      {
        id: "voting",
        label: "Voting",
        to: Links.GOVERNANCE,
        as: Link,
        icon: VotingIcon,
      },
      {
        id: "protocol",
        label: "Protocol",
        to: Links.PROTOCOL,
        as: Link,
        icon: ProtocolIcon,
      },
      {
        id: "leaderboard",
        label: "Leaderboard",
        to: Links.LEADERBOARD,
        as: Link,
        icon: LeaderboardIcon,
      },
    ]}
  />
);
