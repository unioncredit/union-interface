import { useQuery } from "@tanstack/react-query";

export const useNeynarUserSearch = ({ query, limit = 5 }) => {
  return useQuery({
    enabled: !!query,
    staleTime: 120_000,
    queryKey: ["useUserSearch", query],
    queryFn: async () => {
      const response = await fetch(
        `https://api.neynar.com/v2/farcaster/user/search?q=${query}&limit=${limit}`,
        {
          headers: {
            // eslint-disable-next-line no-undef
            "x-api-key": process.env.REACT_APP_NEYNAR_API_KEY,
          },
        }
      );
      if (response.status === 200) {
        const body = await response.json();
        return body.result.users.filter((f) => f.object === "user");
      }

      return [];
    },
  });
};
