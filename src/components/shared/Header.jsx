import "./Header.scss";

import {
  Box,
  Button,
  CloseIcon,
  Grid,
  HamburgerIcon,
  Layout,
  NavItem,
  PopoverMenu,
  Toggle,
  UnionIcon,
  UnionNavIcon,
} from "@unioncredit/ui";
import { useState } from "react";
import { useAccount, useNetwork } from "wagmi";
import { Link, useLocation } from "react-router-dom";
import { ZERO } from "constants";
import { useMember } from "providers/MemberData";
import { useModals } from "providers/ModalManager";
import { useSettings } from "providers/Settings";
import { contextMenuItems, items } from "config/navigation";
import { ConnectButton, HeaderMobileMenu, NetworkSelect } from "components/shared";
import { WALLET_MODAL } from "components/modals/WalletModal";
import useWindowDimensions from "hooks/useWindowDimensions";
import useScrollLock from "hooks/useScrollLock";
import cn from "classnames";
import { InstallAppButton } from "./InstallAppButton";

export function Header({ loading, showNav = true }) {
  const mobileNavBreakpoint = 900;
  const { open } = useModals();
  const { chain } = useNetwork();
  const { pathname } = useLocation();
  const { isConnected } = useAccount();
  const { data: member = {} } = useMember();
  const { width } = useWindowDimensions();
  const setScrollLock = useScrollLock();
  const { settings, setSetting } = useSettings();

  const [menuOpen, setMenuOpen] = useState(false);

  const { isMember, unclaimedRewards = ZERO, unionBalance = ZERO } = member;

  const navItems0 =
    isConnected && isMember ? [items.credit, items.dao] : [items.getStarted, items.dao];

  const navItems = navItems0.map((item) => ({
    ...item,
    active: item.pathname === pathname || item.childPaths?.includes(pathname),
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

  const showTestNets = () => {
    setSetting("showTestnets", !settings.showTestnets);
  };

  return (
    <Box className="Header">
      <Layout.Header w="100%" align="center">
        <Layout.Columned>
          <Grid>
            <Grid.Row align="center">
              <Grid.Col>
                <Box align="center">
                  <Link to="/">
                    <UnionNavIcon width="40px" style={{ marginRight: "8px" }} />
                  </Link>

                  {isConnected && <NetworkSelect />}
                  {(!isConnected || !isMember) && <InstallAppButton />}
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
                    className={cn({
                      "Header__Box--loading": loading,
                    })}
                  >
                    {navigation}
                  </Box>
                </Grid.Col>
              )}
              <Grid.Col align="right">
                <Box justify="flex-end" align="center">
                  {isConnected && (
                    <Button
                      icon={UnionIcon}
                      iconProps={{
                        style: {
                          width: "28px",
                          height: "28px",
                        },
                      }}
                      color="secondary"
                      variant="light"
                      className="UnionWallet"
                      onClick={() => open(WALLET_MODAL)}
                    />
                  )}
                  <ConnectButton />
                  {width > mobileNavBreakpoint ? (
                    <PopoverMenu
                      className="Header__context-menu"
                      position="left"
                      items={contextMenuItems}
                      after={
                        <Toggle
                          active={settings.showTestnets}
                          color="secondary"
                          label="Show TestNets"
                          labelPosition="start"
                          onChange={() => {
                            showTestNets();
                          }}
                        />
                      }
                    />
                  ) : (
                    <Button
                      color="secondary"
                      variant="light"
                      className={cn("Header__hamburger", {
                        active: menuOpen,
                      })}
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
        </Layout.Columned>
      </Layout.Header>

      {menuOpen && width <= mobileNavBreakpoint && (
        <HeaderMobileMenu
          navLinks={navItems}
          footerLinks={contextMenuItems}
          closeMenu={() => {
            setMenuOpen(false);
            setScrollLock(false);
          }}
        />
      )}
    </Box>
  );
}
