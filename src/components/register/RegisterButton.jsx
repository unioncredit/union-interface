import { MultiStepButton } from "@unioncredit/ui";
import { useAccount, useContractRead } from "wagmi";
import { useEffect, useState, useCallback } from "react";

import { ZERO } from "constants";
import format from "utils/format";
import useWrite from "hooks/useWrite";
import useContract from "hooks/useContract";
import { useMember } from "providers/MemberData";
import { useProtocol } from "providers/ProtocolData";
import { ReactComponent as CloudCheck } from "@unioncredit/ui/lib/icons/cloudCheck.svg";

const createItems = (s1, s2, s3) => [
  { number: 1, status: s1 },
  { number: 2, status: s2 },
  { number: 3, status: s3 },
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
    unclaimedRewards = ZERO,
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
      args: [address, userManagerConfig.addressOrName],
    }
  );

  const { onClick: claim } = useWrite({
    contract: "userManager",
    method: "withdrawRewards",
    enabled: unionBalance.lt(newMemberFee),
    onComplete: () => refetchMember(),
  });

  const { onClick: approve } = useWrite({
    contract: "union",
    method: "approve",
    args: [userManagerConfig.addressOrName, newMemberFee],
    enabled: allowance.lt(newMemberFee),
    onComplete: () => refetchAllowance(),
  });

  const { onClick: register } = useWrite({
    contract: "userManager",
    method: "registerMember",
    args: [address],
    enabled: allowance.gte(newMemberFee) && unionBalance.gte(newMemberFee),
    onComplete: () => onComplete(),
  });

  /*--------------------------------------------------------------
    Button action handlers for "Claim", "Approve" and "Register"
   --------------------------------------------------------------*/

  const handleClaim = useCallback(async () => {
    setItems(createItems("pending"));
    await claim();
  }, [claim, refetchMember]);

  const handleApprove = useCallback(async () => {
    setItems(createItems("complete", "pending"));
    await approve();
  }, [approve, refetchAllowance]);

  const handleRegister = useCallback(async () => {
    setItems(createItems("complete", "complete", "pending"));
    await register();
  }, [register, refetchMember]);

  /**
   * Determine which state to show the multistep button in. There are
   * three states "Claim", "Approve" and "Register"
   */
  useEffect(() => {
    if (unionBalance.lt(newMemberFee)) {
      // Member UNION balance is not enough so needs to claim UNION
      // If there is any UNION available
      setAction({ label: "Claim UNION", onClick: handleClaim });
      setLabel(`Unclaimed: ${format(unclaimedRewards)} UNION`);
      setItems(createItems("selected"));
    } else if (allowance.lt(newMemberFee)) {
      // Member has enough UNION but they need to approve the user manager
      // to spend it as their current allowance is not enough
      setAction({ label: "Approve UNION", onClick: handleApprove });
      setLabel("Approving 1.00 UNION");
      setItems(createItems("complete", "selected"));
    } else {
      // The member satisfies all the prerequisite and can register
      setAction({ label: "Pay Membership Fee", onClick: handleRegister, icon: CloudCheck });
      setLabel("Paying 1.00 UNION");
      setItems(createItems("complete", "complete", "selected"));
    }
  }, [
    isMember,
    newMemberFee,
    unionBalance,
    allowance,
    handleRegister,
    handleApprove,
    handleClaim,
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
