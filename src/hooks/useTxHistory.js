import { ZERO_ADDRESS } from "constants";
import { useEffect, useState } from "react";

import fetchUserTransactions from "fetchers/fetchUserTransactions";
import fetchUTokenTransactions from "fetchers/fetchUTokenTransactions";
import fetchRegisterTransactions from "fetchers/fetchRegisterTransactions";
import { useNetwork } from "wagmi";

export default function useTxHistory({
  staker = ZERO_ADDRESS,
  borrower = ZERO_ADDRESS,
}) {
  const { chain } = useNetwork();
  const [data, setData] = useState([]);

  useEffect(() => {
    async function loadData() {
      setData([]);

      const registerTransactions = await fetchRegisterTransactions(
        chain.id,
        staker
      );
      const utokenTransactions = await fetchUTokenTransactions(
        chain.id,
        staker
      );
      const userTransactions = await fetchUserTransactions(chain.id, staker);

      const txHistory = [
        ...registerTransactions,
        ...utokenTransactions,
        ...userTransactions,
      ].sort((a, b) => {
        return Number(b.timestamp) - Number(a.timestamp);
      });

      setData(txHistory);
    }

    staker !== ZERO_ADDRESS && loadData();
  }, [chain.id, borrower, staker]);

  return { data };
}
