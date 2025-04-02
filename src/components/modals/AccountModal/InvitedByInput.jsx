import "./InvitedByInput.scss";

import React, { useState } from "react";
import { AddressInput } from "../../shared";
import { useMember } from "providers/MemberData";
import { ZERO_ADDRESS } from "constants";
import { Box, Button } from "@unioncredit/ui";
import useWrite from "hooks/useWrite";
import { isAddress } from "viem";

export function InvitedByInput() {
  const { data: member, refetch: refetchMember } = useMember();
  const { referrer } = member;

  const initialReferrer = referrer === ZERO_ADDRESS ? "" : referrer;

  const [address, setAddress] = useState(initialReferrer);

  const setReffererButtonProps = useWrite({
    contract: "referral",
    method: "setSelfReferrer",
    args: [address],
    enabled: isAddress(address),
    disabled: address === referrer || !isAddress(address),
    onComplete: () => {
      refetchMember();
    },
  });

  return (
    <Box mt="16px" direction="vertical" className="InvitedByInput">
      <Box className="InvitedByInput__buttons">
        <Button
          label="Save"
          size="pill"
          color="secondary"
          variant="light"
          className="InvitedByInput__button"
          {...setReffererButtonProps}
        />
      </Box>

      <AddressInput
        placeholder="None"
        defaultValue={initialReferrer}
        label="Invited by:"
        onChange={setAddress}
      />
    </Box>
  );
}
