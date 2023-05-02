import "./ContactDetailsTab.scss";

import { CreditDetailsHeader } from "components/modals/ManageContactModal/CreditDetailsHeader";
import { ContactsType, ZERO } from "constants";
import {
  Box,
  Button,
  Modal,
  NumericalBlock,
  NumericalRows,
  Text,
  VouchIcon,
} from "@unioncredit/ui";
import { EDIT_VOUCH_MODAL } from "components/modals/EditVouch";
import format from "utils/format";
import { WRITE_OFF_DEBT_MODAL } from "components/modals/WriteOffDebtModal";
import { useModals } from "providers/ModalManager";
import { useMemberData } from "providers/MemberData";
import { useVouchee } from "providers/VoucheesData";
import { useLastRepayData } from "hooks/useLastRepayData";
import { useVoucher } from "providers/VouchersData";
import { VOUCH_MODAL } from "components/modals/VouchModal";

export function ContactDetailsTab({ address, clearContact }) {
  const { open } = useModals();

  const vouchee = useVouchee(address);
  const voucher = useVoucher(address);

  return (
    <>
      <CreditDetailsHeader
        title="You're providing"
        type={ContactsType.VOUCHERS}
      />
      <div className="container">
        {vouchee ? (
          <VoucheeDetails vouchee={vouchee} clearContact={clearContact} />
        ) : (
          <Modal.Container align="center" direction="vertical">
            <Text m={0} grey={500}>
              You're not providing to this contact
            </Text>

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
          </Modal.Container>
        )}
      </div>

      <CreditDetailsHeader
        title="You're receiving"
        type={ContactsType.VOUCHEES}
      />
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
    </>
  );
}

const VoucherDetails = ({ voucher }) => {
  const { trust = ZERO, vouch = ZERO, locked = ZERO } = voucher;

  return (
    <NumericalRows
      items={[
        {
          label: "Trust",
          value: `${format(trust)} DAI`,
          tooltip: {
            shrink: true,
            content: "TODO",
            position: "right",
          },
        },
        {
          label: "Vouch you receive",
          value: `${format(vouch)} DAI`,
          tooltip: {
            shrink: true,
            content: "TODO",
            position: "right",
          },
        },
        {
          label: "Available to you",
          value: `${format(vouch.sub(locked))} DAI`,
          tooltip: {
            shrink: true,
            content: "TODO",
            position: "right",
          },
        },
      ]}
    />
  );
};

const VoucheeDetails = ({ vouchee, clearContact }) => {
  const { address } = vouchee;
  const { open } = useModals();
  const { data: memberData = {} } = useMemberData(address);

  const {
    locking = ZERO,
    trust = ZERO,
    vouch = ZERO,
    lastRepay = ZERO,
    minPayment = ZERO,
    isOverdue,
  } = { ...vouchee, ...memberData };

  const { paymentDue, relative: lastRepayRelative } =
    useLastRepayData(lastRepay);

  const stats = [
    {
      title: "Trust",
      value: format(trust),
      buttonProps: {
        label: "Change",
        onClick: () => open(EDIT_VOUCH_MODAL, { address, clearContact }),
      },
    },
    {
      title: "Owes you",
      value: format(locking),
      buttonProps: {
        label: "Write-off",
        disabled: locking.lte(ZERO),
        onClick: () => {
          clearContact();
          open(WRITE_OFF_DEBT_MODAL, { address, clearContact });
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
              token="dai"
              align="left"
            />

            <Button
              size="pill"
              variant="light"
              color="secondary"
              {...buttonProps}
            />
          </Modal.Container>
        ))}
      </Box>

      <NumericalRows
        m="24px 0 0"
        items={[
          {
            label: "Vouch you provide",
            value: `${format(vouch)} DAI`,
            tooltip: {
              shrink: true,
              content: "TODO",
              position: "right",
            },
          },
          {
            label: "Available to borrow",
            value: `${format(vouch.sub(locking))} DAI`,
            tooltip: {
              shrink: true,
              content: "TODO",
              position: "right",
            },
          },
          {
            label: "Last payment made",
            value: lastRepayRelative,
            tooltip: {
              shrink: true,
              content: "TODO",
              position: "right",
            },
          },
          {
            label: "Payment due",
            value:
              paymentDue.formatted === "N/A"
                ? paymentDue.formatted
                : isOverdue
                ? `${format(minPayment)} DAI - ${paymentDue.formatted} ago`
                : `${format(minPayment)} DAI in ${paymentDue.formatted}`,
            tooltip: {
              shrink: true,
              content: "TODO",
              position: "right",
            },
          },
        ]}
      />
    </>
  );
};
