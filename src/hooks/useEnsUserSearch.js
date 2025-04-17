import { useEnsAddress } from "wagmi";
import { mainnet } from "viem/chains";

import { tryNormalize } from "utils/format";
import { useUser } from "hooks/useUser";

export const useEnsUserSearch = ({ query }) => {
  const { data: mainnetAddress, isLoading: ensLoading } = useEnsAddress({
    name: tryNormalize(query),
    chainId: mainnet.id,
    query: {
      enabled: query.endsWith(".eth"),
    },
  });

  const { data: user, isFetching: userLoading, isFetched } = useUser({
    address: mainnetAddress,
  });

  return {
    data: user ? [user] : [],
    isLoading: ensLoading || userLoading || (isFetched && user.fid === 0),
  };
};