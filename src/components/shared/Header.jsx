import "./Header.scss";

import {
  NavItem,
  Grid,
  Layout,
  Box,
  ContextMenu,
  Text,
  Button,
} from "@unioncredit/ui";
import { useAccount } from "wagmi";
import { Link, useLocation } from "react-router-dom";
import { ReactComponent as Logo } from "@unioncredit/ui/lib/icons/logo.svg";
import { ReactComponent as Union } from "@unioncredit/ui/lib/icons/union.svg";

import { ZERO } from "constants";
import format from "utils/format";
import { useMember } from "providers/MemberData";
import { useModals } from "providers/ModalManager";
import { items, contextMenuItems } from "config/navigation";
import ConnectButton from "components/shared/ConnectButton";
import { WALLET_MODAL } from "components/modals/WalletModal";
import NetworkSelect from "components/shared/NetworkSelect";
import OverdueAlert from "./OverdueAlert";

export default function Header({ loading }) {
  const { open } = useModals();
  const { pathname } = useLocation();
  const { isConnected } = useAccount();
  const { data: { isMember, unclaimedRewards = ZERO } = {} } = useMember();

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
                <NetworkSelect />
              </Box>
            </Grid.Col>
            <Grid.Col align="center" className="hide-lt-850">
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
            <Grid.Col align="right">
              <Box justify="flex-end">
                <Button
                  mr="4px"
                  icon={Union}
                  variant="secondary"
                  className="UnionWallet"
                  onClick={() => open(WALLET_MODAL)}
                  label={
                    <Text mb="0" ml="4px">
                      {format(unclaimedRewards)}
                    </Text>
                  }
                />
                <ConnectButton buttonProps={{ packed: true }} />
                <ContextMenu position="left" items={contextMenuItems} />
              </Box>
            </Grid.Col>
          </Grid.Row>
          <Grid.Row>
            {/*--------------------------------------------------------------
              Mobile Navigation 
            *--------------------------------------------------------------*/}
            <Box my="16px" className="hide-gt-850" fluid>
              <Grid.Col align="center">{navigation}</Grid.Col>
            </Box>
          </Grid.Row>
        </Grid>
      </Layout.Header>
      <OverdueAlert />
    </>
  );
}
