import { useAccount, useBalance } from "wagmi";
import useWrite from "hooks/useWrite";
import { useProtocol } from "providers/ProtocolData";
import { Button, CheckIcon } from "@unioncredit/ui";
import { ZERO, ZERO_ADDRESS } from "constants";

export function EthRegisterButton({ onComplete }) {
  const { data: protocol = {} } = useProtocol();
  const { address } = useAccount();

  const { data: balance } = useBalance({
    address,
  });

  const { regFee = ZERO, rebate = ZERO, value: ethBalance = ZERO } = { ...protocol, ...balance };

  const ethRegisterFee = regFee.add(rebate);

  const registerButtonProps = useWrite({
    contract: "registerHelper",
    method: "register",
    args: [address, ZERO_ADDRESS],
    enabled: ethRegisterFee.lte(ethBalance),
    disabled: ethRegisterFee.gt(ethBalance),
    onComplete,
    overrides: {
      value: ethRegisterFee,
    },
  });

  return (
    <Button fluid size="large" label="Register ->" icon={CheckIcon} {...registerButtonProps} />
  );
}
