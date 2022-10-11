import { useEffect, useState } from "react";
import { useContractRead } from "wagmi";
import { MultiStepButton } from "@unioncredit/ui";

import { ZERO } from "constants";
import useWrite from "hooks/useWrite";
import useContract from "hooks/useContract";

const initialItems = [{ number: 1, status: "selected" }, { number: 2 }];
const initialButtonProps = { label: "Enter an amount", disabled: true };

export default function Approval({
  owner,
  amount = ZERO,
  spender,
  tokenContract,
  actionProps,
  approvalLabel = "Approve",
}) {
  const [items, setItems] = useState(initialItems);
  const [action, setAction] = useState(initialButtonProps);

  const tokenConfig = useContract(tokenContract);

  const { data: allowance = ZERO } = useContractRead({
    ...tokenConfig,
    functionName: "allowance",
    args: [owner, spender],
  });

  const txButtonProps = useWrite({
    contract: actionProps.contract,
    method: actionProps.method,
    args: actionProps.args,
    enabled: amount.gt(0) && allowance.gte(amount),
  });

  const approveButtonProps = useWrite({
    contract: tokenContract,
    method: "approve",
    args: [spender, amount],
    enabled: amount.gt(0) && allowance.lt(amount),
  });

  /**
   * Handle setting the action props based on the amount
   * and the allowance
   */
  useEffect(() => {
    if (amount.gt(0)) {
      if (amount.gt(allowance)) {
        // The amount is more than the allowance so we
        // need to prompt the user to approve this contract
        setAction({
          label: approvalLabel,
          ...approveButtonProps,
        });
      } else {
        // The user has an allowance that covers this amount
        // so we can skip straight to the action
        setAction({ label: actionProps.label, ...txButtonProps });
      }
    } else {
      // Display an initial state while we wait for the user input
      setAction(initialButtonProps);
    }
  }, [amount, approveButtonProps, txButtonProps]);

  /**
   * Handle setting the items props for the multi step button based
   * on the loading states of each transaction
   */
  useEffect(() => {
    if (approveButtonProps.loading) {
      // Approval is loading
      setItems([{ number: 1, status: "pending" }, { number: 2 }]);
    } else if (txButtonProps.loading) {
      // Transaction is loading
      setItems([{ number: 1 }, { number: 2, status: "pending" }]);
    } else {
      // Return to normal state
      setItems(initialItems);
    }
  }, [approveButtonProps.loading, txButtonProps.loading]);

  return (
    <MultiStepButton
      id="approval-component"
      items={items}
      action={action}
      showSteps={amount.gt(0) && amount.gt(allowance)}
    />
  );
}

