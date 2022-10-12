export default function praseAppLog(status, method, args, tx) {
  const sharedProps = { status, txHash: tx.transactionHash };

  switch (method) {
    case "stake":
      return { ...sharedProps, label: "Staked DAI", value: args[0] };
    case "unstake":
      return { ...sharedProps, label: "Unstaked DAI", value: args[0] };
    default:
      return null;
  }
}
