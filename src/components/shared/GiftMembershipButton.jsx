import "./GiftMembershipButton.scss";

import { Button, VouchIcon } from "@unioncredit/ui";

import useWrite from "hooks/useWrite";
import { ZERO_ADDRESS } from "constants";

export const GiftMembershipButton = ({ address, referrer, canRegister, ethRegisterFee }) => {
  const registerButtonProps = useWrite({
    contract: "registerHelper",
    method: "register",
    args: [address, referrer || ZERO_ADDRESS],
    enabled: canRegister,
    disabled: !canRegister,
    overrides: {
      value: ethRegisterFee,
    },
  });

  return (
    <Button
      key={address}
      size="small"
      icon={VouchIcon}
      className="GiftMembershipButton"
      label="Gift membership"
      {...registerButtonProps}
    />
  );
};
