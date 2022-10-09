import "./Header.scss";

import { useAccount } from "wagmi";
import { Link } from "react-router-dom";
import { NavItem, Grid, Layout, Box, ContextMenu } from "@unioncredit/ui";
import { ReactComponent as Logo } from "@unioncredit/ui/lib/icons/logo.svg";

import { useMember } from "providers/MemberData";
import { items, contextMenuItems } from "config/navigation";
import ConnectButton from "components/shared/ConnectButton";

export default function Header({ loading }) {
  const { isConnected } = useAccount();
  const { data } = useMember();

  const navItems =
    isConnected && data.checkIsMember
      ? [items.credit, items.contacts, items.governance]
      : [items.getStarted, items.governance];

  return (
    <Layout.Header align="center">
      <Grid>
        <Grid.Row align="center">
          <Grid.Col>
            <Box align="center">
              <Logo width="32px" style={{ marginRight: "8px" }} />
              {/* <NetworkSelect /> */}
            </Box>
          </Grid.Col>
          <Grid.Col align="center" className="hide-lt-850">
            <Box
              fluid
              justify="center"
              className={{ "Header__Box--loading": loading }}
            >
              {navItems.map(({ label, ...item }) => (
                <Link
                  key={item.id}
                  to={item.pathname}
                  style={{ display: "block" }}
                >
                  <NavItem as="div" label={label} {...item} />
                </Link>
              ))}
            </Box>
          </Grid.Col>
          <Grid.Col align="right">
            <Box justify="flex-end">
              <ConnectButton />
              <ContextMenu position="left" items={contextMenuItems} />
            </Box>
          </Grid.Col>
        </Grid.Row>
      </Grid>
    </Layout.Header>
  );
}
