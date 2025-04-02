export const BnStringify = (obj) =>
  JSON.stringify(obj, (_, value) => (typeof value === "bigint" ? value.toString() : value));
