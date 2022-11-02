import { useState, useEffect } from "react";
import { fetchEnsName } from "@wagmi/core";
import { chain } from "wagmi";
import useLabels from "./useLabels";

/**
 * Given an input array of objects that have an address property
 * { address: "0x0..0", ... } populate their ens record, assigning
 * null if it does not exist
 */
export default function usePopulateEns(inputData) {
  const { getLabel } = useLabels();
  const [data, setData] = useState(null);

  useEffect(() => {
    async function populateData() {
      const populated = await Promise.all(
        inputData.map(async (row) => ({
          ...row,
          label: getLabel(row.address),
          ens: await fetchEnsName({
            address: row.address,
            chainId: chain.mainnet.id,
          }),
        }))
      );

      setData(populated);
    }

    inputData &&
      Array.isArray(inputData) &&
      inputData.length > 0 &&
      populateData();
  }, [JSON.stringify(inputData)]);

  return data || inputData;
}
