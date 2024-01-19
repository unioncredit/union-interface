import { mainnet, useAccount, useContractEvent, useNetwork } from "wagmi";

import useContract from "hooks/useContract";
import { useMember } from "providers/MemberData";
import { useVouchers } from "providers/VouchersData";
import { useVouchees } from "providers/VoucheesData";
import { compareAddresses } from "utils/compare";

export default function useMemberListener() {
  const { address } = useAccount();
  const { chain: connectedChain } = useNetwork();
  const { refetch: refetchMember } = useMember();
  const { refetch: refetchVouchers } = useVouchers();
  const { refetch: refetchVouchees } = useVouchees();

  const userManager = useContract("userManager", connectedChain?.id ?? mainnet.id);
  const daiContract = useContract("dai", connectedChain?.id ?? mainnet.id);

  const refreshMember = () => {
    console.log("Listener: refreshing member");
    refetchMember();
    refetchVouchers();
    refetchVouchees();
  };

  useContractEvent({
    ...userManager,
    eventName: "LogDebtWriteOff",
    listener: (staker, borrower) => {
      console.debug("Listener: LogDebtWriteOff received", { staker, borrower, address });
      if (compareAddresses(borrower, address) || compareAddresses(staker, address)) {
        refreshMember();
      }
    },
  });

  useContractEvent({
    ...userManager,
    eventName: "LogUpdateTrust",
    listener: (staker, borrower) => {
      console.debug("Listener: LogUpdateTrust received", { staker, borrower, address });
      if (compareAddresses(borrower, address) || compareAddresses(staker, address)) {
        refreshMember();
      }
    },
  });

  useContractEvent({
    ...userManager,
    eventName: "LogCancelVouch",
    listener: (_, borrower) => {
      console.debug("Listener: LogCancelVouch received", { borrower, address });
      if (compareAddresses(borrower, address)) {
        refreshMember();
      }
    },
  });

  useContractEvent({
    ...userManager,
    eventName: "LogRegisterMember",
    listener: (_, account) => {
      console.debug("Listener: LogRegisterMember received", { account, address });
      if (compareAddresses(account, address)) {
        refreshMember();
      }
    },
  });

  useContractEvent({
    ...daiContract,
    eventName: "Transfer",
    listener: (from, to) => {
      console.debug("Listener: DAI Transfer received", { address, from, to });
      if (compareAddresses(address, from) || compareAddresses(address, to)) {
        refreshMember();
      }
    },
  });
}
