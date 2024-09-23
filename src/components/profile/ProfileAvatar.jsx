import { Avatar } from "../shared";
import { Box, Select } from "@unioncredit/ui";
import { EIP3770 } from "constants";
import { useNavigate } from "react-router-dom";
import { useSupportedNetwork } from "../../hooks/useSupportedNetwork";
import { supportedNetworks } from "../../config/networks";
import { useMemo } from "react";

export const ProfileAvatar = ({ address, chainId }) => {
  const navigate = useNavigate();
  const { isSupported } = useSupportedNetwork();

  const networks = supportedNetworks.filter((n) => isSupported(n.chainId));

  const network = useMemo(() => {
    return networks.find((network) => network.chainId === chainId) || networks[0];
  }, [chainId, networks]);

  return (
    <Box className="ProfileHeader__avatar" align="flex-start" justify="space-between">
      <Avatar address={address} size={100} />

      <Box className="ProfileHeader__NetworkSelect">
        <Select
          options={networks.map((n) => ({
            ...n,
            label: null,
          }))}
          defaultValue={{ ...network, label: null }}
          onChange={(option) => navigate(`/profile/${EIP3770[option.chainId]}:${address}`)}
        />
      </Box>
    </Box>
  );
};
