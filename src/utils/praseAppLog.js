export default function praseAppLog(status, method, args, tx, useToken) {
  const sharedProps = { status, txHash: tx?.transactionHash };

  switch (method) {
    case "stake":
      return { ...sharedProps, label: `Staked ${useToken}`, value: args[0] };
    case "unstake":
      return { ...sharedProps, label: `Unstaked ${useToken}`, value: args[0] };
    default:
      return null;
  }
}
