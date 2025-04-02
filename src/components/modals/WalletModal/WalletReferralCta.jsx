import { Button, ConfettiIcon, Modal, Text } from "@unioncredit/ui";
import { SHARE_REFERRAL_MODAL } from "../ShareReferralModal";
import { WALLET_MODAL } from "../WalletModal";
import { useModals } from "providers/ModalManager";
import { useAccount } from "wagmi";

export const WalletReferralCta = () => {
  const { open } = useModals();
  const { chain, address } = useAccount();

  return (
    <Modal.Container mt="16px" p="8px" align="center">
      <Button
        mr="8px"
        label="Referral"
        size="small"
        icon={ConfettiIcon}
        onClick={() => {
          open(SHARE_REFERRAL_MODAL, {
            address,
            chainId: chain?.id,
            onBack: () => {
              open(WALLET_MODAL);
            },
          });
        }}
      />

      <Text m={0} size="small" grey={600}>
        Share your link and get ETH when they register and points based on their activity
        <a
          target="_blank"
          rel="noreferrer"
          href="https://union.mirror.xyz/xXmgVkG3usy0b8x2kfRmtY27zl7qLnrAQmQcMUwz68c"
          style={{ textDecoration: "underline", marginLeft: "4px" }}
        >
          Learn more -&gt;
        </a>
      </Text>
    </Modal.Container>
  );
};
