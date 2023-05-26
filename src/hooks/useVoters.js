import chunk from "lodash/chunk";
import { useContractReads, useNetwork } from "wagmi";
import { useEffect, useState } from "react";
import { mainnet } from "wagmi/chains";

import useContract from "hooks/useContract";
import { CACHE_TIME, ZERO, ZERO_ADDRESS } from "constants";
import { STALE_TIME } from "constants";
import fetchVoteCasts from "fetchers/fetchVoteCasts";
import { getVersion, Versions } from "providers/Version";

const selectVoter = (data) => ({
  unionBalance: data[0] || ZERO,
  votes: data[1] || ZERO,
  delegatedVotes: data[1] ? data[1].sub(data[0]) : ZERO,
});

function useVotes() {
  const { chain } = useNetwork();
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    (async function () {
      const data = await fetchVoteCasts(getVersion(mainnet.id), mainnet.id);
      setAddresses(data);
    })();
  }, [chain.id]);

  return { data: addresses };
}

export default function useVoters() {
  const { data: addresses = [] } = useVotes();
  const unionContract = useContract("union", mainnet.id, Versions.V1);

  const uniqueAddresses = addresses.filter((element, index) => {
    return addresses.indexOf(element) === index;
  });

  const buildVoterQueries = (address) => [
    { ...unionContract, functionName: "balanceOf", args: [address], chainId: mainnet.id },
    { ...unionContract, functionName: "getCurrentVotes", args: [address], chainId: mainnet.id },
  ];

  const contracts = uniqueAddresses.reduce(
    (acc, address) => [...acc, ...buildVoterQueries(address)],
    []
  );

  const resp = useContractReads({
    select: (data) => {
      const tmp = buildVoterQueries(ZERO_ADDRESS);
      const chunkSize = tmp.length;
      const chunked = chunk(data, chunkSize);
      return chunked.map((x, i) => ({
        ...selectVoter(x),
        address: uniqueAddresses[i],
      }));
    },
    contracts: contracts,
    cacheTime: CACHE_TIME,
    staleTime: STALE_TIME,
  });

  return {
    data: resp.data?.map((item) => ({
      ...item,
      voteCount: addresses.filter((a) => a === item.address).length,
    })),
  };
}
