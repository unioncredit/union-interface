import { useCallback, useMemo, useState } from "react";
import { signDaiPermit, signERC2612Permit } from "eth-permit";
import { chain, useAccount, useNetwork, useSigner } from "wagmi";

export default function usePermit({
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

  const createDaiPermit = async () => {
    const permit = await signDaiPermit(
      signer.provider,
      tokenAddress,
      address,
      spender
    );

    return [...args, permit.nonce, permit.expiry, permit.v, permit.r, permit.s];
  };

  const createERC2612Permit = async () => {
    const permit = await signERC2612Permit(
      signer.provider,
      tokenAddress,
      address,
      spender,
      value.toString()
    );

    return [...args, permit.deadline, permit.v, permit.r, permit.s];
  };

  const onClick = useCallback(async () => {
    setLoading(true);

    try {
      switch (connectedChain.id) {
        case chain.mainnet.id:
          onComplete(await createDaiPermit());
          break;

        case chain.arbitrum.id:
        case chain.goerli.id:
          onComplete(await createERC2612Permit());
          break;
      }
    } catch (err) {
      console.warn("usePermit failed: ", err);
    } finally {
      setLoading(false);
    }
  }, [connectedChain.id, address, spender, value]);

  return useMemo(
    () => ({
      loading,
      onClick,
    }),
    [onClick, loading]
  );
}
