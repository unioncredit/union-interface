import "./EthRegisterButton.scss";

import { useAccount, useBalance } from "wagmi";
import useWrite from "hooks/useWrite";
import { useProtocol } from "providers/ProtocolData";
import { Box, Button, CheckIcon, Text } from "@unioncredit/ui";
import { ZERO, ZERO_ADDRESS } from "constants";

export function EthRegisterButton({ onComplete }) {
  const { data: protocol = {} } = useProtocol();
  const { address } = useAccount();

  const { data: balance } = useBalance({
    address,
  });

  const { regFee = ZERO, rebate = ZERO, value: ethBalance = ZERO } = { ...protocol, ...balance };

  const ethRegisterFee = regFee.add(rebate);
  const canRegister = ethRegisterFee.lte(ethBalance);

  const registerButtonProps = useWrite({
    contract: "registerHelper",
    method: "register",
    args: [address, ZERO_ADDRESS],
    enabled: canRegister,
    disabled: !canRegister,
    onComplete,
    overrides: {
      value: ethRegisterFee,
    },
  });

  return (
    <Box className="EthRegisterButton__container" direction="vertical">
      <Button fluid size="large" label="Register ->" icon={CheckIcon} {...registerButtonProps} />

      {!canRegister && (
        <Text color="red500" m="2px 0 0" weight="light">
          You do not have enough funds to register
        </Text>
      )}
    </Box>
  );
}
