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
import { Link } from "react-router-dom";
import { ReactComponent as Logo } from "@unioncredit/ui/lib/icons/logo.svg";
import { ReactComponent as Union } from "@unioncredit/ui/lib/icons/union.svg";

import format from "utils/format";
import { useMember } from "providers/MemberData";
import { useModals } from "providers/ModalManager";
import { items, contextMenuItems } from "config/navigation";
import ConnectButton from "components/shared/ConnectButton";
import { WALLET_MODAL } from "components/modals/WalletModal";
import NetworkSelect from "components/shared/NetworkSelect";

export default function Header({ loading }) {
  const { open } = useModals();
  const { data: member } = useMember();
  const { isConnected } = useAccount();

  const navItems =
    isConnected && member.checkIsMember
      ? [items.credit, items.contacts, items.governance]
      : [items.getStarted, items.governance];

  return (
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
              <Button
                mr="4px"
                icon={Union}
                variant="secondary"
                className="UnionWallet"
                onClick={() => open(WALLET_MODAL)}
                label={
                  <Text mb="0" ml="4px">
                    {format(member.unclaimedRewards)}
                  </Text>
                }
              />
              <ConnectButton />
              <ContextMenu position="left" items={contextMenuItems} />
            </Box>
          </Grid.Col>
        </Grid.Row>
      </Grid>
    </Layout.Header>
  );
}
