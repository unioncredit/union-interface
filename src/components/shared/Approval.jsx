import { useAccount, useReadContract } from "wagmi";
import { useCallback, useEffect, useState } from "react";
import { MultiStepButton, Toggle } from "@unioncredit/ui";
import { maxUint256 } from "viem";

import { MultiStep, ZERO } from "constants";
import useWrite from "hooks/useWrite";
import useContract from "hooks/useContract";
import { useModals } from "providers/ModalManager";
import { useMember } from "providers/MemberData";
import usePermit from "hooks/usePermit";
import { getPermitMethod } from "utils/permits";
import { GASLESS_APPROVALS, useSettings } from "providers/Settings";

const initialItems = [{ number: 1, status: MultiStep.SELECTED }, { number: 2 }];
const initialButtonProps = { label: "Enter an amount", disabled: true };

export function Approval({
  owner,
  amount = ZERO,
  spender,
  tokenContract,
  actionProps,
  requireApproval = true,
}) {
  const { close } = useModals();
  const { refetch: refetchMember } = useMember();
  const { chain } = useAccount();
  const { settings, setSetting } = useSettings();
  const [items, setItems] = useState(initialItems);
  const [action, setAction] = useState(initialButtonProps);
  const [showSteps, setShowSteps] = useState(false);
  const [gasless, setGasless] = useState(settings[GASLESS_APPROVALS] || false);
  const [permitArgs, setPermitArgs] = useState(null);

  const tokenConfig = useContract(tokenContract);
  const permit = getPermitMethod(chain.id, actionProps.method);

  /*--------------------------------------------------------------
    Contract Functions
   --------------------------------------------------------------*/

  const { data: allowance = ZERO, refetch: refetchAllowance } = useReadContract({
    ...tokenConfig,
    functionName: "allowance",
    args: [owner, spender],
  });

  const permitApproveProps = usePermit({
    type: permit.type,
    domain: permit.domain,
    args: actionProps.permitArgs ? actionProps.permitArgs : actionProps.args,
    value: amount,
    spender: spender,
    tokenAddress: tokenConfig.address,
    onComplete: useCallback((args) => setPermitArgs(args), []),
  });

  const transactionApproveProps = useWrite({
    contract: tokenContract,
    method: "approve",
    args: [spender, maxUint256],
    enabled: amount > 0n && allowance < amount,
    onComplete: async () => {
      await refetchAllowance();
    },
  });

  const txButtonProps = useWrite({
    contract: actionProps.contract,
    method: requireApproval && permitArgs ? permit.functionName : actionProps.method,
    args: requireApproval && permitArgs ? permitArgs : actionProps.args,
    enabled: !requireApproval || allowance >= amount || permitArgs,
    onComplete: async () => {
      await refetchMember();
      close();
    },
    overrides: actionProps.overrides,
  });

  const GaslessToggle = () => {
    return (
      <Toggle
        active={gasless}
        color="primary"
        label="Gasless approval"
        labelPosition="end"
        onChange={() => {
          setGasless((g) => !g);
          setPermitArgs(null);
          setSetting(GASLESS_APPROVALS, !gasless);
        }}
      />
    );
  };

  /**
   * Handle setting the action props based on the amount
   * and the allowance
   */
  useEffect(() => {
    if (amount > 0n) {
      if (requireApproval && amount > allowance && !permitArgs) {
        const buttonProps = gasless ? permitApproveProps : transactionApproveProps;

        // The amount is more than the allowance so we
        // need to prompt the user to approve this contract
        setAction({
          ...buttonProps,
          label: buttonProps.loading ? "Approving..." : "Approve",
          loading: false,
          disabled: buttonProps.loading,
        });

        setShowSteps(true);
      } else {
        // The user has an allowance that covers this amount
        // so we can skip straight to the action
        setAction({ label: actionProps.label, ...txButtonProps });
      }
    } else {
      // Display an initial state while we wait for the user input
      setAction(initialButtonProps);
    }
  }, [permitArgs, gasless, amount, transactionApproveProps, txButtonProps, permitApproveProps]);

  /**
   * Handle setting the items props for the multi step button based
   * on the loading states of each transaction
   */
  useEffect(() => {
    if (transactionApproveProps.loading || permitApproveProps.loading) {
      // Approval is loading
      setItems([{ number: 1, status: MultiStep.PENDING }, { number: 2 }]);
    } else if (txButtonProps.loading) {
      // Transaction is loading
      setItems([
        { number: 1, status: MultiStep.COMPLETE },
        { number: 2, status: MultiStep.PENDING },
      ]);
    } else if (allowance >= amount) {
      // Allowance has been complete
      setItems([
        { number: 1, status: MultiStep.COMPLETE },
        { number: 2, status: MultiStep.SELECTED },
      ]);
    } else {
      // Return to normal state
      setItems(initialItems);
    }
  }, [
    allowance,
    amount,
    transactionApproveProps.loading,
    txButtonProps.loading,
    permitApproveProps.loading,
  ]);

  /*--------------------------------------------------------------
    Render Component 
   --------------------------------------------------------------*/

  return (
    <MultiStepButton
      toggle={GaslessToggle}
      id="approval-component"
      items={items}
      action={action}
      showSteps={requireApproval && showSteps}
    />
  );
}
