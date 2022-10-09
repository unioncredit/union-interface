import links from "config/links";

export const items = {
  getStarted: {
    id: "get-started",
    label: "Get Started",
    pathname: "/get-started",
    active: true,
  },
  credit: {
    id: "credit",
    label: "Credit",
    pathname: "/",
  },
  contacts: {
    id: "contacts",
    label: "Contacts",
    pathname: "/contacts",
  },
  governance: {
    id: "governance",
    label: "Governance",
    pathname: "/governance",
  },
};

export const contextMenuItems = [
  {
    label: "Docs",
    target: "_blank",
    href: links.docs,
  },
  { label: "Blog", target: "_blank", href: links.blog },
  {
    label: "Twitter",
    target: "_blank",
    href: links.twitter,
  },
  { label: "Discord", target: "_blank", href: links.discord },
  { label: "Github", target: "_blank", href: links.github },
  { label: "Stats", target: "_blank", href: links.data },
];
