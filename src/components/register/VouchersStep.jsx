import "./VouchersStep.scss";

import {
  ArrowIcon,
  Box,
  Button,
  ButtonRow,
  Card,
  EmptyState,
  Heading,
  LinkIcon,
  Text,
} from "@unioncredit/ui";

import { useModals } from "providers/ModalManager";
import { useVouchers } from "providers/VouchersData";
import { VOUCH_LINK_MODAL } from "components/modals/VouchLinkModal";

import { ZERO } from "constants";
import VouchFaucetButton from "components/VouchFaucetButton";
import VouchersOverview from "../credit/VouchersOverview";

export default function VouchersStep({ complete, onSkipStep }) {
  const { data: vouchersData = [] } = useVouchers();
  const { open } = useModals();

  const vouchers = vouchersData.filter((voucher) => voucher.stakedBalance > ZERO);

  return (
    <Card size="fluid" mb="24px" className="VouchersStep">
      <Card.Body>
        <Box>
          <Heading level={2} size="large" grey={700}>
            Share your profile link with friends
          </Heading>
        </Box>

        <Text grey={500} size="medium">
          To get credit and borrow on Union, find existing Union members to vouch for you. This step
          can be done before or after you register.
        </Text>

        {vouchers.length <= 0 ? (
          <Card className="VouchersStep__card" m="24px 0" size="fluid">
            <EmptyState label={<VouchFaucetButton />} />
          </Card>
        ) : (
          <VouchersOverview vouchers={vouchers} displayCount={6} />
        )}

        <ButtonRow fluid mt="16px" className="VouchesStep__buttons">
          <Button
            fluid
            size="large"
            color="primary"
            icon={LinkIcon}
            label="Get link"
            onClick={() => open(VOUCH_LINK_MODAL)}
          />
          <Button
            fluid
            color="secondary"
            variant="light"
            label="Skip"
            size="large"
            icon={ArrowIcon}
            onClick={onSkipStep}
            disabled={complete}
          />
        </ButtonRow>
      </Card.Body>
    </Card>
  );
}
