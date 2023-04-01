import "./VouchersOverview.scss";

import {
  Text,
  Box,
  Card,
  NumericalBlock,
  Dot,
  ButtonRow,
  Button,
  IncreaseIcon,
} from "@unioncredit/ui";
import { reduceBnSum } from "utils/reduce";
import { Links, ZERO } from "constants";
import format from "utils/format";
import { truncateAddress } from "utils/truncateAddress";
import { PieChart } from "react-minimal-pie-chart";
import { sumField } from "utils/sum";
import { VOUCH_LINK_MODAL } from "components/modals/VouchLinkModal";
import { useModals } from "providers/ModalManager";

export default function VouchersOverview({ vouchers, displayCount }) {
  const { open } = useModals();

  const colors = [
    "#f59e0b",
    "#6366f1",
    "#14b8a6",
    "#f97316",
    "#0ea5e9",
    "#3730a3",
  ];

  const hasVouchers = vouchers.length > 0;
  const vouch = vouchers.map(({ vouch }) => vouch).reduce(reduceBnSum, ZERO);

  let sortedVouchers = vouchers
    .sort((a, b) => a.vouch.lt(b.vouch))
    .map((voucher) => ({
      vouch: voucher.vouch,
      label: voucher.ens ? voucher.ens : truncateAddress(voucher.address),
      percentage: Number(voucher.vouch.mul(10000).div(vouch).toString()) / 100,
    }));

  // If we have more than displayCount vouchers, collapse into "others" item
  if (sortedVouchers.length > displayCount) {
    const others = sortedVouchers.slice(displayCount);
    const othersVouch = others.reduce((acc, curr) => acc.add(curr.vouch), ZERO);

    sortedVouchers = sortedVouchers.slice(0, displayCount - 1);
    sortedVouchers.push({
      vouch: othersVouch,
      label: `${others.length} others`,
      percentage:
        Math.round((100 - sumField(sortedVouchers, "percentage")) * 100) / 100,
    });
  }

  return (
    <Card mt="24px" className="VouchersOverview">
      <Card.Body>
        <Box>
          <PieChart
            lineWidth={35}
            className="VouchersOverview__chart"
            data={
              !hasVouchers
                ? [{ value: 100, color: colors[0] }]
                : sortedVouchers.map((voucher, i) => ({
                    value: voucher.percentage,
                    color: colors[i],
                  }))
            }
          />

          <NumericalBlock
            size="large"
            align="left"
            title="Your credit limit"
            value={format(vouch, 2, false)}
            token="dai"
            subtitle={
              hasVouchers
                ? `Receiving from ${vouchers.length} contacts`
                : "No vouchers"
            }
          />
        </Box>

        <Box m="24px 0" className="VouchersOverview__breakdown">
          {hasVouchers ? (
            sortedVouchers.map((voucher, i) => (
              <Box
                mb="4px"
                align="center"
                key={voucher.label}
                className="VouchersOverview__breakdown__voucher"
              >
                {colors?.[i] && <Dot mr="4px" hex={colors[i]} />}

                <Text
                  size="medium"
                  weight="medium"
                  grey={600}
                  m={0}
                >{`${voucher.percentage}% · ${voucher.label}`}</Text>
              </Box>
            ))
          ) : (
            <Text
              w="100%"
              grey={500}
              align="center"
              className="VouchersOverview__notice"
            >
              Not actively receiving any vouches
            </Text>
          )}
        </Box>

        <ButtonRow>
          <Button
            fluid
            size="large"
            icon={IncreaseIcon}
            label="Increase credit limit"
            onClick={() => open(VOUCH_LINK_MODAL)}
          />

          <Button
            fluid
            as="a"
            size="large"
            color="secondary"
            variant="light"
            label="View all contacts"
            href={Links.CONTACTS}
          />
        </ButtonRow>
      </Card.Body>
    </Card>
  );
}
