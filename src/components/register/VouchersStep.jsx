import "./VouchersStep.scss";
import {
  Table,
  TableRow,
  TableHead,
  Card,
  Divider,
  Box,
  ButtonRow,
  Button,
  Text,
  TableCell,
  Label,
  EmptyState,
} from "@unioncredit/ui";
import { ReactComponent as Twitter } from "@unioncredit/ui/lib/icons/twitter.svg";
import { ReactComponent as Telegram } from "@unioncredit/ui/lib/icons/telegram.svg";
import { ReactComponent as Link } from "@unioncredit/ui/lib/icons/link.svg";

import format from "utils/format";
import Avatar from "components/shared/Avatar";
import { useModals } from "providers/ModalManager";
import { useVouchers } from "providers/VouchersData";
import { truncateAddress } from "utils/truncateAddress";
import PrimaryLabel from "components/shared/PrimaryLabel";
import { CREDIT_REQUEST_MODAL } from "components/modals/CreditRequestModal";
import links from "config/links";
import { useAccount, useNetwork } from "wagmi";
import getProfileUrl, {
  generateTelegramLink,
  generateTwitterLink,
} from "utils/generateLinks";
import { ZERO } from "constants";

export default function VouchersStep() {
  const { data: vouchersData = [] } = useVouchers();
  const { open } = useModals();
  const { chain } = useNetwork();
  const { address } = useAccount();
  const profileUrl = getProfileUrl(address, chain.id);
  const vouchers = vouchersData.filter((voucher) =>
    voucher.stakerBalance.gt(ZERO)
  );

  return (
    <Card size="fluid" mb="24px">
      <Card.Header
        title="Find vouchers"
        subTitle="Get an existing Union member to vouch for you. They’ll need to trust you, as vouching on Union puts the vouchers funds at risk if you fail to repay. The voucher must have DAI staked in order to be valid."
      />
      <Card.Body>
        <Divider />
        <Box fluid mt="24px" mb="14px" direction="vertical">
          <Text grey={700}>Vouchers · {vouchers.length}</Text>
          <Card size="fluid">
            {vouchers.length <= 0 ? (
              <EmptyState
                label={
                  <>
                    No frens?{" "}
                    <a href={links.discord} target="_blank">
                      Try Discord
                    </a>
                  </>
                }
              />
            ) : (
              <Table className="VouchersStep__table">
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead align="right">Trust limit (DAI)</TableHead>
                </TableRow>
                {vouchers.slice(0, 3).map(({ address, trust }) => (
                  <TableRow key={address}>
                    <TableCell fixedSize>
                      <Avatar address={address} />
                    </TableCell>
                    <TableCell>
                      <Label as="p" grey={700} m={0}>
                        <PrimaryLabel address={address} />
                      </Label>
                      <Label as="p" size="small" grey={400} m={0}>
                        {truncateAddress(address)}
                      </Label>
                    </TableCell>
                    <TableCell align="right">{format(trust)}</TableCell>
                  </TableRow>
                ))}
              </Table>
            )}
          </Card>
          <ButtonRow fluid mt="8px" className="VouchesStep__buttons">
            <Button
              fluid
              color="blue"
              icon={Link}
              label="Get vouch link"
              onClick={() => open(CREDIT_REQUEST_MODAL)}
            />
            <Button
              variant="secondary"
              icon={Twitter}
              as="a"
              href={generateTwitterLink(profileUrl)}
              target="_blank"
            />
            <Button
              variant="secondary"
              icon={Telegram}
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
