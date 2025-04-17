import { zeroAddress } from "viem";
import { useQuery } from "@tanstack/react-query";

export const useNeynarUser = ({ address }) => {
  const initialData = {
    object: "user",
    address: address || zeroAddress,
    fid: 0,
    username: "",
    display_name: "",
    pfp_url: "",
    custody_address: zeroAddress,
    verified_addresses: {
      eth_addresses: [],
      primary: {
        eth_address: null,
      },
    },
  };

  return useQuery({
    enabled: !!address,
    staleTime: 120_000,
    queryKey: ["useNeynarUser", address],
    queryFn: async () => {
      const response = await fetch(
        `https://api.neynar.com/v2/farcaster/user/bulk-by-address?addresses=${address}`,
        {
          headers: {
            "x-api-key": process.env.REACT_APP_NEYNAR_API_KEY,
          },
        }
      );
      if (response.status === 200) {
        const body = await response.json();
        const items = body[address.toLowerCase()];
        const user = items?.find((i) => i.object === "user");

        if (user) {
          return user;
        }
      }

      return initialData;
    },
    initialDataUpdatedAt: -1,
    initialData,
  });
};
