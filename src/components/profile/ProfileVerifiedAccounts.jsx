import "./ProfileVerifiedAccounts.scss";

import { useAccount } from "wagmi";
import { Box, Text } from "@unioncredit/ui";
import { useEffect, useState } from "react";
import { base } from "viem/chains";

import { ZERO_ADDRESS } from "constants";
import { ProfileVerifiedAccountBadge } from "./ProfileVerifiedAccountBadge";

export const ProfileVerifiedAccounts = ({ address, chainId }) => {
  const [data, setData] = useState(null);

  const { chain: connectedChain } = useAccount();

  useEffect(() => {
    if (address !== ZERO_ADDRESS) {
      fetch(`https://identity.union.finance/${connectedChain?.id || base.id}/address/${address}`)
        .then((res) => res.json())
        .then(setData)
        .catch((err) => {
          console.log(err.message);
        });
    }
  }, [connectedChain?.id, address]);

  return (
    <Box mt="24px" direction="vertical" className="ProfileVerifiedAccounts" fluid>
      <Text grey={500} size="small" weight="medium" mb="0">
        VERIFIED ACCOUNTS
      </Text>

      {data && (
        <Box align="center" className="ProfileVerifiedAccounts__badges" fluid>
          <ProfileVerifiedAccountBadge
            type="account"
            chainId={chainId}
            address={address}
            label={data?.account?.is_contract_address ? "Contract" : "EOA"}
          />

          {data?.passport?.passport_socials?.map((item, idx) => (
            <ProfileVerifiedAccountBadge
              key={idx}
              chainId={chainId}
              address={address}
              type={item.source}
              url={item.profile_url}
              label={item.profile_name}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};
