import links from "config/links";
import {
  BlogIcon,
  BookIcon,
  SheetIcon,
  SpeakerIcon,
  SpeechIcon,
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
  },
  dao: {
    id: "governance",
    label: "DAO",
    pathname: Links.GOVERNANCE,
  },
};

export const contextMenuItems = [
  { icon: BlogIcon, label: "Blog", target: "_blank", href: links.blog },
  { icon: SheetIcon, label: "Docs", target: "_blank", href: links.docs },
  {
    icon: SpeakerIcon,
    label: "Twitter",
    target: "_blank",
    href: links.twitter,
  },
  { icon: SpeechIcon, label: "Discord", target: "_blank", href: links.discord },
  {
    icon: BookIcon,
    label: "Terms & Conditions",
    target: "_blank",
    href: links.github,
  },
];
