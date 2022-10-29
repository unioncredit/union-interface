import {
  Card,
  Grid,
  Box,
  Dai,
  Stat,
  Label,
  Button,
  Skeleton,
} from "@unioncredit/ui";
import { ReactComponent as Manage } from "@unioncredit/ui/lib/icons/manage.svg";
import { MANAGE_CONTACT_MODAL } from "components/modals/ManageContactModal";

import AddressSummary from "components/shared/AddressSummary";
import { TransactionHistory } from "components/shared/TxHistory";
import { ContactsType } from "constants";
import { useModals } from "providers/ModalManager";
import format from "utils/format";

export default function ContactDetails({ contact = {}, type }) {
  const { open } = useModals();

  if (!contact) {
    return (
      <Card>
        <Card.Body>
          <AddressSummary address={null} />
          <Box mt="32px">
            <Grid>
              <Grid.Row>
                <Grid.Col>
                  <Skeleton shimmer width={160} height={24} />
                </Grid.Col>
              </Grid.Row>
              <Grid.Row>
                <Grid.Col>
                  <Skeleton shimmer w="100%" height={8} mt="24px" />
                  <Skeleton shimmer w="100%" height={24} mt="8px" />
                </Grid.Col>
                <Grid.Col>
                  <Skeleton shimmer w="100%" height={8} mt="24px" />
                  <Skeleton shimmer w="100%" height={24} mt="8px" />
                </Grid.Col>
                <Grid.Col>
                  <Skeleton shimmer w="100%" height={8} mt="24px" />
                  <Skeleton shimmer w="100%" height={24} mt="8px" />
                </Grid.Col>
              </Grid.Row>
            </Grid>
          </Box>
          <Box mt="24px" direction="vertical">
            <Skeleton shimmer width={160} height={16} mt="32px" />
            <Skeleton shimmer w="100%" height={24} mt="24px" />
            <Skeleton shimmer w="100%" height={24} mt="8px" />
            <Skeleton shimmer w="100%" height={24} mt="8px" />
            <Skeleton shimmer w="100%" height={24} mt="8px" />
          </Box>
        </Card.Body>
      </Card>
    );
  }

  const { address } = contact;

  return (
    <Card>
      <Card.Body>
        <AddressSummary address={address} />
        <Grid>
          {/*----------------------------------------------------
            * Main stats
          -------------------------------------------------------*/}
          <Grid.Row>
            <Grid.Col xs={4}>
              <Stat
                size="extra-small"
                label="Trust"
                tooltip="The DAI amount this address trusts you with"
                value={<Dai value={format(0)} />}
              />
            </Grid.Col>
            <Grid.Col xs={4}>
              <Stat
                size="extra-small"
                label="Vouch"
                tooltip="The DAI amount this address can underwrite based on their total staked DAI"
                value={<Dai value={format(0)} />}
              />
            </Grid.Col>
            <Grid.Col xs={4}>
              <Stat
                size="extra-small"
                label="Available"
                tooltip="The DAI amount you can borrow from this address"
                value={<Dai value={format(0)} />}
              />
            </Grid.Col>
          </Grid.Row>
          {type === ContactsType.VOUCHEES && (
            <>
              {/*----------------------------------------------------
                * Borrower Stats (you trust only) 
              -------------------------------------------------------*/}
              <Grid.Row>
                <Grid.Col xs={12}>
                  <Box justify="space-between" mt="8px">
                    <Label as="p" grey={400}>
                      Balance Owed
                    </Label>
                    <Label as="p" grey={700} m={0}>
                      {format(0)}
                    </Label>
                  </Box>
                  <Box justify="space-between">
                    <Label as="p" grey={400}>
                      Min. Payment
                    </Label>
                    <Label as="p" grey={700} m={0}>
                      {format(0)}
                    </Label>
                  </Box>
                  <Box justify="space-between">
                    <Label as="p" grey={400}>
                      Payment Due
                    </Label>
                    <Label as="p" grey={700} m={0}>
                      No Payment Due
                    </Label>
                  </Box>
                </Grid.Col>
              </Grid.Row>
            </>
          )}
          {/*----------------------------------------------------
            * Buttons (you trust only)
          -------------------------------------------------------*/}
          <Grid.Row>
            <Grid.Col xs={12}>
              <Button
                fluid
                mt="12px"
                icon={Manage}
                variant="secondary"
                label="Manage Contact"
                onClick={() => open(MANAGE_CONTACT_MODAL, { contact, type })}
              />
            </Grid.Col>
          </Grid.Row>
        </Grid>
      </Card.Body>
      <TransactionHistory staker={address} />
    </Card>
  );
}
