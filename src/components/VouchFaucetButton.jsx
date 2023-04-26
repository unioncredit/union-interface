import { Button } from "@unioncredit/ui";
import { useNetwork } from "wagmi";
import useWrite from "hooks/useWrite";
import { goerli, optimismGoerli } from "wagmi/chains";
import { useVouchers } from "providers/VouchersData";
import links from "config/links";

export default function VouchFaucetButton() {
  const { chain } = useNetwork();
  const { refetch: refetchVouchers } = useVouchers();

  const { onClick, loading, disabled } = useWrite({
    disabled: false,
    method: "claimVouch",
    contract: "vouchFaucet",
    args: [],
    onComplete: refetchVouchers,
  });

  console.log(onClick, loading, onClick);

  if (![goerli.id, optimismGoerli.id].includes(chain.id)) {
    return (
      <>
        No frens?{" "}
        <a href={links?.discord} target="_blank">
          Try Discord
        </a>
      </>
    );
  }

  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      loading={loading}
      label="Claim a testnet vouch"
      variant="secondary"
    />
  );
}
