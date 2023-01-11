import { ethers } from "ethers";
import { useContractRead } from "wagmi";
import { useEffect, useState } from "react";
import { MultiStepButton } from "@unioncredit/ui";

import { MultiStep, ZERO } from "constants";
import useWrite from "hooks/useWrite";
import useContract from "hooks/useContract";
import { useModals } from "providers/ModalManager";
import { useMember } from "providers/MemberData";

const initialItems = [{ number: 1, status: MultiStep.SELECTED }, { number: 2 }];
const initialButtonProps = { label: "Enter an amount", disabled: true };

export default function Approval({
  owner,
  amount = ZERO,
  spender,
  tokenContract,
  actionProps,
  approvalLabel,
  approvalCompleteLabel,
  requireApproval = true,
}) {
  const { close } = useModals();
  const { refetch: refetchMember } = useMember();
  const [items, setItems] = useState(initialItems);
  const [action, setAction] = useState(initialButtonProps);
  const [showSteps, setShowSteps] = useState(false);

  const tokenConfig = useContract(tokenContract);

  /*--------------------------------------------------------------
    Contract Functions
   --------------------------------------------------------------*/

  const { data: allowance = ZERO, refetch: refetchAllowance } = useContractRead(
    {
      ...tokenConfig,
      functionName: "allowance",
      args: [owner, spender],
    }
  );

  const txButtonProps = useWrite({
    contract: actionProps.contract,
    method: actionProps.method,
    args: actionProps.args,
    enabled: !requireApproval || (amount.gt(0) && allowance.gte(amount)),
    onComplete: () => {
      close();
      refetchMember();
    },
  });

  const approveButtonProps = useWrite({
    contract: tokenContract,
    method: "approve",
    args: [spender, ethers.constants.MaxUint256],
    enabled: amount.gt(0) && allowance.lt(amount),
    onComplete: refetchAllowance,
  });

  /**
   * Handle setting the action props based on the amount
   * and the allowance
   */
  useEffect(() => {
    if (amount.gt(0)) {
      if (amount.gt(allowance) && requireApproval) {
        // The amount is more than the allowance so we
        // need to prompt the user to approve this contract
        setAction({
          label: approveButtonProps.loading ? "Approving..." : "Approve",
          ...approveButtonProps,
          loading: false,
          disabled: approveButtonProps.loading,
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
  }, [amount, approveButtonProps, txButtonProps]);

  /**
   * Handle setting the items props for the multi step button based
   * on the loading states of each transaction
   */
  useEffect(() => {
    if (approveButtonProps.loading) {
      // Approval is loading
      setItems([{ number: 1, status: MultiStep.PENDING }, { number: 2 }]);
    } else if (txButtonProps.loading) {
      // Transaction is loading
      setItems([{ number: 1 }, { number: 2, status: MultiStep.PENDING }]);
    } else if (allowance.gte(amount)) {
      // Allowance has been complete
      setItems([
        { number: 1, status: MultiStep.COMPLETE },
        { number: 2, status: MultiStep.SELECTED },
      ]);
    } else {
      // Return to normal state
      setItems(initialItems);
    }
  }, [allowance, amount, approveButtonProps.loading, txButtonProps.loading]);

  /*--------------------------------------------------------------
    Render Component 
   --------------------------------------------------------------*/

  return (
    <MultiStepButton
      id="approval-component"
      items={items}
      action={action}
      showSteps={requireApproval && showSteps}
      label={allowance.gte(amount) ? approvalCompleteLabel : approvalLabel}
    />
  );
}
