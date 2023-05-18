import "./AddressLabelBox.scss";

import { Box, Text } from "@unioncredit/ui";

import { Avatar, PrimaryLabel } from "components/shared";

export function AddressLabelBox({ label, address, ...props }) {
  return (
    <Box className="AddressLabelBox" justify="space-between" {...props}>
      <Text m={0} size="medium" color="blue600" weight="medium">
        {label}
      </Text>

      <Box align="center">
        <Avatar size="small" address={address} />

        <Text m="0 0 0 4px" size="medium" color="blue600" weight="medium">
          <PrimaryLabel address={address} />
        </Text>
      </Box>
    </Box>
  );
}
