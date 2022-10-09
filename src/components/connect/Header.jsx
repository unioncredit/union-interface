import { Grid, Layout } from "@unioncredit/ui";
import { ReactComponent as Logo } from "@unioncredit/ui/lib/icons/logo.svg";

import ConnectButton from "components/shared/ConnectButton";

export default function Header() {
  return (
    <Grid>
      <Grid.Row>
        <Grid.Col>
          <Layout.Header align="center">
            <Logo width="32px" />
            <ConnectButton />
          </Layout.Header>
        </Grid.Col>
      </Grid.Row>
    </Grid>
  );
}
