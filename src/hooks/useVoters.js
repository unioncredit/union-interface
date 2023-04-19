import chunk from "lodash/chunk";
import { useContractReads } from "wagmi";
import { useEffect, useState } from "react";
import { mainnet } from "wagmi/chains";

import useContract from "hooks/useContract";
import { CACHE_TIME, ZERO_ADDRESS } from "constants";
import { STALE_TIME } from "constants";
import fetchVoteCasts from "fetchers/fetchVoteCasts";
import { useVersion } from "providers/Version";

const selectVoter = (data) => ({
  unionBalance: data[0],
  votes: data[1],
  delegatedVotes: data[1].sub(data[0]),
});

function useVotes() {
  const { version } = useVersion();
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    (async function () {
      const data = await fetchVoteCasts(version, mainnet.id);
      setAddresses(data);
    })();
  }, []);

  return { data: addresses };
}

export default function useVoters() {
  const { data: addresses = [] } = useVotes();
  const unionContract = useContract("union", mainnet.id);

  const uniqueAddresses = addresses.filter((element, index) => {
    return addresses.indexOf(element) === index;
  });

  const buildVoterQueries = (address) => [
    { ...unionContract, functionName: "balanceOf", args: [address] },
    { ...unionContract, functionName: "getCurrentVotes", args: [address] },
  ];

  const contracts = uniqueAddresses.reduce(
    (acc, address) => [...acc, ...buildVoterQueries(address)],
    []
  );

  const resp = useContractReads({
    enabled: false,
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

  useEffect(() => {
    if (uniqueAddresses?.length > 0) resp.refetch();
  }, [uniqueAddresses?.length, resp.refetch]);

  return {
    data: resp.data?.map((item) => ({
      ...item,
      voteCount: addresses.filter((a) => a === item.address).length,
    })),
  };
}
