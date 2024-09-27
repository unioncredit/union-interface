import { Layout } from "@unioncredit/ui";

import { DaoSegmentedControl } from "components/shared/DaoSegmentedControl";
import GovernancePage from "pages/Governance";
import ProtocolPage from "pages/Protocol";
import LeaderboardPage from "pages/Leaderboard";

export const PAGES = {
  VOTING: {
    id: "voting",
    maxw: "653px",
    initialActive: 0,
    component: GovernancePage,
  },
  PROTOCOL: {
    id: "protocol",
    maxw: "653px",
    initialActive: 1,
    component: ProtocolPage,
  },
  LEADERBOARD: {
    id: "leaderboard",
    maxw: "none",
    initialActive: 2,
    component: LeaderboardPage,
  },
};

export default function DaoPages({ page, props }) {
  const { id, maxw, initialActive, component: Component } = page;

  return (
    <Layout.Columned align="center" maxw={maxw}>
      <DaoSegmentedControl value={id} maxw="653px" initialActive={initialActive} />

      <Component {...props} />
    </Layout.Columned>
  );
}
