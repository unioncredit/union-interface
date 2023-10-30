import "./ProfileSidebar.scss";

import { Card, Divider, Grid, Heading, NumericalBlock, Text } from "@unioncredit/ui";
import ProfileGovernanceStats from "./ProfileGovernanceStats";
import { ProfileVoucherStats } from "./ProfileVoucherStats";
import { useVoucheesData } from "../../providers/VoucheesData";
import { useVouchersData } from "../../providers/VouchersData";
import { getVersion } from "../../providers/Version";

export function ProfileSidebar({ chainId, address, profileMember }) {
  const { data: vouchees = [] } = useVoucheesData(address, chainId, getVersion(chainId));
  const { data: vouchers = [] } = useVouchersData(address, chainId, getVersion(chainId));

  const { stakerAddresses = [], borrowerAddresses = [] } = profileMember;

  return (
    <Card className="ProfileSidebar">
      <Card.Body>
        <Heading mb="24px">Reputation</Heading>
        <Text color="grey500" mb="12px">
          Wallet traits
        </Text>
        <Grid>
          <Grid.Row>
            <Grid.Col>
              <NumericalBlock
                align="left"
                size="small"
                title="Receiving vouches from"
                value={`${stakerAddresses?.length ?? 0} accounts`}
              />
            </Grid.Col>
            <Grid.Col>
              <NumericalBlock
                align="left"
                size="small"
                title="Vouching for"
                value={`${borrowerAddresses?.length ?? 0} accounts`}
              />
            </Grid.Col>
          </Grid.Row>
        </Grid>

        {vouchers.length > 0 && (
          <>
            <Divider m="24px 0" />

            <ProfileVoucherStats vouchers={vouchers} vouchees={vouchees} />
          </>
        )}

        <Divider m="24px 0" />

        <ProfileGovernanceStats address={address} chainId={chainId} />
      </Card.Body>
    </Card>
  );
}
