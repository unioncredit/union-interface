import {
  Card,
  Grid,
  Box,
  Dai,
  Stat,
  Label,
  Button,
  Skeleton,
  ModalOverlay,
  Modal,
} from "@unioncredit/ui";
import { useNetwork } from "wagmi";
import { ReactComponent as Manage } from "@unioncredit/ui/lib/icons/manage.svg";
import { MANAGE_CONTACT_MODAL } from "components/modals/ManageContactModal";

import AddressSummary from "components/shared/AddressSummary";
import { TransactionHistory } from "components/shared/TxHistory";
import { ZERO } from "constants";
import { ContactsType } from "constants";
import useIsMobile from "hooks/useIsMobile";
import { useModals } from "providers/ModalManager";
import { useEffect } from "react";
import format from "utils/format";
import dueDate from "utils/dueDate";
import { useProtocol } from "providers/ProtocolData";
import { useVersionBlockNumber } from "hooks/useVersionBlockNumber";
import { useVersion } from "providers/Version";

function NoScrollModal(props) {
  useEffect(() => {
    document.body.classList.add("no-scroll");
    return () => {
      document.body.classList.remove("no-scroll");
    };
  });
  return <Modal {...props} />;
}

export default function ContactDetails({ contact, setContactIndex, type }) {
  const isMobile = useIsMobile();
  const { open } = useModals();
  const { isV2 } = useVersion();
  const { data: protocol = {} } = useProtocol();
  const { chain: connectedChain } = useNetwork();
  const { data: blockNumber } = useVersionBlockNumber({
    chainId: connectedChain.id,
  });

  const { overdueTime, overdueBlocks } = protocol;

  /*----------------------------------------------------
   * Hide on mobile when no contact
  -------------------------------------------------------*/
  if (!contact && isMobile) {
    return null;
  }

  /*----------------------------------------------------
   * Skeleton State 
  -------------------------------------------------------*/
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

  const {
    address,
    trust = ZERO,
    vouch = ZERO,
    locking = ZERO,
    locked = ZERO,
    interest = ZERO,
    lastRepay = ZERO,
  } = contact || {};

  // vouchers have a locked amount while vouchees have a locking
  // amount. If therefore either locking or locked is going to be zero
  // so we can just subtract them both to handle both vouchee and voucher
  // cases here
  const available = vouch.sub(locking).sub(locked);

  const content = (
    <>
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
              tooltip={
                type === ContactsType.VOUCHERS
                  ? "The DAI amount this address trusts you with"
                  : "The DAI amount you trust this address with"
              }
              value={<Dai value={format(trust)} />}
            />
          </Grid.Col>
          <Grid.Col xs={4}>
            <Stat
              size="extra-small"
              label="Vouch"
              tooltip={
                type === ContactsType.VOUCHERS
                  ? "The DAI amount this address can underwrite based on their total staked DAI"
                  : "The DAI amount you can underwrite for this address"
              }
              value={<Dai value={format(vouch)} />}
            />
          </Grid.Col>
          <Grid.Col xs={4}>
            <Stat
              size="extra-small"
              label="Available"
              tooltip={
                type === ContactsType.VOUCHERS
                  ? "The DAI amount you can borrow from this address"
                  : "The DAI amount this address can lock of yours"
              }
              value={<Dai value={format(available)} />}
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
                    {format(locking)}
                  </Label>
                </Box>
                <Box justify="space-between">
                  <Label as="p" grey={400}>
                    Min. Payment
                  </Label>
                  <Label as="p" grey={700} m={0}>
                    {format(interest)}
                  </Label>
                </Box>
                <Box justify="space-between">
                  <Label as="p" grey={400}>
                    Payment Due
                  </Label>
                  <Label as="p" grey={700} m={0}>
                    {dueDate(
                      lastRepay,
                      isV2 ? overdueTime : overdueBlocks,
                      blockNumber,
                      connectedChain.id
                    )}
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
    </>
  );

  /*----------------------------------------------------
   * Render 
  -------------------------------------------------------*/
  return (
    <Card overflow>
      {isMobile ? (
        <ModalOverlay onClick={() => setContactIndex(null)}>
          <NoScrollModal size="large">
            <Modal.Header
              title="Contact details"
              className="contactDetailsModal"
              onClose={() => setContactIndex(null)}
            />
            <Modal.Body>{content}</Modal.Body>
            <TransactionHistory staker={address} pageSize={3} />
          </NoScrollModal>
        </ModalOverlay>
      ) : (
        <>
          <Card.Body>{content}</Card.Body>
          <TransactionHistory staker={address} pageSize={5} />
        </>
      )}
    </Card>
  );
}
