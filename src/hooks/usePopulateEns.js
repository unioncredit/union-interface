import { chain, useContractRead } from "wagmi";
import useLabels from "./useLabels";

/**
 * Given an input array of objects that have an address property
 * { address: "0x0..0", ... } populate their ens record, assigning
 * null if it does not exist
 */
export default function usePopulateEns(inputData) {
  const { getLabel } = useLabels();

  const { data: ensNames } = useContractRead({
    chainId: chain.mainnet.id,
    addressOrName: "0x3671ae578e63fdf66ad4f3e12cc0c0d71ac7510c",
    contractInterface: [
      {
        inputs: [
          { internalType: "contract ENS", name: "_ens", type: "address" },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
      },
      {
        inputs: [
          { internalType: "address[]", name: "addresses", type: "address[]" },
        ],
        name: "getNames",
        outputs: [{ internalType: "string[]", name: "r", type: "string[]" }],
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "getNames",
    args: [inputData?.map(({ address }) => address)],
    enabled: !!inputData,
  });

  return inputData?.map((row, i) => ({
    ...row,
    ens: ensNames?.[i],
    label: getLabel(row.address),
  }));
}
