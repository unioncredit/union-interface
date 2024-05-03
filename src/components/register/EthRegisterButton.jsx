import "./EthRegisterButton.scss";

import { useAccount, useBalance } from "wagmi";
import useWrite from "hooks/useWrite";
import { useProtocol } from "providers/ProtocolData";
import { Button, CheckIcon, Text } from "@unioncredit/ui";
import { ZERO, ZERO_ADDRESS } from "constants";
import useReferrer from "../../hooks/useReferrer";

export function EthRegisterButton({ onComplete }) {
  const { referrer } = useReferrer();
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
    args: [address, referrer || ZERO_ADDRESS],
    enabled: canRegister,
    disabled: !canRegister,
    onComplete,
    overrides: {
      value: ethRegisterFee,
    },
  });

  return (
    <div className="EthRegisterButton__container">
      <Button fluid size="large" label="Register ->" icon={CheckIcon} {...registerButtonProps} />

      {!canRegister && (
        <a
          rel="noreferrer"
          target="_blank"
          href="https://relay.link/bridge/optimism?fromChainId=1&lockCurrency=true&lockToChain=true"
        >
          <Text color="red500" m="2px 0" weight="light">
            You do not have enough funds to register
          </Text>
          <Text grey={500} style={{ textDecoration: "underline" }}>
            Bridge ETH
          </Text>
        </a>
      )}
    </div>
  );
}
