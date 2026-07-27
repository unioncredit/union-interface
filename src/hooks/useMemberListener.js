import { useCallback, useEffect, useMemo, useRef } from "react";
import { useAccount, useWatchContractEvent } from "wagmi";
import { mainnet } from "viem/chains";

import useContract from "hooks/useContract";
import { useMember } from "providers/MemberData";
import { useVouchers } from "providers/VouchersData";
import { useVouchees } from "providers/VoucheesData";
import { compareAddresses } from "utils/compare";
import { useToken } from "hooks/useToken";

/**
 * Refresh the connected member's data when a relevant on-chain event fires.
 *
 * wagmi v2's `useWatchContractEvent` takes `onLogs` and hands it an ARRAY of
 * logs with DECODED NAMED args — the previous `listener` prop was the wagmi v1
 * shape and was silently ignored, so no handler ever ran and third-party
 * repays / vouches / write-offs never refreshed the UI.
 *
 * Handler identity matters: wagmi keeps `onLogs` in its subscription effect's
 * dependency array, so a new identity per render tears down and re-creates the
 * watcher. The values the handlers need (address, and the provider refetch
 * functions — which are new inline functions every render) are kept fresh in a
 * ref instead of being captured, and the handlers themselves are created once.
 *
 * Arg names match the ABIs exactly (userManager: staker/borrower,
 * account/borrower; erc20: from/to). Both address fields are checked because the
 * user may be either party to the event.
 */
export default function useMemberListener() {
  const { address, chain: connectedChain } = useAccount();
  const { refetch: refetchMember } = useMember();
  const { refetch: refetchVouchers } = useVouchers();
  const { refetch: refetchVouchees } = useVouchees();
  const { token } = useToken();

  const chainId = connectedChain?.id ?? mainnet.id;
  const userManager = useContract("userManager", chainId);
  const tokenContract = useContract(token.toLowerCase(), chainId);

  const latest = useRef({ address: undefined, refresh: async () => {} });
  useEffect(() => {
    latest.current = {
      address,
      refresh: async () => {
        await refetchMember();
        refetchVouchers();
        refetchVouchees();
      },
    };
  });

  // Created once; reads the current address/refetchers from the ref at event time.
  const refreshIfInvolved = useCallback(
    (keys) => (logs) => {
      const { address: current, refresh } = latest.current;
      if (!current) return;

      const involved = (logs || []).some((log) =>
        keys.some((key) => compareAddresses(log?.args?.[key], current))
      );

      if (involved) refresh();
    },
    []
  );

  const onStakerBorrowerLogs = useMemo(
    () => refreshIfInvolved(["staker", "borrower"]),
    [refreshIfInvolved]
  );
  const onAccountBorrowerLogs = useMemo(
    () => refreshIfInvolved(["account", "borrower"]),
    [refreshIfInvolved]
  );
  const onTransferLogs = useMemo(() => refreshIfInvolved(["from", "to"]), [refreshIfInvolved]);

  useWatchContractEvent({
    ...userManager,
    eventName: "LogDebtWriteOff",
    enabled: !!userManager.address,
    onLogs: onStakerBorrowerLogs,
  });

  useWatchContractEvent({
    ...userManager,
    eventName: "LogUpdateTrust",
    enabled: !!userManager.address,
    onLogs: onStakerBorrowerLogs,
  });

  useWatchContractEvent({
    ...userManager,
    eventName: "LogCancelVouch",
    enabled: !!userManager.address,
    onLogs: onAccountBorrowerLogs,
  });

  useWatchContractEvent({
    ...userManager,
    eventName: "LogRegisterMember",
    enabled: !!userManager.address,
    onLogs: onAccountBorrowerLogs,
  });

  useWatchContractEvent({
    ...tokenContract,
    eventName: "Transfer",
    enabled: !!tokenContract.address,
    onLogs: onTransferLogs,
  });
}
