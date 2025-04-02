import { useAccount } from "wagmi";
import { Text } from "@unioncredit/ui";
import { Link } from "react-router-dom";

import { EIP3770 } from "constants";
import { compareAddresses } from "utils/compare";
import { PrimaryLabel } from "components/shared";

export const Address = ({ address }) => {
  const { chain, address: connectedAddress } = useAccount();

  return (
    <Text as="span" size="medium" weight="medium" grey={500} m={0}>
      <Link to={`/profile/${EIP3770[chain.id]}:${address}`}>
        {compareAddresses(connectedAddress, address) ? "You" : <PrimaryLabel address={address} />}
      </Link>
    </Text>
  );
};
