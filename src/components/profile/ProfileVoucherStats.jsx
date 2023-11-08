import "./ProfileVoucherStats.scss";

import { Badge, Box, Heading, Text } from "@unioncredit/ui";
import { Avatar, PrimaryLabel } from "../shared";
import format from "utils/format";

export function ProfileVoucherStats({ vouchers, vouchees }) {
  const topVouchers = [...vouchers].sort((a, b) => a.vouch.lt(b.vouch)).slice(0, 3);

  return (
    vouchers.length > 0 && (
      <Box className="ProfileVoucherStats" direction="vertical">
        <Box
          className="ProfileVoucherStats__header"
          mb="16px"
          justify="space-between"
          align="center"
          fluid
        >
          <Heading m={0} level={2} size="small" weight="medium" grey={500}>
            Top Vouchers
          </Heading>

          <Text m={0} grey={500} size="medium">
            {topVouchers.length} of {vouchers.length}
          </Text>
        </Box>

        <Box className="ProfileVoucherStats__TopVouchers" direction="vertical" fluid>
          {topVouchers.map(({ address, vouch }) => (
            <Box
              key={address}
              className="ProfileVoucherStats__TopVoucher"
              justify="space-between"
              align="center"
              fluid
            >
              <Box>
                <Avatar address={address} size={40} />

                <Box pl="8px" direction="vertical">
                  <Text m={0} size="medium">
                    <PrimaryLabel address={address} />
                  </Text>
                  <Text m={0} size="small" grey={500}>
                    {vouchees.find((v) => v.address === address) ? "Mutual Contact" : "Top Voucher"}
                  </Text>
                </Box>
              </Box>

              <Badge color="grey" label={`${format(vouch)} DAI`} borderColor="#E4E4E7" />
            </Box>
          ))}
        </Box>
      </Box>
    )
  );
}
