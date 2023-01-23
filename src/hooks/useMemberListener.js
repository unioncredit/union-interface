import { useAccount, useContractEvent } from "wagmi";

import useContract from "hooks/useContract";
import { useMember } from "providers/MemberData";
import { useVouchers } from "providers/VouchersData";

export default function useMemberListener() {
  const { address } = useAccount();
  const { refetch: refetchMember } = useMember();
  const { refetch: refetchVouchers } = useVouchers();

  const userManager = useContract("userManager");

  const refreshMember = () => {
    console.log("Listener: refreshing member");
    refetchMember();
    refetchVouchers();
  };

  useContractEvent({
    ...userManager,
    eventName: "LogUpdateTrust",
    listener: ([, borrower]) => {
      console.log("Listener: LogUpdateTrust received", { borrower, address });
      if (borrower === address) {
        refreshMember();
      }
    },
  });

  useContractEvent({
    ...userManager,
    eventName: "LogCancelVouch",
    listener: ([, borrower]) => {
      console.log("Listener: LogCancelVouch received", { borrower, address });
      if (borrower === address) {
        refreshMember();
      }
    },
  });

  useContractEvent({
    ...userManager,
    eventName: "LogRegisterMember",
    listener: ([, account]) => {
      console.log("Listener: LogRegisterMember received", { account, address });
      if (account === address) {
        refreshMember();
      }
    },
  });
}
