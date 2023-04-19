import links from "config/links";
import {
  BlogIcon,
  TermsIcon,
  CopyIcon,
  MarketingIcon,
  DiscordIcon,
} from "@unioncredit/ui";
import { Links } from "constants";

export const items = {
  getStarted: {
    id: "get-started",
    label: "Get Started",
    pathname: "/",
    active: true,
  },
  credit: {
    id: "credit",
    label: "Credit",
    pathname: "/",
    childPaths: ["/stake", "/contacts/providing", "/contacts/receiving"],
  },
  dao: {
    id: "governance",
    label: "DAO",
    pathname: Links.GOVERNANCE,
    childPaths: ["/protocol", "/leaderboard"],
  },
};

export const contextMenuItems = [
  { icon: BlogIcon, label: "Blog", target: "_blank", href: links.blog },
  { icon: CopyIcon, label: "Docs", target: "_blank", href: links.docs },
  {
    icon: MarketingIcon,
    label: "Twitter",
    target: "_blank",
    href: links.twitter,
  },
  {
    icon: DiscordIcon,
    label: "Discord",
    target: "_blank",
    href: links.discord,
  },
  {
    icon: TermsIcon,
    label: "Terms & Conditions",
    target: "_blank",
    href: links.github,
  },
];
