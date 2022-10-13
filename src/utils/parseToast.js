import { Status } from "constants";
import format from "./format";

// TODO:
const chainId = null;
const getBlockExplorerLink = () => "#";

export default function praseToast(status, method, args, tx) {
  const sharedProps = {
    link: getBlockExplorerLink(chainId, tx),
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
      default:
        return {
          ...sharedProps,
          content: "Transaction pending",
          title: "Pending",
        };
    }
  }
}
