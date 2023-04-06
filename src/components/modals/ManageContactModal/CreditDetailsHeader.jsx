import "./CreditDetailsHeader.scss";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ProfileIcon,
  Box,
  Text,
  IconBadge,
  IconBadgeRow,
} from "@unioncredit/ui";
import { ContactsType } from "constants";

export function CreditDetailsHeader({ type, title }) {
  const color = type === ContactsType.VOUCHERS ? "#EC4899" : "#3B82F6";
  const icon = type === ContactsType.VOUCHERS ? ArrowRightIcon : ArrowLeftIcon;

  return (
    <Box className="CreditDetailsHeader" align="center">
      <IconBadgeRow>
        <IconBadge
          icon={ProfileIcon}
          color="white"
          variant="filled"
          borderSize={2}
          borderColor="white"
          backgroundColor={color}
        />

        <IconBadge
          icon={icon}
          color="white"
          variant="filled"
          borderSize={2}
          borderColor="white"
          backgroundColor={color}
        />
      </IconBadgeRow>

      <Text m={0} grey={800} size="medium" weight="medium">
        {title}
      </Text>
    </Box>
  );
}
