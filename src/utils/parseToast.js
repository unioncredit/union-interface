import { chain } from "wagmi";

import format from "./format";
import { Status } from "constants";
import { blockExplorerTx } from "./blockExplorer";
import { truncateAddress } from "./truncateAddress";
import { ethers } from "ethers";

export default function parseToast(
  status,
  method,
  args,
  tx,
  chainId = chain.mainnet.id
) {
  const sharedProps = {
    link: tx ? blockExplorerTx(chainId, tx.hash) : null,
    variant: status,
    id: `${status}__${method}__${Date.now()}`,
  };

  if (status === Status.SUCCESS) {
    /*--------------------------------------------------------------
      Successfull transactions 
    --------------------------------------------------------------*/

    switch (method) {
      case "stake":
        return {
          ...sharedProps,
          content: `Staked ${format(args[0])} DAI successfully`,
          title: "Staked DAI",
        };
      case "unstake":
        return {
          ...sharedProps,
          content: `Unstaked ${format(args[0])} DAI successfully`,
          title: "Unstaked DAI",
        };
      case "updateTrust":
        return {
          ...sharedProps,
          content: `Vouched ${format(args[1])} for ${truncateAddress(
            args[0]
          )} successfully`,
          title: "Vouched",
        };
      case "approve":
        return {
          ...sharedProps,
          content: `Approved ${format(args[2])} successfully`,
          title: "Approved",
        };
      case "borrow":
        return {
          ...sharedProps,
          content: `Borrowed ${format(args[0])} DAI successfully`,
          title: "Borrowed",
        };
      case "repayBorrow":
        const amount = ethers.constants.MaxUint256.eq(args[0])
          ? "maximum"
          : format(args[0]);
        return {
          ...sharedProps,
          content: `Repaid ${amount} DAI successfully`,
          title: "Repaid borrow",
        };
      case "delegate":
        return {
          ...sharedProps,
          content: `Delegated to ${truncateAddress(args[0])} successfully`,
          title: "Delegated",
        };
      default:
        return {
          ...sharedProps,
          content: "Transaction successful",
          title: "Success",
        };
    }
  } else if (status === Status.FAILED) {
    /*--------------------------------------------------------------
      Failed transactions
    --------------------------------------------------------------*/

    switch (method) {
      case "stake":
        return {
          ...sharedProps,
          content: `Staking ${format(args[0])} DAI failed`,
          title: "Staking DAI",
        };
      case "unstake":
        return {
          ...sharedProps,
          content: `Unstaking ${format(args[0])} DAI failed`,
          title: "Unstake DAI",
        };
      case "updateTrust":
        return {
          ...sharedProps,
          content: `Vouching ${format(args[1])} DAI for ${truncateAddress(
            args[0]
          )} failed`,
          title: "Vouching",
        };
      case "approve":
        return {
          ...sharedProps,
          content: "Approving failed",
          title: "Approving",
        };
      case "borrow":
        return {
          ...sharedProps,
          content: `Borrowing ${format(args[0])} failed`,
          title: "Borrowing",
        };
      case "repayBorrow":
        const amount = ethers.constants.MaxUint256.eq(args[0])
          ? "maximum"
          : format(args[0]);
        return {
          ...sharedProps,
          content: `Repaying ${amount} DAI failed`,
          title: "Repaying",
        };
      case "delegate":
        return {
          ...sharedProps,
          content: `Delegating to ${truncateAddress(args[0])} failed`,
          title: "Delegating",
        };
      default:
        return {
          ...sharedProps,
          content: "Transaction failed",
          title: "Failed",
        };
    }
  } else {
    /*--------------------------------------------------------------
      Pending transactions
    --------------------------------------------------------------*/

    switch (method) {
      case "stake":
        return {
          ...sharedProps,
          content: `Staking ${format(args[0])} DAI`,
          title: "Staking DAI",
        };
      case "unstake":
        return {
          ...sharedProps,
          content: `Unstaking ${format(args[0])} DAI`,
          title: "Unstake DAI",
        };
      case "updateTrust":
        return {
          ...sharedProps,
          content: `Vouching ${format(args[1])} DAI for ${truncateAddress(
            args[0]
          )}`,
          title: "Vouching",
        };
      case "approve":
        return {
          ...sharedProps,
          content: "Approving",
          title: "Approving",
        };
      case "borrow":
        return {
          ...sharedProps,
          content: `Borrowing ${format(args[0])}`,
          title: "Borrowing",
        };
      case "repayBorrow":
        const amount = ethers.constants.MaxUint256.eq(args[0])
          ? "maximum"
          : format(args[0]);
        return {
          ...sharedProps,
          content: `Repaying ${amount} DAI`,
          title: "Repaying",
        };
      case "delegate":
        return {
          ...sharedProps,
          content: `Delegating to ${truncateAddress(args[0])}`,
          title: "Delegating",
        };
      default:
        return {
          ...sharedProps,
          content: "Transaction pending",
          title: "Pending",
        };
    }
  }
}
