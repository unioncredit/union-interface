import { useCallback } from "react";
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
 * These subscriptions previously passed a `listener` prop with positional
 * arguments — the wagmi v1 shape. wagmi v2's `useWatchContractEvent` takes
 * `onLogs` and hands it an ARRAY of logs with DECODED NAMED args, so every
 * `listener` here was an unknown prop that wagmi ignored: no handler ever ran.
 *
 * Net effect of the bug: if a third party repaid your loan, vouched for you,
 * cancelled a vouch, wrote off debt, or you received/sent the token, the UI kept
 * showing stale data until a manual refetch or the 2-minute staleTime refetch on
 * window focus.
 *
 * Arg names below match the ABIs exactly (userManager: staker/borrower,
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

  const refreshMember = useCallback(async () => {
    await refetchMember();
    refetchVouchers();
    refetchVouchees();
  }, [refetchMember, refetchVouchers, refetchVouchees]);

  // True when any log in the batch names the connected address in one of `keys`.
  const involvesUser = useCallback(
    (logs, keys) =>
      Boolean(address) &&
      (logs || []).some((log) => keys.some((key) => compareAddresses(log?.args?.[key], address))),
    [address]
  );

  const refreshIfInvolved = useCallback(
    (keys) => (logs) => {
      if (involvesUser(logs, keys)) refreshMember();
    },
    [involvesUser, refreshMember]
  );

  useWatchContractEvent({
    ...userManager,
    eventName: "LogDebtWriteOff",
    onLogs: refreshIfInvolved(["staker", "borrower"]),
  });

  useWatchContractEvent({
    ...userManager,
    eventName: "LogUpdateTrust",
    onLogs: refreshIfInvolved(["staker", "borrower"]),
  });

  useWatchContractEvent({
    ...userManager,
    eventName: "LogCancelVouch",
    onLogs: refreshIfInvolved(["account", "borrower"]),
  });

  useWatchContractEvent({
    ...userManager,
    eventName: "LogRegisterMember",
    onLogs: refreshIfInvolved(["account", "borrower"]),
  });

  useWatchContractEvent({
    ...tokenContract,
    eventName: "Transfer",
    onLogs: refreshIfInvolved(["from", "to"]),
  });
}
