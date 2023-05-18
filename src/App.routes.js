import { ContactsType, Links } from "constants";

import GovernancePage from "pages/Governance";
import ProposalPage from "pages/Proposal";
import ProfilePage from "pages/Profile";
import RegisterPage from "pages/Register";
import LeaderboardPage from "pages/Leaderboard";
import ProtocolPage from "pages/Protocol";
import CreditPages, { PAGES } from "pages/CreditPages";

// prettier-ignore
export const member = [
  { path: "/",                    component: CreditPages,     props: { page: PAGES.BORROW } },
  { path: "/stake",               component: CreditPages,     props: { page: PAGES.STAKE } },
  { path: "/contacts",            component: CreditPages,     props: { page: PAGES.CONTACTS_PROVIDING } },
  { path: "/contacts/providing",  component: CreditPages,     props: { page: PAGES.CONTACTS_PROVIDING } },
  { path: "/contacts/receiving",  component: CreditPages,     props: { page: PAGES.CONTACTS_RECEIVING } },
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
