import "./WalletModal.scss";

import {
  Box,
  Button,
  ChartIcon,
  ClaimIcon,
  LockIcon,
  Modal,
  ModalOverlay,
  NumericalBlock,
  NumericalRows,
  Tooltip,
} from "@unioncredit/ui";
import { mainnet } from "viem/chains";

import format from "utils/format";
import { useMember } from "providers/MemberData";
import { useModals } from "providers/ModalManager";
import useWrite from "hooks/useWrite";
import { ZERO } from "constants";
import { useWatchAsset } from "hooks/useWatchAsset";
import useContract from "hooks/useContract";
import { getVersion } from "providers/Version";
import { WalletReferralCta } from "./WalletModal/WalletReferralCta";
import { WalletRewards } from "./WalletModal/WalletRewards";

export const WALLET_MODAL = "wallet-modal";

export default function WalletModal() {
  const { close } = useModals();
  const { watchAsset } = useWatchAsset();
  const union = useContract("union", mainnet.id, getVersion(mainnet.id));

  const { data: member = {}, refetch } = useMember();

  const { isOverdue, unclaimedRewards = ZERO, unionBalance = ZERO } = member;

  const totalBalance = unionBalance + unclaimedRewards;

  /*--------------------------------------------------------------
    Contract Functions
   --------------------------------------------------------------*/

  const buttonProps = useWrite({
    contract: "userManager",
    method: "withdrawRewards",
    enabled: unclaimedRewards > 0n,
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
          <Box justify="space-between">
            <NumericalBlock
              align="left"
              size="large"
              title={`Current Balance`}
              value={format(totalBalance, "UNION")}
              token="union"
            />

            <Button
              mt="2px"
              size="pill"
              variant="light"
              color="secondary"
              label="+ Add token to wallet"
              onClick={() => watchAsset({ address: union.address })}
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

          {isOverdue ? (
            <Tooltip content="You cannot claim rewards while in default" w="100%">
              <Button
                size="large"
                icon={LockIcon}
                label="Claim UNION"
                {...buttonProps}
                disabled={true}
                fluid
              />
            </Tooltip>
          ) : (
            <Button fluid size="large" icon={ClaimIcon} label="Claim UNION" {...buttonProps} />
          )}

          <Button
            fluid
            mt="8px"
            size="large"
            color="secondary"
            variant="light"
            label="Points Leaderboard"
            className="PointsLeaderboardButton"
            icon={ChartIcon}
            onClick={() => open("https://www.stack.so/leaderboard/union-points-program")}
          />

          <WalletRewards />
          <WalletReferralCta />
        </Modal.Body>
      </Modal>
    </ModalOverlay>
  );
}
