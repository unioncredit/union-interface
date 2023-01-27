import "./HeaderMobileMenu.scss";
import { Box, NavItem } from "@unioncredit/ui";
import { Link } from "react-router-dom";
import { createElement } from "react";

export default function HeaderMobileMenu({ navLinks, footerLinks, closeMenu }) {
  return (
    <Box className="HeaderMobileMenu" direction="vertical">
      <Box className="HeaderMobileMenu__navigation" direction="vertical">
        {navLinks.map(({ label, ...item }) => (
          <Link key={item.id} to={item.pathname}>
            <NavItem as="div" label={label} onClick={closeMenu} {...item} />
          </Link>
        ))}
      </Box>

      <Box mt="10px" className="HeaderMobileMenu__footer" direction="vertical">
        {footerLinks.map(({ icon: Icon, label, ...item }) => {
          const props = {
            ...item,
          };

          return createElement(
            "a",
            props,
            <>
              {Icon && <Icon width="24px" height="24px" />}
              {label}
            </>
          );
        })}
      </Box>
    </Box>
  );
}
