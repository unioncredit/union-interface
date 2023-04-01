import { Avatar } from "components/shared/Avatar";
import { AvatarBadgeRow } from "@unioncredit/ui";

export const AddressesAvatarBadgeRow = ({ addresses, ...props }) => (
  <AvatarBadgeRow {...props}>
    {addresses.map((address) => (
      <Avatar key={address} address={address} />
    ))}
  </AvatarBadgeRow>
);
