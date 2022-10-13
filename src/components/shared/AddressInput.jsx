import { useState } from "react";
import { useEnsName, useEnsAddress } from "wagmi";
import { Input, Label, Box, LoadingSpinner } from "@unioncredit/ui";
import { ReactComponent as EnsIcon } from "@unioncredit/ui/lib/icons/ens.svg";

import { Errors } from "constants";
import { isAddress } from "ethers/lib/utils";
import Avatar from "components/shared/Avatar";

export default function AddressInput(props) {
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);

  const { data: ens, isLoading: isLoadingName } = useEnsName({
    address: isAddress(value) && value,
    chainId: 1,
  });

  const { data: addressFromEns, isLoading: isLoadingAddress } = useEnsAddress({
    name: value?.endsWith(".eth") && value,
    chainId: 1,
  });

  const address = isAddress(value) ? value : addressFromEns;

  const handleChange = (event) => {
    const value = event.target.value;

    if (value.endsWith(".eth") || isAddress(value)) {
      // Input ends with .eth so we treat it is an ENS or
      // it is a valid ETH address
      setValue(value);
      setError(null);
    } else if (value === "") {
      // Input valus is an empty string
      setValue("");
      setError(null);
    } else {
      // Input value is not an address OR ENS so set an error
      setError(Errors.INVALID_ADDRESS_OR_ENS);
    }
  };

  return (
    <Input
      {...props}
      error={error}
      onChange={handleChange}
      caption={
        <Box direction="horizontal" align="center" mt="4px">
          {isAddress(address) && <Avatar size={16} address={address} />}
          <Label mb={0} mt={0} ml="4px" size="small">
            {ens || address || "-"}
          </Label>
        </Box>
      }
      suffix={
        isLoadingName || isLoadingAddress ? (
          <LoadingSpinner />
        ) : (
          value?.endsWith(".eth") && <EnsIcon />
        )
      }
    />
  );
}
