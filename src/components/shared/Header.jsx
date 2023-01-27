import "./Header.scss";

import {
  NavItem,
  Grid,
  Layout,
  Box,
  ContextMenu,
  Button,
  HamburgerIcon,
  CloseIcon,
} from "@unioncredit/ui";
import { useState } from "react";
import { useAccount } from "wagmi";
import { Link, useLocation } from "react-router-dom";
import { ReactComponent as Logo } from "@unioncredit/ui/lib/icons/logo.svg";
import { ReactComponent as Union } from "@unioncredit/ui/lib/icons/union.svg";

import { ZERO } from "constants";
import format from "utils/format";
import OverdueAlert from "./OverdueAlert";
import { useMember } from "providers/MemberData";
import { useModals } from "providers/ModalManager";
import { items, contextMenuItems } from "config/navigation";
import ConnectButton from "components/shared/ConnectButton";
import { WALLET_MODAL } from "components/modals/WalletModal";
import NetworkSelect from "components/shared/NetworkSelect";
import HeaderMobileMenu from "components/shared/HeaderMobileMenu";
import useWindowDimensions from "hooks/useWindowDimensions";
import useScrollLock from "hooks/useScrollLock";

export default function Header({ loading, showNav = true }) {
  const mobileNavBreakpoint = 900;
  const { open } = useModals();
  const { pathname } = useLocation();
  const { isConnected } = useAccount();
  const { data: member = {} } = useMember();
  const { width } = useWindowDimensions();
  const setScrollLock = useScrollLock();

  const [menuOpen, setMenuOpen] = useState(false);

  const { isMember, unclaimedRewards = ZERO, unionBalance = ZERO } = member;

  const navItems0 =
    isConnected && isMember
      ? [items.credit, items.contacts, items.governance]
      : [items.getStarted, items.governance];

  const navItems = navItems0.map((item) => ({
    ...item,
    active:
      item.pathname === "/"
        ? item.pathname === pathname
        : item.id === "credit"
        ? pathname.match(/\/(stake|credit)/)
        : pathname.startsWith(item.pathname),
  }));

  const navigation = (
    <Box fluid justify="center">
      {navItems.map(({ label, ...item }) => (
        <Link key={item.id} to={item.pathname}>
          <NavItem as="div" label={label} {...item} />
        </Link>
      ))}
    </Box>
  );

  return (
    <>
      <Layout.Header align="center">
        <Grid>
          <Grid.Row align="center">
            <Grid.Col>
              <Box align="center">
                <Logo width="32px" style={{ marginRight: "8px" }} />
                {isConnected && <NetworkSelect />}
              </Box>
            </Grid.Col>
            {showNav && (
              <Grid.Col align="center" className="hide-lt-900">
                {/*--------------------------------------------------------------
                Desktop Navigation 
              *--------------------------------------------------------------*/}
                <Box
                  fluid
                  justify="center"
                  className={{ "Header__Box--loading": loading }}
                >
                  {navigation}
                </Box>
              </Grid.Col>
            )}
            <Grid.Col align="right">
              <Box justify="flex-end" align="center">
                {isConnected && (
                  <Button
                    mr="4px"
                    icon={Union}
                    iconProps={{
                      style: {
                        width: "24px",
                        height: "24px",
                      },
                    }}
                    color="secondary"
                    variant="light"
                    className="UnionWallet"
                    onClick={() => open(WALLET_MODAL)}
                    label={format(unclaimedRewards.add(unionBalance))}
                  />
                )}
                <ConnectButton buttonProps={{ packed: true }} />
                {width > mobileNavBreakpoint ? (
                  <ContextMenu
                    className="Header__context-menu"
                    position="left"
                    items={contextMenuItems}
                  />
                ) : (
                  <Button
                    color="secondary"
                    variant="light"
                    className="Header__hamburger"
                    icon={menuOpen ? CloseIcon : HamburgerIcon}
                    onClick={() => {
                      setScrollLock(!menuOpen);
                      setMenuOpen(!menuOpen);
                    }}
                  />
                )}
              </Box>
            </Grid.Col>
          </Grid.Row>
        </Grid>
      </Layout.Header>
      <OverdueAlert />

      {menuOpen && width <= mobileNavBreakpoint && (
        <HeaderMobileMenu
          navLinks={navItems}
          footerLinks={contextMenuItems}
          closeMenu={() => setMenuOpen(false)}
        />
      )}
    </>
  );
}
