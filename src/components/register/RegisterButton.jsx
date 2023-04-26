import { CheckIcon, MultiStepButton } from "@unioncredit/ui";
import { useAccount, useContractRead } from "wagmi";
import { useEffect, useState, useCallback } from "react";

import { MultiStep, ZERO } from "constants";
import useWrite from "hooks/useWrite";
import useContract from "hooks/useContract";
import { useMember } from "providers/MemberData";
import { useProtocol } from "providers/ProtocolData";

const createItems = (s1, s2) => [
  { number: 1, status: s1 },
  { number: 2, status: s2 },
];

export default function RegisterButton({ onComplete }) {
  const { address } = useAccount();

  const [action, setAction] = useState(null);
  const [items, setItems] = useState(null);
  const [label, setLabel] = useState(null);

  const { data: member, refetch: refetchMember } = useMember();
  const { data: protocol } = useProtocol();

  const {
    unionBalance = ZERO,
    isMember = false,
    newMemberFee = ZERO,
  } = { ...member, ...protocol };

  const unionConfig = useContract("union");
  const userManagerConfig = useContract("userManager");

  /*--------------------------------------------------------------
    Contract Functions
   --------------------------------------------------------------*/

  const { data: allowance = ZERO, refetch: refetchAllowance } = useContractRead(
    {
      ...unionConfig,
      functionName: "allowance",
      args: [address, userManagerConfig.address],
    }
  );

  const { onClick: approve, loading: approveLoading } = useWrite({
    contract: "union",
    method: "approve",
    args: [userManagerConfig.address, newMemberFee],
    enabled: allowance.lt(newMemberFee),
    onComplete: () => refetchAllowance(),
  });

  const { onClick: register, loading: registerLoading } = useWrite({
    contract: "userManager",
    method: "registerMember",
    args: [address],
    enabled: allowance.gte(newMemberFee) && unionBalance.gte(newMemberFee),
    onComplete: () => onComplete(),
  });

  /*--------------------------------------------------------------
    Button action handlers for "Approve" and "Register"
   --------------------------------------------------------------*/

  const handleApprove = useCallback(async () => {
    setItems(createItems(MultiStep.COMPLETE, MultiStep.PENDING));
    await approve();
  }, [approve, refetchAllowance]);

  const handleRegister = useCallback(async () => {
    setItems(
      createItems(MultiStep.COMPLETE, MultiStep.COMPLETE, MultiStep.PENDING)
    );
    await register();
  }, [register, refetchMember]);

  /**
   * Determine which state to show the multistep button in. There are
   * three states "Approve" and "Register"
   */
  useEffect(() => {
    if (allowance.lt(newMemberFee)) {
      // Member has enough UNION but they need to approve the user manager
      // to spend it as their current allowance is not enough
      setAction({
        label: "Approve UNION",
        onClick: handleApprove,
        size: "large",
        disabled: unionBalance.lt(newMemberFee),
      });
      setLabel("Approving 1.00 UNION");
      setItems(
        createItems(approveLoading ? MultiStep.PENDING : MultiStep.SELECTED)
      );
    } else {
      // The member satisfies all the prerequisite and can register
      setAction({
        label: "Pay Membership Fee",
        onClick: handleRegister,
        icon: CheckIcon,
        size: "large",
      });
      setLabel("Paying 1.00 UNION");
      setItems(
        createItems(
          MultiStep.COMPLETE,
          registerLoading ? MultiStep.PENDING : MultiStep.SELECTED
        )
      );
    }
  }, [
    isMember,
    newMemberFee,
    unionBalance,
    allowance,
    handleRegister,
    handleApprove,
    approveLoading,
    registerLoading,
  ]);

  /*--------------------------------------------------------------
    Render Component 
   --------------------------------------------------------------*/

  if (!action || !items) {
    return null;
  }

  return (
    <MultiStepButton
      items={items}
      action={action}
      showSteps={true}
      label={label}
    />
  );
}
