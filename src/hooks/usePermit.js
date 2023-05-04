import { useCallback, useMemo, useState } from "react";
import { signDaiPermit, signERC2612Permit } from "eth-permit";
import { useAccount, useSigner } from "wagmi";
import { PermitType } from "utils/permits";

export default function usePermit({
  type,
  args,
  value,
  spender,
  tokenAddress,
  onComplete,
  domain = null,
}) {
  const { address } = useAccount();
  const { data: signer } = useSigner();
  const [loading, setLoading] = useState(false);

  const createDaiPermit = useCallback(async () => {
    const permit = await signDaiPermit(
      signer.provider,
      domain
        ? {
            ...domain,
            verifyingContract: tokenAddress,
          }
        : tokenAddress,
      address,
      spender
    );

    return [...args, permit.nonce, permit.expiry, permit.v, permit.r, permit.s];
  }, [
    signDaiPermit,
    signer?.provider,
    tokenAddress,
    address,
    spender,
    JSON.stringify(domain),
    JSON.stringify(args),
  ]);

  const createERC2612Permit = useCallback(async () => {
    const permit = await signERC2612Permit(
      signer.provider,
      domain
        ? {
            ...domain,
            verifyingContract: tokenAddress,
          }
        : tokenAddress,
      address,
      spender,
      value.toString()
    );

    return [...args, permit.deadline, permit.v, permit.r, permit.s];
  }, [
    signERC2612Permit,
    signer?.provider,
    tokenAddress,
    address,
    spender,
    value,
    JSON.stringify(domain),
    JSON.stringify(args),
  ]);

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
  }, [createERC2612Permit, createDaiPermit, onComplete]);

  return useMemo(
    () => ({
      loading,
      onClick,
    }),
    [onClick, loading]
  );
}
