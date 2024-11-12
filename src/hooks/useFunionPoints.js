import { useEffect, useState } from "react";
import { isAddress } from "ethers/lib/utils";

export const useFunionPoints = (address) => {
  const [data, setData] = useState(0);
  const [loading, setLoading] = useState(false);

  function loadData() {
    if (!address || !isAddress(address)) {
      setData(0);
      return;
    }

    setLoading(true);

    fetch(`https://preview.union.finance/api/stack-points/${address}`, {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Union data API request failed: " + response.statusText);
        }
        return response.json();
      })
      .then((json) => {
        setData(json.points);
      })
      .catch((error) => {
        console.error("Failed to retrieve funion points: " + error);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadData();
  }, [address]);

  return { data, loading };
};
