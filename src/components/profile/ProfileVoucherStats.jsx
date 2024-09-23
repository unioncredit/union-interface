import "./ProfileVoucherStats.scss";

import { ArrowRightIcon, Box, Heading, Text } from "@unioncredit/ui";
import { Avatar, PrimaryLabel } from "../shared";
import format from "utils/format";
import { Link } from "react-router-dom";
import { getProfileUrl } from "../../utils/generateLinks";

export function ProfileVoucherStats({ vouchers, vouchees, chainId }) {
  const topVouchers = [...vouchers].sort((a, b) => (a.vouch.lt(b.vouch) ? 1 : -1)).slice(0, 3);

  return (
    <Box className="ProfileVoucherStats" direction="vertical" fluid>
      <Heading mb="16px" level={2}>
        Notable Connections
      </Heading>

      {topVouchers.length > 0 ? (
        <Box className="ProfileVoucherStats__TopVouchers" direction="vertical" fluid>
          {topVouchers.map(({ address, vouch }) => (
            <Link key={address} to={getProfileUrl(address, chainId)}>
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
                      {`${format(vouch, 0)} DAI`}
                    </Text>
                  </Box>
                </Box>

                <Box className="ProfileVoucherStats__arrow">
                  <ArrowRightIcon width={24} height={24} />
                </Box>
              </Box>
            </Link>
          ))}
        </Box>
      ) : (
        <Text size="medium" grey={500}>
          This user has no vouchers.
        </Text>
      )}
    </Box>
  );
}
