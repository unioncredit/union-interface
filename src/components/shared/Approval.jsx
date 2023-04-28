import { ethers } from "ethers";
import { useContractRead, useNetwork } from "wagmi";
import { useEffect, useState } from "react";
import { MultiStepButton, Toggle } from "@unioncredit/ui";

import { MultiStep, ZERO } from "constants";
import useWrite from "hooks/useWrite";
import useContract from "hooks/useContract";
import { useModals } from "providers/ModalManager";
import { useMember } from "providers/MemberData";
import usePermit from "hooks/usePermit";
import { getPermitMethod } from "utils/permits";

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
  const { chain } = useNetwork();
  const [items, setItems] = useState(initialItems);
  const [action, setAction] = useState(initialButtonProps);
  const [showSteps, setShowSteps] = useState(false);
  const [gasless, setGasless] = useState(false);
  const [permitArgs, setPermitArgs] = useState(null);

  const tokenConfig = useContract(tokenContract);
  const permit = getPermitMethod(chain.id, actionProps.method);

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

  const permitApproveProps = usePermit({
    type: permit.type,
    args: actionProps.permitArgs ? actionProps.permitArgs : actionProps.args,
    value: amount,
    spender: spender,
    tokenAddress: tokenConfig.address,
    onComplete: (args) => setPermitArgs(args),
  });

  const transactionApproveProps = useWrite({
    contract: tokenContract,
    method: "approve",
    args: [spender, ethers.constants.MaxUint256],
    enabled: amount.gt(0) && allowance.lt(amount),
    onComplete: refetchAllowance,
  });

  const txButtonProps = useWrite({
    contract: actionProps.contract,
    method:
      requireApproval && permitArgs ? permit.functionName : actionProps.method,
    args: requireApproval && permitArgs ? permitArgs : actionProps.args,
    enabled: !requireApproval || allowance.gte(amount) || permitArgs,
    onComplete: () => {
      close();
      refetchMember();
    },
  });

  const GaslessToggle = () => {
    return (
      <Toggle
        active={gasless}
        color="primary"
        label="Gasless approval"
        labelPosition="end"
        onChange={() => {
          setGasless(!gasless);
          setPermitArgs(null);
        }}
      />
    );
  };

  /**
   * Handle setting the action props based on the amount
   * and the allowance
   */
  useEffect(() => {
    if (amount.gt(0)) {
      if (requireApproval && amount.gt(allowance) && !permitArgs) {
        // The amount is more than the allowance so we
        // need to prompt the user to approve this contract
        if (gasless) {
          setAction({
            ...permitApproveProps,
            label: permitApproveProps.loading
              ? "Approving..."
              : "Gasless Approve",
            loading: false,
            disabled: permitApproveProps.loading,
          });
        } else {
          setAction({
            ...transactionApproveProps,
            label: transactionApproveProps.loading ? "Approving..." : "Approve",
            loading: false,
            disabled: transactionApproveProps.loading,
          });
        }

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
  }, [
    permitArgs,
    gasless,
    amount,
    transactionApproveProps,
    txButtonProps,
    permitApproveProps,
  ]);

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
