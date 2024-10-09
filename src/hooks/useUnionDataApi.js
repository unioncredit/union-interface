import { useEffect, useMemo, useState } from "react";

export const useUnionDataApi = ({ network, page = 1, size = 50, sort = {}, query = {} }) => {
  const [data, setData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const body = useMemo(
    () => ({
      union: query,
      sort: {
        [sort.field]: sort.order,
      },
    }),
    [sort]
  );

  useEffect(() => {
    setLoading(true);

    fetch(`https://api.union.finance/api/v1/${network}?page=${page}&size=${size}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Union data API request failed: " + response.statusText);
        }
        return response.json();
      })
      .then((json) => {
        setData(json);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => setLoading(false));
  }, [body, network, page, size]);

  return { data, error, loading };
};
