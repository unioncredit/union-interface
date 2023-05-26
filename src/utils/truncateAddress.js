export const truncateAddress = (address) => `${address.slice(0, 6)}...${address.slice(-4)}`;

export const truncateEns = (ens, cutoff = 16) => {
  if (!ens || ens.length <= cutoff) {
    return ens;
  }

  const parts = ens.split(".");
  const name = parts.slice(0, -1).join(".");

  return `${name.slice(0, 4)}...${name.slice(-4)}.${parts.slice(-1)}`;
};
