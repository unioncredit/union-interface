import { useCallback, useMemo, useState } from "react";
import { signDaiPermit, signERC2612Permit } from "eth-permit";
import { useAccount } from "wagmi";
import { PermitType } from "utils/permits";
import { BnStringify } from "utils/json";

export default function usePermit({
  type,
  args,
  value,
  spender,
  tokenAddress,
  onComplete,
  domain = null,
}) {
  const { connector, address } = useAccount();
  const [loading, setLoading] = useState(false);

  const provider = connector.getProvider();

  const createDaiPermit = useCallback(async () => {
    const permit = await signDaiPermit(
      provider,
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
    provider,
    tokenAddress,
    address,
    spender,
    BnStringify(domain),
    BnStringify(args),
  ]);

  const createERC2612Permit = useCallback(async () => {
    const permit = await signERC2612Permit(
      provider,
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
    provider,
    tokenAddress,
    address,
    spender,
    value,
    BnStringify(domain),
    BnStringify(args),
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
