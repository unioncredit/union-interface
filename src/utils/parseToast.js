import { mainnet } from "wagmi/chains";

import format from "./format";
import { Status } from "constants";
import { blockExplorerTx } from "./blockExplorer";
import { truncateAddress } from "./truncateAddress";
import { ethers } from "ethers";
import { Versions } from "providers/Version";
export default function createParseToast(
  method,
  args,
  token,
  chainId = mainnet.id,
  version,
  contract
) {
  return function (status, tx) {
    const sharedProps = {
      link: tx ? blockExplorerTx(chainId, tx.hash) : null,
      variant: status,
      id: `${status}__${method}__${Date.now()}`,
    };

    if (status === Status.SUCCESS) {
      /*--------------------------------------------------------------
      Successful transactions
    --------------------------------------------------------------*/

      switch (method) {
        case "stake":
          return {
            ...sharedProps,
            content: `Staked ${format(args[0], token)} ${token} successfully`,
            title: `Stake ${token}`,
          };
        case "unstake":
          return {
            ...sharedProps,
            content: `Unstaked ${format(args[0], token)} ${token} successfully`,
            title: `Unstake ${token}`,
          };
        case "updateTrust":
          return {
            ...sharedProps,
            content: `Vouched ${format(args[1], token)} for ${truncateAddress(
              args[0]
            )} successfully`,
            title: "Vouched",
          };
        case "approve":
          return {
            ...sharedProps,
            content: `Approved ${
              ethers.constants.MaxUint256.eq(args[1]) ? "max" : format(args[1], token)
            } successfully`,
            title: `Approve ${token}`,
          };
        case "borrow":
          const borrowAmount = version === Versions.V2 ? args[1] : args[0];
          return {
            ...sharedProps,
            content: `Borrowed ${format(borrowAmount, token)} ${token} successfully`,
            title: `Borrow ${token}`,
          };
        case "repayBorrow":
          const repayAmount = version === Versions.V2 ? args[1] : args[0];
          const amount = ethers.constants.MaxUint256.eq(repayAmount)
            ? "maximum"
            : format(repayAmount, token);
          return {
            ...sharedProps,
            content: `Repaid ${amount} ${token} successfully`,
            title: `Repay ${token}`,
          };
        case "delegate":
          return {
            ...sharedProps,
            content: `Delegated to ${truncateAddress(args[0])} successfully`,
            title: "Delegate",
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
            content: `Staking ${format(args[0], token)} ${token} failed`,
            title: `Stake ${token}`,
          };
        case "unstake":
          return {
            ...sharedProps,
            content: `Unstaking ${format(args[0], token)} ${token} failed`,
            title: `Unstake ${token}`,
          };
        case "updateTrust":
          return {
            ...sharedProps,
            content: `Vouching ${format(args[1], token)} ${token} for ${truncateAddress(
              args[0]
            )} failed`,
            title: "Vouch",
          };
        case "approve":
          return {
            ...sharedProps,
            content: "Approving failed",
            title: `Approve ${token}`,
          };
        case "borrow":
          const borrowAmount = version === Versions.V2 ? args[1] : args[0];
          return {
            ...sharedProps,
            content: `Borrowing ${format(borrowAmount, token)} failed`,
            title: `Borrow ${token}`,
          };
        case "repayBorrow":
          const repayAmount = version === Versions.V2 ? args[1] : args[0];
          const amount = ethers.constants.MaxUint256.eq(repayAmount)
            ? "maximum"
            : format(repayAmount, token);
          return {
            ...sharedProps,
            content: `Repaying ${amount} ${token} failed`,
            title: `Repay ${token}`,
          };
        case "delegate":
          return {
            ...sharedProps,
            content: `Delegating to ${truncateAddress(args[0])} failed`,
            title: "Delegate",
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
            content: `Staking ${format(args[0], token)} ${token}`,
            title: `Stake ${token}`,
          };
        case "unstake":
          return {
            ...sharedProps,
            content: `Unstaking ${format(args[0], token)} ${token}`,
            title: `Unstake ${token}`,
          };
        case "updateTrust":
          return {
            ...sharedProps,
            content: `Vouching ${format(args[1], token)} ${token} for ${truncateAddress(args[0])}`,
            title: "Vouch",
          };
        case "approve":
          return {
            ...sharedProps,
            content: `Approving ${token} for ${contract === "userManager" ? "Staking" : "Repay"}`,
            title: `Approve ${token}`,
          };
        case "borrow":
          const borrowAmount = version === Versions.V2 ? args[1] : args[0];
          return {
            ...sharedProps,
            content: `Borrowing ${format(borrowAmount, token)} ${token}`,
            title: `Borrow ${token}`,
          };
        case "repayBorrow":
          const repayAmount = version === Versions.V2 ? args[1] : args[0];
          const amount = ethers.constants.MaxUint256.eq(repayAmount)
            ? "maximum"
            : format(repayAmount, token);
          return {
            ...sharedProps,
            content: `Repaying ${amount} ${token}`,
            title: `Repay ${token}`,
          };
        case "delegate":
          return {
            ...sharedProps,
            content: `Delegating to ${truncateAddress(args[0])}`,
            title: "Delegate",
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
