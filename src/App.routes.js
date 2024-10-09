import { Links } from "constants";

import ProposalPage from "pages/Proposal";
import ProfilePage from "pages/Profile";
import RegisterPage from "pages/Register";
import CreditPages, { PAGES as CREDIT_PAGES } from "pages/CreditPages";
import DaoPages, { PAGES as DAO_PAGES } from "pages/DaoPages";
import { BOARDS } from "./pages/Leaderboard";

// prettier-ignore
export const member = [
  { path: "/",                    component: CreditPages,     props: { page: CREDIT_PAGES.BORROW } },
  { path: "/stake",               component: CreditPages,     props: { page: CREDIT_PAGES.STAKE } },
  { path: "/contacts",            component: CreditPages,     props: { page: CREDIT_PAGES.CONTACTS_PROVIDING } },
  { path: "/contacts/providing",  component: CreditPages,     props: { page: CREDIT_PAGES.CONTACTS_PROVIDING } },
  { path: "/contacts/receiving",  component: CreditPages,     props: { page: CREDIT_PAGES.CONTACTS_RECEIVING } },
]

// prettier-ignore
export const nonMember = [
  {path: "/", component: RegisterPage,  props: {} }
]

// prettier-ignore
export const general = [
  { path: "/profile/:addressOrEns",        component: ProfilePage,      props: {} },
  { path: Links.GOVERNANCE,                component: DaoPages,   props: { page: DAO_PAGES.VOTING } },
  { path: Links.PROTOCOL,                  component: DaoPages,     props: { page: DAO_PAGES.PROTOCOL } },
  { path: "/governance/proposals/:hash",   component: ProposalPage,     props: {} },
  // Leaderboard routes
  ...Object.values(BOARDS).map(board => ({
    path: board.to,
    component: DaoPages,
    props: { page: DAO_PAGES.LEADERBOARD, props: { board } }
  }))
]

export const allRoutes = [...member, ...nonMember, ...general];
