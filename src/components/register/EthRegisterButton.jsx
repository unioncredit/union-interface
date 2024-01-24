import { useAccount, useBalance } from "wagmi";
import useWrite from "hooks/useWrite";
import { useProtocol } from "providers/ProtocolData";
import { Button, CheckIcon } from "@unioncredit/ui";
import { ZERO_ADDRESS } from "constants";

export function EthRegisterButton({ onComplete }) {
  const { data: protocol = {} } = useProtocol();
  const { address } = useAccount();

  const { data: balance } = useBalance({
    address,
  });

  const { regFee, value: ethBalance } = { ...protocol, ...balance };

  const registerButtonProps = useWrite({
    contract: "registerHelper",
    method: "register",
    args: [address, ZERO_ADDRESS],
    enabled: regFee.lte(ethBalance),
    disabled: regFee.gt(ethBalance),
    onComplete,
  });

  return (
    <Button fluid size="large" label="Register ->" icon={CheckIcon} {...registerButtonProps} />
  );
}
