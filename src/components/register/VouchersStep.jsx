import "./VouchersStep.scss";

import { useAccount, useNetwork } from "wagmi";
import {
  Table,
  TableRow,
  TableHead,
  Card,
  Box,
  ButtonRow,
  Button,
  Text,
  TableCell,
  EmptyState,
  Heading,
  TwitterIcon,
  TelegramIcon,
  LinkIcon,
} from "@unioncredit/ui";

import format from "utils/format";
import { useModals } from "providers/ModalManager";
import { useVouchers } from "providers/VouchersData";
import { truncateAddress } from "utils/truncateAddress";
import { Avatar, PrimaryLabel } from "components/shared";
import { VOUCH_LINK_MODAL } from "components/modals/VouchLinkModal";

import { getProfileUrl, generateTelegramLink, generateTwitterLink } from "utils/generateLinks";
import { ZERO } from "constants";
import VouchFaucetButton from "components/VouchFaucetButton";

export default function VouchersStep() {
  const { data: vouchersData = [] } = useVouchers();
  const { open } = useModals();
  const { chain } = useNetwork();
  const { address } = useAccount();

  const profileUrl = `https://app.union.finance${getProfileUrl(address, chain.id)}`;

  const vouchers = vouchersData.filter((voucher) => voucher.stakedBalance.gt(ZERO));

  return (
    <Card size="fluid" mb="24px">
      <Card.Body>
        <Box>
          <Heading level={2} size="large" grey={700}>
            Find vouchers
          </Heading>
          <Heading level={2} size="large" grey={400} ml="8px">
            (optional)
          </Heading>
        </Box>

        <Text grey={500} size="medium">
          In order to have credit and borrow on Union, you’ll need to find existing Union members to
          vouch for you. This step you can do before or after you register.
        </Text>

        <Box className="VouchersStep__container" fluid mt="24px" mb="14px" direction="vertical">
          <Card className="VouchersStep__card" size="fluid">
            {vouchers.length <= 0 ? (
              <EmptyState label={<VouchFaucetButton />} />
            ) : (
              <Table className="VouchersStep__table">
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead align="right">Trust limit</TableHead>
                </TableRow>
                {vouchers.slice(0, 3).map(({ address, trust }) => (
                  <TableRow key={address}>
                    <TableCell fixedSize>
                      <Avatar address={address} />
                    </TableCell>
                    <TableCell>
                      <Text grey={800} size="medium" weight="medium" m={0}>
                        <PrimaryLabel address={address} />
                      </Text>
                      <Text grey={500} size="small" weight="medium" m={0}>
                        {truncateAddress(address)}
                      </Text>
                    </TableCell>
                    <TableCell align="right">
                      <Text grey={800} size="medium" weight="medium" m={0}>
                        {format(trust)} DAI
                      </Text>
                    </TableCell>
                  </TableRow>
                ))}
              </Table>
            )}
          </Card>
          <ButtonRow fluid mt="16px" className="VouchesStep__buttons">
            <Button
              fluid
              size="large"
              color="primary"
              icon={LinkIcon}
              label="Get vouch link"
              onClick={() => open(VOUCH_LINK_MODAL)}
            />
            <Button
              size="large"
              color="secondary"
              variant="light"
              icon={TwitterIcon}
              as="a"
              href={generateTwitterLink(profileUrl)}
              target="_blank"
            />
            <Button
              size="large"
              color="secondary"
              variant="light"
              icon={TelegramIcon}
              as="a"
              href={generateTelegramLink(profileUrl)}
              target="_blank"
            />
          </ButtonRow>
        </Box>
      </Card.Body>
    </Card>
  );
}
