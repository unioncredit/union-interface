import "./NetworkSelectOption.scss";
import { Avatar, Box, Button, Card, CheckIcon, Text } from "@unioncredit/ui";
import cn from "classnames";
import format from "utils/format";
import useMemberSummary from "hooks/useMemberSummary";

export const NetworkSelectOption = ({ address, network, token, active, disabled, onClick }) => {
  const { label, value, avatar, description, chainId } = network;
  const { data } = useMemberSummary(address, chainId);

  return (
    <Card
      my="6px"
      maxw="100%"
      key={value}
      onClick={onClick}
      className={cn("NetworkSelectOption", {
        "NetworkSelectOption--active": active,
        "NetworkSelectOption--disabled": disabled,
      })}
    >
      <Box align="center" h="64px">
        <Box fluid p="12px" className="NetworkSelectOption__contentBox" align="center">
          <Box justify="center" mr="16px">
            <Avatar size={40} src={avatar} />
          </Box>
          <Box direction="vertical">
            <Text as="h3" m={0} size="medium" weight="medium" grey={800}>
              {label}
            </Text>

            <Box align="center">
              {data.isMember && <CheckIcon className="NetworkSelectOption__check" />}

              <Text grey={600} m={0} pr="8px" size="small">
                {address
                  ? data.isMember
                    ? `Member · ${format(data.creditLimit, token)} ${token} available`
                    : "Not a member"
                  : description}
              </Text>
            </Box>
          </Box>
        </Box>
        <Box p="0 12px" className="NetworkSelectOption__controlBox">
          {active ? (
            <Button
              size="pill"
              label="Selected"
              color="blue"
              variant="light"
              style={{
                height: "24px",
                fontSize: "12px",
                pointerEvents: "none",
              }}
            />
          ) : (
            <Button
              size="pill"
              color="secondary"
              variant="light"
              label="Switch"
              style={{
                height: "24px",
                fontSize: "12px",
                pointerEvents: "none",
              }}
            />
          )}
        </Box>
      </Box>
    </Card>
  );
};
