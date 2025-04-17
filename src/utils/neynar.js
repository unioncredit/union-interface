export const getNeynarAddress = (user) => {
  return user.verified_addresses.primary.eth_address
    || (user.verified_addresses.eth_addresses.length > 0 && user.verified_addresses.eth_addresses[0])
    || user.custody_address;
}