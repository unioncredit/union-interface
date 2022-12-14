import "./NetworkSelectOption.scss";
import { Avatar, Box, Button, Card, Label, Text } from "@unioncredit/ui";
import cn from "classnames";
import format from "utils/format";
import useMemberSummary from "hooks/useMemberSummary";

export const NetworkSelectOption = ({
  address,
  network,
  active,
  disabled,
  onClick,
}) => {
  const { label, value, avatar, description, chainId } = network;
  const { data } = useMemberSummary(address, chainId);

  return (
    <Card
      my="6px"
      packed
      maxw="100%"
      key={value}
      onClick={onClick}
      className={cn("NetworkSelectOption", {
        "NetworkSelectOption--active": active,
        "NetworkSelectOption--disabled": disabled,
      })}
    >
      <Box align="center">
        <Box fluid p="12px" className="NetworkSelectOption__contentBox">
          <Box justify="center" mr="16px">
            <Avatar size={40} src={avatar} />
          </Box>
          <Box direction="vertical">
            <Text as="h3" m={0} grey={800}>
              {label}
            </Text>

            <Label as="p" m={0} pr="8px" size="small">
              {address
                ? data.isMember
                  ? `Member · ${format(data.creditLimit)} DAI available`
                  : "Not a member"
                : description}
            </Label>
          </Box>
        </Box>
        <Box p="0 12px" className="NetworkSelectOption__controlBox">
          {active ? (
            <Button variant="pill" label="Selected" color="blue" />
          ) : (
            <Button variant="pill" label="Switch" />
          )}
        </Box>
      </Box>
    </Card>
  );
};
