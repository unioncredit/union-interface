import { MultiStepButton } from "@unioncredit/ui";
import { useAccount, useContractRead } from "wagmi";
import { useEffect, useState, useCallback } from "react";

import { ZERO } from "constants";
import format from "utils/format";
import useWrite from "hooks/useWrite";
import useContract from "hooks/useContract";
import { useMember } from "providers/MemberData";
import { useProtocol } from "providers/ProtocolData";

const createItems = (s1, s2, s3) => [
  { number: 1, status: s1 },
  { number: 2, status: s2 },
  { number: 2, status: s3 },
];

export default function RegisterButton() {
  const { address } = useAccount();

  const [action, setAction] = useState(null);
  const [items, setItems] = useState(null);

  const { data: member, refetch: refetchMember } = useMember();
  const { data: protocol } = useProtocol();

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
    enabled: member.unionBalance.lt(protocol.newMemberFee),
  });

  const { onClick: approve } = useWrite({
    contract: "union",
    method: "approve",
    args: [userManagerConfig.addressOrName, protocol.newMemberFee],
    enabled: allowance.lt(protocol.newMemberFee),
  });

  const { onClick: register } = useWrite({
    contract: "userManager",
    method: "registerMember",
    args: [address],
    enabled:
      allowance.gte(protocol.newMemberFee) &&
      member.unionBalance.gte(protocol.newMemberFee),
  });

  /*--------------------------------------------------------------
    Button action handlers for "Claim", "Approve" and "Register"
   --------------------------------------------------------------*/

  const handleClaim = useCallback(async () => {
    setItems(createItems("pending"));
    await claim();
    await refetchMember();
    setItems(createItems("selected"));
  }, [claim, refetchMember]);

  const handleApprove = useCallback(async () => {
    setItems(createItems("complete", "pending"));
    await approve();
    await refetchAllowance();
    setItems(createItems("complete", "selected"));
  }, [approve, refetchAllowance]);

  const handleRegister = useCallback(async () => {
    setItems(createItems("complete", "complete", "pending"));
    await register();
    await refetchMember();
    setItems(createItems("complete", "complete", "selected"));
  }, [register, refetchMember]);

  /**
   * Determine which state to show the multistep button in. There are
   * three states "Claim", "Approve" and "Register"
   */
  useEffect(() => {
    if (member.unionBalance.lt(protocol.newMemberFee)) {
      // Member UNION balance is not enough so needs to claim UNION
      // If there is any UNION available
      setAction({ label: "Claim UNION", onClick: handleClaim });
      setItems(createItems("selected"));
    } else if (allowance.lt(protocol.newMemberFee)) {
      // Member has enough UNION but they need to approve the user manager
      // to spend it as their current allowance is not enough
      setAction({ label: "Approve UNION", onClick: handleApprove });
      setItems(createItems("complete", "selected"));
    } else {
      // The member satisfies all the prerequisite and can register
      setAction({ label: "Register", onClick: handleRegister });
      setItems(createItems("complete", "complete", "selected"));
    }
  }, [
    member.isMember,
    protocol.newMemberFee,
    member.unionBalance,
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
      label={`Unclaimed: ${format(member.unClaimedRewards)} UNION`}
    />
  );
}
