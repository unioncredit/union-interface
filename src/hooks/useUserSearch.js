import { useDebounce } from "use-debounce";
import { isAddress } from "viem";

import { useNeynarUserSearch } from "hooks/useNeynarUserSearch";
import { useEnsUserSearch } from "hooks/useEnsUserSearch";
import { useNeynarUser } from "hooks/useNeynarUser";
import { getNeynarAddress } from "../utils/neynar";

export const useUserSearch = ({ query, limit = 5 }) => {
  const [debouncedQuery] = useDebounce(query, 500);

  const { data: neynarUsers = [], isLoading: neynarUsersLoading } = useNeynarUserSearch({
    query: debouncedQuery,
    limit,
  });

  const { data: ensUsers = [], isLoading: ensUsersLoading } = useEnsUserSearch({
    query: debouncedQuery,
  });

  const { data: addressUser, isFetching: addressUserLoading } = useNeynarUser({
    address: isAddress(debouncedQuery) ? debouncedQuery : undefined,
  });

  const mappedNeynarUsers = [
    ...neynarUsers,
    ...(addressUser.fid !== 0 ? [addressUser] : [])
  ].map(r => ({
    name: r.display_name,
    username: r.username,
    avatar: r.pfp_url,
    address: getNeynarAddress(r),
  }))

  return {
    data: [...mappedNeynarUsers, ...ensUsers],
    isLoading:
      neynarUsersLoading || query !== debouncedQuery || ensUsersLoading || addressUserLoading,
  };
};
