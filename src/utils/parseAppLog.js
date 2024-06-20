export default function parseAppLog(status, method, args, tx) {
  const sharedProps = { status, txHash: tx?.transactionHash };

  switch (method) {
    case "stake":
      return {
        ...sharedProps,
        label: "Stake",
        value: args[0],
      };
    case "unstake":
      return {
        ...sharedProps,
        label: "Unstake",
        value: args[0],
      };
    case "borrow":
      return {
        ...sharedProps,
        label: "Borrow",
        value: args[1],
      };
    case "repayBorrow":
      return {
        ...sharedProps,
        label: "Repayment",
        value: args[1],
      };
    default:
      return null;
  }
}
