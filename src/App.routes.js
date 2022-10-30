import { ContactsType } from "constants";

import ContactsPage from "pages/Contacts";
import GovernancePage from "pages/Governance";
import ProposalsPage from "pages/Proposals";
import ProposalPage from "pages/Proposal";
import ProfilePage from "pages/Profile";
import RegisterPage from "pages/Register";
import CreditPage from "pages/Credit";
import StakePage from "pages/Stake";

// prettier-ignore
export const member = [
  { path: "/",                    component: CreditPage,      props: {} },
  { path: "/stake",               component: StakePage,       props: {} },
  { path: "/contacts",            component: ContactsPage,    props: { type: ContactsType.VOUCHEES } },
  { path: "/contacts/trusts-you", component: ContactsPage,    props: { type: ContactsType.VOUCHERS } },
  { path: "/governance",          component: GovernancePage,  props: { type: ContactsType.VOUCHERS } },
]

// prettier-ignore
export const nonMember = [
  {path: "/", component: RegisterPage,  props: {} }
]

// prettier-ignore
export const general = [
  { path: "/profile/:addressOrEns",        component: ProfilePage,   props: {} },
  { path: "/governance/proposals",         component: ProposalsPage, props: {} },
  { path: "/governance/proposals/:hash",   component: ProposalPage,  props: {} },
]
