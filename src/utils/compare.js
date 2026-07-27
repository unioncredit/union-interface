// Null-safe: callers include event-log handlers and lookups where an address can
// legitimately be absent (disconnected wallet, undecoded log arg). Previously
// threw on a nullish argument.
export const compareAddresses = (a, b) =>
  typeof a === "string" && typeof b === "string" && a.toLowerCase() === b.toLowerCase();
