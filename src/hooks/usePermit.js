import { useCallback, useMemo, useState } from "react";
import { signDaiPermit, signERC2612Permit } from "eth-permit";
import { useAccount, useNetwork, useSigner } from "wagmi";
import { PermitType } from "utils/permits";

export default function usePermit({
  type,
  args,
  value,
  spender,
  tokenAddress,
  onComplete,
}) {
  const { address } = useAccount();
  const { data: signer } = useSigner();
  const { chain: connectedChain } = useNetwork();
  const [loading, setLoading] = useState(false);

  const createDaiPermit = useCallback(async () => {
    const permit = await signDaiPermit(
      signer.provider,
      tokenAddress,
      address,
      spender
    );

    return [...args, permit.nonce, permit.expiry, permit.v, permit.r, permit.s];
  }, [signer, tokenAddress, address, spender]);

  const createERC2612Permit = useCallback(async () => {
    const permit = await signERC2612Permit(
      signer.provider,
      tokenAddress,
      address,
      spender,
      value.toString()
    );

    return [...args, permit.deadline, permit.v, permit.r, permit.s];
  }, [signer, tokenAddress, address, spender, value]);

  const onClick = useCallback(async () => {
    setLoading(true);

    try {
      switch (type) {
        case PermitType.DAI:
          onComplete(await createDaiPermit());
          break;

        case PermitType.ERC20:
          onComplete(await createERC2612Permit());
          break;
      }
    } catch (err) {
      console.warn("usePermit failed: ", err);
    } finally {
      setLoading(false);
    }
  }, [
    createERC2612Permit,
    createDaiPermit,
    connectedChain.id,
    address,
    spender,
    value,
  ]);

  return useMemo(
    () => ({
      loading,
      onClick,
    }),
    [onClick, loading]
  );
}
