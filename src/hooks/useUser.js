import { zeroAddress } from "viem";
import makeBlockie from "ethereum-blockies-base64";
import { useEnsAvatar, useEnsName } from "wagmi";
import { normalize } from "viem/ens";

import { useNeynarUser } from "hooks/useNeynarUser";
import { getNeynarAddress } from "utils/neynar";
import { mainnet } from "viem/chains";
import { truncateAddress } from "../utils/truncateAddress";

export const useUser = ({ address }) => {
  const { data: user, isLoading: userIsLoading } = useNeynarUser({ address });

  const { data: ensName, isLoading: nameIsLoading } = useEnsName({
    address,
    chainId: mainnet.id,
    query: {
      enabled: !!address,
    }
  });

  const { data: ensAvatar, isLoading: avatarIsLoading } = useEnsAvatar({
    name: normalize(ensName),
    chainId: mainnet.id,
    query: {
      enabled: !!address,
    }
  });

  const data = {
    address,
    name: user?.username || ensName || null,
    avatar: user?.pfp_url || ensAvatar || makeBlockie(address || zeroAddress),
    username: address ? truncateAddress(address) : "123",
  };

  return {
    data: address ? data : null,
    isLoading: userIsLoading || nameIsLoading || avatarIsLoading,
  };
};
