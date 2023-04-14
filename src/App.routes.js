import { ContactsType, Links } from "constants";

import ContactsPage from "pages/Contacts";
import GovernancePage from "pages/Governance";
import ProposalPage from "pages/Proposal";
import ProfilePage from "pages/Profile";
import RegisterPage from "pages/Register";
import CreditPage from "pages/Credit";
import StakePage from "pages/Stake";
import LeaderboardPage from "pages/Leaderboard";
import ProtocolPage from "pages/Protocol";

// prettier-ignore
export const member = [
  { path: "/",                    component: CreditPage,      props: {} },
  { path: "/stake",               component: StakePage,       props: {} },
  { path: "/contacts",            component: ContactsPage,    props: { type: ContactsType.VOUCHEES } },
  { path: "/contacts/providing",  component: ContactsPage,    props: { type: ContactsType.VOUCHEES } },
  { path: "/contacts/receiving",  component: ContactsPage,    props: { type: ContactsType.VOUCHERS } },
]

// prettier-ignore
export const nonMember = [
  {path: "/", component: RegisterPage,  props: {} }
]

// prettier-ignore
export const general = [
  { path: "/profile/:addressOrEns",        component: ProfilePage,      props: {} },
  { path: Links.GOVERNANCE,                component: GovernancePage,   props: { type: ContactsType.VOUCHERS } },
  { path: Links.PROTOCOL,                  component: ProtocolPage,     props: {} },
  { path: "/governance/proposals/:hash",   component: ProposalPage,     props: {} },
  { path: Links.LEADERBOARD,               component: LeaderboardPage,  props: {} },
]
