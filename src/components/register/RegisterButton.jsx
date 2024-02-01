import { CheckIcon, MultiStepButton, Toggle } from "@unioncredit/ui";
import { useAccount, useContractRead, useNetwork } from "wagmi";
import { useCallback, useEffect, useState } from "react";

import { MultiStep, ZERO } from "constants";
import useWrite from "hooks/useWrite";
import useContract from "hooks/useContract";
import { useMember } from "providers/MemberData";
import { useProtocol } from "providers/ProtocolData";
import usePermit from "hooks/usePermit";
import { getPermitMethod } from "utils/permits";
import { GASLESS_APPROVALS, useSettings } from "providers/Settings";
import { useVouchers } from "providers/VouchersData";

const initialItems = [{ number: 1, status: MultiStep.SELECTED }, { number: 2 }];

export default function RegisterButton({ onComplete }) {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { settings, setSetting } = useSettings();

  const [action, setAction] = useState(null);
  const [items, setItems] = useState(null);
  const [gasless, setGasless] = useState(settings[GASLESS_APPROVALS] || false);
  const [permitArgs, setPermitArgs] = useState(null);

  const { data: member } = useMember();
  const { data: protocol } = useProtocol();
  const { data: vouchersData = [] } = useVouchers();

  const vouchers = vouchersData.filter((voucher) => voucher.stakedBalance?.gt(ZERO));

  const { unionBalance = ZERO, isMember = false, newMemberFee = ZERO } = { ...member, ...protocol };

  const permit = getPermitMethod(chain.id, "registerMember");
  const readyToBurn = vouchers.length > 0 && unionBalance.gte(newMemberFee);

  const unionConfig = useContract("union");
  const userManagerConfig = useContract("userManager");

  /*--------------------------------------------------------------
    Contract Functions
   --------------------------------------------------------------*/

  const { data: allowance = ZERO, refetch: refetchAllowance } = useContractRead({
    ...unionConfig,
    functionName: "allowance",
    args: [address, userManagerConfig.address],
  });

  const permitApproveProps = usePermit({
    type: permit.type,
    args: [address, newMemberFee],
    value: newMemberFee,
    spender: userManagerConfig.address,
    tokenAddress: unionConfig.address,
    onComplete: useCallback((args) => setPermitArgs(args), []),
  });

  const transactionApproveProps = useWrite({
    contract: "union",
    method: "approve",
    args: [userManagerConfig.address, newMemberFee],
    enabled: allowance.lt(newMemberFee),
    onComplete: () => refetchAllowance(),
  });

  const registerButtonProps = useWrite({
    contract: "userManager",
    method: permitArgs ? permit.functionName : "registerMember",
    args: permitArgs ? permitArgs : [address],
    enabled: (allowance.gte(newMemberFee) || permitArgs) && unionBalance.gte(newMemberFee),
    onComplete: () => onComplete(),
  });

  const GaslessToggle = () => {
    return (
      <Toggle
        active={gasless}
        color="primary"
        label="Gasless approval"
        labelPosition="end"
        disabled={!readyToBurn}
        onChange={() => {
          setGasless(!gasless);
          setPermitArgs(null);
          setSetting(GASLESS_APPROVALS, !gasless);
        }}
      />
    );
  };

  /**
   * Determine which state to show the multistep button in. There are
   * three states "Approve" and "Register"
   */
  useEffect(() => {
    if (allowance.lt(newMemberFee) && !permitArgs) {
      // Member has enough UNION but they need to approve the user manager
      // to spend it as their current allowance is not enough
      if (!readyToBurn) {
        setAction({
          size: "large",
          label: "Complete the previous steps",
          disabled: true,
        });
      } else if (gasless) {
        setAction({
          ...permitApproveProps,
          size: "large",
          label: permitApproveProps.loading ? "Approving..." : "Approve UNION",
          disabled: permitApproveProps.loading,
        });
      } else {
        setAction({
          ...transactionApproveProps,
          label: transactionApproveProps.loading ? "Approving..." : "Approve UNION",
          size: "large",
          disabled: unionBalance.lt(newMemberFee) || transactionApproveProps.loading,
        });
      }
    } else {
      // The member satisfies all the prerequisite and can register
      setAction({
        ...registerButtonProps,
        label: "Pay Membership Fee",
        icon: CheckIcon,
        size: "large",
        disabled: registerButtonProps.loading,
      });
    }
  }, [
    gasless,
    isMember,
    newMemberFee,
    unionBalance,
    allowance,
    permitApproveProps,
    transactionApproveProps,
    registerButtonProps,
  ]);

  useEffect(() => {
    if (permitApproveProps.loading || transactionApproveProps.loading) {
      // Approval is loading
      setItems([{ number: 1, status: MultiStep.PENDING }, { number: 2 }]);
    } else if (registerButtonProps.loading) {
      // Transaction is loading
      setItems([{ number: 1 }, { number: 2, status: MultiStep.PENDING }]);
    } else if (allowance.gte(newMemberFee) || permitArgs) {
      // Allowance has been complete
      setItems([
        { number: 1, status: MultiStep.COMPLETE },
        { number: 2, status: MultiStep.SELECTED },
      ]);
    } else {
      // Return to normal state
      setItems(initialItems);
    }
  }, [permitApproveProps.loading]);

  /*--------------------------------------------------------------
    Render Component 
   --------------------------------------------------------------*/

  if (!action || !items) {
    return null;
  }

  return (
    <MultiStepButton
      toggle={GaslessToggle}
      id="approval-component"
      items={items}
      action={action}
      showSteps={true}
    />
  );
}
