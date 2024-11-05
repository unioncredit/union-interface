import "./ContactDetailsTab.scss";

import { CreditDetailsHeader } from "components/modals/ManageContactModal/CreditDetailsHeader";
import { ContactsType, ZERO } from "constants";
import {
  Box,
  Button,
  CancelIcon,
  LockIcon,
  Modal,
  NumericalBlock,
  NumericalRows,
  Text,
  Tooltip,
  VouchIcon,
} from "@unioncredit/ui";
import useWrite from "hooks/useWrite";
import { useAccount } from "wagmi";
import { useNavigate } from "react-router-dom";

import { EDIT_VOUCH_MODAL } from "components/modals/EditVouch";
import format from "utils/format";
import { WRITE_OFF_DEBT_MODAL } from "components/modals/WriteOffDebtModal";
import { useModals } from "providers/ModalManager";
import { useMember, useMemberData } from "providers/MemberData";
import { useVouchee } from "providers/VoucheesData";
import { useLastRepayData } from "hooks/useLastRepayData";
import { useVoucher } from "providers/VouchersData";
import { VOUCH_MODAL } from "components/modals/VouchModal";
import { useSettings } from "providers/Settings";
import { useToken } from "hooks/useToken";

export function ContactDetailsTab({
  address,
  nextContact,
  prevContact,
  contactIndex,
  contactsCount,
  clearContact,
}) {
  const { open } = useModals();
  const { data: member } = useMember();

  const { isOverdue } = member;

  const vouchee = useVouchee(address);
  const voucher = useVoucher(address);

  return (
    <div className="ContactDetailsTab">
      <CreditDetailsHeader title="You're providing" type={ContactsType.VOUCHERS} />
      <div className="container">
        {vouchee ? (
          <VoucheeDetails
            vouchee={vouchee}
            address={address}
            nextContact={nextContact}
            prevContact={prevContact}
            contactIndex={contactIndex}
            contactsCount={contactsCount}
            clearContact={clearContact}
          />
        ) : (
          <Modal.Container align="center" direction="vertical">
            <Text m={0} grey={500}>
              You're not providing to this contact
            </Text>

            {isOverdue ? (
              <Tooltip content="You cannot vouch for new addresses while in default">
                <Button
                  mt="8px"
                  size="small"
                  color="secondary"
                  variant="light"
                  icon={LockIcon}
                  disabled={true}
                >
                  Vouch
                </Button>
              </Tooltip>
            ) : (
              <Button
                mt="8px"
                size="small"
                color="secondary"
                variant="light"
                icon={VouchIcon}
                onClick={() => {
                  clearContact();
                  open(VOUCH_MODAL, { address });
                }}
              >
                Vouch
              </Button>
            )}
          </Modal.Container>
        )}
      </div>

      <CreditDetailsHeader title="You're receiving" type={ContactsType.VOUCHEES} />
      <div className="container">
        {voucher ? (
          <VoucherDetails voucher={voucher} />
        ) : (
          <Modal.Container justify="center">
            <Text m={0} grey={500}>
              You're not receiving from this contact
            </Text>
          </Modal.Container>
        )}
      </div>
    </div>
  );
}

