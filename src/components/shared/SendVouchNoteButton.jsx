import { DiscordIcon, MultiStepButton, VouchIcon } from "@unioncredit/ui";
import { useEffect, useState } from "react";

import { MultiStep } from "constants";
import useWrite from "hooks/useWrite";

const ITEMS = {
  SEND_VOUCH: 1,
  SEND_VOUCH_NOTE: 2,
};

const initialItems = [
  { number: ITEMS.SEND_VOUCH, status: MultiStep.SELECTED },
  { number: ITEMS.SEND_VOUCH_NOTE, status: false },
];

export default function SendVouchNoteButton({
  address,
  trust,
  message,
  disabled,
  onVouchComplete,
  onVouchNoteComplete,
  ...props
}) {
  const [activeItem, setActiveItem] = useState(1);
  const [action, setAction] = useState(null);
  const [items, setItems] = useState(initialItems);

  /*--------------------------------------------------------------
    Contract Functions
   --------------------------------------------------------------*/

  const sendVouchButtonProps = useWrite({
    contract: "userManager",
    method: "updateTrust",
    args: [address, trust?.raw],
    enabled: address && trust?.raw.gt(0),
    onComplete: () => {
      setActiveItem(ITEMS.SEND_VOUCH_NOTE);
      onVouchComplete && onVouchComplete();
    },
  });

  const vouchNoteButtonProps = useWrite({
    contract: "vouchNote",
    method: "mint",
    // returns a string array of the vouch note message where each line is a max of 40 chars long
    args: [address, message ? message?.match(/.{1,40}/g).map((s) => s.trim()) : ""],
    enabled: address && message,
    onComplete: onVouchNoteComplete,
  });

  useEffect(() => {
    switch (activeItem) {
      case ITEMS.SEND_VOUCH:
        setAction({
          ...sendVouchButtonProps,
          size: "large",
          icon: VouchIcon,
          label: sendVouchButtonProps.loading ? "Sending vouch..." : "Confirm vouch",
          disabled: sendVouchButtonProps.loading || disabled,
        });
        break;

      case ITEMS.SEND_VOUCH_NOTE:
        setAction({
          ...vouchNoteButtonProps,
          size: "large",
          icon: DiscordIcon,
          label: vouchNoteButtonProps.loading ? "Sending note..." : "Send note",
          disabled: !message || vouchNoteButtonProps.loading || disabled,
        });
        break;
    }
  }, [activeItem, sendVouchButtonProps, vouchNoteButtonProps, disabled]);

  useEffect(() => {
    switch (activeItem) {
      case ITEMS.SEND_VOUCH:
        setItems([
          {
            number: ITEMS.SEND_VOUCH,
            status: sendVouchButtonProps.loading ? MultiStep.PENDING : MultiStep.SELECTED,
          },
          { number: ITEMS.SEND_VOUCH_NOTE, status: false },
        ]);
        break;

      case ITEMS.SEND_VOUCH_NOTE:
        setItems([
          { number: ITEMS.SEND_VOUCH, status: MultiStep.COMPLETE },
          {
            number: ITEMS.SEND_VOUCH_NOTE,
            status: vouchNoteButtonProps.loading ? MultiStep.PENDING : MultiStep.SELECTED,
          },
        ]);
        break;
    }
  }, [activeItem, sendVouchButtonProps.loading, vouchNoteButtonProps.loading]);

  /*--------------------------------------------------------------
    Render Component 
   --------------------------------------------------------------*/

  if (!action || !items) {
    return null;
  }

  return (
    <MultiStepButton
      id="approval-component"
      items={items}
      action={action}
      showSteps={true}
      {...props}
    />
  );
}
