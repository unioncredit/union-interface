import {
  Box,
  Button,
  ClaimIcon,
  GovernanceIcon,
  Modal,
  ModalOverlay,
  NumericalBlock,
  NumericalRows,
} from "@unioncredit/ui";

import format from "utils/format";
import { useMember } from "providers/MemberData";
import { useModals } from "providers/ModalManager";
import useWrite from "hooks/useWrite";
import { ZERO } from "constants";
import { Link } from "react-router-dom";
import { useNetwork } from "wagmi";

export const WALLET_MODAL = "wallet-modal";

export default function WalletModal() {
  const { close } = useModals();
  const { chain } = useNetwork();

  const { data: member = {}, refetch } = useMember();

  const { unclaimedRewards = ZERO, unionBalance = ZERO } = member;

  const totalBalance = unionBalance.add(unclaimedRewards);

  /*--------------------------------------------------------------
    Contract Functions
   --------------------------------------------------------------*/

  const buttonProps = useWrite({
    contract: "userManager",
    method: "withdrawRewards",
    enabled: unclaimedRewards.gt(0),
    onComplete: async () => {
      await refetch();
      close();
    },
  });

  /*--------------------------------------------------------------
    Render Component 
   --------------------------------------------------------------*/

  return (
    <ModalOverlay onClick={close}>
      <Modal className="WalletModal">
        <Modal.Header title="UNION Balance" onClose={close} />
        <Modal.Body>
          <Box justify="center">
            <NumericalBlock
              align="center"
              size="large"
              title={`Total ${chain.name} Balance`}
              value={format(totalBalance)}
              token="union"
            />
          </Box>

          <NumericalRows
            m="16px 0"
            items={[
              {
                label: "Wallet",
                value: `${format(unionBalance)} UNION`,
              },
              {
                label: "Unclaimed",
                value: `${format(unclaimedRewards)} UNION`,
              },
            ]}
          />

          <Button fluid size="large" icon={ClaimIcon} label="Claim UNION" {...buttonProps} />
          <Button
            fluid
            as={Link}
            mt="8px"
            size="large"
            color="secondary"
            variant="light"
            label="Union Governance"
            to="/governance"
            icon={GovernanceIcon}
            onClick={close}
          />
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
}