const VoucherDetails = ({ voucher }) => {
  const navigate = useNavigate();
  const { token } = useToken();

  const { address: borrowerAddress } = useAccount();
  const { address: stakerAddress, trust = ZERO, vouch = ZERO, locking = ZERO } = voucher;

  const cancelVouchButtonProps = useWrite({
    contract: "userManager",
    method: "cancelVouch",
    args: [stakerAddress, borrowerAddress], // staker, borrower
    enabled: locking.lte(ZERO),
    onComplete: async () => {
      navigate(0); // reload page
    },
  });

  return (
    <>
      <NumericalRows
        items={[
          {
            label: "Trust amount",
            value: `${format(trust, token)} ${token}`,
            tooltip: {
              content: "Trust set for you by this contact",
            },
          },
          {
            label: "Vouch you receive",
            value: `${format(vouch, token)} ${token}`,
            tooltip: {
              content: "The max vouch you would receive based on their total stake",
            },
          },
          {
            label: "Available to you",
            value: `${format(vouch.sub(locking), token)} ${token}`,
            tooltip: {
              content: "The amount currently available to borrow via this contacts unlocked stake",
            },
          },
        ]}
      />

      <Tooltip
        w="100%"
        enabled={locking.gt(ZERO)}
        title="Cannot be cancelled"
        content="A received vouch cannot be cancelled if there is outstanding debt"
      >
        <Button
          fluid
          mt="16px"
          color="red"
          icon={CancelIcon}
          label="Cancel received vouch"
          {...cancelVouchButtonProps}
          disabled={cancelVouchButtonProps.disabled || locking.gt(ZERO)}
        />
      </Tooltip>
    </>
  );
};

const VoucheeDetails = ({
  vouchee,
  address,
  nextContact,
  prevContact,
  contactIndex,
  contactsCount,
  clearContact,
}) => {
  const { open } = useModals();
  const { token } = useToken();
  const { address: voucheeAddress } = vouchee;

  const { data: memberData = {} } = useMemberData(voucheeAddress);

  const {
    locking = ZERO,
    trust = ZERO,
    vouch = ZERO,
    lastRepay = ZERO,
    minPayment = ZERO,
    isOverdue,
  } = { ...vouchee, ...memberData };

  const { paymentDue, formatted: lastRepayFormatted } = useLastRepayData(lastRepay);

  const stats = [
    {
      title: "Trust",
      value: format(trust, token),
      buttonProps: {
        label: "Change",
        onClick: () =>
          open(EDIT_VOUCH_MODAL, {
            address,
            nextContact,
            prevContact,
            contactIndex,
            contactsCount,
            clearContact,
          }),
      },
    },
    {
      title: "Owes you",
      value: format(locking, token),
      buttonProps: {
        label: "Write-off",
        disabled: locking.lte(ZERO),
        onClick: () => {
          clearContact();
          open(WRITE_OFF_DEBT_MODAL, {
            address,
            nextContact,
            prevContact,
            contactIndex,
            contactsCount,
            clearContact,
          });
        },
      },
    },
  ];

  return (
    <>
      <Box className="ContactDetailsTab__stats">
        {stats.map(({ title, value, buttonProps }) => (
          <Modal.Container
            key={title}
            fluid
            p="12px"
            align="flex-end"
            justify="space-between"
            className="ContactDetailsTab__stat"
          >
            <NumericalBlock
              size="x-small"
              title={title}
              value={value}
              token={token.toLowerCase()}
              align="left"
            />

            <Button size="pill" variant="light" color="secondary" {...buttonProps} />
          </Modal.Container>
        ))}
      </Box>

      <NumericalRows
        m="24px 0 0"
        items={[
          {
            label: "Vouch you provide",
            value: `${format(vouch, token)} ${token}`,
            tooltip: {
              content: `The theoretical max amount of ${token} you’re underwriting to this contact. This is the lesser of your deposit stake and your trust setting`,
            },
          },
          {
            label: "Available to borrow",
            value: `${format(vouch.sub(locking), token)} ${token}`,
            tooltip: {
              content:
                "The amount this contact can borrow accounting for outstanding borrows from them and other contacts",
            },
          },
          {
            label: "Last payment made",
            value: lastRepayFormatted,
            tooltip: {
              content: "The last time a payment was made by this contact",
            },
          },
          {
            label: "Payment due",
            value:
              paymentDue.formatted === "N/A" || locking.lte(ZERO)
                ? "N/A"
                : isOverdue
                ? `${format(minPayment, token)} ${token} - ${paymentDue.formatted} ago`
                : `${format(minPayment, token)} ${token} in ${paymentDue.formatted}`,
            tooltip: {
              content: "Amount and time until their next minimum payment",
            },
          },
        ]}
      />
    </>
  );
};
