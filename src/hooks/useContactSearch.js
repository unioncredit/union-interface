import { useMemo } from "react";

export default function useContactSearch(contacts, query) {
  return useMemo(() => {
    if (!query) return contacts;

    const queryLc = query.toLowerCase();

    return contacts.filter((item) => {
      const address = item.address.toLowerCase();
      const ens = item.ens ? item.ens.toLowerCase() : "";
      const label = item.label ? item.label.toLowerCase() : "";

      return (
        address.includes(queryLc) ||
        label.includes(queryLc) ||
        ens.includes(queryLc)
      );
    });
  }, [JSON.stringify(contacts), query]);
}
