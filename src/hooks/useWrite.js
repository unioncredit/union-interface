import { useCallback, useMemo, useState } from "react";
import { useAccount, useConfig } from "wagmi";
import { waitForTransactionReceipt, writeContract } from "@wagmi/core";

import createParseToast from "utils/parseToast";
import useContract from "hooks/useContract";
import parseAppLog from "utils/parseAppLog";
import { Status } from "constants";
import { useToasts } from "providers/Toasts";
import { useAppLogs } from "providers/AppLogs";
import { useVersion } from "providers/Version";
import { useToken } from "hooks/useToken";
import { BnStringify } from "../utils/json";

export default function useWrite({
  disabled: isDisabled,
  method,
  args,
  enabled,
  contract,
  onComplete,
  value,
  ...props
}) {
  const [loading, setLoading] = useState(false);

  const { version } = useVersion();
  const { chain } = useAccount();
  const config = useConfig();
  const { addLog } = useAppLogs();
  const { addToast, closeToast } = useToasts();
  const { token } = useToken();
  const contractConfig = useContract(contract);

  const memoizedArgs = useMemo(() => args, [BnStringify(args)]);
  const memoizedProps = useMemo(() => props, [BnStringify(props)]);

  /**
   * onClick is just the name of the action function for this
   * write. When fired the action defined by the hook inputs
   * will be executed.
   */
  const onClick = useCallback(async () => {
    setLoading(true);

    const parseToast = createParseToast(method, memoizedArgs, token, chain.id, version, contract);

    let toastId = addToast(parseToast(Status.PENDING, null), false);

    try {
      const hash = await writeContract(config, {
        ...contractConfig,
        ...memoizedProps,
        functionName: method,
        args: memoizedArgs,
        // @ts-ignore
        value,
      });

      // Replace current pending toast with a new pending toast
      // that links out to etherscan
      closeToast(toastId);
      toastId = addToast(parseToast(Status.PENDING, hash), false);

      const { status } = await waitForTransactionReceipt(config, {
        hash,
      });

      onComplete && onComplete();

      addLog(parseAppLog(Status.SUCCESS, method, memoizedArgs, hash));
      addToast(parseToast(status === "success" ? Status.SUCCESS : Status.FAILED, hash));

      return true;
    } catch (error) {
      console.log("TxButton error:", error);
      console.log("TxButton error message:", error.message);
      console.log("TxButton error code:", error.code);

      if (error.code == 4001) {
        // User rejected the request
        addToast({
          link: null,
          variant: Status.FAILED,
          title: "User rejected",
          content: "User rejected the request",
          id: `${Status.FAILED}__${method}__${Date.now()}`,
        });
      } else {
        addToast(parseToast(Status.FAILED, null));
      }

      return false;
    } finally {
      setLoading(false);
      closeToast(toastId);
    }
  }, [method, memoizedArgs, chain?.id, BnStringify(contractConfig)]);

  /*--------------------------------------------------------------
    Return
   --------------------------------------------------------------*/

  return useMemo(
    () => ({
      disabled: isDisabled || !enabled,
      loading,
      onClick,
    }),
    [onClick, loading, isDisabled, enabled]
  );
}
