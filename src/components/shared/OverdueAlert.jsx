import { Box, Alert } from "@unioncredit/ui";

import { ZERO } from "constants";
import format from "utils/format";
import { useMember } from "providers/MemberData";
import { useModals } from "providers/ModalManager";
import { REPAY_MODAL } from "components/modals/RepayModal";

export default function OverdueAlert() {
  const { open } = useModals();
  const { data: member = {} } = useMember();

  const { isOverdue, minPayment = ZERO } = member;

  if (!isOverdue) {
    return null;
  }

  return (
    <Box
      w="100%"
      maxw="445px"
      mb="24px"
      align="center"
      justify="center"
      ml="auto"
      mr="auto"
    >
      <Alert
        label={`Overdue payment of ${format(minPayment)} DAI`}
        action={{ label: "Make payment", onClick: () => open(REPAY_MODAL) }}
      />
    </Box>
  );
}
