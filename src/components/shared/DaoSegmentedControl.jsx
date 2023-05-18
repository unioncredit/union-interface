import "./DaoSegmentedControl.scss";

import { Link } from "react-router-dom";
import {
  GovernanceIcon,
  LeaderboardIcon,
  ProtocolIcon,
  SegmentedControl,
} from "@unioncredit/ui";
import { Links } from "constants";

export const DaoSegmentedControl = ({ value, initialActive, ...props }) => (
  <SegmentedControl
    fluid
    value={value}
    initialActive={initialActive}
    m="24px auto"
    size="large"
    variant="rounded"
    className="DaoSegmentedControl"
    {...props}
    items={[
      {
        id: "voting",
        label: "Voting",
        to: Links.GOVERNANCE,
        as: Link,
        icon: GovernanceIcon,
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
