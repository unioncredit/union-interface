import { useNeynarUser } from "hooks/useNeynarUser";

/**
 * Farcaster name/bio for an address.
 *
 * Previously backed by Airstack, whose API no longer exists — api.airstack.xyz
 * answers 404 for the GraphQL endpoint and 530 at the domain root — so every
 * caller silently got `{ name: null, bio: null }` after a failed round trip.
 * Since `usePrimaryName` prefers the Farcaster name over ENS, that meant no
 * Farcaster name ever rendered anywhere in the app.
 *
 * Neynar serves the same data and is already used for user search, so this
 * reads through the existing `useNeynarUser` query (shared react-query cache,
 * one request per address). The returned shape is unchanged for callers.
 */
export const useFarcasterData = ({ address }) => {
  // Not `isLoading`: useNeynarUser seeds the query with initialData, so
  // react-query reports success immediately and isLoading is always false —
  // callers' placeholder branches (see ProfileHeaderContent) would be
  // unreachable and the name would visibly swap in after the fetch. And not
  // bare `isFetching`: the app-level QueryClient keeps default
  // refetchOnWindowFocus, so once the 120s staleTime lapses a refocus starts a
  // background refetch — without the isFetched guard that would flash the
  // skeleton over an already-rendered name. loading is therefore true only
  // until the FIRST fetch for this address settles.
  const { data: user, isFetching, isFetched, error } = useNeynarUser({ address });
  const loading = isFetching && !isFetched;

  const data = {
    // Airstack's `profileName` was the Farcaster username (fname), so map to
    // the same field rather than Neynar's free-form `display_name`.
    name: user?.username || null,
    bio: user?.profile?.bio?.text || null,
  };

  return { data, error, loading };
};
