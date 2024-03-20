import { mainnet } from "wagmi/chains";

import format from "./format";
import { Status } from "constants";
import { blockExplorerTx } from "./blockExplorer";
import { truncateAddress } from "./truncateAddress";
import { ethers } from "ethers";
import { Versions } from "providers/Version";

export default function createParseToast(method, args, chainId = mainnet.id, version, useToken) {
  return function (status, tx) {
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
            content: `Staked ${format(args[0])} ${useToken} successfully`,
            title: `Staked ${useToken}`,
          };
        case "unstake":
          return {
            ...sharedProps,
            content: `Unstaked ${format(args[0])} ${useToken} successfully`,
            title: `Unstaked ${useToken}`,
          };
        case "updateTrust":
          return {
            ...sharedProps,
            content: `Vouched ${format(args[1])} for ${truncateAddress(args[0])} successfully`,
            title: "Vouched",
          };
        case "approve":
          return {
            ...sharedProps,
            content: `Approved ${
              ethers.constants.MaxUint256.eq(args[1]) ? "max" : format(args[1])
            } successfully`,
            title: "Approved",
          };
        case "borrow":
          const borrowAmount = version === Versions.V2 ? args[1] : args[0];
          return {
            ...sharedProps,
            content: `Borrowed ${format(borrowAmount)} ${useToken} successfully`,
            title: "Borrowed",
          };
        case "repayBorrow":
          const repayAmount = version === Versions.V2 ? args[1] : args[0];
          const amount = ethers.constants.MaxUint256.eq(repayAmount)
            ? "maximum"
            : format(repayAmount);
          return {
            ...sharedProps,
            content: `Repaid ${amount} ${useToken} successfully`,
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
            content: `Staking ${format(args[0])} ${useToken} failed`,
            title: `Staking ${useToken}`,
          };
        case "unstake":
          return {
            ...sharedProps,
            content: `Unstaking ${format(args[0])} ${useToken} failed`,
            title: `Unstake ${useToken}`,
          };
        case "updateTrust":
          return {
            ...sharedProps,
            content: `Vouching ${format(args[1])} ${useToken} for ${truncateAddress(
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
          const borrowAmount = version === Versions.V2 ? args[1] : args[0];
          return {
            ...sharedProps,
            content: `Borrowing ${format(borrowAmount)} failed`,
            title: "Borrowing",
          };
        case "repayBorrow":
          const repayAmount = version === Versions.V2 ? args[1] : args[0];
          const amount = ethers.constants.MaxUint256.eq(repayAmount)
            ? "maximum"
            : format(repayAmount);
          return {
            ...sharedProps,
            content: `Repaying ${amount} ${useToken} failed`,
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
            content: `Staking ${format(args[0])} ${useToken}`,
            title: `Staking ${useToken}`,
          };
        case "unstake":
          return {
            ...sharedProps,
            content: `Unstaking ${format(args[0])} ${useToken}`,
            title: `Unstake ${useToken}`,
          };
        case "updateTrust":
          return {
            ...sharedProps,
            content: `Vouching ${format(args[1])} ${useToken} for ${truncateAddress(args[0])}`,
            title: "Vouching",
          };
        case "approve":
          return {
            ...sharedProps,
            content: "Approving",
            title: "Approving",
          };
        case "borrow":
          const borrowAmount = version === Versions.V2 ? args[1] : args[0];
          return {
            ...sharedProps,
            content: `Borrowing ${format(borrowAmount)}`,
            title: "Borrowing",
          };
        case "repayBorrow":
          const repayAmount = version === Versions.V2 ? args[1] : args[0];
          const amount = ethers.constants.MaxUint256.eq(repayAmount)
            ? "maximum"
            : format(repayAmount);
          return {
            ...sharedProps,
            content: `Repaying ${amount} ${useToken}`,
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
  };
}
