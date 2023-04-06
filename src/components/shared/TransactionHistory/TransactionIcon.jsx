import {
  BorrowIcon,
  CancelVouchIcon,
  NewMemberIcon,
  NewVouchIcon,
  NewVouchReceivedIcon,
  RepayIcon,
} from "@unioncredit/ui";

import { TransactionTypes } from "constants";
import { Avatar } from "components/shared";

export const TransactionIcon = ({ type, borrower, staker, applicant }) => {
  const icons = {
    [TransactionTypes.CANCEL]: CancelVouchIcon,
    [TransactionTypes.TRUST]: NewVouchIcon,
    [TransactionTypes.TRUSTED]: NewVouchReceivedIcon,
    [TransactionTypes.REGISTER]: NewMemberIcon,
  };

  const Icon = icons?.[type] && icons[type];

  switch (type) {
    case TransactionTypes.BORROW:
      return <BorrowIcon fill="#3b82f6" width="24px" className="fillPath" />;

    case TransactionTypes.REPAY:
      return <RepayIcon fill="#22c55e" width="24px" className="fillPath" />;

    default:
      return (
        <div className="avatarIcon">
          {[TransactionTypes.CANCEL, TransactionTypes.TRUST].includes(type) && (
            <Avatar address={borrower} size={24} />
          )}
          {type === TransactionTypes.TRUSTED && (
            <Avatar address={staker} size={24} />
          )}
          {type === TransactionTypes.REGISTER && (
            <Avatar address={applicant} size={24} />
          )}

          {Icon && <Icon width="16px" />}
        </div>
      );
  }
};
